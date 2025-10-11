'use client'

import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'

interface MiddlewareStatus {
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

async function checkMiddlewareStatus(): Promise<MiddlewareStatus> {
    try {
        const response = await fetch('/', {
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
        return {
            isActive: false,
            isFallback: true,
            fallbackReason: 'error',
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

export function MiddlewareStatusIndicator() {
    const [status, setStatus] = useState<MiddlewareStatus>({
        isActive: false,
        isFallback: true
    })
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        // Verificação inicial
        checkMiddlewareStatus().then(setStatus)

        // Verificações periódicas (a cada 30 segundos)
        const interval = setInterval(() => {
            checkMiddlewareStatus().then(setStatus)
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    // Não mostrar em produção
    if (process.env.NODE_ENV === 'production') {
        return null
    }

    const getStatusColor = () => {
        if (status.isActive) return 'bg-green-500'
        if (status.fallbackReason === 'cooldown') return 'bg-yellow-500'
        if (status.fallbackReason === 'timeout') return 'bg-orange-500'
        return 'bg-red-500'
    }

    const getStatusIcon = () => {
        if (status.isActive) return <CheckCircle className="w-4 h-4" />
        if (status.fallbackReason === 'cooldown') return <Clock className="w-4 h-4" />
        if (status.fallbackReason === 'timeout') return <AlertCircle className="w-4 h-4" />
        return <XCircle className="w-4 h-4" />
    }

    const getStatusText = () => {
        if (status.isActive) return 'Active'
        if (status.fallbackReason === 'cooldown') return 'Cooldown'
        if (status.fallbackReason === 'timeout') return 'Timeout'
        if (status.fallbackReason === 'disabled') return 'Disabled'
        return 'Error'
    }

    return (
        <div className="fixed bottom-4 right-4 z-[9999] font-mono text-xs">
            {/* Indicador compacto */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`${getStatusColor()} text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:opacity-90 transition-opacity`}
            >
                {getStatusIcon()}
                <span className="font-semibold">Middleware: {getStatusText()}</span>
            </button>

            {/* Painel expandido */}
            {isExpanded && (
                <div className="mt-2 bg-gray-900 text-gray-100 p-4 rounded-lg shadow-xl max-w-sm">
                    <div className="space-y-2">
                        {/* Status principal */}
                        <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                            <span className="font-semibold">Status</span>
                            <span className={`px-2 py-1 rounded ${getStatusColor()} text-white`}>
                                {getStatusText()}
                            </span>
                        </div>

                        {/* Fallback reason */}
                        {status.isFallback && status.fallbackReason && (
                            <div>
                                <span className="text-gray-400">Reason:</span>{' '}
                                <span className="text-yellow-400">{status.fallbackReason}</span>
                            </div>
                        )}

                        {/* Error message */}
                        {status.errorMessage && (
                            <div>
                                <span className="text-gray-400">Error:</span>{' '}
                                <span className="text-red-400 text-[10px] break-all">
                                    {status.errorMessage}
                                </span>
                            </div>
                        )}

                        {/* Cooldown */}
                        {status.cooldownRemaining && (
                            <div>
                                <span className="text-gray-400">Cooldown:</span>{' '}
                                <span className="text-yellow-400">{status.cooldownRemaining}s</span>
                            </div>
                        )}

                        {/* Persona info */}
                        {status.persona && (
                            <>
                                <div>
                                    <span className="text-gray-400">Persona:</span>{' '}
                                    <span className="text-blue-400">{status.persona}</span>
                                </div>
                                {status.confidence && (
                                    <div>
                                        <span className="text-gray-400">Confidence:</span>{' '}
                                        <span className="text-green-400">
                                            {(status.confidence * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Routing strategy */}
                        {status.routingStrategy && (
                            <div>
                                <span className="text-gray-400">Strategy:</span>{' '}
                                <span className="text-purple-400">{status.routingStrategy}</span>
                            </div>
                        )}

                        {/* Session ID */}
                        {status.sessionId && (
                            <div>
                                <span className="text-gray-400">Session:</span>{' '}
                                <span className="text-gray-500 text-[10px] break-all">
                                    {status.sessionId}
                                </span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-2 border-t border-gray-700 flex gap-2">
                            <button
                                onClick={() => checkMiddlewareStatus().then(setStatus)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-[10px] transition-colors"
                            >
                                Refresh
                            </button>
                            <button
                                onClick={() => {
                                    document.cookie = 'user_profile=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                                    document.cookie = 'session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                                    window.location.reload()
                                }}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-[10px] transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
