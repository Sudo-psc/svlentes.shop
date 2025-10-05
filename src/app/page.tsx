import { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { LeadCaptureSection } from '@/components/sections/LeadCaptureSection'
import { EconomySection } from '@/components/sections/EconomySection'
import { ProblemSolutionSection } from '@/components/sections/ProblemSolutionSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import ReferralProgram from '@/components/sections/ReferralProgram'
import AddOns from '@/components/sections/AddOns'
import FAQ from '@/components/sections/FAQ'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { StructuredData } from '@/components/seo/StructuredData'
import { LazySection } from '@/components/ui/LazySection'
import { addOnsData } from '@/data/add-ons'
import {
    generateMedicalBusinessStructuredData,
    generateFAQStructuredData,
    generateServiceStructuredData,
    generateBreadcrumbStructuredData
} from '@/lib/seo'

export const metadata: Metadata = {
    title: 'SV Lentes - Nunca mais fique sem lentes | Assinatura com Acompanhamento Médico',
    description: 'Pioneiro no Brasil em assinatura de lentes de contato com acompanhamento médico especializado. Dr. Philipe Saraiva Cruz - CRM 65.870. Economia de até 40%.',
    alternates: {
        canonical: 'https://svlentes.shop',
    },
}

export default function HomePage() {
    const medicalBusinessData = generateMedicalBusinessStructuredData()
    const faqData = generateFAQStructuredData()
    const serviceData = generateServiceStructuredData()
    const breadcrumbData = generateBreadcrumbStructuredData([
        { name: 'Início', url: 'https://svlentes.shop' }
    ])

    return (
        <div className="min-h-screen">
            <StructuredData data={[medicalBusinessData, faqData, serviceData, breadcrumbData]} />

            {/* Hero Section */}
            <section id="hero">
                <HeroSection />
            </section>

            {/* Lead Capture Section */}
            <section id="planos-precos">
                <LeadCaptureSection />
            </section>

            {/* Seção Problema-Solução */}
            <LazySection>
                <section id="problema-solucao">
                    <ProblemSolutionSection />
                </section>
            </LazySection>

            {/* Calculadora de Economia */}
            <LazySection>
                <section id="calculadora-economia">
                    <EconomySection />
                </section>
            </LazySection>

            {/* Seção Como Funciona */}
            <LazySection>
                <section id="como-funciona">
                    <HowItWorksSection />
                </section>
            </LazySection>

            {/* Programa de Indicação */}
            <LazySection>
                <section id="programa-indicacao">
                    <ReferralProgram />
                </section>
            </LazySection>

            {/* Seção de Add-ons */}
            <section id="servicos-adicionais">
                <AddOns services={addOnsData} layout="cards" />
            </section>

            {/* Seção FAQ */}
            <section id="perguntas-frequentes">
                <FAQ />
            </section>

            {/* CTA Final */}
            <LazySection>
                <section id="contato">
                    <FinalCTA />
                </section>
            </LazySection>
        </div>
    )
}