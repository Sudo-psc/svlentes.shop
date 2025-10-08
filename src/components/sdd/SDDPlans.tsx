'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
    CheckCircle,
    Shield,
    Truck,
    Eye,
    Star,
    Phone,
    Users,
    Calendar,
    Heart,
    Award,
    Zap,
    Crown,
    AlertCircle
} from 'lucide-react'

interface SDDPlansProps {
    className?: string
}

interface Plan {
    id: string
    name: string
    price: number
    description: string
    features: string[]
    recommended?: boolean
    color: string
    icon: React.ReactNode
    clinicalLevel: string
    idealFor: string[]
    material: string
    delivery: string
}

export function SDDPlans({ className = '' }: SDDPlansProps) {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

    const plans: Plan[] = [
        {
            id: 'basico',
            name: 'Básico',
            price: 99,
            description: 'Perfeito para quem busca rotina simples e economia',
            features: [
                'Lentes esféricas gelatinosas (diárias ou mensais)',
                'Acompanhamento médico trimestral',
                'Paquimetria ultrassônica',
                'Lembretes automáticos no WhatsApp',
                'Entrega semestral com rastreio',
                'Suporte médico 24/7',
                'Consulta inicial completa',
                'Kit limpeza gratuito'
            ],
            recommended: false,
            color: 'blue',
            icon: <Shield className="w-6 h-6" />,
            clinicalLevel: 'Essencial',
            idealFor: ['Miopia', 'Hipermetropia', 'Rotina simples', 'Primeira vez'],
            material: 'Hema/GMA',
            delivery: '2x/ano'
        },
        {
            id: 'padrao',
            name: 'Padrão',
            price: 139,
            description: 'O mais completo para necessidades visuais complexas',
            features: [
                'Tudo do plano Básico +',
                'Lentes tóricas e multifocais (conforme prescrição)',
                'Paquimetria + topografia corneana anual',
                'Teleorientação prioritária',
                'Consulta de retorno semestral',
                'Entrega trimestral (4x/ano)',
                'Materiais de maior oxigenação',
                'Consulta com especialista',
                'Seguro perda/dano emergencial'
            ],
            recommended: true,
            color: 'purple',
            icon: <Crown className="w-6 h-6" />,
            clinicalLevel: 'Avançado',
            idealFor: ['Astigmatismo', 'Presbiopia', 'Uso frequente', 'Alta demanda'],
            material: 'Silicone-Hidrogel',
            delivery: '4x/ano'
        },
        {
            id: 'premium',
            name: 'Premium',
            price: 199,
            description: 'Máxima tecnologia e cuidado para olhos sensíveis',
            features: [
                'Tudo do plano Padrão +',
                'Materiais avançados (Silicone Hidrogel de última geração)',
                'Paquimetria + topografia + meibografia',
                'Agenda preferencial garantida',
                'Atendimento exclusivo com Dr. Philipe',
                'Entrega mensal personalizada',
                'Casos especiais (RGP, escleral sob avaliação)',
                'Consulta nutricional ocular',
                'Programa fidelidade VIP',
                'Seguro total internacional'
            ],
            recommended: false,
            color: 'gold',
            icon: <Star className="w-6 h-6" />,
            clinicalLevel: 'Exclusivo',
            idealFor: ['Olhos sensíveis', 'Alta demanda visual', 'Adaptação especial', 'Profissionais'],
            material: 'Silicone-Hidrogel Premium',
            delivery: '12x/ano'
        }
    ]

    const handlePlanSelect = (planId: string) => {
        setSelectedPlan(planId)
        // Redirecionar para WhatsApp ou checkout
        const plan = plans.find(p => p.id === planId)
        if (plan) {
            const message = `Olá! Tenho interesse no plano ${plan.name} (R$ ${plan.price},00/mês). Podemos conversar sobre os detalhes?`
            window.location.href = `https://wa.me/5533998601427?text=${encodeURIComponent(message)}`
        }
    }

    const getColorClasses = (color: string) => {
        const colors = {
            blue: {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                text: 'text-blue-600',
                gradient: 'from-blue-500 to-cyan-500',
                button: 'bg-blue-600 hover:bg-blue-700'
            },
            purple: {
                bg: 'bg-purple-50',
                border: 'border-purple-200',
                text: 'text-purple-600',
                gradient: 'from-purple-500 to-pink-500',
                button: 'bg-purple-600 hover:bg-purple-700'
            },
            gold: {
                bg: 'bg-amber-50',
                border: 'border-amber-200',
                text: 'text-amber-600',
                gradient: 'from-amber-500 to-orange-500',
                button: 'bg-amber-600 hover:bg-amber-700'
            }
        }
        return colors[color as keyof typeof colors] || colors.blue
    }

    return (
        <section className={`py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white ${className}`}>
            <div className="container-custom">
                {/* Header da Seção */}
                <div className="text-center mb-16">
                    <Badge
                        variant="secondary"
                        size="lg"
                        className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200"
                    >
                        <Award className="w-4 h-4 mr-2" />
                        Planos para cada necessidade
                    </Badge>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Escolha seu plano de
                        <span className="block text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            transformação visual
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Três opções completas com acompanhamento médico do Dr. Philipe Saraiva Cruz.
                        Todos incluem entrega, suporte e segurança clínica.
                    </p>
                </div>

                {/* Ciclo de Cobrança */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${billingCycle === 'monthly'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Mensal
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${billingCycle === 'annual'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Anual (20% OFF)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cards dos Planos */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    {plans.map((plan, index) => {
                        const colors = getColorClasses(plan.color)
                        const annualPrice = Math.floor(plan.price * 12 * 0.8) / 12
                        const displayPrice = billingCycle === 'annual' ? annualPrice : plan.price

                        return (
                            <div
                                key={plan.id}
                                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl ${plan.recommended
                                    ? `${colors.border} scale-105`
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {/* Badge Recomendado */}
                                {plan.recommended && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-6 py-2">
                                            <Star className="w-4 h-4 mr-2" />
                                            Mais Popular
                                        </Badge>
                                    </div>
                                )}

                                <div className="p-8">
                                    {/* Header do Plano */}
                                    <div className="text-center mb-8">
                                        <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                            <div className={colors.text}>{plan.icon}</div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {plan.name}
                                        </h3>

                                        <p className="text-gray-600 mb-6">
                                            {plan.description}
                                        </p>

                                        {/* Preço */}
                                        <div className="mb-6">
                                            <div className="text-4xl font-bold text-gray-900">
                                                R$ {displayPrice.toFixed(2).replace('.', ',')}
                                            </div>
                                            <div className="text-gray-500">
                                                /mês {billingCycle === 'annual' && '(cobrança anual)'}
                                            </div>

                                            {billingCycle === 'annual' && (
                                                <div className="mt-2">
                                                    <Badge variant="success" size="sm">
                                                        Economize R$ {(plan.price * 12 - annualPrice * 12).toFixed(2).replace('.', ',')}/ano
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        {/* Nível Clínico */}
                                        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${colors.bg} mb-6`}>
                                            <Shield className={`w-4 h-4 ${colors.text}`} />
                                            <span className={`text-sm font-semibold ${colors.text}`}>
                                                Nível {plan.clinicalLevel}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-4 mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-start space-x-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Ideal Para */}
                                    <div className="mb-8">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Ideal para:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {plan.idealFor.map((item, itemIndex) => (
                                                <Badge key={itemIndex} variant="secondary" size="sm" className="text-xs">
                                                    {item}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Especificações Técnicas */}
                                    <div className="bg-gray-50 rounded-xl p-4 mb-8">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Material:</span>
                                                <div className="font-semibold text-gray-900">{plan.material}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Entrega:</span>
                                                <div className="font-semibold text-gray-900">{plan.delivery}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTAs */}
                                    <div className="space-y-3">
                                        <Button
                                            onClick={() => handlePlanSelect(plan.id)}
                                            variant="cta"
                                            size="lg"
                                            className={`w-full ${plan.recommended
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                                                : colors.button
                                                } text-white font-bold`}
                                        >
                                            <Phone className="w-5 h-5 mr-2" />
                                            ASSINAR AGORA
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={() => handlePlanSelect(plan.id)}
                                            className="w-full border-gray-300 hover:border-gray-400"
                                        >
                                            AGENDAR AVALIAÇÃO
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Comparação Visual */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Comparação completa dos planos
                        </h3>
                        <p className="text-lg text-gray-600">
                            Veja lado a lado o que cada plano oferece
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                                        <th className="text-left p-6 font-semibold text-gray-900">Recursos</th>
                                        <th className="text-center p-6 font-semibold text-blue-600">Básico</th>
                                        <th className="text-center p-6 font-semibold text-purple-600">Padrão</th>
                                        <th className="text-center p-6 font-semibold text-amber-600">Premium</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t border-gray-200">
                                        <td className="p-6 font-medium text-gray-900">Lentes esféricas</td>
                                        <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                                        <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                                        <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                                    </tr>
                                    <tr className="border-t border-gray-200 bg-gray-50">
                                        <td className="p-6 font-medium text-gray-900">Lentes tóricas</td>
                                        <td className="p-6 text-center text-gray-400">—</td>
                                        <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                                        <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                                    </tr>
                                    <tr className="border-t border-gray-200">
                                        <td className="p-6 font-medium text-gray-900">Lentes multifocais</td>
                                        <td className="p-6 text-center text-gray-400">—</td>
                                        <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                                        <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                                    </tr>
                                    <tr className="border-t border-gray-200 bg-gray-50">
                                        <td className="p-6 font-medium text-gray-900">Topografia corneana</td>
                                        <td className="p-6 text-center text-gray-400">—</td>
                                        <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                                        <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                                    </tr>
                                    <tr className="border-t border-gray-200">
                                        <td className="p-6 font-medium text-gray-900">Meibografia</td>
                                        <td className="p-6 text-center text-gray-400">—</td>
                                        <td className="p-6 text-center text-gray-400">—</td>
                                        <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                                    </tr>
                                    <tr className="border-t border-gray-200 bg-gray-50">
                                        <td className="p-6 font-medium text-gray-900">Entrega</td>
                                        <td className="p-6 text-center text-gray-700">2x/ano</td>
                                        <td className="p-6 text-center text-gray-700">4x/ano</td>
                                        <td className="p-6 text-center text-gray-700">12x/ano</td>
                                    </tr>
                                    <tr className="border-t border-gray-200">
                                        <td className="p-6 font-medium text-gray-900">Atendimento direto Dr. Philipe</td>
                                        <td className="p-6 text-center text-gray-400">—</td>
                                        <td className="p-6 text-center text-gray-400">—</td>
                                        <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Segurança Clínica */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            Segurança clínica em todos os planos
                        </h3>
                        <p className="text-xl text-white/90">
                            Sua saúde visual é nossa prioridade absoluta
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-bold mb-2">Prescrição Obrigatória</h4>
                            <p className="text-sm text-white/80">
                                Grau esférico/cilíndrico/eixo, curvatura base, diâmetro, Dk/t, material
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-bold mb-2">Validade de 1 Ano</h4>
                            <p className="text-sm text-white/80">
                                Receita sempre atualizada e segura para seu uso contínuo
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-bold mb-2">Sinais de Alerta</h4>
                            <p className="text-sm text-white/80">
                                Atendimento imediato para dor, vermelhidão, visão borrada ou secreção
                            </p>
                        </div>
                    </div>

                    {/* CTA Final */}
                    <div className="text-center">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                            <p className="text-lg mb-6 text-white/90">
                                Precisa de ajuda para escolher? Fale com nosso especialista clínico.
                            </p>
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={() => window.location.href = 'tel:+5533998601427'}
                                className="bg-white text-blue-600 hover:bg-gray-100 flex items-center space-x-2 mx-auto"
                            >
                                <Phone className="w-5 h-5" />
                                <span>Falar com Especialista</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
