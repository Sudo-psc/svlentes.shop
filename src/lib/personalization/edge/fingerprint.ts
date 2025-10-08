/**
 * Edge-Compatible Fingerprinting System
 *
 * Privacy-first device fingerprinting for edge runtime
 * Uses server-side signals without client-side JavaScript
 */

import type { NextRequest } from 'next/server'

export interface DeviceFingerprint {
    hash: string
    components: FingerprintComponents
    confidence: number
    timestamp: Date
}

export interface FingerprintComponents {
    userAgent: string
    acceptLanguage: string
    acceptEncoding: string
    ip: string
    timezone?: string
    screenHint?: string
    platform?: string
    colorDepth?: string
    deviceMemory?: string
}

export class EdgeFingerprint {
    private static SALT = process.env.FINGERPRINT_SALT || 'sv-lentes-2025'

    /**
     * Generate fingerprint from request headers
     * Edge-compatible (no DOM/Canvas access)
     */
    static async generate(request: NextRequest): Promise<DeviceFingerprint> {
        const components = this.extractComponents(request)
        const hash = await this.hashComponents(components)
        const confidence = this.calculateConfidence(components)

        return {
            hash,
            components,
            confidence,
            timestamp: new Date()
        }
    }

    /**
     * Extract fingerprint components from request
     */
    private static extractComponents(request: NextRequest): FingerprintComponents {
        const headers = request.headers

        // Basic components (always available)
        const userAgent = headers.get('user-agent') || 'unknown'
        const acceptLanguage = headers.get('accept-language') || 'unknown'
        const acceptEncoding = headers.get('accept-encoding') || 'unknown'

        // IP address (Vercel/Cloudflare headers)
        const ip = headers.get('x-forwarded-for')?.split(',')[0].trim() ||
            headers.get('x-real-ip') ||
            headers.get('cf-connecting-ip') ||
            'unknown'

        // Client hints (if available)
        const timezone = headers.get('sec-ch-ua-timezone') || undefined
        const platform = headers.get('sec-ch-ua-platform') || undefined
        const screenHint = this.extractScreenHint(headers)
        const colorDepth = headers.get('sec-ch-ua-bitness') || undefined
        const deviceMemory = headers.get('device-memory') || undefined

        return {
            userAgent,
            acceptLanguage,
            acceptEncoding,
            ip,
            timezone,
            screenHint,
            platform,
            colorDepth,
            deviceMemory
        }
    }

    /**
     * Extract screen size hint from viewport-width header
     */
    private static extractScreenHint(headers: Headers): string | undefined {
        const viewportWidth = headers.get('viewport-width') || headers.get('sec-ch-viewport-width')

        if (!viewportWidth) return undefined

        const width = parseInt(viewportWidth)

        if (width >= 1920) return 'desktop-large'
        if (width >= 1280) return 'desktop'
        if (width >= 768) return 'tablet'
        if (width >= 375) return 'mobile'
        return 'mobile-small'
    }

    /**
     * Hash components using SHA-256
     */
    private static async hashComponents(components: FingerprintComponents): Promise<string> {
        // Combine components in deterministic order
        const data = [
            components.userAgent,
            components.acceptLanguage,
            components.acceptEncoding,
            components.ip,
            components.timezone || '',
            components.platform || '',
            components.screenHint || '',
            this.SALT
        ].join('::')

        // Hash using Web Crypto API (edge-compatible)
        const encoder = new TextEncoder()
        const dataBuffer = encoder.encode(data)
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)

