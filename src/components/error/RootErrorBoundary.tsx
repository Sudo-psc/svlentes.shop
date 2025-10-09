'use client'

import { Component, ReactNode } from 'react'
import { ErrorFallback } from './ErrorFallback'
import { logError } from '@/lib/error-handler'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
    errorInfo?: any
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
        // Log critical error
        logError(error, 'RootErrorBoundary - Critical')

        this.setState({ errorInfo })

        // Send to monitoring service
        if (process.env.NODE_ENV === 'production') {
            // TODO: Send to error tracking service
            console.error('Critical production error:', error, errorInfo)
        }
    }

    private resetError = () => {
        // For root errors, we reload the page to ensure clean state
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorFallback
                    error={this.state.error}
                    resetError={this.resetError}
                    variant="full"
                    title="Erro Crítico"
                    message="Ocorreu um erro crítico na aplicação. Vamos recarregar a página para você."
                    showHomeButton={false}
                    showBackButton={false}
                />
            )
        }

        return this.props.children
    }
}

export function RootErrorBoundary({ children }: Props) {
    return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>
}
