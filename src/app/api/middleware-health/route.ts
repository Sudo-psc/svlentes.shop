import { NextRequest, NextResponse } from 'next/server'

/**
 * API de Health Check do Middleware
 * 
 * Endpoint para monitorar o estado do sistema de fallback
 * e circuit breaker do middleware de personalização.
 * 
 * GET /api/middleware-health
 * 
 * Retorna:
 * - Status do circuit breaker
 * - Métricas de performance
 * - Recomendações de saúde
 */

// Simular acesso às métricas do middleware (em produção usar Redis)
// Nota: Como o middleware roda em edge runtime, precisamos de um mecanismo
// de compartilhamento de estado (Redis, KV store, etc.)

interface HealthCheckResponse {
    status: 'healthy' | 'degraded' | 'unhealthy'
    timestamp: string
    circuitBreaker: {
        status: 'closed' | 'open' | 'half-open'
        consecutiveErrors: number
        consecutiveSuccesses: number
    }
    metrics: {
        totalRequests: number
        totalErrors: number
        totalFallbacks: number
        errorRate: number
        avgLatency: number
        uptime: number
    }
    issues: string[]
    recommendations: string[]
}

export async function GET(request: NextRequest) {
    try {
        // Em produção, buscar métricas do Redis ou KV store
        // Por enquanto, retornar dados simulados baseados em headers

        const testResponse = await fetch(new URL('/', request.url), {
            method: 'HEAD',
            cache: 'no-store'
        })

        const circuitBreakerStatus = testResponse.headers.get('x-circuit-breaker-status') || 'closed'
        const personalizationStatus = testResponse.headers.get('x-personalization-status') || 'active'
        const fallbackReason = testResponse.headers.get('x-personalization-fallback-reason')
        const consecutiveErrors = parseInt(testResponse.headers.get('x-circuit-breaker-errors') || '0', 10)
        const totalRequests = parseInt(testResponse.headers.get('x-circuit-breaker-total-requests') || '0', 10)
        const errorRate = parseFloat(testResponse.headers.get('x-circuit-breaker-error-rate') || '0')

        // Determinar status geral
        let status: 'healthy' | 'degraded' | 'unhealthy'
        const issues: string[] = []
        const recommendations: string[] = []

        if (circuitBreakerStatus === 'open') {
            status = 'unhealthy'
            issues.push('Circuit breaker is open - personalization disabled')
            recommendations.push('Wait for cooldown period to complete')
            recommendations.push('Check error logs for root cause')
        } else if (circuitBreakerStatus === 'half-open') {
            status = 'degraded'
            issues.push('Circuit breaker is recovering')
            recommendations.push('Monitor recovery progress')
        } else if (personalizationStatus === 'fallback') {
            status = 'degraded'
            issues.push(`Personalization in fallback mode: ${fallbackReason}`)
            recommendations.push('Check middleware logs for details')
        } else if (errorRate > 10) {
            status = 'degraded'
            issues.push(`Elevated error rate: ${errorRate}%`)
            recommendations.push('Monitor error patterns')
        } else {
            status = 'healthy'
        }

        const response: HealthCheckResponse = {
            status,
            timestamp: new Date().toISOString(),
            circuitBreaker: {
                status: circuitBreakerStatus as any,
                consecutiveErrors,
                consecutiveSuccesses: 0 // Não disponível via headers
            },
            metrics: {
                totalRequests,
                totalErrors: Math.round(totalRequests * errorRate / 100),
                totalFallbacks: personalizationStatus === 'fallback' ? 1 : 0,
                errorRate,
                avgLatency: 0, // Não disponível via headers
                uptime: 100 - errorRate
            },
            issues,
            recommendations
        }

        return NextResponse.json(response, {
            status: status === 'healthy' ? 200 : status === 'degraded' ? 207 : 503,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Content-Type': 'application/json'
            }
        })

    } catch (error) {
        console.error('[Health Check] Error:', error)

        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
            issues: ['Failed to check middleware health'],
            recommendations: ['Check middleware configuration', 'Review error logs']
        }, {
            status: 503,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Content-Type': 'application/json'
            }
        })
    }
}

// Endpoint para forçar reset do circuit breaker (apenas desenvolvimento)
export async function POST(request: NextRequest) {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({
            error: 'Reset only available in development'
        }, { status: 403 })
    }

    try {
        const body = await request.json()
        const action = body.action

        if (action === 'reset') {
            // Em produção, limpar estado no Redis
            // Por enquanto, apenas retornar sucesso

            return NextResponse.json({
                success: true,
                message: 'Circuit breaker reset requested',
                timestamp: new Date().toISOString()
            })
        }

        return NextResponse.json({
            error: 'Invalid action'
        }, { status: 400 })

    } catch (error) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
