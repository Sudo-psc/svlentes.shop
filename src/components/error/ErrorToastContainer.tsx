'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ErrorToast, ToastType } from './ErrorToast'
import { createPortal } from 'react-dom'

interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
    action?: {
        label: string
        onClick: () => void
    }
}

interface ToastContextValue {
    showToast: (toast: Omit<Toast, 'id'>) => void
    showError: (message: string, action?: Toast['action']) => void
    showSuccess: (message: string) => void
    showInfo: (message: string) => void
    showWarning: (message: string) => void
    clearToasts: () => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

interface ToastProviderProps {
    children: ReactNode
    maxToasts?: number
}

export function ToastProvider({ children, maxToasts = 3 }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(7)
        const newToast = { ...toast, id }

        setToasts(prev => {
            const updated = [...prev, newToast]
            // Keep only the latest toasts
            return updated.slice(-maxToasts)
        })
    }, [maxToasts])

    const showError = useCallback((message: string, action?: Toast['action']) => {
        showToast({ message, type: 'error', action })
    }, [showToast])

    const showSuccess = useCallback((message: string) => {
        showToast({ message, type: 'success' })
    }, [showToast])

    const showInfo = useCallback((message: string) => {
        showToast({ message, type: 'info' })
    }, [showToast])

    const showWarning = useCallback((message: string) => {
        showToast({ message, type: 'warning' })
    }, [showToast])

    const clearToasts = useCallback(() => {
        setToasts([])
    }, [])

    const value: ToastContextValue = {
        showToast,
        showError,
        showSuccess,
        showInfo,
        showWarning,
        clearToasts
    }

    return (
        <ToastContext.Provider value={value}>
            {children}
            {typeof window !== 'undefined' && createPortal(
                <div
                    className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {toasts.map(toast => (
                        <div key={toast.id} className="pointer-events-auto">
                            <ErrorToast
                                message={toast.message}
                                type={toast.type}
                                duration={toast.duration}
                                action={toast.action}
                                onClose={() => removeToast(toast.id)}
                            />
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    )
}
