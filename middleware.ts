import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_PERSONALIZATION_CONFIG, PERSONA_DEFINITIONS } from '@/lib/personalization/config'
import { UserProfile, BehavioralPattern, DemographicIndicators, RoutingDecision } from '@/types/personalization'
import {
    determineFallbackStrategy,
    calculateCircuitBreakerMetrics,
    shouldPerformHealthCheck,
    shouldUpdateCircuitBreakerState,
    generateHealthReport,
    formatMetricsForLogging
} from '@/lib/middleware-fallback'

// Interface para dados comportamentais coletados
interface BehavioralData {
    url: string
    userAgent: string
    referer: string
    timestamp: Date
    deviceInfo: DeviceInfo
    pageAnalysis: PageAnalysis
    trafficSource: TrafficSource
    temporalData: TemporalData
}

interface DeviceInfo {
    type: 'desktop' | 'mobile' | 'tablet'
    os: string
    browser: string
}

interface PageAnalysis {
    path: string
    query: Record<string, string>
    hash: string
}

interface TrafficSource {
    type: 'direct' | 'organic' | 'social' | 'referral' | 'paid'
    source?: string
    campaign?: string
}

interface TemporalData {
    hour: number
    dayOfWeek: number
    dayOfMonth: number
    month: number
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
}

// Cache simples para profiles (em produção usar Redis ou similar)
const profileCache = new Map<string, { profile: UserProfile; timestamp: number }>()

// ============================================================================
// SISTEMA DE FALLBACK ROBUSTO - Circuit Breaker Pattern
// ============================================================================

// Constantes de configuração do fallback
const FALLBACK_CONFIG = {
    // Timeouts em cascata
    TIMEOUT_LEVELS: {
        fast: 50,      // Primeira tentativa (50ms)
        normal: 100,   // Segunda tentativa (100ms)
        slow: 200      // Terceira tentativa (200ms)
    },

    // Circuit breaker
    MAX_CONSECUTIVE_ERRORS: 5,
    ERROR_COOLDOWN_MS: 60000,        // 1 minuto
    PARTIAL_RECOVERY_MS: 30000,      // 30 segundos para recuperação parcial

    // Health check
    HEALTH_CHECK_INTERVAL_MS: 10000, // 10 segundos
    HEALTH_CHECK_THRESHOLD: 3,       // 3 sucessos para reativar

    // Rate limiting
    MAX_REQUESTS_PER_SECOND: 100,

    // Métricas
    METRICS_WINDOW_MS: 60000,        // Janela de 1 minuto para métricas
} as const

// Estado do Circuit Breaker
interface CircuitBreakerState {
    status: 'closed' | 'open' | 'half-open'
    consecutiveErrors: number
    consecutiveSuccesses: number
    lastErrorTime: number
    lastSuccessTime: number
    totalRequests: number
    totalErrors: number
    totalFallbacks: number
    lastHealthCheck: number
}

// Estado global de fallback (em produção usar Redis)
let circuitBreaker: CircuitBreakerState = {
    status: 'closed',
    consecutiveErrors: 0,
    consecutiveSuccesses: 0,
    lastErrorTime: 0,
    lastSuccessTime: Date.now(),
    totalRequests: 0,
    totalErrors: 0,
    totalFallbacks: 0,
    lastHealthCheck: Date.now()
}

// Métricas de performance
interface PerformanceMetrics {
    timestamp: number
    latency: number
    success: boolean
    fallbackReason?: string
}

const performanceMetrics: PerformanceMetrics[] = []

