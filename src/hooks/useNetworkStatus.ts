import { useState, useEffect } from 'react'

export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState(true)
    const [wasOffline, setWasOffline] = useState(false)

    useEffect(() => {
        // Initial state
        setIsOnline(navigator.onLine)

        const handleOnline = () => {
            setIsOnline(true)
            if (wasOffline) {
                // User came back online
                console.log('Connection restored')
            }
        }

        const handleOffline = () => {
            setIsOnline(false)
            setWasOffline(true)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [wasOffline])

    return {
        isOnline,
        isOffline: !isOnline,
        wasOffline
    }
}
