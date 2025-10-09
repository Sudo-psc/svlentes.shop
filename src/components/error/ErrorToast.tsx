'use client'

import { useEffect } from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'error' | 'success' | 'info' | 'warning'

interface ErrorToastProps {
    message: string
    type?: ToastType
    duration?: number
    onClose?: () => void
    action?: {
        label: string
        onClick: () => void
    }
}

const icons = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
    warning: AlertTriangle
}

const styles = {
    error: 'bg-destructive/10 border-destructive text-destructive',
    success: 'bg-success/10 border-success text-success',
    info: 'bg-primary/10 border-primary text-primary',
    warning: 'bg-warning/10 border-warning text-warning'
}

export function ErrorToast({
    message,
    type = 'error',
    duration = 5000,
    onClose,
    action
}: ErrorToastProps) {
    const Icon = icons[type]

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose?.()
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [duration, onClose])

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg border-2 shadow-lg backdrop-blur-sm',
                'animate-in slide-in-from-top-5 fade-in',
                styles[type]
            )}
            role="alert"
        >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{message}</p>

                {action && (
                    <button
                        onClick={action.onClick}
                        className="text-sm font-semibold underline mt-2 hover:opacity-80 transition-opacity"
                    >
                        {action.label}
                    </button>
                )}
            </div>

            {onClose && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                    aria-label="Fechar"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}