export async function middleware(request: NextRequest) {
    const startTime = Date.now()
    circuitBreaker.totalRequests++

    // ========================================================================
    // NÍVEL 1: Verificações Rápidas de Fallback
    // ========================================================================

    // 1.1: Personalização desabilitada globalmente
    if (!DEFAULT_PERSONALIZATION_CONFIG.enabled) {
        return createFallbackResponse(request, 'disabled', startTime)
    }

    // 1.2: Circuit breaker aberto (muitos erros)
    if (circuitBreaker.status === 'open') {
        const timeSinceLastError = Date.now() - circuitBreaker.lastErrorTime

        // Verificar se pode tentar recuperação parcial
        if (timeSinceLastError >= FALLBACK_CONFIG.PARTIAL_RECOVERY_MS) {
            circuitBreaker.status = 'half-open'
            console.log('[Fallback] Circuit breaker entering half-open state (attempting recovery)')
        } else {
            // Ainda em cooldown
            const remainingCooldown = Math.ceil((FALLBACK_CONFIG.ERROR_COOLDOWN_MS - timeSinceLastError) / 1000)
            return createFallbackResponse(request, 'cooldown', startTime, { remainingCooldown })
        }
    }

    // 1.3: Health check periódico
    const timeSinceHealthCheck = Date.now() - circuitBreaker.lastHealthCheck
    if (timeSinceHealthCheck >= FALLBACK_CONFIG.HEALTH_CHECK_INTERVAL_MS) {
        performHealthCheck()
    }

    // ========================================================================
    // NÍVEL 2: Tentativa de Personalização com Fallback em Cascata
    // ========================================================================

    try {
        // Determinar timeout baseado no estado do circuit breaker
        const timeout = getAdaptiveTimeout()

        // Executar personalização com timeout adaptativo
        const result = await Promise.race([
            executePersonalization(request, startTime),
            createTimeoutPromise(timeout)
        ])

        // ✅ SUCESSO: Registrar e atualizar circuit breaker
        recordSuccess(startTime)

        return result

    } catch (error) {
        // ❌ ERRO: Registrar e decidir próxima ação
        const errorType = classifyError(error)
        recordError(startTime, errorType)

        // Log detalhado do erro
        logMiddlewareError(error, {
            errorType,
            circuitBreakerStatus: circuitBreaker.status,
            consecutiveErrors: circuitBreaker.consecutiveErrors,
            url: request.url,
            userAgent: request.headers.get('user-agent'),
            timestamp: new Date().toISOString()
        })

        // ========================================================================
        // NÍVEL 3: Fallback Inteligente Baseado no Tipo de Erro
        // ========================================================================

        // 3.1: Timeout → Tentar versão simplificada
        if (errorType === 'timeout') {
            try {
                const simplifiedResult = await executeSimplifiedPersonalization(request, startTime)
                recordSuccess(startTime, 'simplified')
                return simplifiedResult
            } catch (simplifiedError) {
                // Fallback completo se versão simplificada também falhar
                return createFallbackResponse(request, 'error', startTime, { error, simplifiedError })
            }
        }

        // 3.2: Erro de dados → Usar cache ou padrão
        if (errorType === 'data') {
            return createFallbackResponse(request, 'data-error', startTime, { error })
        }

        // 3.3: Erro de rede → Fallback imediato
        if (errorType === 'network') {
            return createFallbackResponse(request, 'network-error', startTime, { error })
        }

        // 3.4: Erro desconhecido → Fallback genérico
        return createFallbackResponse(request, 'error', startTime, { error })
    }
}

// ============================================================================
// FUNÇÕES DE SUPORTE DO CIRCUIT BREAKER
// ============================================================================

/**
 * Determina timeout adaptativo baseado no estado do sistema
 */
function getAdaptiveTimeout(): number {
    switch (circuitBreaker.status) {
        case 'closed':
            // Sistema saudável → timeout normal
            return FALLBACK_CONFIG.TIMEOUT_LEVELS.normal

        case 'half-open':
            // Recuperando → timeout mais generoso
            return FALLBACK_CONFIG.TIMEOUT_LEVELS.slow

        case 'open':
            // Sistema com problemas → timeout rápido
            return FALLBACK_CONFIG.TIMEOUT_LEVELS.fast

        default:
            return FALLBACK_CONFIG.TIMEOUT_LEVELS.normal
    }
}

/**
 * Classifica o tipo de erro para fallback inteligente
 */
