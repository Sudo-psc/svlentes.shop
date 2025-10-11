'use client'

import React from 'react'
import { useMiddlewareStatus } from '@/lib/middleware-monitor'

/**
 * Dashboard de Monitoramento do Middleware
 * 
 * Página administrativa para visualizar o estado do sistema
 * de fallback e circuit breaker em tempo real.
 * 
 * Acesso: /admin/middleware-dashboard
 */

interface HealthData {
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

export default function MiddlewareDashboard() {
    const middlewareStatus = useMiddlewareStatus(5000) // Atualizar a cada 5s
    const [healthData, setHealthData] = React.useState<HealthData | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        const fetchHealthData = async () => {
            try {
                const response = await fetch('/api/middleware-health')
                const data = await response.json()
                setHealthData(data)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao buscar dados')
            } finally {
                setIsLoading(false)
            }
        }

        fetchHealthData()
        const interval = setInterval(fetchHealthData, 5000)

        return () => clearInterval(interval)
    }, [])

    const handleReset = async () => {
        if (!confirm('Tem certeza que deseja resetar o circuit breaker?')) {
            return
        }

        try {
            const response = await fetch('/api/middleware-health', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reset' })
            })

            const data = await response.json()
            alert(data.message || 'Circuit breaker resetado com sucesso')
            window.location.reload()
        } catch (err) {
            alert('Erro ao resetar: ' + (err instanceof Error ? err.message : 'Erro desconhecido'))
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Middleware Dashboard</h1>
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Carregando dados...</p>
                    </div>
                </div>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy':
            case 'closed':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'degraded':
            case 'half-open':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'unhealthy':
            case 'open':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy':
            case 'closed':
                return '✅'
            case 'degraded':
            case 'half-open':
                return '⚠️'
            case 'unhealthy':
            case 'open':
                return '❌'
            default:
                return '❓'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Middleware Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Monitoramento em tempo real do sistema de fallback e circuit breaker
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">❌ Erro: {error}</p>
                    </div>
                )}

                {/* Status Geral */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className={`p-6 rounded-lg border-2 ${getStatusColor(healthData?.status || 'unknown')}`}>
                        <div className="text-4xl mb-2">{getStatusIcon(healthData?.status || 'unknown')}</div>
                        <h3 className="text-lg font-semibold mb-1">Status Geral</h3>
                        <p className="text-2xl font-bold capitalize">{healthData?.status || 'Unknown'}</p>
                    </div>

                    <div className={`p-6 rounded-lg border-2 ${getStatusColor(healthData?.circuitBreaker.status || 'unknown')}`}>
                        <div className="text-4xl mb-2">{getStatusIcon(healthData?.circuitBreaker.status || 'unknown')}</div>
                        <h3 className="text-lg font-semibold mb-1">Circuit Breaker</h3>
                        <p className="text-2xl font-bold capitalize">{healthData?.circuitBreaker.status || 'Unknown'}</p>
                    </div>

                    <div className={`p-6 rounded-lg border-2 ${getStatusColor(middlewareStatus.isActive ? 'healthy' : 'unhealthy')}`}>
                        <div className="text-4xl mb-2">{middlewareStatus.isActive ? '✅' : '❌'}</div>
                        <h3 className="text-lg font-semibold mb-1">Personalização</h3>
                        <p className="text-2xl font-bold">{middlewareStatus.isActive ? 'Ativa' : 'Fallback'}</p>
                    </div>
                </div>

                {/* Métricas */}
                {healthData?.metrics && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">Métricas de Performance</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <MetricCard
                                label="Total de Requisições"
                                value={healthData.metrics.totalRequests.toLocaleString()}
                                icon="📊"
                            />
                            <MetricCard
                                label="Total de Erros"
                                value={healthData.metrics.totalErrors.toLocaleString()}
                                icon="❌"
                                color={healthData.metrics.totalErrors > 0 ? 'text-red-600' : 'text-gray-900'}
                            />
                            <MetricCard
                                label="Total de Fallbacks"
                                value={healthData.metrics.totalFallbacks.toLocaleString()}
                                icon="🔄"
                                color={healthData.metrics.totalFallbacks > 0 ? 'text-yellow-600' : 'text-gray-900'}
                            />
                            <MetricCard
                                label="Taxa de Erro"
                                value={`${healthData.metrics.errorRate.toFixed(1)}%`}
                                icon="📈"
                                color={healthData.metrics.errorRate > 10 ? 'text-red-600' : 'text-green-600'}
                            />
                            <MetricCard
                                label="Latência Média"
                                value={`${healthData.metrics.avgLatency.toFixed(0)}ms`}
                                icon="⚡"
                                color={healthData.metrics.avgLatency > 100 ? 'text-yellow-600' : 'text-green-600'}
                            />
                            <MetricCard
                                label="Uptime"
                                value={`${healthData.metrics.uptime.toFixed(1)}%`}
                                icon="✅"
                                color={healthData.metrics.uptime < 95 ? 'text-red-600' : 'text-green-600'}
                            />
                        </div>
                    </div>
                )}

                {/* Circuit Breaker Details */}
                {healthData?.circuitBreaker && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">Detalhes do Circuit Breaker</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Status</p>
                                <p className="text-lg font-semibold capitalize">{healthData.circuitBreaker.status}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Erros Consecutivos</p>
                                <p className="text-lg font-semibold">{healthData.circuitBreaker.consecutiveErrors}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Sucessos Consecutivos</p>
                                <p className="text-lg font-semibold">{healthData.circuitBreaker.consecutiveSuccesses}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Issues e Recomendações */}
                {healthData && (healthData.issues.length > 0 || healthData.recommendations.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {healthData.issues.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-red-900 mb-3">⚠️ Problemas Detectados</h3>
                                <ul className="space-y-2">
                                    {healthData.issues.map((issue, index) => (
                                        <li key={index} className="text-red-800 flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>{issue}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {healthData.recommendations.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Recomendações</h3>
                                <ul className="space-y-2">
                                    {healthData.recommendations.map((rec, index) => (
                                        <li key={index} className="text-blue-800 flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Ações */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Ações de Desenvolvimento</h2>
                        <div className="flex gap-4">
                            <button
                                onClick={handleReset}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                            >
                                🔄 Resetar Circuit Breaker
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                            >
                                ♻️ Recarregar Dashboard
                            </button>
                        </div>
                        <p className="mt-4 text-sm text-gray-600">
                            ⚠️ Estas ações estão disponíveis apenas em ambiente de desenvolvimento
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Última atualização: {healthData?.timestamp ? new Date(healthData.timestamp).toLocaleString('pt-BR') : 'N/A'}</p>
                    <p className="mt-1">Atualização automática a cada 5 segundos</p>
                </div>
            </div>
        </div>
    )
}

function MetricCard({
    label,
    value,
    icon,
    color = 'text-gray-900'
}: {
    label: string
    value: string
    icon: string
    color?: string
}) {
    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-xs text-gray-600 mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
        </div>
    )
}
