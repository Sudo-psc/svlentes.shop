import { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
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

            {/* Seção Problema-Solução */}
            <LazySection>
                <ProblemSolutionSection />
            </LazySection>

            {/* Calculadora de Economia */}
            <LazySection>
                <EconomySection />
            </LazySection>

            {/* Temporary progress indicator */}
            <div className="bg-white py-16">
                <div className="container-custom">
                    <div className="text-center">
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 max-w-2xl mx-auto">
                            <h2 className="text-2xl font-semibold text-primary-800 mb-4">
                                🚧 Progresso da Implementação
                            </h2>
                            <ul className="text-left text-primary-700 space-y-2">
                                <li>✅ Next.js 14 com App Router</li>
                                <li>✅ Tailwind CSS configurado</li>
                                <li>✅ Estrutura de diretórios criada</li>
                                <li>✅ Dependências instaladas</li>
                                <li>✅ Dados estáticos implementados</li>
                                <li>✅ Integração Stripe configurada</li>
                                <li>✅ Header, Footer e WhatsApp flutuante</li>
                                <li>✅ Hero Section com formulário de leads</li>
                                <li>✅ Calculadora de economia completa</li>
                                <li>✅ Seção Problema-Solução implementada</li>
                                <li>✅ Seção Como Funciona com abas</li>
                                <li>✅ Programa de Indicação implementado</li>
                                <li>✅ Seção de Add-ons implementada</li>
                                <li>✅ Seção FAQ implementada</li>
                                <li>✅ CTA Final implementado</li>
                                <li>⏳ Próximo: APIs e integrações</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seção Como Funciona */}
            <LazySection>
                <HowItWorksSection />
            </LazySection>

            {/* Programa de Indicação */}
            <LazySection>
                <ReferralProgram />
            </LazySection>

            {/* Seção de Add-ons */}
            <LazySection>
                <AddOns services={addOnsData} layout="cards" />
            </LazySection>

            {/* Seção FAQ */}
            <LazySection>
                <FAQ />
            </LazySection>

            {/* CTA Final */}
            <LazySection>
                <FinalCTA />
            </LazySection>

            <div id="planos-precos" className="h-20 bg-gray-50"></div>
            <div id="contato" className="h-20 bg-gray-50"></div>
        </div>
    )
}