        // Convert to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        return hashHex
    }

    /**
     * Calculate confidence based on available signals
     */
    private static calculateConfidence(components: FingerprintComponents): number {
        let confidence = 0.3 // Base confidence

        // User agent (highly valuable)
        if (components.userAgent !== 'unknown') confidence += 0.3

        // IP address
        if (components.ip !== 'unknown') confidence += 0.2

        // Language preferences
        if (components.acceptLanguage !== 'unknown') confidence += 0.1

        // Client hints (bonus)
        if (components.timezone) confidence += 0.05
        if (components.platform) confidence += 0.05
        if (components.screenHint) confidence += 0.05
        if (components.deviceMemory) confidence += 0.05

        return Math.min(confidence, 1.0)
    }

    /**
     * Anonymize IP address (LGPD/GDPR compliance)
     * Keeps only network prefix for geolocation
     */
    static anonymizeIP(ip: string): string {
        const parts = ip.split('.')

        if (parts.length === 4) {
            // IPv4: Keep first 3 octets
            return `${parts[0]}.${parts[1]}.${parts[2]}.0`
        }

        // IPv6: Keep first 4 segments
        const segments = ip.split(':')
        return segments.slice(0, 4).join(':') + '::0'
    }

    /**
     * Check if fingerprint is likely a bot
     */
    static isBotLikely(components: FingerprintComponents): boolean {
        const ua = components.userAgent.toLowerCase()

        const botPatterns = [
            'bot', 'crawler', 'spider', 'scraper',
            'curl', 'wget', 'python', 'java',
            'headless', 'phantom', 'selenium'
        ]

        return botPatterns.some(pattern => ua.includes(pattern))
    }

    /**
     * Parse User-Agent for device info (edge-optimized)
     */
    static parseUserAgent(userAgent: string): {
        device: 'desktop' | 'mobile' | 'tablet'
        os: string
        browser: string
    } {
        const ua = userAgent.toLowerCase()

        // Device detection
        let device: 'desktop' | 'mobile' | 'tablet' = 'desktop'
        if (ua.includes('mobile') || ua.includes('android')) {
            device = 'mobile'
        } else if (ua.includes('tablet') || ua.includes('ipad')) {
            device = 'tablet'
        }

        // OS detection
        let os = 'unknown'
        if (ua.includes('windows')) os = 'windows'
        else if (ua.includes('mac os')) os = 'macos'
        else if (ua.includes('linux')) os = 'linux'
        else if (ua.includes('android')) os = 'android'
        else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'ios'

        // Browser detection
        let browser = 'unknown'
        if (ua.includes('edg/')) browser = 'edge'
        else if (ua.includes('chrome')) browser = 'chrome'
        else if (ua.includes('firefox')) browser = 'firefox'
        else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'safari'
        else if (ua.includes('opera') || ua.includes('opr/')) browser = 'opera'

        return { device, os, browser }
    }

    /**
     * Get timezone from IP geolocation (Cloudflare header)
     */
    static getTimezoneFromIP(request: NextRequest): string {
        // Cloudflare provides timezone in header
        const cfTimezone = request.headers.get('cf-timezone')
        if (cfTimezone) return cfTimezone

        // Default to Brazil timezone
        return 'America/Sao_Paulo'
    }

    /**
     * Get country from IP geolocation
     */
    static getCountryFromIP(request: NextRequest): string {
        // Cloudflare provides country code
        const cfCountry = request.headers.get('cf-ipcountry')
        if (cfCountry) return cfCountry

        // Vercel provides country
        const vercelCountry = request.geo?.country
        if (vercelCountry) return vercelCountry

        // Default to Brazil
        return 'BR'
    }
}

/**
 * Rate limiting based on fingerprint
 */
export class FingerprintRateLimit {
    private static limits = new Map<string, { count: number; timestamp: number }>()
    private static MAX_REQUESTS = 100 // per minute
    private static WINDOW_MS = 60 * 1000 // 1 minute

    static checkLimit(fingerprintHash: string): boolean {
        const now = Date.now()
        const record = this.limits.get(fingerprintHash)

        if (!record) {
            this.limits.set(fingerprintHash, { count: 1, timestamp: now })
            return true
        }

        // Reset if window expired
        if (now - record.timestamp > this.WINDOW_MS) {
            this.limits.set(fingerprintHash, { count: 1, timestamp: now })
            return true
        }

        // Check if limit exceeded
        if (record.count >= this.MAX_REQUESTS) {
            return false
        }

        // Increment count
        record.count++
        return true
    }

    static cleanup(): void {
        const now = Date.now()
        for (const [hash, record] of this.limits.entries()) {
            if (now - record.timestamp > this.WINDOW_MS * 2) {
                this.limits.delete(hash)
            }
        }
    }
}

/**
 * Fingerprint cache (in-memory for edge)
 */
const fingerprintCache = new Map<string, DeviceFingerprint>()

export async function getCachedFingerprint(request: NextRequest): Promise<DeviceFingerprint> {
    // Try to get from cache based on IP + UA
    const cacheKey = `${request.headers.get('x-forwarded-for')}-${request.headers.get('user-agent')}`
    const cached = fingerprintCache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp.getTime() < 5 * 60 * 1000) {
        return cached
    }

    // Generate new fingerprint
    const fingerprint = await EdgeFingerprint.generate(request)
    fingerprintCache.set(cacheKey, fingerprint)

    // Cleanup old entries
    if (fingerprintCache.size > 10000) {
        const oldestKey = fingerprintCache.keys().next().value
        fingerprintCache.delete(oldestKey)
    }

    return fingerprint
}
