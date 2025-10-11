'use client'

import { Button } from '@/components/ui/Button'
import { Check } from 'lucide-react'
import { openWhatsAppWithContext } from '@/lib/whatsapp'

interface PricingCardsProps {
    className?: string
}

export function PricingCards({ className = '' }: PricingCardsProps) {
    const plans = [
        {
            name: 'Essencial',
            price: 'R$ 99,00',
            features: [
                '1 consulta/semestre',
                '5 especialistas ativas',
                'Suporte online'
            ],
            highlighted: false,
            ctaText: 'Assinar Essencial'
        },
        {
            name: 'Cuidado Plus Semestral',
            price: 'R$ 149,00',
            features: [
                '1 consulta/bimestre',
                '2 consultas de turno',
                'Suporte de tarde'
            ],
            highlighted: false,
            ctaText: 'Teste de trial'
        },
        {
            name: 'Cuidado Plus Anual',
            price: 'R$ 139,00',
            features: [
                '2 consulta/semestre',
                'Sup/Mg prioritário',
                'Lentes de teste'
            ],
            highlighted: true,
            ctaText: 'Assinar Cuidadplus'
        },
        {
            name: 'Premium',
            price: 'R$ 199,00',
            features: [
                '2 consultas/semestre',
                '2 consultas de turno',
                'Suporte de todo'
            ],
            highlighted: false,
            ctaText: 'Assinar Cuidaplus'
        }
    ]

    const handleCTA = (_planName: string) => {
        try {
            openWhatsAppWithContext('pricing', {
                page: 'landing-page',
                section: 'pricing-cards'
            })
        } catch (error) {
            console.error('Erro ao abrir WhatsApp:', error)
            window.open('https://wa.me/5533998601427', '_blank')
        }
    }

    return (
        <section className={`bg-white py-16 ${className}`}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Planos de Assinatura
                    </h2>
                    <div className="bg-green-50 rounded-lg p-4 inline-block">
                        <p className="text-sm text-gray-700">
                            ⭐ <span className="font-semibold">Quem aprova:</span>{' '}
                            As lentes começaram caro e você está economizando + as
                            lentes são de primeira classe!
                        </p>
                    </div>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`rounded-lg p-6 ${plan.highlighted
                                    ? 'bg-green-600 text-white shadow-xl ring-2 ring-green-600'
                                    : 'bg-white border-2 border-gray-200'
                                }`}
                        >
                            {/* Plan Name */}
                            <h4
                                className={`text-lg font-bold mb-4 ${plan.highlighted ? 'text-white' : 'text-gray-900'
                                    }`}
                            >
                                {plan.name}
                            </h4>

                            {/* Price */}
                            <div className="mb-6">
                                <p
                                    className={`text-3xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'
                                        }`}
                                >
                                    {plan.price}
                                </p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <Check
                                            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-white' : 'text-green-600'
                                                }`}
                                        />
                                        <span
                                            className={`text-sm ${plan.highlighted ? 'text-white' : 'text-gray-600'
                                                }`}
                                        >
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <Button
                                onClick={() => handleCTA(plan.name)}
                                className={`w-full ${plan.highlighted
                                        ? 'bg-white text-green-600 hover:bg-gray-50'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                            >
                                {plan.ctaText}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Carousel Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        </section>
    )
}
