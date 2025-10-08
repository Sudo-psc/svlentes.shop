'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            Algo deu errado
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Não foi possível carregar este conteúdo. Por favor, tente novamente.
                        </p>
                        <Button
                            onClick={() => this.setState({ hasError: false })}
                            variant="primary"
                            size="md"
                        >
                            Tentar Novamente
                        </Button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