function classifyError(error: unknown): 'timeout' | 'network' | 'data' | 'unknown' {
    const errorMessage = error instanceof Error ? error.message : String(error)

    if (errorMessage.includes('timeout')) return 'timeout'
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) return 'network'
    if (errorMessage.includes('parse') || errorMessage.includes('invalid')) return 'data'

    return 'unknown'
}

/**
 * Registra sucesso e atualiza circuit breaker
 */
function recordSuccess(startTime: number, mode: 'full' | 'simplified' = 'full') {
    const latency = Date.now() - startTime

    // Atualizar métricas
    performanceMetrics.push({
        timestamp: Date.now(),
        latency,
        success: true
    })

    // Limpar métricas antigas
    cleanOldMetrics()

    // Atualizar circuit breaker
    circuitBreaker.consecutiveErrors = 0
    circuitBreaker.consecutiveSuccesses++
    circuitBreaker.lastSuccessTime = Date.now()

    // Recuperação do circuit breaker
    if (circuitBreaker.status === 'half-open') {
        if (circuitBreaker.consecutiveSuccesses >= FALLBACK_CONFIG.HEALTH_CHECK_THRESHOLD) {
            circuitBreaker.status = 'closed'
            console.log('[Fallback] ✅ Circuit breaker closed (system recovered)')
        }
    }

    if (DEFAULT_PERSONALIZATION_CONFIG.debug && mode === 'simplified') {
        console.log(`[Fallback] ⚡ Simplified personalization succeeded (${latency}ms)`)
    }
}

/**
 * Registra erro e atualiza circuit breaker
 */
function recordError(startTime: number, errorType: string) {
    const latency = Date.now() - startTime

    // Atualizar métricas
    performanceMetrics.push({
        timestamp: Date.now(),
        latency,
        success: false,
        fallbackReason: errorType
    })

    // Limpar métricas antigas
    cleanOldMetrics()

    // Atualizar circuit breaker
    circuitBreaker.consecutiveErrors++
    circuitBreaker.consecutiveSuccesses = 0
    circuitBreaker.lastErrorTime = Date.now()
    circuitBreaker.totalErrors++
    circuitBreaker.totalFallbacks++

    // Abrir circuit breaker se muitos erros
    if (circuitBreaker.consecutiveErrors >= FALLBACK_CONFIG.MAX_CONSECUTIVE_ERRORS) {
        if (circuitBreaker.status !== 'open') {
            circuitBreaker.status = 'open'
            console.error(`[Fallback] ⚠️ Circuit breaker opened (${circuitBreaker.consecutiveErrors} consecutive errors)`)
        }
    }
}

/**
 * Health check periódico do sistema
 */
function performHealthCheck() {
    circuitBreaker.lastHealthCheck = Date.now()

    // Calcular taxa de erro na janela de tempo
    const recentMetrics = performanceMetrics.filter(
        m => Date.now() - m.timestamp < FALLBACK_CONFIG.METRICS_WINDOW_MS
    )

    const totalRecent = recentMetrics.length
    const errorsRecent = recentMetrics.filter(m => !m.success).length
    const errorRate = totalRecent > 0 ? errorsRecent / totalRecent : 0

    // Calcular latência média
    const avgLatency = totalRecent > 0
        ? recentMetrics.reduce((sum, m) => sum + m.latency, 0) / totalRecent
        : 0

    if (DEFAULT_PERSONALIZATION_CONFIG.debug) {
        console.log('[Fallback] Health Check:', {
            status: circuitBreaker.status,
            errorRate: `${(errorRate * 100).toFixed(1)}%`,
            avgLatency: `${avgLatency.toFixed(0)}ms`,
            totalRequests: circuitBreaker.totalRequests,
            totalErrors: circuitBreaker.totalErrors,
            consecutiveErrors: circuitBreaker.consecutiveErrors
        })
    }

    // Alertar se taxa de erro alta
    if (errorRate > 0.2 && totalRecent >= 10) {
        console.warn(`[Fallback] ⚠️ High error rate detected: ${(errorRate * 100).toFixed(1)}%`)
    }
}

