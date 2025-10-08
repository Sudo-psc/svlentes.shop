import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor'
import { ResourcePreloader } from '@/components/performance/ResourcePreloader'
import { ServiceWorkerCleanup } from '@/components/performance/ServiceWorkerCleanup'
import { ErrorHandler } from '@/components/performance/ErrorHandler'
import { initializeChunkErrorHandler } from '@/lib/chunk-error-handler'
import { PrivacyProvider } from '@/components/privacy/PrivacyProvider'
import { CookieConsent } from '@/components/privacy/CookieConsent'
import { SmoothScroll } from '@/components/ui/SmoothScroll'
import { CriticalCSS } from '@/components/performance/CriticalCSS'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { ThemeScript } from '@/components/theme/ThemeScript'
import { RootErrorBoundary } from '@/components/error/RootErrorBoundary'
import { AccessibilityWidget, SkipToContent, KeyboardNavigationDetector } from '@/components/accessibility'
import {
    baseMetadata,
    generateOrganizationStructuredData,
    generateWebSiteStructuredData
} from '@/lib/seo'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    weight: ['300', '400', '500', '600', '700'],
})

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
    weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
    ...baseMetadata,
    metadataBase: new URL('https://saraivavision.com.br'),
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // const organizationData = generateOrganizationStructuredData()
    // const websiteData = generateWebSiteStructuredData()

    // Initialize chunk error handler
    if (typeof window !== 'undefined') {
        initializeChunkErrorHandler()
    }

    return (
        <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
            <head>
                <ThemeScript />
                <CriticalCSS />
                <link rel="preconnect" href="https://js.stripe.com" />
                <link rel="preconnect" href="https://api.whatsapp.com" />
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
            </head>
            <body className="antialiased">
                <RootErrorBoundary>
                    <ThemeProvider>
                        <PrivacyProvider>
                            <SkipToContent />
                            <KeyboardNavigationDetector />
                            <ErrorHandler />
                            <ServiceWorkerCleanup />
                            <PerformanceMonitor />
                            <ResourcePreloader />
                            <Header />
                            <main id="main-content" className="min-h-screen pt-20 lg:pt-24">
                                {children}
                            </main>
                            <Footer />
                            <CookieConsent />
                            <SmoothScroll />
                            <AccessibilityWidget />
                        </PrivacyProvider>
                    </ThemeProvider>
                </RootErrorBoundary>
            </body>
        </html>
    )
}