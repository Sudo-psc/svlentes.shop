'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Error:', error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
            <div className="container-custom px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-8">
                        <AlertTriangle className="w-20 h-20 text-red-600 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Algo deu errado
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Desculpe, ocorreu um erro inesperado. Por favor, tente novamente.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Button
                            onClick={reset}
                            variant="primary"
                            size="lg"
                            className="flex items-center space-x-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Tentar Novamente</span>
                        </Button>
                        
                        <Button
                            onClick={() => window.location.href = '/'}
                            variant="outline"
                            size="lg"
                            className="flex items-center space-x-2"
                        >
                            <Home className="w-5 h-5" />
                            <span>Voltar ao Início</span>
                        </Button>
                    </div>

                    {error.digest && (
                        <div className="bg-white rounded-lg p-4 text-sm text-gray-500">
                            <p>Código do erro: {error.digest}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
