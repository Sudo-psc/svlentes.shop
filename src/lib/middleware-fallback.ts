/**
 * Sistema de Fallback Robusto para Middleware
 * 
 * Implementa Circuit Breaker Pattern com recuperação gradual
 * e fallback em cascata para garantir disponibilidade.
 */

export interface FallbackConfig {
    enabled: boolean
    maxConsecutiveErrors: number
    errorCooldownMs: number
    partialRecoveryMs: number
    healthCheckIntervalMs: number
    healthCheckThreshold: number
    timeoutLevels: {
        fast: number
        normal: number
        slow: number
    }
}

export interface CircuitBreakerMetrics {
    status: 'closed' | 'open' | 'half-open'
    consecutiveErrors: number
    consecutiveSuccesses: number
    totalRequests: number
    totalErrors: number
    totalFallbacks: number
    errorRate: number
    avgLatency: number
    lastErrorTime: number
    lastSuccessTime: number
    uptime: number
}

export interface FallbackStrategy {
    level: 'none' | 'simplified' | 'cached' | 'default'
    reason: string
    shouldRetry: boolean
    retryAfterMs?: number
}

/**
 * Determina estratégia de fallback baseada no tipo de erro
 */
export function determineFallbackStrategy(
    error: unknown,
    consecutiveErrors: number,
    lastErrorTime: number
): FallbackStrategy {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const timeSinceLastError = Date.now() - lastErrorTime

    // Erro de timeout → Tentar versão simplificada
    if (errorMessage.includes('timeout')) {
        return {
            level: 'simplified',
            reason: 'timeout',
            shouldRetry: consecutiveErrors < 3,
            retryAfterMs: 1000
        }
    }

    // Erro de rede → Usar cache ou fallback completo
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return {
            level: 'cached',
            reason: 'network',
            shouldRetry: consecutiveErrors < 2,
            retryAfterMs: 5000
        }
    }

    // Erro de dados → Fallback para padrão
    if (errorMessage.includes('parse') || errorMessage.includes('invalid')) {
        return {
            level: 'default',
            reason: 'data',
            shouldRetry: false
        }
    }

    // Muitos erros consecutivos → Fallback completo com cooldown
    if (consecutiveErrors >= 5) {
        return {
            level: 'default',
            reason: 'circuit-breaker-open',
            shouldRetry: timeSinceLastError >= 60000, // 1 minuto
            retryAfterMs: 60000
        }
    }

    // Erro desconhecido → Fallback padrão
    return {
        level: 'default',
        reason: 'unknown',
        shouldRetry: consecutiveErrors < 3,
        retryAfterMs: 2000
    }
}

/**
 * Calcula métricas do circuit breaker
 */
export function calculateCircuitBreakerMetrics(
    state: {
        status: 'closed' | 'open' | 'half-open'
        consecutiveErrors: number
        consecutiveSuccesses: number
        totalRequests: number
        totalErrors: number
        totalFallbacks: number
        lastErrorTime: number
        lastSuccessTime: number
    },
    performanceMetrics: Array<{ timestamp: number; latency: number; success: boolean }>
): CircuitBreakerMetrics {
    const now = Date.now()
    const recentMetrics = performanceMetrics.filter(m => now - m.timestamp < 60000)

    const errorRate = state.totalRequests > 0
        ? (state.totalErrors / state.totalRequests) * 100
        : 0

    const avgLatency = recentMetrics.length > 0
        ? recentMetrics.reduce((sum, m) => sum + m.latency, 0) / recentMetrics.length
        : 0

    const uptime = state.totalRequests > 0
        ? ((state.totalRequests - state.totalErrors) / state.totalRequests) * 100
        : 100

    return {
        status: state.status,
        consecutiveErrors: state.consecutiveErrors,
        consecutiveSuccesses: state.consecutiveSuccesses,
        totalRequests: state.totalRequests,
        totalErrors: state.totalErrors,
        totalFallbacks: state.totalFallbacks,
        errorRate: parseFloat(errorRate.toFixed(2)),
        avgLatency: parseFloat(avgLatency.toFixed(2)),
        lastErrorTime: state.lastErrorTime,
        lastSuccessTime: state.lastSuccessTime,
        uptime: parseFloat(uptime.toFixed(2))
    }
}

/**
 * Verifica se deve executar health check
 */
