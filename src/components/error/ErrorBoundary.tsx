'use client'

import { Component, ReactNode } from 'react'
import { ErrorFallback } from './ErrorFallback'
import { NetworkErrorFallback } from './NetworkErrorFallback'
import { logError, isNetworkError } from '@/lib/error-handler'

interface Props {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: any) => void
    showHomeButton?: boolean
    showBackButton?: boolean
}

interface State {
    hasError: boolean
    error?: Error
    errorInfo?: any
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
        // Log error
        logError(error, 'ErrorBoundary')

        // Store error info
        this.setState({ errorInfo })

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo)
        }

        // Send to monitoring service in production
        if (process.env.NODE_ENV === 'production') {
            // TODO: Send to Sentry, LogRocket, etc.
            console.error('Production error:', error, errorInfo)
        }
    }

    private resetError = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Network error fallback
            if (isNetworkError(this.state.error)) {
                return <NetworkErrorFallback onRetry={this.resetError} />
            }

            // Default error fallback
            return (
                <ErrorFallback
                    error={this.state.error}
                    resetError={this.resetError}
                    showHomeButton={this.props.showHomeButton}
                    showBackButton={this.props.showBackButton}
                />
            )
        }

        return this.props.children
    }
}
