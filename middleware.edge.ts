/**
 * Hybrid Edge Middleware for Personalization
 *
 * Combines client-side persona inference (cookie) with server-side fallback.
 * Priority: Client cookie > Redis cache > Fingerprint inference
 *
 * High-performance middleware running on Vercel Edge Runtime
 * Latency target: P95 < 50ms
 */

import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_PERSONALIZATION_CONFIG, PERSONA_DEFINITIONS } from '@/lib/personalization/config'
import { EdgeFingerprint, getCachedFingerprint, FingerprintRateLimit } from '@/lib/personalization/edge/fingerprint'
import { getRedisCache } from '@/lib/personalization/cache/redis-cache'
import type { UserProfile, BehavioralPattern, RoutingDecision } from '@/types/personalization'

// Edge runtime configuration
export const config = {
    runtime: 'edge',
    regions: ['gru1', 'gig1'], // São Paulo + Rio de Janeiro
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images).*)',
    ],
}

/**
 * Valid persona types
 */
const VALID_PERSONAS = [
    'health_conscious',
    'price_sensitive',
    'premium_seeker',
    'convenience_seeker',
    'tech_savvy',
    'researcher',
    'urgent_buyer',
    'new_visitor'
]

export async function middleware(request: NextRequest) {
    // Skip personalization if disabled
    if (!DEFAULT_PERSONALIZATION_CONFIG.enabled) {
        return NextResponse.next()
    }

    const startTime = Date.now()
    const response = NextResponse.next()

    try {
        // ──────────────────────────────────────────────────────────────
        // PRIORITY 1: Read client-side persona from cookie
        // ──────────────────────────────────────────────────────────────
        const clientPersona = request.cookies.get('user_persona')?.value

        if (clientPersona && VALID_PERSONAS.includes(clientPersona)) {
            // Client has valid persona → Use it immediately
            response.headers.set('x-user-persona', clientPersona)
            response.headers.set('x-persona-source', 'client-cookie')
            response.headers.set('x-persona-confidence', '0.85')
            response.headers.set('x-personalization-latency', (Date.now() - startTime).toString())

            // Store in Redis for future visits (background task)
            const fingerprint = await getCachedFingerprint(request)
            const cache = getRedisCache()
            cache.set(`persona:${fingerprint.hash}`, clientPersona, 7 * 24 * 60 * 60) // 7 days
                .catch(err => console.error('[Middleware] Redis cache error:', err))

            if (DEFAULT_PERSONALIZATION_CONFIG.debug) {
                console.log(`[Hybrid Middleware] Using client persona: ${clientPersona} (${Date.now() - startTime}ms)`)
            }

            return response
        }

        // ──────────────────────────────────────────────────────────────
        // PRIORITY 2: Fallback to server-side fingerprint + Redis
        // ──────────────────────────────────────────────────────────────
        // 1. Generate device fingerprint
        const fingerprint = await getCachedFingerprint(request)

        // 2. Rate limiting check
        if (!FingerprintRateLimit.checkLimit(fingerprint.hash)) {
            console.warn('[Middleware] Rate limit exceeded:', fingerprint.hash)
            return new NextResponse('Too Many Requests', { status: 429 })
        }

        // 3. Bot detection
        if (EdgeFingerprint.isBotLikely(fingerprint.components)) {
            // Skip personalization for bots
            response.headers.set('x-bot-detected', 'true')
            return response
        }

        // 4. Get or create session ID
        const sessionId = getOrCreateSessionId(request, fingerprint.hash)

        // 5. Try Redis cache for persona
        const cache = getRedisCache()
        const cachedPersona = await cache.get<string>(`persona:${fingerprint.hash}`)

        if (cachedPersona && VALID_PERSONAS.includes(cachedPersona)) {
            // Found in Redis → Use cached persona
            response.headers.set('x-user-persona', cachedPersona)
            response.headers.set('x-persona-source', 'redis-cache')
            response.headers.set('x-persona-confidence', '0.75')
            response.headers.set('x-session-id', sessionId)
            response.headers.set('x-fingerprint', fingerprint.hash.substring(0, 16))
            response.headers.set('x-personalization-latency', (Date.now() - startTime).toString())

            if (DEFAULT_PERSONALIZATION_CONFIG.debug) {
                console.log(`[Hybrid Middleware] Using Redis persona: ${cachedPersona} (${Date.now() - startTime}ms)`)
            }

            return response
        }

        // 6. No cookie, no Redis → Fallback to basic profile creation
        let userProfile = await createBasicProfile(request, sessionId, fingerprint)

        // Cache the inferred persona in Redis
        await cache.set(`persona:${fingerprint.hash}`, userProfile.primaryPersona, 24 * 60 * 60) // 24h

        // 7. Set personalization headers for new visitor
        response.headers.set('x-user-persona', userProfile.primaryPersona)
        response.headers.set('x-persona-source', 'inferred')
        response.headers.set('x-persona-confidence', userProfile.confidenceScore.toFixed(2))
        response.headers.set('x-session-id', sessionId)
        response.headers.set('x-fingerprint', fingerprint.hash.substring(0, 16))

        // Performance metrics
        const latency = Date.now() - startTime
        response.headers.set('x-personalization-latency', latency.toString())

        // 8. Determine routing decision (optional, disabled by default)
        const routingDecision = getRoutingDecision(userProfile, request)
        response.headers.set('x-routing-strategy', routingDecision.strategy)

        if (DEFAULT_PERSONALIZATION_CONFIG.debug) {
            console.log(`[Hybrid Middleware] New visitor persona: ${userProfile.primaryPersona} (${latency}ms)`)
        }

        return response

    } catch (error) {
        // Graceful degradation on error
        console.error('[Edge Middleware] Error:', error)

        response.headers.set('x-personalization-error', 'true')
        response.headers.set('x-personalization-latency', (Date.now() - startTime).toString())

        return response
    }
}

