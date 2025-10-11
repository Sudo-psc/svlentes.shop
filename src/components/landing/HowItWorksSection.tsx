'use client'

import { Stethoscope, Truck, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

const steps = [
    {
        icon: Stethoscope,
        title: 'Acompanhamento médico contínuo',
        description: 'Consultas regulares e suporte contínuo para sua saúde visual'
    },
    {
        icon: Truck,
        title: 'Entrega rastreada 2x/ano',
        description: 'Lentes novas semestralmente, direto na sua casa, com débito mensal'
    },
    {
        icon: ShieldCheck,
        title: 'Marcas certificadas ANVISA',
        description: 'Expertise com lentes de marcas regulamentadas e controladas'
    }
]

export function HowItWorksSection() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                {/* Título */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Como funciona?
                    </h2>
                </div>

                {/* Cards dos passos */}
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Icon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {step.description}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* Toggle de ciclo de pagamento */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${billingCycle === 'monthly'
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            Mensal
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${billingCycle === 'annual'
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            Anual
                            <span className="ml-2 text-xs bg-secondary-500 text-white px-2 py-0.5 rounded-full">
                                Economize
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