/**
 * Limpa métricas antigas para evitar memory leak
 */
function cleanOldMetrics() {
    const cutoff = Date.now() - FALLBACK_CONFIG.METRICS_WINDOW_MS
    const oldLength = performanceMetrics.length

    // Remover métricas antigas
    while (performanceMetrics.length > 0 && performanceMetrics[0].timestamp < cutoff) {
        performanceMetrics.shift()
    }

    // Limitar tamanho máximo
    if (performanceMetrics.length > 1000) {
        performanceMetrics.splice(0, performanceMetrics.length - 1000)
    }
}

async function executePersonalization(request: NextRequest, startTime: number): Promise<NextResponse> {
    const response = NextResponse.next()

    // 1. Coletar dados comportamentais básicos
    const behavioralData = collectBehavioralData(request)

    // 2. Obter ou gerar ID de sessão
    const sessionId = getOrCreateSessionId(request)

    // 3. Obter perfil existente ou criar novo
    const userProfile = await getOrCreateUserProfile(request, sessionId, behavioralData)

    // 4. Analisar comportamento e atualizar scores de persona
    const updatedProfile = await analyzeBehavior(userProfile, behavioralData)

    // 5. Determinar estratégia de roteamento
    const routingDecision = getRoutingDecision(updatedProfile, behavioralData)

    // 6. Adicionar headers de personalização
    response.headers.set('x-user-persona', updatedProfile.primaryPersona)
    response.headers.set('x-persona-confidence', updatedProfile.confidenceScore.toString())
    response.headers.set('x-session-id', sessionId)
    response.headers.set('x-routing-strategy', routingDecision.strategy)
    response.headers.set('x-personalization-status', 'active')

    if (routingDecision.cacheKey) {
        response.headers.set('x-cache-key', routingDecision.cacheKey)
    }

    // 7. Aplicar regras de reescrita se necessário
    if (routingDecision.shouldRewrite && routingDecision.targetPath) {
        const rewriteUrl = new URL(routingDecision.targetPath, request.url)

        // Verificar se o target path existe (fallback se não existir)
        try {
            // Log para debug
            if (DEFAULT_PERSONALIZATION_CONFIG.debug) {
                console.log(`[Personalization] Rewriting ${request.url} to ${rewriteUrl.toString()} for persona ${updatedProfile.primaryPersona}`)
            }

            return NextResponse.rewrite(rewriteUrl, {
                request: {
                    headers: request.headers
                }
            })
        } catch (rewriteError) {
            console.warn('[Personalization] Rewrite failed, falling back to default:', rewriteError)
            // Continuar com response padrão
        }
    }

    // 8. Configurar cookies de perfil
    if (updatedProfile.shouldUpdateProfile) {
        try {
            response.cookies.set('user_profile', JSON.stringify(updatedProfile), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: DEFAULT_PERSONALIZATION_CONFIG.cacheTTL,
                path: '/'
            })

            response.cookies.set('session_id', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 24 horas
                path: '/'
            })
        } catch (cookieError) {
            console.warn('[Personalization] Cookie setting failed:', cookieError)
            // Continuar sem cookies
        }
    }

    // 9. Log de performance para debug
    if (DEFAULT_PERSONALIZATION_CONFIG.debug) {
        const processingTime = Date.now() - startTime
        console.log(`[Personalization] Processed in ${processingTime}ms - Persona: ${updatedProfile.primaryPersona} (${updatedProfile.confidenceScore})`)
    }

    return response
}

/**
 * Cria resposta de fallback com informações detalhadas
 */
