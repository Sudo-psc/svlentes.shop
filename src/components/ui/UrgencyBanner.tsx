'use client'

import { useState, useEffect } from 'react'
import { Clock, Users, TrendingUp } from 'lucide-react'

interface UrgencyBannerProps {
    variant?: 'limited-spots' | 'time-limited' | 'social-proof'
    className?: string
}

export function UrgencyBanner({ variant = 'limited-spots', className = '' }: UrgencyBannerProps) {
    const [spotsLeft, setSpotsLeft] = useState(5)
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 })

    // Countdown timer para oferta por tempo limitado
    useEffect(() => {
        if (variant === 'time-limited') {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    let { hours, minutes, seconds } = prev

                    if (seconds > 0) {
                        seconds--
                    } else if (minutes > 0) {
                        minutes--
                        seconds = 59
                    } else if (hours > 0) {
                        hours--
                        minutes = 59
                        seconds = 59
                    }

                    return { hours, minutes, seconds }
                })
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [variant])

    // Simular redução de vagas (apenas visual, não real)
    useEffect(() => {
        if (variant === 'limited-spots') {
            const interval = setInterval(() => {
                setSpotsLeft(prev => Math.max(3, prev - (Math.random() > 0.7 ? 1 : 0)))
            }, 30000) // A cada 30 segundos

            return () => clearInterval(interval)
        }
    }, [variant])

    if (variant === 'limited-spots') {
        return (
            <div className={`bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-4 rounded-lg ${className}`}>
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-orange-900">
                            Apenas <span className="text-xl font-bold text-orange-600">{spotsLeft} vagas</span> disponíveis esta semana
                        </p>
                        <p className="text-xs text-orange-700 mt-1">
                            Alta demanda para consultas com Dr. Philipe Saraiva Cruz
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-orange-600">{spotsLeft}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (variant === 'time-limited') {
        return (
            <div className={`bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-4 rounded-lg ${className}`}>
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <Clock className="w-6 h-6 text-red-600 animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-red-900">
                            Oferta especial termina em:
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                            <div className="bg-red-600 text-white px-2 py-1 rounded font-bold text-sm">
                                {String(timeLeft.hours).padStart(2, '0')}h
                            </div>
                            <span className="text-red-600 font-bold">:</span>
                            <div className="bg-red-600 text-white px-2 py-1 rounded font-bold text-sm">
                                {String(timeLeft.minutes).padStart(2, '0')}m
                            </div>
                            <span className="text-red-600 font-bold">:</span>
                            <div className="bg-red-600 text-white px-2 py-1 rounded font-bold text-sm">
                                {String(timeLeft.seconds).padStart(2, '0')}s
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (variant === 'social-proof') {
        return (
            <div className={`bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-lg ${className}`}>
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-green-900">
                            <span className="text-lg font-bold text-green-600">127 pessoas</span> agendaram consulta esta semana
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                            Junte-se aos milhares que já economizam com SV Lentes
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 bg-green-200 rounded-full border-2 border-white"></div>
                            <div className="w-8 h-8 bg-green-300 rounded-full border-2 border-white"></div>
                            <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
