'use client'

import { Component, ReactNode } from 'react'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

class ErrorBoundaryClass extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('RootErrorBoundary caught error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="text-center max-w-md">
                        <h1 className="text-4xl font-bold text-foreground mb-4">Erro</h1>
                        <p className="text-muted-foreground mb-6">
                            Algo deu errado. Por favor, recarregue a página.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            Recarregar Página
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export function RootErrorBoundary({ children }: Props) {
    return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>
}