export function shouldPerformHealthCheck(
    lastHealthCheck: number,
    intervalMs: number
): boolean {
    return Date.now() - lastHealthCheck >= intervalMs
}

/**
 * Determina se circuit breaker deve mudar de estado
 */
export function shouldUpdateCircuitBreakerState(
    currentStatus: 'closed' | 'open' | 'half-open',
    consecutiveErrors: number,
    consecutiveSuccesses: number,
    maxErrors: number,
    recoveryThreshold: number
): 'closed' | 'open' | 'half-open' {
    switch (currentStatus) {
        case 'closed':
            // Abrir se muitos erros
            if (consecutiveErrors >= maxErrors) {
                return 'open'
            }
            return 'closed'

        case 'open':
            // Não muda automaticamente, precisa de cooldown
            return 'open'

        case 'half-open':
            // Fechar se sucessos suficientes
            if (consecutiveSuccesses >= recoveryThreshold) {
                return 'closed'
            }
            // Reabrir se erro
            if (consecutiveErrors > 0) {
                return 'open'
            }
            return 'half-open'

        default:
            return 'closed'
    }
}

/**
 * Gera relatório de saúde do sistema
 */
export function generateHealthReport(metrics: CircuitBreakerMetrics): {
    status: 'healthy' | 'degraded' | 'unhealthy'
    issues: string[]
    recommendations: string[]
} {
    const issues: string[] = []
    const recommendations: string[] = []

    // Verificar taxa de erro
    if (metrics.errorRate > 20) {
        issues.push(`High error rate: ${metrics.errorRate}%`)
        recommendations.push('Investigate root cause of errors')
    } else if (metrics.errorRate > 10) {
        issues.push(`Elevated error rate: ${metrics.errorRate}%`)
        recommendations.push('Monitor error patterns')
    }

    // Verificar latência
    if (metrics.avgLatency > 200) {
        issues.push(`High latency: ${metrics.avgLatency}ms`)
        recommendations.push('Optimize personalization logic or increase timeout')
    } else if (metrics.avgLatency > 100) {
        issues.push(`Elevated latency: ${metrics.avgLatency}ms`)
        recommendations.push('Consider caching strategies')
    }

    // Verificar circuit breaker
    if (metrics.status === 'open') {
        issues.push('Circuit breaker is open')
        recommendations.push('Wait for cooldown period to complete')
    } else if (metrics.status === 'half-open') {
        issues.push('Circuit breaker is recovering')
        recommendations.push('Monitor recovery progress')
    }

    // Verificar uptime
    if (metrics.uptime < 95) {
        issues.push(`Low uptime: ${metrics.uptime}%`)
        recommendations.push('Review system stability and error handling')
    }

    // Determinar status geral
    let status: 'healthy' | 'degraded' | 'unhealthy'
    if (issues.length === 0) {
        status = 'healthy'
    } else if (metrics.status === 'open' || metrics.errorRate > 20 || metrics.uptime < 90) {
        status = 'unhealthy'
    } else {
        status = 'degraded'
    }

    return { status, issues, recommendations }
}

/**
 * Formata métricas para logging
 */
export function formatMetricsForLogging(metrics: CircuitBreakerMetrics): string {
    return [
        `Status: ${metrics.status}`,
        `Error Rate: ${metrics.errorRate}%`,
        `Avg Latency: ${metrics.avgLatency}ms`,
        `Uptime: ${metrics.uptime}%`,
        `Requests: ${metrics.totalRequests}`,
        `Errors: ${metrics.totalErrors}`,
        `Fallbacks: ${metrics.totalFallbacks}`
    ].join(' | ')
}

/**
 * Exporta métricas para monitoramento externo
 */
export function exportMetricsForMonitoring(metrics: CircuitBreakerMetrics) {
    return {
        'middleware.circuit_breaker.status': metrics.status === 'closed' ? 0 : metrics.status === 'half-open' ? 1 : 2,
        'middleware.error_rate': metrics.errorRate,
        'middleware.avg_latency': metrics.avgLatency,
        'middleware.uptime': metrics.uptime,
        'middleware.total_requests': metrics.totalRequests,
        'middleware.total_errors': metrics.totalErrors,
        'middleware.total_fallbacks': metrics.totalFallbacks,
        'middleware.consecutive_errors': metrics.consecutiveErrors,
        'middleware.consecutive_successes': metrics.consecutiveSuccesses
    }
}
