'use client'

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { PrivacyProvider } from '@/components/privacy/PrivacyProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Lazy load apenas componentes não-críticos
const CookieConsent = dynamic(() => import('@/components/privacy/CookieConsent').then(mod => ({ default: mod.CookieConsent })), {
    ssr: false
})

interface ClientProvidersProps {
    children: ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
    return (
        <ThemeProvider>
            <PrivacyProvider>
                <Header />
                <main id="main-content" className="min-h-screen pt-20 lg:pt-24">
                    {children}
                </main>
                <Footer />
                <CookieConsent />
            </PrivacyProvider>
        </ThemeProvider>
    )
}
