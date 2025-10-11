'use client'

import { Loader2 } from 'lucide-react'

interface LoadingFallbackProps {
    message?: string
    variant?: 'default' | 'minimal' | 'full'
}

export function LoadingFallback({
    message = 'Carregando...',
    variant = 'default'
}: LoadingFallbackProps) {
    if (variant === 'minimal') {
        return (
            <div className="flex items-center justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        )
    }

    if (variant === 'full') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-lg text-muted-foreground">{message}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">{message}</p>
            </div>
        </div>
    )
}
