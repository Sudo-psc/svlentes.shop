'use client'

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { PrivacyProvider } from '@/components/privacy/PrivacyProvider'

// Lazy load components pesados
const Header = dynamic(() => import('@/components/layout/Header').then(mod => ({ default: mod.Header })), {
    ssr: true
})
const Footer = dynamic(() => import('@/components/layout/Footer').then(mod => ({ default: mod.Footer })), {
    ssr: true
})
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
