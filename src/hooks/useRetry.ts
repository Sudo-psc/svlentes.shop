import { useState, useCallback } from 'react'

interface UseRetryOptions {
    maxRetries?: number
    retryDelay?: number
    onRetry?: (attempt: number) => void
    onMaxRetriesReached?: () => void
}

export function useRetry(options: UseRetryOptions = {}) {
    const {
        maxRetries = 3,
        retryDelay = 1000,
        onRetry,
        onMaxRetriesReached
    } = options

    const [retryCount, setRetryCount] = useState(0)
    const [isRetrying, setIsRetrying] = useState(false)

    const retry = useCallback(async <T>(
        fn: () => Promise<T>
    ): Promise<T | null> => {
        if (retryCount >= maxRetries) {
            if (onMaxRetriesReached) {
                onMaxRetriesReached()
            }
            return null
        }

        setIsRetrying(true)
        setRetryCount(prev => prev + 1)

        if (onRetry) {
            onRetry(retryCount + 1)
        }

        // Exponential backoff
        const delay = retryDelay * Math.pow(2, retryCount)
        await new Promise(resolve => setTimeout(resolve, delay))

        try {
            const result = await fn()
            setIsRetrying(false)
            setRetryCount(0) // Reset on success
            return result
        } catch (error) {
            setIsRetrying(false)
            throw error
        }
    }, [retryCount, maxRetries, retryDelay, onRetry, onMaxRetriesReached])

    const reset = useCallback(() => {
        setRetryCount(0)
        setIsRetrying(false)
    }, [])

    const canRetry = retryCount < maxRetries

    return {
        retry,
        retryCount,
        isRetrying,
        canRetry,
        reset
    }
}