/**
 * Get or create session ID from fingerprint
 */
function getOrCreateSessionId(request: NextRequest, fingerprintHash: string): string {
    const existingSession = request.cookies.get('session_id')?.value

    if (existingSession) {
        return existingSession
    }

    // Create deterministic session ID from fingerprint + timestamp
    const timestamp = Date.now()
    const sessionId = `${fingerprintHash.substring(0, 16)}-${timestamp}`

    return sessionId
}

/**
 * Create basic user profile from request data
 */
async function createBasicProfile(
    request: NextRequest,
    sessionId: string,
    fingerprint: any
): Promise<UserProfile> {
    const { device, os, browser } = EdgeFingerprint.parseUserAgent(fingerprint.components.userAgent)
    const timezone = EdgeFingerprint.getTimezoneFromIP(request)
    const country = EdgeFingerprint.getCountryFromIP(request)

    // Parse URL for page analysis
    const url = new URL(request.url)
    const path = url.pathname

    // Infer initial persona from page
    const initialPersona = inferInitialPersona(path, device)

    return {
        primaryPersona: initialPersona,
        confidenceScore: 0.4, // Low initial confidence
        behavioralPatterns: [],
        demographicIndicators: {
            likelyAge: inferAge(device, new Date().getHours()),
            likelyIncome: 'medium',
            likelyLocation: country.toLowerCase(),
            devicePreference: device,
            browsingTime: getTimeOfDay(new Date()),
            language: fingerprint.components.acceptLanguage.split(',')[0] || 'pt-BR',
            timezone
        },
        engagementLevel: 'medium',
        conversionProbability: 0.3,
        shouldUpdateProfile: true,
        sessionId,
        lastUpdated: new Date()
    }
}

/**
 * Update existing profile with new behavior
 */
async function updateProfile(
    request: NextRequest,
    profile: UserProfile,
    fingerprint: any
): Promise<UserProfile> {
    const url = new URL(request.url)
    const path = url.pathname

    // Create behavior pattern
    const pattern: BehavioralPattern = {
        type: 'navigation',
        weight: 0.3,
        value: {
            path,
            timestamp: new Date()
        },
        timestamp: new Date()
    }

    // Add to patterns (keep last 50)
    const patterns = [...profile.behavioralPatterns, pattern].slice(-50)

    // Recalculate persona scores
    const personaScores = calculatePersonaScores(patterns, path)
    const topPersona = Object.entries(personaScores)
        .sort(([, a], [, b]) => b - a)[0]

    // Determine if update is needed
    const shouldUpdate =
        profile.primaryPersona !== topPersona[0] ||
        Date.now() - new Date(profile.lastUpdated).getTime() > 60 * 60 * 1000 ||
        profile.confidenceScore < 0.7

    return {
        ...profile,
        primaryPersona: topPersona[0],
        confidenceScore: topPersona[1],
        behavioralPatterns: patterns,
        shouldUpdateProfile: shouldUpdate,
        lastUpdated: new Date()
    }
}

