import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Header />
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
            <Footer />
            <WhatsAppButton />
        </>
    )
}
