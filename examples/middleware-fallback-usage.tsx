/**
 * Exemplos de Uso do Sistema de Fallback
 * 
 * Este arquivo contém exemplos práticos de como usar
 * o sistema de fallback em diferentes cenários.
 */

import React from 'react'
import { useMiddlewareStatus } from '@/lib/middleware-monitor'

// ============================================================================
// EXEMPLO 1: Componente que se adapta ao status do middleware
// ============================================================================

export function AdaptiveHero() {
    const status = useMiddlewareStatus()

    // Renderizar conteúdo diferente baseado no status
    if (status.isActive && status.persona) {
        // Personalização ativa - mostrar conteúdo personalizado
        return (
            <div className="hero">
                <h1>Olá, {getPersonaGreeting(status.persona)}!</h1>
                <p>{getPersonaMessage(status.persona)}</p>
                <button>{getPersonaCTA(status.persona)}</button>
            </div>
        )
    }

    // Fallback - mostrar conteúdo genérico
    return (
        <div className="hero">
            <h1>Bem-vindo ao SVlentes</h1>
            <p>Lentes de contato com acompanhamento médico</p>
            <button>Começar Agora</button>
        </div>
    )
}

function getPersonaGreeting(persona: string): string {
    const greetings: Record<string, string> = {
        'price-conscious': 'economizador',
        'quality-focused': 'exigente',
        'convenience-seeker': 'prático',
        'urgent-buyer': 'decidido'
    }
    return greetings[persona] || 'visitante'
}

function getPersonaMessage(persona: string): string {
    const messages: Record<string, string> = {
        'price-conscious': 'Economize até 40% com nossa assinatura',
        'quality-focused': 'Qualidade premium com acompanhamento médico',
        'convenience-seeker': 'Receba em casa sem complicação',
        'urgent-buyer': 'Comece hoje mesmo, entrega rápida'
    }
    return messages[persona] || 'Lentes de contato com acompanhamento médico'
}

function getPersonaCTA(persona: string): string {
    const ctas: Record<string, string> = {
        'price-conscious': 'Ver Preços',
        'quality-focused': 'Conhecer o Serviço',
        'convenience-seeker': 'Assinar Agora',
        'urgent-buyer': 'Começar Hoje'
    }
    return ctas[persona] || 'Começar Agora'
}

// ============================================================================
// EXEMPLO 2: Indicador visual de status
// ============================================================================

export function MiddlewareStatusIndicator() {
    const status = useMiddlewareStatus()

    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    const getStatusColor = () => {
        if (status.isActive) return 'bg-green-500'
        if (status.fallbackReason === 'cooldown') return 'bg-yellow-500'
        return 'bg-red-500'
    }

    const getStatusText = () => {
        if (status.isActive) return 'Personalização Ativa'
        return `Fallback: ${status.fallbackReason}`
    }

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg px-4 py-2 border">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
                <span className="text-sm font-medium">{getStatusText()}</span>
                {status.persona && (
                    <span className="text-xs text-gray-500">
                        ({status.persona})
                    </span>
                )}
            </div>
        </div>
    )
}

// ============================================================================
// EXEMPLO 3: Hook customizado para decisões baseadas em fallback
// ============================================================================

export function usePersonalizationDecision() {
    const status = useMiddlewareStatus()

    return {
        // Se deve mostrar conteúdo personalizado
        shouldPersonalize: status.isActive && status.confidence && status.confidence > 0.5,

        // Se deve usar cache
        shouldUseCache: status.isFallback && status.fallbackReason === 'timeout',

        // Se deve mostrar versão simplificada
        shouldSimplify: status.routingStrategy === 'simplified',

        // Persona atual (ou padrão)
        persona: status.persona || 'default',

        // Nível de confiança
        confidence: status.confidence || 0,

        // Status completo
        status
    }
}

// Uso do hook
export function SmartPricingSection() {
    const { shouldPersonalize, persona, confidence } = usePersonalizationDecision()

    if (shouldPersonalize && confidence > 0.7) {
        // Alta confiança - mostrar preços personalizados
        return <PersonalizedPricing persona={persona} />
    }

    if (shouldPersonalize && confidence > 0.4) {
        // Média confiança - mostrar preços com destaque
        return <HighlightedPricing persona={persona} />
    }

    // Baixa confiança ou fallback - mostrar preços padrão
    return <StandardPricing />
}

// ============================================================================
// EXEMPLO 4: Componente de alerta para problemas
// ============================================================================

