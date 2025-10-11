import { useState, useCallback } from 'react'
import { logError, AppError } from '@/lib/error-handler'

interface UseErrorHandlerOptions {
    onError?: (error: Error) => void
    logErrors?: boolean
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
    const { onError, logErrors = true } = options
    const [error, setError] = useState<Error | null>(null)
    const [isError, setIsError] = useState(false)

    const handleError = useCallback((err: unknown) => {
        const error = err instanceof Error ? err : new Error(String(err))

        setError(error)
        setIsError(true)

        if (logErrors) {
            logError(error, 'useErrorHandler')
        }

        if (onError) {
            onError(error)
        }
    }, [onError, logErrors])

    const clearError = useCallback(() => {
        setError(null)
        setIsError(false)
    }, [])

    const resetError = clearError

    return {
        error,
        isError,
        handleError,
        clearError,
        resetError
    }
}