function createFallbackResponse(
    request: NextRequest,
    reason: 'disabled' | 'cooldown' | 'error' | 'timeout' | 'data-error' | 'network-error',
    startTime: number,
    metadata?: Record<string, any>
): NextResponse {
    const response = NextResponse.next()
    const latency = Date.now() - startTime

    // Headers informativos sobre o fallback
    response.headers.set('x-personalization-status', 'fallback')
    response.headers.set('x-personalization-fallback-reason', reason)
    response.headers.set('x-routing-strategy', 'default')
    response.headers.set('x-personalization-latency', latency.toString())
    response.headers.set('x-circuit-breaker-status', circuitBreaker.status)

    // Adicionar persona padrão
    response.headers.set('x-user-persona', DEFAULT_PERSONALIZATION_CONFIG.defaultPersona)
    response.headers.set('x-persona-confidence', '0.0')
    response.headers.set('x-persona-source', 'fallback')

    // Adicionar informações de erro se disponível
    if (metadata?.error) {
        const errorMessage = metadata.error instanceof Error
            ? metadata.error.message
            : String(metadata.error)
        response.headers.set('x-personalization-error', errorMessage.substring(0, 100))
    }

    // Adicionar informações de cooldown
    if (reason === 'cooldown' && metadata?.remainingCooldown) {
        response.headers.set('x-personalization-cooldown-remaining', metadata.remainingCooldown.toString())
    }

    // Adicionar métricas do circuit breaker
    response.headers.set('x-circuit-breaker-errors', circuitBreaker.consecutiveErrors.toString())
    response.headers.set('x-circuit-breaker-total-requests', circuitBreaker.totalRequests.toString())

    // Calcular taxa de erro
    const errorRate = circuitBreaker.totalRequests > 0
        ? (circuitBreaker.totalErrors / circuitBreaker.totalRequests * 100).toFixed(1)
        : '0.0'
    response.headers.set('x-circuit-breaker-error-rate', errorRate)

    // Log para monitoramento
    if (DEFAULT_PERSONALIZATION_CONFIG.debug) {
        console.log(`[Fallback] 🔄 Serving default experience:`, {
            reason,
            latency: `${latency}ms`,
            circuitBreakerStatus: circuitBreaker.status,
            consecutiveErrors: circuitBreaker.consecutiveErrors,
            errorRate: `${errorRate}%`,
            url: request.url
        })
    }

    return response
}

/**
 * Versão simplificada de personalização (fallback de segundo nível)
 */
async function executeSimplifiedPersonalization(
    request: NextRequest,
    startTime: number
): Promise<NextResponse> {
    const response = NextResponse.next()

    // Personalização mínima baseada apenas em dados do request
    const behavioralData = collectBehavioralData(request)
    const sessionId = getOrCreateSessionId(request)

    // Inferir persona básica sem cache ou processamento pesado
    const basicPersona = inferInitialPersona(behavioralData)

    // Headers mínimos
    response.headers.set('x-user-persona', basicPersona)
    response.headers.set('x-persona-confidence', '0.3')
    response.headers.set('x-persona-source', 'simplified')
    response.headers.set('x-session-id', sessionId)
    response.headers.set('x-routing-strategy', 'simplified')
    response.headers.set('x-personalization-status', 'simplified')
    response.headers.set('x-personalization-latency', (Date.now() - startTime).toString())

    return response
}