export function MiddlewareHealthAlert() {
    const [healthData, setHealthData] = React.useState<any>(null)

    React.useEffect(() => {
        const checkHealth = async () => {
            try {
                const response = await fetch('/api/middleware-health')
                const data = await response.json()
                setHealthData(data)
            } catch (error) {
                console.error('Failed to check health:', error)
            }
        }

        checkHealth()
        const interval = setInterval(checkHealth, 30000) // A cada 30s

        return () => clearInterval(interval)
    }, [])

    // Não mostrar se tudo estiver ok
    if (!healthData || healthData.status === 'healthy') {
        return null
    }

    // Mostrar alerta apenas para admins em desenvolvimento
    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    return (
        <div className="fixed bottom-4 left-4 z-50 max-w-md">
            <div className={`rounded-lg shadow-lg p-4 ${healthData.status === 'degraded'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                } border-2`}>
                <div className="flex items-start gap-3">
                    <span className="text-2xl">
                        {healthData.status === 'degraded' ? '⚠️' : '❌'}
                    </span>
                    <div className="flex-1">
                        <h3 className="font-bold mb-1">
                            Middleware {healthData.status === 'degraded' ? 'Degradado' : 'Com Problemas'}
                        </h3>
                        {healthData.issues && healthData.issues.length > 0 && (
                            <ul className="text-sm space-y-1 mb-2">
                                {healthData.issues.map((issue: string, i: number) => (
                                    <li key={i}>• {issue}</li>
                                ))}
                            </ul>
                        )}
                        <a
                            href="/admin/middleware-dashboard"
                            className="text-sm font-medium underline"
                        >
                            Ver Dashboard →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================================
// EXEMPLO 5: Componente de métricas em tempo real
// ============================================================================

export function LiveMetrics() {
    const [metrics, setMetrics] = React.useState<any>(null)

    React.useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch('/api/middleware-health')
                const data = await response.json()
                setMetrics(data.metrics)
            } catch (error) {
                console.error('Failed to fetch metrics:', error)
            }
        }

        fetchMetrics()
        const interval = setInterval(fetchMetrics, 5000)

        return () => clearInterval(interval)
    }, [])

    if (!metrics || process.env.NODE_ENV !== 'development') {
        return null
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-black/80 text-white rounded-lg p-3 text-xs font-mono">
                <div className="grid grid-cols-2 gap-2">
                    <div>Requests:</div>
                    <div className="text-right">{metrics.totalRequests}</div>

                    <div>Errors:</div>
                    <div className="text-right text-red-400">{metrics.totalErrors}</div>

                    <div>Error Rate:</div>
                    <div className={`text-right ${metrics.errorRate > 10 ? 'text-red-400' : 'text-green-400'
                        }`}>
                        {metrics.errorRate.toFixed(1)}%
                    </div>

                    <div>Latency:</div>
                    <div className={`text-right ${metrics.avgLatency > 100 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                        {metrics.avgLatency.toFixed(0)}ms
                    </div>

                    <div>Uptime:</div>
                    <div className={`text-right ${metrics.uptime < 95 ? 'text-red-400' : 'text-green-400'
                        }`}>
                        {metrics.uptime.toFixed(1)}%
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================================================
// EXEMPLO 6: Integração com analytics
// ============================================================================

export function useMiddlewareAnalytics() {
    const status = useMiddlewareStatus()

    React.useEffect(() => {
        // Enviar evento quando personalização está ativa
        if (status.isActive && status.persona) {
            // Exemplo com Google Analytics
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'personalization_active', {
                    persona: status.persona,
                    confidence: status.confidence,
                    routing_strategy: status.routingStrategy
                })
            }
        }

        // Enviar evento quando em fallback
        if (status.isFallback) {
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'personalization_fallback', {
                    reason: status.fallbackReason,
                    error: status.errorMessage
                })
            }
        }
    }, [status.isActive, status.isFallback, status.persona])

    return status
}

// ============================================================================
// COMPONENTES AUXILIARES (para os exemplos acima)
// ============================================================================

function PersonalizedPricing({ persona }: { persona: string }) {
    return <div>Preços personalizados para {persona}</div>
}

function HighlightedPricing({ persona }: { persona: string }) {
    return <div>Preços com destaque para {persona}</div>
}

function StandardPricing() {
    return <div>Preços padrão</div>
}

// ============================================================================
// EXEMPLO 7: Layout com fallback integrado
// ============================================================================

export function LayoutWithFallback({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}

            {/* Componentes de monitoramento (apenas dev) */}
            {process.env.NODE_ENV === 'development' && (
                <>
                    <MiddlewareStatusIndicator />
                    <MiddlewareHealthAlert />
                    <LiveMetrics />
                </>
            )}
        </>
    )
}
