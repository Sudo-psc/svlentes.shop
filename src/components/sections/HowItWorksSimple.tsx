'use client'

import { FileText, CalendarCheck, Package } from 'lucide-react'

interface HowItWorksSimpleProps {
    className?: string
}

export function HowItWorksSimple({ className = '' }: HowItWorksSimpleProps) {
    const steps = [
        {
            icon: CalendarCheck,
            title: 'Acompanhamento médico mensal contínuo',
            description: 'Consulta de rotina e suporte contínuo para sua saúde visual'
        },
        {
            icon: Package,
            title: 'Entrega rastreada 2x/ano direto na casa, com 7 dias de prazo',
            description: 'Lentes novas semestralmente, gerenciadas pelos dígitos morfológicos'
        },
        {
            icon: FileText,
            title: 'Marcas renomadas, consulte, troque a receita ANVISA',
            description: 'Escolha marcas conceituadas, ajuste quando necessário'
        }
    ]

    return (
        <section className={`bg-gray-100 py-16 ${className}`}>
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                    Como funciona?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                            <div key={index} className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                                {/* Círculo com ícone */}
                                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                                    <Icon className="w-10 h-10 text-green-600" />
                                </div>

                                {/* Título */}
                                <h3 className="font-bold text-lg text-gray-900 mb-3">
                                    {step.title}
                                </h3>

                                {/* Descrição */}
                                <p className="text-sm text-gray-600">
                                    {step.description}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* Toggle Monthly/Annual - Placeholder */}
                <div className="flex justify-center mt-8">
                    <div className="inline-flex items-center bg-white rounded-full p-1 shadow-sm">
                        <button className="px-6 py-2 rounded-full bg-green-600 text-white text-sm font-medium">
                            Monthly
                        </button>
                        <button className="px-6 py-2 rounded-full text-gray-600 text-sm font-medium">
                            Annual
                        </button>
                        <span className="ml-2 text-xs text-green-600 font-medium">
                            + pricing policies
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
