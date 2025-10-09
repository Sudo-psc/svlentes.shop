'use client'

import { Button } from '@/components/ui/Button'
import { Check, Star } from 'lucide-react'
import Link from 'next/link'

const plans = [
    {
        id: 'essencial',
        name: 'Essencial',
        price: 99.00,
        color: 'green',
        features: [
            'Lentes começam no acordo observado',
            'Renovação automática',
            'Entrega rastreada',
            'Suporte básico'
        ],
        cta: 'Assinar Essencial',
        rating: 5,
        available: true
    },
    {
        id: 'cuidado-plus',
        name: 'Cuidado Plus',
        price: 149.00,
        color: 'gray',
        features: [
            '1 visita semestral',
            'Suporte online',
            'Suporte de lente',
            'Frete de custo'
        ],
        cta: 'Frete de custo',
        rating: 0,
        available: false
    },
    {
        id: 'cuidado-plus-deluxe',
        name: 'Cuidado Plus Deluxe',
        price: 139.00,
        color: 'green',
        features: [
            '2 visitas semestrais',
            'Suporte prioritário',
            'Lentes de teste',
            'Entrega express'
        ],
        cta: 'Assinar Cuidado Plus',
        rating: 5,
        available: true
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 199.00,
        color: 'green',
        features: [
            '2 visitas semestrais',
            '2 consultas ao ano',
            'Suporte de teste',
            'Benefícios exclusivos'
        ],
        cta: 'Assinar Consultar',
        rating: 5,
        available: true
    }
]

export function PricingSection() {
    return (
        <section className="py-20 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
                {/* Título */}
                <div className="text-center mb-4">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                        Planos de Assinatura
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Quem aprova:
                    </p>
                </div>

                {/* Cards de preços */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border-2 ${plan.color === 'green'
                                    ? 'border-secondary-500'
                                    : 'border-gray-200 dark:border-gray-700'
                                } hover:shadow-xl transition-shadow`}
                        >
                            {/* Header do card */}
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                        R$ {plan.price.toFixed(2)}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">/mês</span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <Button
                                asChild
                                className={`w-full ${plan.color === 'green'
                                        ? 'bg-secondary-600 hover:bg-secondary-700'
                                        : 'bg-gray-400 hover:bg-gray-500'
                                    } text-white`}
                                disabled={!plan.available}
                            >
                                <Link href={plan.available ? '/assinatura' : '#'}>
                                    {plan.cta}
                                </Link>
                            </Button>

                            {/* Rating */}
                            {plan.rating > 0 && (
                                <div className="flex items-center justify-center gap-1 mt-4">
                                    {Array.from({ length: plan.rating }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                        />
                                    ))}
                                    <div className="w-6 h-6 bg-secondary-500 rounded-full ml-2" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
