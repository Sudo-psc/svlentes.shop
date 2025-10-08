export class AppError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number
    ) {
        super(message)
        this.name = 'AppError'
    }
}

export function handleApiError(error: unknown): AppError {
    if (error instanceof AppError) {
        return error
    }

    if (error instanceof Error) {
        return new AppError(error.message, 'UNKNOWN_ERROR', 500)
    }

    return new AppError('Erro desconhecido', 'UNKNOWN_ERROR', 500)
}

export async function withErrorHandling<T>(
    fn: () => Promise<T>,
    fallback?: T
): Promise<T> {
    try {
        return await fn()
    } catch (error) {
        console.error('Error in withErrorHandling:', error)
        if (fallback !== undefined) {
            return fallback
        }
        throw handleApiError(error)
    }
}

export function logError(error: unknown, context?: string) {
    const timestamp = new Date().toISOString()
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    console.error(`[${timestamp}] ${context || 'Error'}:`, errorMessage)
    
    if (error instanceof Error && error.stack) {
        console.error('Stack:', error.stack)
    }
}

export function setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return

    window.addEventListener('error', (event) => {
        logError(event.error, 'Global Error')
    })

    window.addEventListener('unhandledrejection', (event) => {
        logError(event.reason, 'Unhandled Promise Rejection')
    })
}