/**
 * Calculate persona scores from behavioral patterns
 */
function calculatePersonaScores(
    patterns: BehavioralPattern[],
    currentPath: string
): Record<string, number> {
    const scores: Record<string, number> = {
        'price-conscious': 0,
        'quality-focused': 0,
        'convenience-seeker': 0,
        'tech-savvy': 0,
        'health-conscious': 0,
        'budget-planner': 0,
        'urgent-buyer': 0,
        'researcher': 0
    }

    // Score based on current page
    if (currentPath.includes('/pricing') || currentPath.includes('/calculator')) {
        scores['price-conscious'] += 0.8
        scores['budget-planner'] += 0.7
    }

    if (currentPath.includes('/how-it-works') || currentPath.includes('/about')) {
        scores['researcher'] += 0.8
        scores['quality-focused'] += 0.6
    }

    if (currentPath.includes('/agendar-consulta')) {
        scores['urgent-buyer'] += 0.7
        scores['health-conscious'] += 0.6
    }

    if (currentPath.includes('/features') || currentPath.includes('/integrations')) {
        scores['tech-savvy'] += 0.8
    }

    if (currentPath === '/' || currentPath.includes('/quick-start')) {
        scores['convenience-seeker'] += 0.7
    }

    // Score based on pattern history
    patterns.forEach(pattern => {
        const path = pattern.value?.path || ''

        if (path.includes('/pricing')) scores['price-conscious'] += 0.2
        if (path.includes('/quality')) scores['quality-focused'] += 0.2
        if (path.includes('/quick')) scores['convenience-seeker'] += 0.2
    })

    // Normalize scores to 0-1
    const maxScore = Math.max(...Object.values(scores), 1)
    Object.keys(scores).forEach(persona => {
        scores[persona] = Math.min(scores[persona] / maxScore, 1)
    })

    return scores
}

/**
 * Infer initial persona from landing page
 */
function inferInitialPersona(path: string, device: string): string {
    if (path.includes('/pricing') || path.includes('/calculator')) {
        return 'price-conscious'
    }

    if (path.includes('/how-it-works') || path.includes('/about')) {
        return 'quality-focused'
    }

    if (device === 'mobile' && path === '/') {
        return 'convenience-seeker'
    }

    if (path.includes('/agendar-consulta')) {
        return 'urgent-buyer'
    }

    return DEFAULT_PERSONALIZATION_CONFIG.defaultPersona
}

/**
 * Infer age from device and browsing time
 */
function inferAge(device: string, hour: number): string {
    if (device === 'mobile' && hour >= 20 && hour <= 23) {
        return '18-25'
    } else if (device === 'desktop' && hour >= 9 && hour <= 17) {
        return '26-45'
    } else {
        return '46+'
    }
}

/**
 * Get time of day category
 */
function getTimeOfDay(date: Date): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = date.getHours()

    if (hour >= 6 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 18) return 'afternoon'
    if (hour >= 18 && hour < 22) return 'evening'
    return 'night'
}

/**
 * Get routing decision based on profile
 */
function getRoutingDecision(profile: UserProfile, request: NextRequest): RoutingDecision {
    const url = new URL(request.url)
    const path = url.pathname
    const persona = profile.primaryPersona

    // Routing rules (simplified for edge runtime)
    const rules: Record<string, Record<string, RoutingDecision>> = {
        'price-conscious': {
            '/': {
                strategy: 'personalized',
                targetPath: '/variants/price-focused-home',
                shouldRewrite: false, // Disabled for now
                priority: 'high',
                reasoning: 'Price-focused homepage',
                cacheKey: `price-home-${profile.confidenceScore.toFixed(1)}`
            }
        },
        'quality-focused': {
            '/': {
                strategy: 'personalized',
                targetPath: '/variants/quality-home',
                shouldRewrite: false,
                priority: 'high',
                reasoning: 'Quality-focused homepage'
            }
        }
    }

    const personaRules = rules[persona]
    if (personaRules && personaRules[path]) {
        return personaRules[path]
    }

    // Default: no rewrite
    return {
        strategy: 'default',
        shouldRewrite: false,
        priority: 'low',
        reasoning: 'No personalization rules for this path/persona'
    }
}
