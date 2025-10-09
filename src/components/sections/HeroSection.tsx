'use client'

import { Button } from '@/components/ui/Button'
import { openWhatsAppWithContext } from '@/lib/whatsapp'
import { PlayCircle, ChevronDown } from 'lucide-react'

interface HeroSectionProps {
    className?: string
}

export function HeroSection({ className = '' }: HeroSectionProps) {
    const handleAssinarAgora = () => {
        try {
            openWhatsAppWithContext('pricing', {
                page: 'landing-page',
                section: 'hero-primary-cta'
            })
        } catch (error) {
            console.error('Erro ao abrir WhatsApp:', error)
            window.open('https://wa.me/5533998601427', '_blank')
        }
    }

    const handleAgendarAvaliacao = () => {
        try {
            openWhatsAppWithContext('consultation', {
                page: 'landing-page',
                section: 'hero-secondary-cta'
            })
        } catch (error) {
            console.error('Erro ao abrir WhatsApp:', error)
            window.open('https://wa.me/5533998601427', '_blank')
        }
    }

    return (
        <section className={`relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden ${className}`}>
            <div className="container mx-auto px-4 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column - Hero Content */}
                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Lentes por assinatura com acompanhamento médico
                        </h1>

                        <p className="text-lg text-gray-600">
                            Simplifique sua visão. Cuide da saúde ocular.
                        </p>

                        {/* CTAs lado a lado */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                onClick={handleAssinarAgora}
                                size="lg"
                                className="bg-green-600 hover:bg-green-700 text-white px-8"
                            >
                                Assinar Agora
                            </Button>

                            <Button
                                onClick={handleAgendarAvaliacao}
                                size="lg"
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8"
                            >
                                Agendar avaliação
                            </Button>
                        </div>

                        {/* Scroll indicator */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Entenda como funciona</span>
                            <ChevronDown className="w-4 h-4 animate-bounce" />
                        </div>
                    </div>

                    {/* Right Column - Video Placeholder */}
                    <div className="relative">
                        <div
                            className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center shadow-xl"
                            role="img"
                            aria-label="Vídeo placeholder — Conheça nosso serviço de assinatura"
                            tabIndex={0}
                        >
                            <div className="text-center">
                                <PlayCircle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">Vídeo Placeholder</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Conheça nosso serviço de assinatura
                                </p>
                            </div>
                        </div>
                        {/* Video controls mockup */}
                        <div
                            className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded px-4 py-2 text-white text-xs"
                            aria-hidden="true"
                        >
                            Controles simulados / nome do vídeo.mp4 / Management
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
