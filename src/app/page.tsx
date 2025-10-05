import { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { MetricsStrip } from '@/components/sections/MetricsStrip'
import { QuickStartSection } from '@/components/sections/QuickStartSection'

export const metadata: Metadata = {
    title: 'SV Lentes | Assinatura de Lentes de Contato com Acompanhamento Médico em São Paulo',
    description: 'Transforme sua visão com a assinatura de lentes de contato pioneira no Brasil. Acompanhamento médico especializado, entrega mensal e economia de até 40%. Lentes diárias, tóricas, multifocais com Dr. Philipe Saraiva Cruz - CRM 69.870.',
    keywords: [
        'assinatura lentes de contato São Paulo',
        'lentes de contato mensal',
        'lentes diárias com acompanhamento médico',
        'oftalmologista especialista lentes de contato',
        'Dr. Philipe Saraiva Cruz oftalmologista',
        'lentes tóricas para astigmatismo',
        'lentes multifocais presbiopia',
        'clínica oftalmológica Caratinga',
        'entrega domiciliar lentes de contato',
        'economia lentes de contato assinatura',
        'lentes de contato descartáveis qualidade',
        'consulta oftalmológica lentes de contato',
        'serviço assinatura lentes premium',
        'lentes de contato personalizadas',
        'saúde ocular São Paulo'
    ],
    alternates: {
        canonical: 'https://saraivavision.com.br',
    },
    openGraph: {
        title: 'SV Lentes - Assinatura de Lentes de Contato com Acompanhamento Médico',
        description: 'Nunca mais fique sem lentes! Assinatura completa com acompanhamento médico especializado, entrega mensal e economia de até 40%.',
        url: 'https://saraivavision.com.br',
        siteName: 'SV Lentes',
        locale: 'pt_BR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SV Lentes - Assinatura de Lentes de Contato',
        description: 'Transforme sua visão com acompanhamento médico especializado e economia de até 40%',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section id="hero">
                <HeroSection />
            </section>

            {/* Metrics Strip - Consolidado após Hero */}
            <section className="bg-white">
                <MetricsStrip />
            </section>

            {/* Quick Start Section - Novo fluxo */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-700">
                <QuickStartSection />
            </section>

            {/* Temporariamente comentado para debug */}
            {/* <section id="planos-precos" className="bg-gray-50">
                <LeadCaptureSection />
            </section> */}
            {/* <LazySection>
                <ProblemSolutionSection />
            </LazySection>

            <LazySection>
                <EconomySection />
            </LazySection>

            <LazySection>
                <HowItWorksSection />
            </LazySection>

            <LazySection>
                <ReferralProgram />
            </LazySection>

            <AddOns services={addOnsData} layout="cards" />

            <FAQ />

            <LazySection>
                <FinalCTA />
            </LazySection> */}
        </div>
    )
}
