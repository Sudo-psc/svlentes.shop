import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
// import { StructuredData } from '@/components/seo/StructuredData'
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor'
import { ResourcePreloader } from '@/components/performance/ResourcePreloader'
import { ServiceWorkerCleanup } from '@/components/performance/ServiceWorkerCleanup'
import { ErrorHandler } from '@/components/performance/ErrorHandler'
import { PrivacyProvider } from '@/components/privacy/PrivacyProvider'
import { CookieConsent } from '@/components/privacy/CookieConsent'
import { SmoothScroll } from '@/components/ui/SmoothScroll'
import { CriticalCSS } from '@/components/performance/CriticalCSS'
import { baseMetadata } from '@/lib/seo'

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

export const metadata: Metadata = baseMetadata

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
            <head>
                <CriticalCSS />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
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
                    <PerformanceMonitor />
                    <ResourcePreloader />
                    {/* <StructuredData data={[organizationData, websiteData]} /> */}
                    <Header />
                    <main className="pt-16 lg:pt-20">
                        {children}
                    </main>
                    <Footer />
                    <CookieConsent />
                    <SmoothScroll />
                </PrivacyProvider>
            </body>
        </html>
    )
}