function createTimeoutPromise(timeoutMs: number): Promise<never> {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Personalization timeout after ${timeoutMs}ms`))
        }, timeoutMs)
    })
}

function logMiddlewareError(error: unknown, context: Record<string, any>) {
    const timestamp = new Date().toISOString()
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined

    console.error('[Personalization] Middleware Error:', {
        timestamp,
        message: errorMessage,
        stack: errorStack,
        context,
        consecutiveErrors: context.consecutiveErrors
    })

    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
        // TODO: Integrar com Sentry, DataDog, etc.
        // sendToMonitoring({ error, context })
    }
}

function collectBehavioralData(request: NextRequest): BehavioralData {
    const url = request.url
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''
    const timestamp = new Date()

    return {
        url,
        userAgent,
        referer,
        timestamp,
        deviceInfo: parseUserAgent(userAgent),
        pageAnalysis: analyzeCurrentPage(url),
        trafficSource: analyzeTrafficSource(referer),
        temporalData: analyzeTemporalData(timestamp)
    }
}

function parseUserAgent(userAgent: string): DeviceInfo {
    // Simplificado - em produção usar ua-parser-js ou similar
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent)
    const isTablet = /iPad|Tablet/.test(userAgent)

    let type: 'desktop' | 'mobile' | 'tablet' = 'desktop'
    if (isTablet) type = 'tablet'
    else if (isMobile) type = 'mobile'

    let os = 'unknown'
    if (userAgent.includes('Windows')) os = 'windows'
    else if (userAgent.includes('Mac')) os = 'mac'
    else if (userAgent.includes('Linux')) os = 'linux'
    else if (userAgent.includes('Android')) os = 'android'
    else if (userAgent.includes('iOS')) os = 'ios'

    let browser = 'unknown'
    if (userAgent.includes('Chrome')) browser = 'chrome'
    else if (userAgent.includes('Firefox')) browser = 'firefox'
    else if (userAgent.includes('Safari')) browser = 'safari'
    else if (userAgent.includes('Edge')) browser = 'edge'

    return { type, os, browser }
}

function analyzeCurrentPage(url: string): PageAnalysis {
    const urlObj = new URL(url)
    return {
        path: urlObj.pathname,
        query: Object.fromEntries(urlObj.searchParams),
        hash: urlObj.hash
    }
}

function analyzeTrafficSource(referer: string): TrafficSource {
    if (!referer) return { type: 'direct' }

    try {
        const refererUrl = new URL(referer)
        const domain = refererUrl.hostname

        if (domain.includes('google')) return { type: 'organic', source: 'google' }
        if (domain.includes('facebook')) return { type: 'social', source: 'facebook' }
        if (domain.includes('instagram')) return { type: 'social', source: 'instagram' }
        if (domain.includes('whatsapp')) return { type: 'social', source: 'whatsapp' }
        if (domain.includes('linkedin')) return { type: 'social', source: 'linkedin' }

        return { type: 'referral', source: domain }
    } catch {
        return { type: 'direct' }
    }
}

function analyzeTemporalData(timestamp: Date): TemporalData {
    const hour = timestamp.getHours()
    const dayOfWeek = timestamp.getDay()
    const dayOfMonth = timestamp.getDate()
    const month = timestamp.getMonth()

    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
    if (hour >= 6 && hour < 12) timeOfDay = 'morning'
    else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon'
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening'
    else timeOfDay = 'night'

    return { hour, dayOfWeek, dayOfMonth, month, timeOfDay }
}

function getOrCreateSessionId(request: NextRequest): string {
    const existingSession = request.cookies.get('session_id')?.value

    if (existingSession) {
        return existingSession
    }

    // Gerar novo ID de sessão
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
    return sessionId
}

async function getOrCreateUserProfile(
    request: NextRequest,
    sessionId: string,
    behavioralData: BehavioralData
): Promise<UserProfile> {
    // 1. Tentar obter do cache
    const cachedProfile = profileCache.get(sessionId)
    if (cachedProfile && Date.now() - cachedProfile.timestamp < DEFAULT_PERSONALIZATION_CONFIG.cacheTTL * 1000) {
        return cachedProfile.profile
    }

    // 2. Tentar obter do cookie
    const profileCookie = request.cookies.get('user_profile')?.value
    if (profileCookie) {
        try {
            const profile = JSON.parse(profileCookie) as UserProfile
            // Atualizar cache
            profileCache.set(sessionId, { profile, timestamp: Date.now() })
            return profile
        } catch (error) {
            console.error('[Personalization] Error parsing profile cookie:', error)
        }
    }

    // 3. Criar perfil básico baseado em dados disponíveis
    const newProfile = createBasicProfile(sessionId, behavioralData)

    // Salvar no cache
    profileCache.set(sessionId, { profile: newProfile, timestamp: Date.now() })

    return newProfile
}

function createBasicProfile(sessionId: string, behavioralData: BehavioralData): UserProfile {
    // Inferir persona inicial baseada em dados básicos
    const initialPersona = inferInitialPersona(behavioralData)

    return {
        primaryPersona: initialPersona,
        confidenceScore: 0.5, // Baixa confiança inicial
        behavioralPatterns: [],
        demographicIndicators: inferBasicDemographics(behavioralData),
        engagementLevel: 'medium',
        conversionProbability: 0.3,
        shouldUpdateProfile: true,
        sessionId,
        lastUpdated: new Date()
    }
}

function inferInitialPersona(behavioralData: BehavioralData): string {
    const { pageAnalysis, deviceInfo, trafficSource } = behavioralData

    // Lógica simples de inferência inicial
    if (pageAnalysis.path.includes('/pricing') || pageAnalysis.path.includes('/calculator')) {
        return 'price-conscious'
    }

    if (pageAnalysis.path.includes('/how-it-works') || pageAnalysis.path.includes('/about')) {
        return 'quality-focused'
    }

    if (deviceInfo.type === 'mobile' && trafficSource.type === 'social') {
        return 'convenience-seeker'
    }

    if (pageAnalysis.path.includes('/agendar-consulta')) {
        return 'urgent-buyer'
    }

    return DEFAULT_PERSONALIZATION_CONFIG.defaultPersona
}

function inferBasicDemographics(behavioralData: BehavioralData): DemographicIndicators {
    const { deviceInfo, temporalData } = behavioralData

    return {
        likelyAge: inferAgeFromBehavior(deviceInfo, temporalData),
        likelyIncome: 'medium', // Default, será refinado depois
        likelyLocation: 'brazil', // Baseado no idioma do site
        devicePreference: deviceInfo.type,
        browsingTime: temporalData.timeOfDay,
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo'
    }
}

function inferAgeFromBehavior(deviceInfo: DeviceInfo, temporalData: TemporalData): string {
    // Lógica simplificada de inferência de idade
    if (deviceInfo.type === 'mobile' && temporalData.hour >= 20 && temporalData.hour <= 23) {
        return '18-25'
    } else if (deviceInfo.type === 'desktop' && temporalData.hour >= 9 && temporalData.hour <= 17) {
        return '26-45'
    } else {
        return '46+'
    }
}

async function analyzeBehavior(profile: UserProfile, behavioralData: BehavioralData): Promise<UserProfile> {
    // Adicionar padrão comportamental atual
    const newPattern: BehavioralPattern = {
        type: 'navigation',
        weight: 0.3,
        value: behavioralData.pageAnalysis,
        timestamp: behavioralData.timestamp
    }

    const updatedPatterns = [...profile.behavioralPatterns, newPattern]

    // Manter apenas últimos 50 padrões para não sobrecarregar
    if (updatedPatterns.length > 50) {
        updatedPatterns.splice(0, updatedPatterns.length - 50)
    }

    // Recalcular scores de persona
    const personaScores = calculatePersonaScores(updatedPatterns, behavioralData)
    const topPersona = Object.entries(personaScores)
        .sort(([, a], [, b]) => b - a)[0]

    // Determinar se precisa atualizar
    const shouldUpdate =
        profile.primaryPersona !== topPersona[0] ||
        Date.now() - new Date(profile.lastUpdated).getTime() > 60 * 60 * 1000 || // 1 hora
        profile.confidenceScore < 0.7

    return {
        ...profile,
        primaryPersona: topPersona[0],
        confidenceScore: topPersona[1],
        behavioralPatterns: updatedPatterns,
        shouldUpdateProfile: shouldUpdate,
        lastUpdated: new Date()
    }
}

function calculatePersonaScores(patterns: BehavioralPattern[], behavioralData: BehavioralData): Record<string, number> {
    const personas = Object.keys(PERSONA_DEFINITIONS)
    const scores: Record<string, number> = {}

    personas.forEach(personaId => {
        const personaDef = PERSONA_DEFINITIONS[personaId as keyof typeof PERSONA_DEFINITIONS]
        let score = 0

        // Calcular score baseado nos padrões
        patterns.forEach(pattern => {
            if (pattern.type === 'navigation') {
                score += scoreNavigationPattern(personaId, pattern.value, personaDef.triggers)
            }
        })

        // Adicionar score baseado em dados temporais
        score += scoreTemporalPattern(personaId, behavioralData.temporalData)

        // Adicionar score baseado em dispositivo
        score += scoreDevicePattern(personaId, behavioralData.deviceInfo)

        scores[personaId] = Math.max(0, Math.min(1, score)) // Normalizar entre 0 e 1
    })

    return scores
}

function scoreNavigationPattern(personaId: string, pageAnalysis: PageAnalysis, triggers: any[]): number {
    let score = 0

    triggers.forEach(trigger => {
        if (trigger.type === 'page_view' && pageAnalysis.path.includes(trigger.condition)) {
            score += trigger.weight
        }
    })

    return score
}

function scoreTemporalPattern(personaId: string, temporalData: TemporalData): number {
    // Lógica simples baseada em horários para diferentes personas
    const hour = temporalData.hour
    const dayOfWeek = temporalData.dayOfWeek

    switch (personaId) {
        case 'price-conscious':
            return (hour >= 19 && hour <= 23) ? 0.2 : 0.1 // Horário comercial para pesquisa de preços
        case 'quality-focused':
            return (hour >= 9 && hour <= 17) ? 0.2 : 0.1 // Horário comercial para pesquisas detalhadas
        case 'convenience-seeker':
            return (dayOfWeek >= 1 && dayOfWeek <= 5) ? 0.15 : 0.1 // Dias de semana para conveniência
        case 'urgent-buyer':
            return hour >= 12 && hour <= 20 ? 0.25 : 0.1 // Horário de pico para urgências
        default:
            return 0.1
    }
}

function scoreDevicePattern(personaId: string, deviceInfo: DeviceInfo): number {
    const personaDef = PERSONA_DEFINITIONS[personaId as keyof typeof PERSONA_DEFINITIONS]

    if (personaDef.characteristics.devicePreference.includes(deviceInfo.type)) {
        return 0.2
    }

    return 0.05
}

function getRoutingDecision(profile: UserProfile, behavioralData: BehavioralData): RoutingDecision {
    const { pageAnalysis } = behavioralData
    const persona = profile.primaryPersona

    // Regras de roteamento baseadas em persona
    const routingRules: Record<string, Record<string, RoutingDecision>> = {
        'price-conscious': {
            '/': {
                strategy: 'personalized',
                targetPath: '/variants/price-focused-home',
                shouldRewrite: true,
                priority: 'high',
                reasoning: 'Show pricing-focused homepage to price-conscious users',
                cacheKey: `price-conscious-home-${profile.confidenceScore.toFixed(2)}`
            },
            '/pricing': {
                strategy: 'personalized',
                targetPath: '/variants/price-detailed-pricing',
                shouldRewrite: true,
                priority: 'high',
                reasoning: 'Show detailed pricing comparison'
            }
        },
        'quality-focused': {
            '/': {
                strategy: 'personalized',
                targetPath: '/variants/quality-home',
                shouldRewrite: true,
                priority: 'high',
                reasoning: 'Show quality-focused homepage'
            }
        },
        'convenience-seeker': {
            '/': {
                strategy: 'personalized',
                targetPath: '/variants/convenience-home',
                shouldRewrite: true,
                priority: 'high',
                reasoning: 'Show convenience-focused homepage'
            }
        }
    }

    const personaRules = routingRules[persona]
    if (personaRules && personaRules[pageAnalysis.path]) {
        return personaRules[pageAnalysis.path]
    }

    // Regra padrão
    return {
        strategy: 'default',
        shouldRewrite: false,
        priority: 'low',
        reasoning: 'No specific routing rules for this persona and path'
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images).*)',
    ],
}
