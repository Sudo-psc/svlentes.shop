import { HeroSection } from '@/components/landing/HeroSection'
import { MetricsStrip } from '@/components/landing/MetricsStrip'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'SVLentes - Lentes por Assinatura com Acompanhamento Médico',
    description: 'Simplifique sua rotina e cuide da saúde da sua visão com lentes de contato por assinatura e acompanhamento médico especializado.',
    keywords: 'lentes de contato, assinatura, acompanhamento médico, oftalmologia, Dr. Philipe Saraiva Cruz',
    openGraph: {
        title: 'SVLentes - Lentes por Assinatura',
        description: 'Lentes de contato com acompanhamento médico especializado',
        type: 'website',
    }
}

export default function HomePage() {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <MetricsStrip />
            <HowItWorksSection />
            <PricingSection />
            <FAQSection />
        </main>
    )
}
