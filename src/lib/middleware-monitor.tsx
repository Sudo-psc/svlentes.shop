'use client'

import React from 'react'

/**
 * Middleware Monitoring Utilities
 *
 * Ferramentas para monitorar o estado do middleware de personalização
 * e detectar quando está em modo fallback.
 */

export interface MiddlewareStatus {
    isActive: boolean
    isFallback: boolean
    fallbackReason?: 'disabled' | 'cooldown' | 'error' | 'timeout'
    errorMessage?: string
    cooldownRemaining?: number
    persona?: string
    confidence?: number
    sessionId?: string
    routingStrategy?: string
}

/**
 * Verifica o status do middleware através dos headers da resposta
 */
export async function checkMiddlewareStatus(url: string = '/'): Promise<MiddlewareStatus> {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            cache: 'no-store'
        })

        const status = response.headers.get('x-personalization-status')
        const fallbackReason = response.headers.get('x-personalization-fallback-reason')
        const errorMessage = response.headers.get('x-personalization-error')
        const cooldownRemaining = response.headers.get('x-personalization-cooldown-remaining')
        const persona = response.headers.get('x-user-persona')
        const confidence = response.headers.get('x-persona-confidence')
        const sessionId = response.headers.get('x-session-id')
        const routingStrategy = response.headers.get('x-routing-strategy')

        return {
            isActive: status === 'active',
            isFallback: status === 'fallback',
            fallbackReason: fallbackReason as any,
            errorMessage: errorMessage || undefined,
            cooldownRemaining: cooldownRemaining ? parseInt(cooldownRemaining, 10) : undefined,
            persona: persona || undefined,
            confidence: confidence ? parseFloat(confidence) : undefined,
            sessionId: sessionId || undefined,
            routingStrategy: routingStrategy || undefined
        }
    } catch (error) {
        console.error('[Monitor] Failed to check middleware status:', error)
        return {
            isActive: false,
            isFallback: true,
            fallbackReason: 'error',
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Monitora continuamente o status do middleware
 */
export function startMiddlewareMonitoring(
    intervalMs: number = 30000,
    onStatusChange?: (status: MiddlewareStatus) => void
): () => void {
    let lastStatus: MiddlewareStatus | null = null
    let intervalId: NodeJS.Timeout

    const check = async () => {
        const status = await checkMiddlewareStatus()

        // Detectar mudanças
        if (lastStatus && onStatusChange) {
            if (lastStatus.isActive !== status.isActive ||
                lastStatus.fallbackReason !== status.fallbackReason) {
                onStatusChange(status)
            }
        }

        lastStatus = status

        // Log em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
            console.log('[Monitor] Middleware status:', {
                isActive: status.isActive,
                isFallback: status.isFallback,
                fallbackReason: status.fallbackReason,
                persona: status.persona,
                confidence: status.confidence
            })
        }
    }

    // Primeira verificação imediata
    check()

    // Verificações periódicas
    intervalId = setInterval(check, intervalMs)

    // Retornar função para parar monitoramento
    return () => {
        clearInterval(intervalId)
    }
}

/**
 * Hook React para monitorar status do middleware
 */
export function useMiddlewareStatus(intervalMs: number = 30000) {
    if (typeof window === 'undefined') {
        return {
            isActive: false,
            isFallback: true,
            fallbackReason: 'disabled' as const
        }
    }

    const [status, setStatus] = React.useState<MiddlewareStatus>({
        isActive: false,
        isFallback: true
    })

    React.useEffect(() => {
        // Verificação inicial
        checkMiddlewareStatus().then(setStatus)

        // Monitoramento contínuo
        const stopMonitoring = startMiddlewareMonitoring(intervalMs, setStatus)

        return stopMonitoring
    }, [intervalMs])

    return status
}

/**
 * Componente de debug para mostrar status do middleware
 */
export function MiddlewareStatusDebug() {
    const status = useMiddlewareStatus()
    const [healthData, setHealthData] = React.useState<any>(null)
    const [isExpanded, setIsExpanded] = React.useState(false)

    React.useEffect(() => {
        // Buscar dados de saúde detalhados
        const fetchHealth = async () => {
            try {
                const response = await fetch('/api/middleware-health')
                const data = await response.json()
                setHealthData(data)
            } catch (error) {
                console.error('[Monitor] Failed to fetch health data:', error)
            }
        }

        fetchHealth()
        const interval = setInterval(fetchHealth, 10000) // Atualizar a cada 10s

        return () => clearInterval(interval)
    }, [])

    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    const getStatusColor = () => {
        if (status.isActive) return '#10B981'
        if (status.fallbackReason === 'cooldown') return '#F59E0B'
        return '#EF4444'
    }

    const getStatusIcon = () => {
        if (status.isActive) return '✓'
        if (status.fallbackReason === 'cooldown') return '⏸'
        return '✗'
    }

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                padding: '12px',
                background: getStatusColor(),
                color: 'white',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'monospace',
                zIndex: 9999,
                maxWidth: isExpanded ? '400px' : '300px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div style={{ fontWeight: 'bold', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                    {getStatusIcon()} Middleware: {status.isActive ? 'Active' : 'Fallback'}
                </span>
                <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    {isExpanded ? '▼' : '▶'}
                </span>
            </div>

            {status.isFallback && (
                <div style={{ marginBottom: '5px' }}>
                    Reason: {status.fallbackReason}
                </div>
            )}

            {status.errorMessage && (
                <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.9, marginBottom: '5px' }}>
                    Error: {status.errorMessage}
                </div>
            )}

            {status.cooldownRemaining && (
                <div style={{ marginBottom: '5px' }}>
                    Cooldown: {status.cooldownRemaining}s
                </div>
            )}

            {status.persona && (
                <div style={{ marginBottom: '5px' }}>
                    Persona: {status.persona} ({(status.confidence! * 100).toFixed(0)}%)
                </div>
            )}

            {status.routingStrategy && (
                <div style={{ marginBottom: '5px' }}>
                    Strategy: {status.routingStrategy}
                </div>
            )}

            {isExpanded && healthData && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        Health: {healthData.status}
                    </div>

                    {healthData.circuitBreaker && (
                        <div style={{ marginBottom: '5px' }}>
                            Circuit: {healthData.circuitBreaker.status}
                            {healthData.circuitBreaker.consecutiveErrors > 0 && (
                                <span> ({healthData.circuitBreaker.consecutiveErrors} errors)</span>
                            )}
                        </div>
                    )}

                    {healthData.metrics && (
                        <div style={{ fontSize: '10px', opacity: 0.9 }}>
                            <div>Requests: {healthData.metrics.totalRequests}</div>
                            <div>Error Rate: {healthData.metrics.errorRate.toFixed(1)}%</div>
                            <div>Uptime: {healthData.metrics.uptime.toFixed(1)}%</div>
                        </div>
                    )}

                    {healthData.issues && healthData.issues.length > 0 && (
                        <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.9 }}>
                            <div style={{ fontWeight: 'bold' }}>Issues:</div>
                            {healthData.issues.map((issue: string, i: number) => (
                                <div key={i}>• {issue}</div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.7, textAlign: 'center' }}>
                Click to {isExpanded ? 'collapse' : 'expand'}
            </div>
        </div>
    )
}

/**
 * Utilitário para forçar reset do middleware (desenvolvimento)
 */
export async function resetMiddlewareState(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
        console.warn('[Monitor] Reset only available in development')
        return
    }

    try {
        // Limpar cookies relacionados
        document.cookie = 'user_profile=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        document.cookie = 'session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        // Limpar cache do navegador
        if ('caches' in window) {
            const cacheNames = await caches.keys()
            await Promise.all(cacheNames.map(name => caches.delete(name)))
        }

        console.log('[Monitor] Middleware state reset. Reloading page...')

        // Recarregar página
        window.location.reload()
    } catch (error) {
        console.error('[Monitor] Failed to reset middleware state:', error)
    }
}

