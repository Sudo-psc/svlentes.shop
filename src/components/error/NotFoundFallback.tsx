'use client'

import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

interface NotFoundFallbackProps {
    title?: string
    message?: string
    showHomeButton?: boolean
    showBackButton?: boolean
}

export function NotFoundFallback({
    title = 'Página não encontrada',
    message = 'A página que você está procurando não existe ou foi movida.',
    showHomeButton = true,
    showBackButton = true
}: NotFoundFallbackProps) {
    const router = useRouter()

    return (
        <div className="min-h-[600px] flex items-center justify-center p-8">
            <div className="text-center max-w-md space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                    <FileQuestion className="w-20 h-20 text-primary mx-auto relative" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-foreground">404</h1>
                    <h2 className="text-2xl font-semibold text-foreground">
                        {title}
                    </h2>
                    <p className="text-muted-foreground">
                        {message}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    {showHomeButton && (
                        <Button
                            onClick={() => router.push('/')}
                            variant="primary"
                            size="lg"
                            className="gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Ir para Início
                        </Button>
                    )}

                    {showBackButton && (
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
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
