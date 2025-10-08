import { Metadata } from 'next'
import { ConversionHero } from '@/components/conversion/ConversionHero'
import { ConversionCTA } from '@/components/conversion/ConversionCTA'

export const metadata: Metadata = {
    title: 'Transforme Sua Visão Hoje | Assinatura de Lentes com Acompanhamento Médico',
    description: 'Nunca mais fique sem lentes! Assinatura completa com entrega mensal e acompanhamento médico especializado. Economize até 40% com Dr. Philipe Saraiva Cruz - CRM 69.870.',
    keywords: [
        'assinatura lentes de contato',
        'lentes de contato mensal',
        'acompanhamento médico oftalmologista',
        'entrega domiciliar lentes',
        'economia lentes de contato',
        'Dr. Philipe Saraiva Cruz'
    ],
    alternates: {
        canonical: 'https://saraivavision.com.br/landing-conversao',
    },
    openGraph: {
        title: 'Transforme Sua Visão Hoje | Assinatura de Lentes',
        description: 'Nunca mais fique sem lentes! Assinatura completa com acompanhamento médico especializado e economia de até 40%',
        url: 'https://saraivavision.com.br/landing-conversao',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function LandingConversao() {
    return (
        <div className="min-h-screen">
            {/* Hero Section - Foco Singular em Conversão */}
            <ConversionHero />

            {/* CTA Section - Única Meta de Conversão */}
            <ConversionCTA />
        </div>
    )
}
