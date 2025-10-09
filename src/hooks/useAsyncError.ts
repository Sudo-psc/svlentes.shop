import { useState, useCallback } from 'react'
import { useErrorHandler } from './useErrorHandler'
import { useRetry } from './useRetry'

interface UseAsyncErrorOptions {
    retryable?: boolean
    maxRetries?: number
    onError?: (error: Error) => void
}

export function useAsyncError<T>(
    asyncFn: () => Promise<T>,
    options: UseAsyncErrorOptions = {}
) {
    const { retryable = false, maxRetries = 3, onError } = options

    const [data, setData] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const { error, isError, handleError, clearError } = useErrorHandler({ onError })
    const { retry, retryCount, isRetrying, canRetry, reset: resetRetry } = useRetry({ maxRetries })

    const execute = useCallback(async () => {
        setIsLoading(true)
        clearError()

        try {
            const result = await asyncFn()
            setData(result)
            resetRetry()
            return result
        } catch (err) {
            handleError(err)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [asyncFn, clearError, handleError, resetRetry])

    const executeWithRetry = useCallback(async () => {
        if (!retryable) {
            return execute()
        }

        try {
            return await retry(execute)
        } catch (err) {
            // Error already handled by execute
            return null
        }
    }, [retryable, retry, execute])

    const reset = useCallback(() => {
        setData(null)
        setIsLoading(false)
        clearError()
        resetRetry()
    }, [clearError, resetRetry])

    return {
        data,
        isLoading,
        error,
        isError,
        execute: retryable ? executeWithRetry : execute,
        retry: executeWithRetry,
        retryCount,
        isRetrying,
        canRetry: retryable && canRetry,
        reset
    }
}
