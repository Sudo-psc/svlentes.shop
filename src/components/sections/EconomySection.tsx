'use client'

import { useState } from 'react'
import { EconomyCalculator } from '@/components/forms/EconomyCalculator'
import { Badge } from '@/components/ui/Badge'
import { type CalculatorData } from '@/lib/validations'
import { type EconomyCalculationResult } from '@/lib/economy-calculator'
import { formatCurrency } from '@/lib/utils'
import {
    Calculator,
    TrendingUp,
    Users,
    Award,
    CheckCircle,
    DollarSign,
    Clock,
    Target
} from 'lucide-react'

interface EconomySectionProps {
    className?: string
}

export function EconomySection({ className = '' }: EconomySectionProps) {
    const [calculationResult, setCalculationResult] = useState<EconomyCalculationResult | null>(null)
    const [userData, setUserData] = useState<CalculatorData | null>(null)

    const handleCalculation = (data: CalculatorData, result: EconomyCalculationResult) => {
        setUserData(data)
        setCalculationResult(result)
    }

    const economyStats = [
        {
            icon: DollarSign,
            value: 'R$ 800',
            label: 'Economia média anual',
            description: 'Nossos clientes economizam em média'
        },
        {
            icon: Users,
            value: '5.000+',
            label: 'Clientes satisfeitos',
            description: 'Já confiam na nossa assinatura'
        },
        {
            icon: TrendingUp,
            value: '40%',
            label: 'Economia média',
            description: 'Comparado à compra avulsa'
        },
        {
            icon: Clock,
            value: '12h',
            label: 'Tempo economizado',
            description: 'Por ano sem ir à ótica'
        }
    ]

    const whyCalculate = [
        {
            icon: Target,
            title: 'Resultado Personalizado',
            description: 'Cálculo baseado no seu perfil específico de uso'
        },
        {
            icon: CheckCircle,
            title: 'Transparência Total',
            description: 'Veja exatamente quanto você vai economizar'
        },
        {
            icon: Award,
            title: 'Plano Ideal',
            description: 'Recomendação do melhor plano para você'
        }
    ]

    return (
        <section className={`py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white ${className}`} id="calculadora-economia">
            <div className="container-custom">

                {/* Header */}
                <div className="text-center mb-16">
                    <Badge
                        variant="info"
                        size="lg"
                        className="mb-6"
                    >
                        <Calculator className="w-4 h-4 mr-2" />
                        Calculadora Gratuita
                    </Badge>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Descubra sua{' '}
                        <span className="text-gradient">Economia Real</span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Nossa calculadora personalizada mostra exatamente quanto você pode economizar
                        com a assinatura LAAS baseada no seu perfil de uso atual.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {economyStats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                        >
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <stat.icon className="w-6 h-6 text-primary-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm font-medium text-gray-700 mb-1">
                                {stat.label}
                            </div>
                            <div className="text-xs text-gray-500">
                                {stat.description}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left Column - Why Calculate */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Por que usar nossa calculadora?
                            </h3>

                            <div className="space-y-6">
                                {whyCalculate.map((item, index) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-gray-600">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Result Preview */}
                        {calculationResult && userData && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                                <h4 className="text-lg font-semibold text-green-800 mb-4">
                                    🎉 Parabéns, {userData.nome}!
                                </h4>
                                <p className="text-green-700 mb-4">
                                    Com base no seu perfil de uso, você pode economizar:
                                </p>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        {formatCurrency(calculationResult.annualSavings)}
                                    </div>
                                    <div className="text-sm text-green-600">
                                        por ano com o {calculationResult.recommendedPlan.name}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Trust Elements */}
                        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                                Garantias LAAS
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Cálculo 100% gratuito e sem compromisso</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Seus dados protegidos conforme LGPD</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Resultado personalizado em tempo real</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Acompanhamento médico especializado</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Calculator */}
                    <div className="lg:sticky lg:top-8">
                        <EconomyCalculator
                            variant="full"
                            onCalculate={handleCalculation}
                        />
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-primary-900 mb-4">
                            Ainda tem dúvidas sobre a economia?
                        </h3>
                        <p className="text-primary-700 mb-6">
                            Nosso time de especialistas pode fazer um cálculo ainda mais detalhado
                            considerando suas necessidades específicas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#contato"
                                className="btn-primary inline-flex items-center justify-center space-x-2"
                            >
                                <Calculator className="w-4 h-4" />
                                <span>Falar com Especialista</span>
                            </a>
                            <a
                                href="#planos-precos"
                                className="btn-outline inline-flex items-center justify-center space-x-2"
                            >
                                <Target className="w-4 h-4" />
                                <span>Ver Todos os Planos</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}