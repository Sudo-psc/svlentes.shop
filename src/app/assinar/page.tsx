'use client'

import { SubscriptionFlow } from '@/components/subscription/SubscriptionFlow'

// Force dynamic rendering to prevent prerender issues with ThemeProvider
export const dynamic = 'force-dynamic'

export default function AssinarPage() {
    return (
        <main>
            <SubscriptionFlow />
        </main>
    )
}
