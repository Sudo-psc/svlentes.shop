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
    title: 'LAAS - Nunca mais fique sem lentes | Assinatura com Acompanhamento Médico',
    description: 'Pioneiro no Brasil em assinatura de lentes de contato com acompanhamento médico especializado. Dr. Philipe Saraiva Cruz - CRM 65.870. Economia de até 40%.',
    alternates: {
        canonical: 'https://laas.com.br',
    },
}

export default function HomePage() {
    const medicalBusinessData = generateMedicalBusinessStructuredData()
    const faqData = generateFAQStructuredData()
    const serviceData = generateServiceStructuredData()
    const breadcrumbData = generateBreadcrumbStructuredData([
        { name: 'Início', url: 'https://laas.com.br' }
    ])

    return (
        <div className="min-h-screen">
            <StructuredData data={[medicalBusinessData, faqData, serviceData, breadcrumbData]} />

            {/* Hero Section */}
            <HeroSection />

            {/* Lead Capture Section */}
            <LeadCaptureSection />

            {/* Seção Problema-Solução */}
            <LazySection>
                <ProblemSolutionSection />
            </LazySection>

            {/* Calculadora de Economia */}
            <LazySection>
                <EconomySection />
            </LazySection>


            {/* Seção Como Funciona */}
            <LazySection>
                <HowItWorksSection />
            </LazySection>

            {/* Programa de Indicação */}
            <LazySection>
                <ReferralProgram />
            </LazySection>

            {/* Seção de Add-ons */}
            <AddOns services={addOnsData} layout="cards" />

            {/* Seção FAQ */}
            <FAQ />

            {/* CTA Final */}
            <LazySection>
                <FinalCTA />
            </LazySection>

            <div id="planos-precos" className="h-20 bg-gray-50"></div>
            <div id="contato" className="h-20 bg-gray-50"></div>
        </div>
    )
}