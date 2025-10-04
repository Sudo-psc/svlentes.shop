import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider'
import { StructuredData } from '@/components/seo/StructuredData'
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor'
import { ResourcePreloader } from '@/components/performance/ResourcePreloader'
import { ServiceWorkerCleanup } from '@/components/performance/ServiceWorkerCleanup'
import { ErrorHandler } from '@/components/performance/ErrorHandler'
import { initializeChunkErrorHandler } from '@/lib/chunk-error-handler'
import { PrivacyProvider } from '@/components/privacy/PrivacyProvider'
import { CookieConsent } from '@/components/privacy/CookieConsent'
import { SmoothScroll } from '@/components/ui/SmoothScroll'
import {
    baseMetadata,
    generateOrganizationStructuredData,
    generateWebSiteStructuredData
} from '@/lib/seo'

export const metadata: Metadata = baseMetadata

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const organizationData = generateOrganizationStructuredData()
    const websiteData = generateWebSiteStructuredData()

    // Initialize chunk error handler
    if (typeof window !== 'undefined') {
        initializeChunkErrorHandler()
    }

    return (
        <html lang="pt-BR">
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://js.stripe.com" />
                <link rel="dns-prefetch" href="https://api.whatsapp.com" />
                <meta name="theme-color" content="#0066cc" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="format-detection" content="telephone=no" />
            </head>
            <body className="antialiased">
                <PrivacyProvider>
                    <ErrorHandler />
                    <ServiceWorkerCleanup />
                    <GoogleAnalytics />
                    <PerformanceMonitor />
                    <ResourcePreloader />
                    <StructuredData data={[organizationData, websiteData]} />
                    <Header />
                    <main className="pt-16 lg:pt-20">
                        {children}
                    </main>
                    <Footer />
                    <WhatsAppFloat />
                    <CookieConsent />
                    <SmoothScroll />
                    <AnalyticsProvider />
                </PrivacyProvider>
            </body>
        </html>
    )
}