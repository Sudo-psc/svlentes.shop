'use client'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { HeroImage } from '@/components/sections/HeroImage'
import { UrgencyBanner } from '@/components/ui/UrgencyBanner'
import { openWhatsAppWithContext } from '@/lib/whatsapp'
import { Phone, MessageCircle, Award } from 'lucide-react'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'

interface HeroSectionProps {
    className?: string
}

export function HeroSection({ className = '' }: HeroSectionProps) {
    const handleAgendarConsulta = () => {
        try {
            openWhatsAppWithContext('consultation', {
                page: 'landing-page',
                section: 'hero-primary-cta'
            })
        } catch (error) {
            console.error('Erro ao abrir WhatsApp:', error)
            window.open('https://wa.me/5533998601427', '_blank')
        }
    }

    const handleFalarWhatsApp = () => {
        try {
            openWhatsAppWithContext('hero', {
                page: 'landing-page',
                section: 'hero-secondary-cta'
            })
        } catch (error) {
            console.error('Erro ao abrir WhatsApp:', error)
            window.open('https://wa.me/5533998601427', '_blank')
        }
    }

    return (
        <section className={`relative bg-white overflow-hidden ${className}`}>
            {/* Background Pattern - Minimalista */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary-600 rounded-full blur-3xl"></div>
            </div>

            <div className="container-custom relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[85vh] py-20 lg:py-28">

                    {/* Left Column - Hero Content */}
                    <div className="space-y-10 animate-fade-in">

                        {/* Main Headline - Clean e minimalista */}
                        <div className="text-center lg:text-left space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 leading-[1.1] tracking-tight">
                                <span className="block mb-3">Lentes de contato</span>
                                <span className="block text-primary-600">por assinatura</span>
                            </h1>

                            <p className="text-lg md:text-xl text-primary-700 leading-relaxed max-w-xl">
                                Acompanhamento médico especializado com entrega mensal em casa
                            </p>
                        </div>

                        {/* Trust Indicators - Mais sutis */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                            <div className="flex items-center space-x-2">
                                <Award className="w-5 h-5 text-primary-600" />
                                <span className="text-primary-700 font-medium">Pioneiro no Brasil</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 bg-success-600 rounded-full"></span>
                                <span className="text-primary-700 font-medium">CRM-MG 69.870</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-primary-700 font-medium">1.000+ clientes</span>
                            </div>
                        </div>

                        {/* CTA Clean */}
                        <div className="flex flex-col gap-4 justify-center lg:justify-start">
                            <Button
                                onClick={handleAgendarConsulta}
                                variant="default"
                                size="lg"
                                className="w-full sm:w-auto bg-primary-900 hover:bg-primary-800 text-white px-8 py-6 text-base rounded-lg shadow-sm hover:shadow-md transition-all"
                                aria-label="Agendar consulta com oftalmologista"
                            >
                                <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
                                <span>Agendar Consulta</span>
                            </Button>

                            {/* Garantia - Minimalista */}
                            <p className="text-sm text-primary-600 text-center lg:text-left">
                                Sem compromisso · Cancele quando quiser
                            </p>
                        </div>

                        {/* Link secundário discreto */}
                        <div className="text-center lg:text-left">
                            <button
                                onClick={handleFalarWhatsApp}
                                className="text-sm text-primary-500 hover:text-primary-700 transition-colors"
                            >
                                Falar no WhatsApp →
                            </button>
                        </div>

                    </div>

                    {/* Right Column - Hero Image */}
                    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <ErrorBoundary fallback={<div className="bg-muted rounded-lg h-[400px] flex items-center justify-center"><p className="text-muted-foreground">Imagem indisponível</p></div>}>
                            <HeroImage
                                className="transform transition-transform duration-300 hover:scale-[1.02]"
                                imageVariant="hero1"
                            />
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </section>
    )
}
