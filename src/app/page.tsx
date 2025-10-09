import { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { MetricsStrip } from '@/components/sections/MetricsStrip'
import { HowItWorksSimple } from '@/components/sections/HowItWorksSimple'
import { PricingCards } from '@/components/sections/PricingCards'
import FAQ from '@/components/sections/FAQ'
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel'

// Force dynamic rendering due to parallel routes using headers()
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'SV Lentes | Assinatura de Lentes de Contato com Acompanhamento Médico',
    description: 'Lentes por assinatura com acompanhamento médico. Simplifique sua visão. Cuide da saúde ocular. Dr. Philipe Saraiva Cruz - CRM-MG 69.870.',
    keywords: [
        'assinatura lentes de contato',
        'lentes de contato mensal',
        'acompanhamento médico oftalmológico',
        'Dr. Philipe Saraiva Cruz',
        'CRM-MG 69.870',
        'Caratinga MG',
        'entrega domiciliar lentes',
        'LGPD compliant',
        'lentes de contato descartáveis'
    ],
    alternates: {
        canonical: 'https://svlentes.shop',
    },
    openGraph: {
        title: 'SV Lentes - Assinatura de Lentes de Contato com Acompanhamento Médico',
        description: 'Simplifique sua visão. Cuide da saúde ocular com acompanhamento médico especializado.',
        url: 'https://svlentes.shop',
        siteName: 'SV Lentes',
        locale: 'pt_BR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SV Lentes - Assinatura de Lentes de Contato',
        description: 'Lentes por assinatura com acompanhamento médico especializado',
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
            {/* 1) Hero Section with Video Placeholder */}
            <HeroSection />

            {/* 2) Metrics Strip - Trust Badges */}
            <MetricsStrip />

            {/* 3) How It Works - 3 Steps with Circular Icons */}
            <HowItWorksSimple />

            {/* 4) Pricing Cards - 4 Plans */}
            <PricingCards />

            {/* 5) FAQ Section */}
            <FAQ />

            {/* 6) Testimonials Carousel */}
            <TestimonialsCarousel />
        </div>
    )
}
