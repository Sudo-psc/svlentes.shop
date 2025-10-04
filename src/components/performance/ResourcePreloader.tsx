'use client'

import { useEffect } from 'react'
import { preloadCriticalResources, addResourceHints } from '@/lib/cache'

export function ResourcePreloader() {
    useEffect(() => {
        // Preload critical resources
        preloadCriticalResources()

        // Add resource hints
        addResourceHints()

        // Preload critical API endpoints
        if (typeof window !== 'undefined') {
            // Preload Stripe.js
            const stripeScript = document.createElement('link')
            stripeScript.rel = 'preload'
            stripeScript.href = 'https://js.stripe.com/v3/'
            stripeScript.as = 'script'
            document.head.appendChild(stripeScript)

            // Prefetch critical data
            fetch('/api/pricing-plans', { method: 'HEAD' }).catch(() => { })
            fetch('/api/doctor-info', { method: 'HEAD' }).catch(() => { })
        }
    }, [])

    return null
}