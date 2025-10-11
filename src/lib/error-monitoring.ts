interface ErrorReport {
    message: string
    stack?: string
    timestamp: string
    url: string
    userAgent: string
    errorType: string
    context?: Record<string, any>
}

class ErrorMonitoring {
    private static instance: ErrorMonitoring
    private errors: ErrorReport[] = []
    private maxErrors = 50

    private constructor() {
        this.setupMonitoring()
    }

    public static getInstance(): ErrorMonitoring {
        if (!ErrorMonitoring.instance) {
            ErrorMonitoring.instance = new ErrorMonitoring()
        }
        return ErrorMonitoring.instance
    }

    private setupMonitoring() {
        if (typeof window === 'undefined') return

        // Monitor unhandled errors
        window.addEventListener('error', (event) => {
            this.captureError({
                message: event.message,
                stack: event.error?.stack,
                errorType: 'UnhandledError',
                context: {
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno
                }
            })
        })

        // Monitor unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.captureError({
                message: event.reason?.message || String(event.reason),
                stack: event.reason?.stack,
                errorType: 'UnhandledPromiseRejection',
                context: {
                    reason: event.reason
                }
            })
        })

        // Monitor console errors
        const originalConsoleError = console.error
        console.error = (...args) => {
            this.captureError({
                message: args.map(arg => String(arg)).join(' '),
                errorType: 'ConsoleError',
                context: { args }
            })
            originalConsoleError.apply(console, args)
        }
    }

    public captureError(error: Partial<ErrorReport>) {
        const report: ErrorReport = {
            message: error.message || 'Unknown error',
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: typeof window !== 'undefined' ? window.location.href : '',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            errorType: error.errorType || 'Error',
            context: error.context
        }

        this.errors.push(report)

        // Keep only recent errors
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors)
        }

        // Log in development
        if (process.env.NODE_ENV === 'development') {
            console.group('🔴 Error Captured')
            console.error('Message:', report.message)
            console.error('Type:', report.errorType)
            console.error('Time:', report.timestamp)
            if (report.stack) console.error('Stack:', report.stack)
            if (report.context) console.error('Context:', report.context)
            console.groupEnd()
        }

        // Send to monitoring service in production
        if (process.env.NODE_ENV === 'production') {
            this.sendToMonitoring(report)
        }
    }

    private async sendToMonitoring(report: ErrorReport) {
        try {
            // TODO: Send to your monitoring service (Sentry, LogRocket, etc.)
            // await fetch('/api/monitoring/errors', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(report)
            // })

            console.log('Error report ready to send:', report)
        } catch (error) {
            console.error('Failed to send error report:', error)
        }
    }

    public getErrors(): ErrorReport[] {
        return [...this.errors]
    }

    public clearErrors() {
        this.errors = []
    }

    public getErrorStats() {
        const errorsByType = this.errors.reduce((acc, error) => {
            acc[error.errorType] = (acc[error.errorType] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        return {
            total: this.errors.length,
            byType: errorsByType,
            recent: this.errors.slice(-10)
        }
    }
}

export const errorMonitoring = ErrorMonitoring.getInstance()

export function captureError(error: Error | string, context?: Record<string, any>) {
    errorMonitoring.captureError({
        message: typeof error === 'string' ? error : error.message,
        stack: typeof error === 'string' ? undefined : error.stack,
        errorType: 'ManualCapture',
        context
    })
}
