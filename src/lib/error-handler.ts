export class AppError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number,
        public context?: Record<string, any>
    ) {
        super(message)
        this.name = 'AppError'
    }
}

export class NetworkError extends AppError {
    constructor(message: string = 'Erro de conexão', context?: Record<string, any>) {
        super(message, 'NETWORK_ERROR', 0, context)
        this.name = 'NetworkError'
    }
}

export class ValidationError extends AppError {
    constructor(message: string, context?: Record<string, any>) {
        super(message, 'VALIDATION_ERROR', 400, context)
        this.name = 'ValidationError'
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Recurso não encontrado', context?: Record<string, any>) {
        super(message, 'NOT_FOUND', 404, context)
        this.name = 'NotFoundError'
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Não autorizado', context?: Record<string, any>) {
        super(message, 'UNAUTHORIZED', 401, context)
        this.name = 'UnauthorizedError'
    }
}

export function isNetworkError(error: unknown): boolean {
    if (error instanceof NetworkError) return true
    if (!(error instanceof Error)) return false

    const networkPatterns = [
        'network',
        'fetch',
        'timeout',
        'connection',
        'offline',
        'NetworkError',
        'Failed to fetch',
        'ERR_NETWORK',
        'ERR_CONNECTION'
    ]

    return networkPatterns.some(pattern =>
        error.message?.toLowerCase().includes(pattern.toLowerCase())
    )
}

export function handleApiError(error: unknown): AppError {
    if (error instanceof AppError) {
        return error
    }

    if (error instanceof Error) {
        // Check if it's a network error
        if (isNetworkError(error)) {
            return new NetworkError(error.message)
        }

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
        logError(error, 'withErrorHandling')

        if (fallback !== undefined) {
            return fallback
        }

        throw handleApiError(error)
    }
}

export async function withRetry<T>(
    fn: () => Promise<T>,
    options: {
        maxRetries?: number
        retryDelay?: number
        onRetry?: (attempt: number) => void
    } = {}
): Promise<T> {
    const { maxRetries = 3, retryDelay = 1000, onRetry } = options
    let lastError: Error | undefined

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn()
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error))

            if (attempt < maxRetries) {
                if (onRetry) {
                    onRetry(attempt + 1)
                }

                // Exponential backoff
                const delay = retryDelay * Math.pow(2, attempt)
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }
    }

    throw lastError || new Error('Max retries exceeded')
}

export function logError(error: unknown, context?: string) {
    const timestamp = new Date().toISOString()
    const errorMessage = error instanceof Error ? error.message : String(error)

    const logPrefix = `[${timestamp}] ${context || 'Error'}`

    if (process.env.NODE_ENV === 'development') {
        console.group(`🔴 ${logPrefix}`)
        console.error('Message:', errorMessage)

        if (error instanceof AppError) {
            console.error('Code:', error.code)
            console.error('Status:', error.statusCode)
            if (error.context) {
                console.error('Context:', error.context)
            }
        }

        if (error instanceof Error && error.stack) {
            console.error('Stack:', error.stack)
        }

        console.groupEnd()
    } else {
        console.error(`${logPrefix}:`, errorMessage)
    }
}

export function setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return

    // Handle global errors
    window.addEventListener('error', (event) => {
        logError(event.error, 'Global Error')

        // Prevent default browser error handling
        if (process.env.NODE_ENV === 'production') {
            event.preventDefault()
        }
    })

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        logError(event.reason, 'Unhandled Promise Rejection')

        // Prevent default browser error handling
        if (process.env.NODE_ENV === 'production') {
            event.preventDefault()
        }
    })

    // Handle chunk loading errors (Next.js specific) with reload protection
    const CHUNK_RELOAD_KEY = 'chunk_reload_attempts'
    const MAX_CHUNK_RELOADS = 3

    const handleChunkError = (error: any) => {
        if (error && typeof error === 'object') {
            const errorString = error.toString()
            if (errorString.includes('Loading chunk') || errorString.includes('ChunkLoadError')) {
                const attempts = parseInt(sessionStorage.getItem(CHUNK_RELOAD_KEY) || '0', 10)

                if (attempts < MAX_CHUNK_RELOADS) {
                    console.warn(`Chunk load error detected, reloading page (attempt ${attempts + 1}/${MAX_CHUNK_RELOADS})...`)
                    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(attempts + 1))

                    // Short delay before reload
                    setTimeout(() => {
                        window.location.reload()
                    }, 500)
                } else {
                    console.error('Max chunk reload attempts reached. Please clear cache and refresh manually.')
                    sessionStorage.removeItem(CHUNK_RELOAD_KEY)
                }
            }
        }
    }

    window.addEventListener('error', (event) => {
        handleChunkError(event.error)
    })

    // Reset counter on successful load
    window.addEventListener('load', () => {
        sessionStorage.removeItem(CHUNK_RELOAD_KEY)
    })
}

// User-friendly error messages
export function getUserFriendlyMessage(error: unknown): string {
    if (error instanceof NetworkError) {
        return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.'
    }

    if (error instanceof ValidationError) {
        return error.message
    }

    if (error instanceof NotFoundError) {
        return 'O recurso solicitado não foi encontrado.'
    }

    if (error instanceof UnauthorizedError) {
        return 'Você não tem permissão para acessar este recurso.'
    }

    if (error instanceof AppError) {
        return error.message
    }

    if (error instanceof Error) {
        return error.message
    }

    return 'Ocorreu um erro inesperado. Por favor, tente novamente.'
}
