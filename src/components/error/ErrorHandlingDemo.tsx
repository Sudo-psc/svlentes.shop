'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ErrorBoundary, LoadingFallback, useToast } from '@/components/error'
import { useAsyncError, useNetworkStatus } from '@/hooks/error-hooks'
import { Card } from '@/components/ui/card'

// Simulated API calls
const simulateSuccess = () =>
    new Promise(resolve => setTimeout(() => resolve({ data: 'Success!' }), 1000))

const simulateError = () =>
    new Promise((_, reject) => setTimeout(() => reject(new Error('Simulated error')), 1000))

const simulateNetworkError = () =>
    new Promise((_, reject) => setTimeout(() => reject(new Error('Network error: Failed to fetch')), 1000))

function DemoCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {children}
        </Card>
    )
}

function ToastDemo() {
    const { showError, showSuccess, showInfo, showWarning } = useToast()

    return (
        <DemoCard title="1. Sistema de Toast">
            <div className="flex flex-wrap gap-2">
                <Button onClick={() => showSuccess('Operação realizada com sucesso!')} variant="outline">
                    Success Toast
                </Button>
                <Button onClick={() => showError('Erro ao processar solicitação')} variant="outline">
                    Error Toast
                </Button>
                <Button onClick={() => showInfo('Informação importante')} variant="outline">
                    Info Toast
                </Button>
                <Button onClick={() => showWarning('Atenção: verifique os dados')} variant="outline">
                    Warning Toast
                </Button>
                <Button
                    onClick={() => showError('Erro com ação', {
                        label: 'Tentar novamente',
                        onClick: () => showSuccess('Tentando novamente...')
                    })}
                    variant="outline"
                >
                    Error com Ação
                </Button>
            </div>
        </DemoCard>
    )
}

function AsyncErrorDemo() {
    const [operation, setOperation] = useState<'success' | 'error' | 'network' | null>(null)

    const { data, isLoading, error, isError, execute, retry, retryCount, canRetry } = useAsyncError(
        async () => {
            if (operation === 'success') return await simulateSuccess()
            if (operation === 'error') return await simulateError()
            if (operation === 'network') return await simulateNetworkError()
            return null
        },
        {
            retryable: true,
            maxRetries: 3,
            onError: (err) => console.log('Error captured:', err)
        }
    )

    const handleOperation = (type: 'success' | 'error' | 'network') => {
        setOperation(type)
        setTimeout(() => execute(), 0)
    }

    return (
        <DemoCard title="2. useAsyncError Hook">
            <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    <Button onClick={() => handleOperation('success')} variant="outline" disabled={isLoading}>
                        Simular Sucesso
                    </Button>
                    <Button onClick={() => handleOperation('error')} variant="outline" disabled={isLoading}>
                        Simular Erro
                    </Button>
                    <Button onClick={() => handleOperation('network')} variant="outline" disabled={isLoading}>
                        Simular Erro de Rede
                    </Button>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
                    {isLoading ? <LoadingFallback variant="minimal" /> : null}
                    {isError ? (
                        <div className="text-center space-y-2">
                            <p className="text-sm text-destructive">{error?.message}</p>
                            {canRetry ? (
                                <Button onClick={retry} size="sm" variant="outline">
                                    Tentar Novamente ({retryCount}/3)
                                </Button>
                            ) : null}
                        </div>
                    ) : null}
                    {data && !isLoading && !isError ? (
                        <p className="text-sm text-success">✓ {JSON.stringify(data as Record<string, unknown>)}</p>
                    ) : null}
                    {!data && !isLoading && !isError ? (
                        <p className="text-sm text-muted-foreground">Clique em um botão para testar</p>
                    ) : null}
                </div>
            </div>
        </DemoCard>
    )
}

function NetworkStatusDemo() {
    const { isOnline, isOffline, wasOffline } = useNetworkStatus()

    return (
        <DemoCard title="3. Network Status Monitor">
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success' : 'bg-destructive'}`} />
                    <span className="text-sm font-medium">
                        Status: {isOnline ? 'Online' : 'Offline'}
                    </span>
                </div>

                {wasOffline && isOnline && (
                    <div className="bg-success/10 border border-success text-success rounded-lg p-3 text-sm">
                        ✓ Conexão restaurada!
                    </div>
                )}

                {isOffline && (
                    <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-3 text-sm">
                        ⚠ Você está offline. Algumas funcionalidades podem não estar disponíveis.
                    </div>
                )}

                <p className="text-xs text-muted-foreground">
                    Dica: Desconecte sua internet para testar
                </p>
            </div>
        </DemoCard>
    )
}

function ProblematicComponent({ shouldError }: { shouldError: boolean }) {
    if (shouldError) {
        throw new Error('Componente com erro simulado!')
    }
    return (
        <div className="text-center py-4">
            <p className="text-sm text-success">✓ Componente funcionando corretamente</p>
        </div>
    )
}

function ErrorBoundaryDemo() {
    const [shouldError, setShouldError] = useState(false)

    return (
        <DemoCard title="4. Error Boundary">
            <div className="space-y-3">
                <Button
                    onClick={() => setShouldError(!shouldError)}
                    variant="outline"
                >
                    {shouldError ? 'Corrigir Erro' : 'Causar Erro'}
                </Button>

                <div className="bg-muted/50 rounded-lg p-4 min-h-[100px]">
                    <ErrorBoundary showHomeButton={false} showBackButton={false}>
                        <ProblematicComponent shouldError={shouldError} />
                    </ErrorBoundary>
                </div>
            </div>
        </DemoCard>
    )
}

export function ErrorHandlingDemo() {
    return (
        <div className="container mx-auto py-12 px-4 space-y-8">
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-4xl font-bold text-foreground">
                    Sistema de Tratamento de Erros
                </h1>
                <p className="text-lg text-muted-foreground">
                    Demonstração interativa dos componentes e hooks de error handling
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <ToastDemo />
                <AsyncErrorDemo />
                <NetworkStatusDemo />
                <ErrorBoundaryDemo />
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground">
                    📚 Veja o guia completo em <code className="bg-muted px-2 py-1 rounded">ERROR_HANDLING_GUIDE.md</code>
                </p>
            </div>
        </div>
    )
}
