'use client'

import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'

interface NetworkErrorFallbackProps {
    onRetry?: () => void
    message?: string
}

export function NetworkErrorFallback({
    onRetry,
    message = 'Sem conexão com a internet'
}: NetworkErrorFallbackProps) {
    const [isOnline, setIsOnline] = useState(true)

    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        setIsOnline(navigator.onLine)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    const handleRetry = () => {
        if (onRetry) {
            onRetry()
        } else {
            window.location.reload()
        }
    }

    return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
            <div className="text-center max-w-md space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-destructive/10 blur-2xl rounded-full" />
                    <WifiOff className="w-16 h-16 text-destructive mx-auto relative" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-foreground">
                        {message}
                    </h3>
                    <p className="text-muted-foreground">
                        {isOnline
                            ? 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
                            : 'Você está offline. Verifique sua conexão com a internet.'
                        }
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-destructive'}`} />
                    <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>

                <Button
                    onClick={handleRetry}
                    variant="primary"
                    size="md"
                    className="gap-2"
                    disabled={!isOnline}
                >
                    <RefreshCw className="w-4 h-4" />
                    Tentar Novamente
                </Button>
            </div>
        </div>
    )
}
