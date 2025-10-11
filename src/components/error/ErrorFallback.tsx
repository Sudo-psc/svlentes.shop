'use client'

import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

interface ErrorFallbackProps {
    error?: Error
    resetError?: () => void
    showHomeButton?: boolean
    showBackButton?: boolean
    title?: string
    message?: string
    variant?: 'default' | 'minimal' | 'full'
}

export function ErrorFallback({
    error,
    resetError,
    showHomeButton = true,
    showBackButton = false,
    title = 'Algo deu errado',
    message = 'Não foi possível carregar este conteúdo. Por favor, tente novamente.',
    variant = 'default'
}: ErrorFallbackProps) {
    const router = useRouter()

    const handleReset = () => {
        if (resetError) {
            resetError()
        } else {
            window.location.reload()
        }
    }

    const handleGoHome = () => {
        router.push('/')
    }

    const handleGoBack = () => {
        router.back()
    }

    if (variant === 'minimal') {
        return (
            <div className="flex items-center justify-center p-4 text-center">
                <div className="space-y-2">
                    <AlertTriangle className="w-8 h-8 text-warning mx-auto" />
                    <p className="text-sm text-muted-foreground">{message}</p>
                    <Button onClick={handleReset} variant="outline" size="sm">
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        )
    }

    if (variant === 'full') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
                <div className="max-w-2xl w-full bg-card rounded-2xl shadow-2xl p-8 md:p-12 text-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-warning/10 blur-3xl rounded-full" />
                        <AlertTriangle className="w-20 h-20 text-warning mx-auto relative" />
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            {title}
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto">
                            {message}
                        </p>
                    </div>

                    {error && process.env.NODE_ENV === 'development' && (
                        <details className="text-left bg-muted/50 rounded-lg p-4 text-sm">
                            <summary className="cursor-pointer font-semibold text-foreground mb-2">
                                Detalhes do erro (desenvolvimento)
                            </summary>
                            <pre className="text-xs text-muted-foreground overflow-auto">
                                {error.message}
                                {error.stack && `\n\n${error.stack}`}
                            </pre>
                        </details>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Button
                            onClick={handleReset}
                            variant="primary"
                            size="lg"
                            className="gap-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Tentar Novamente
                        </Button>

                        {showHomeButton && (
                            <Button
                                onClick={handleGoHome}
                                variant="outline"
                                size="lg"
                                className="gap-2"
                            >
                                <Home className="w-5 h-5" />
                                Ir para Início
                            </Button>
                        )}

                        {showBackButton && (
                            <Button
                                onClick={handleGoBack}
                                variant="ghost"
                                size="lg"
                                className="gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Voltar
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // Default variant
    return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
            <div className="text-center max-w-md space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-warning/10 blur-2xl rounded-full" />
                    <AlertTriangle className="w-16 h-16 text-warning mx-auto relative" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-foreground">
                        {title}
                    </h3>
                    <p className="text-muted-foreground">
                        {message}
                    </p>
                </div>

                {error && process.env.NODE_ENV === 'development' && (
                    <details className="text-left bg-muted/50 rounded-lg p-4 text-sm">
                        <summary className="cursor-pointer font-semibold text-foreground mb-2">
                            Detalhes do erro
                        </summary>
                        <pre className="text-xs text-muted-foreground overflow-auto">
                            {error.message}
                        </pre>
                    </details>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={handleReset}
                        variant="primary"
                        size="md"
                        className="gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Tentar Novamente
                    </Button>

                    {showHomeButton && (
                        <Button
                            onClick={handleGoHome}
                            variant="outline"
                            size="md"
                            className="gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Início
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
