'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import {
    Shield,
    Truck,
    Eye,
    Calendar,
    CheckCircle,
    Star,
    Heart,
    Clock,
    Award,
    Users
} from 'lucide-react'

interface SDDBenefitsProps {
    className?: string
}

export function SDDBenefits({ className = '' }: SDDBenefitsProps) {
    const [activeBenefit, setActiveBenefit] = useState(0)

    const benefits = [
        {
            icon: Shield,
            title: "Acompanhamento médico contínuo",
            description: "Receita atualizada e segura por 12 meses",
            details: [
                "Consulta inicial completa com Dr. Philipe Saraiva Cruz",
                "Avaliação trimestral da saúde ocular",
                "Receita sempre válida e atualizada",
                "Suporte médico para dúvidas e emergências"
            ],
            color: "blue"
        },
        {
            icon: Truck,
            title: "Comodidade real",
            description: "Entrega rastreada 2x/ano + lembretes de troca",
            details: [
                "Receba em casa sem sair de Caratinga",
                "Lembretes automáticos no WhatsApp",
                "Rastreamento em tempo real",
                "Embalagem discreta e segura"
            ],
            color: "green"
        },
        {
            icon: Eye,
            title: "Resultado visual",
            description: "Conforto e nitidez com marcas certificadas ANVISA",
            details: [
                "Lentes das melhores marcas do mercado",
                "Certificação ANVISA garantida",
                "Material adaptado ao seu tipo de olho",
                "Visão nítida e conforto prolongado"
            ],
            color: "purple"
        }
    ]

    const testimonials = [
        {
            name: "Ana Silva",
            profession: "Professora",
            avatar: "AS",
            rating: 5,
            text: "Troquei mensal para diárias e reduzi irritação em 80%. O acompanhamento médico me dá total segurança.",
            metric: "80% menos irritação",
            time: "Cliente há 8 meses",
            plan: "Padrão"
        },
        {
            name: "Carlos Mendes",
            profession: "Engenheiro",
            avatar: "CM",
            rating: 5,
            text: "Astigmatismo corrigido com tórica. Adaptação completa em 7 dias. Nunca tive visão tão clara.",
            metric: "Adaptação em 7 dias",
            time: "Cliente há 14 meses",
            plan: "Premium"
        },
        {
            name: "Mariana Costa",
            profession: "Advogada",
            avatar: "MC",
            rating: 5,
            text: "Uso 14h por dia no computador. As lentes diárias mudaram minha qualidade de vida e produtividade.",
            metric: "14h uso diário",
            time: "Cliente há 6 meses",
            plan: "Básico"
        }
    ]

    const caseStudies = [
        {
            condition: "Miopia",
            solution: "Lentes esféricas diárias",
            result: "Visão 20/20 garantida",
            adaptation: "Imediata"
        },
        {
            condition: "Astigmatismo",
            solution: "Lentes tóricas personalizadas",
            result: "Estabilidade visual completa",
            adaptation: "7 dias"
        },
        {
            condition: "Presbiopia",
            solution: "Lentes multifocais progressivas",
            result: "Visão de perto e longe",
            adaptation: "14 dias"
        },
        {
            condition: "Ceratocone",
            solution: "RGP/escleral (Premium)",
            result: "Correção avançada",
            adaptation: "Sob avaliação"
        }
    ]

    const getColorClasses = (color: string) => {
        const colors = {
            blue: {
                bg: "bg-blue-100",
                text: "text-blue-600",
                border: "border-blue-200",
                gradient: "from-blue-500 to-cyan-500"
            },
            green: {
                bg: "bg-green-100",
                text: "text-green-600",
                border: "border-green-200",
                gradient: "from-green-500 to-emerald-500"
            },
            purple: {
                bg: "bg-purple-100",
                text: "text-purple-600",
                border: "border-purple-200",
                gradient: "from-purple-500 to-pink-500"
            }
        }
        return colors[color as keyof typeof colors] || colors.blue
    }

    return (
        <section className={`py-20 lg:py-24 bg-white ${className}`}>
            <div className="container-custom">
                {/* Header da Seção */}
                <div className="text-center mb-16">
                    <Badge
                        variant="secondary"
                        size="lg"
                        className="mb-6 bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 border-blue-200"
                    >
                        <Award className="w-4 h-4 mr-2" />
                        Benefícios Comprovados
                    </Badge>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Funciona para pessoas
                        <span className="block text-gradient bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                            como você
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Descubra por que mais de 250 pessoas em Caratinga e região confiam na Saraiva Vision
                        para sua saúde visual e bem-estar.
                    </p>
                </div>

                {/* Tríade de Benefícios */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    {benefits.map((benefit, index) => {
                        const colors = getColorClasses(benefit.color)
                        const Icon = benefit.icon

                        return (
                            <div
                                key={index}
                                className={`relative group cursor-pointer transition-all duration-300 ${activeBenefit === index ? 'scale-105' : 'hover:scale-102'
                                    }`}
                                onClick={() => setActiveBenefit(index)}
                                onMouseEnter={() => setActiveBenefit(index)}
                            >
                                <div className={`bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 ${activeBenefit === index
                                        ? `${colors.border} shadow-2xl`
                                        : 'border-gray-100 hover:border-gray-200'
                                    }`}>
                                    {/* Ícone Principal */}
                                    <div className={`w-20 h-20 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-10 h-10 ${colors.text}`} />
                                    </div>

                                    {/* Título e Descrição */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                                        {benefit.title}
                                    </h3>

                                    <p className="text-gray-600 text-center mb-6 font-medium">
                                        {benefit.description}
                                    </p>

                                    {/* Detalhes Expandidos */}
                                    <div className={`space-y-3 transition-all duration-300 ${activeBenefit === index ? 'opacity-100 max-h-96' : 'opacity-60 max-h-0 overflow-hidden'
                                        }`}>
                                        {benefit.details.map((detail, detailIndex) => (
                                            <div key={detailIndex} className="flex items-center space-x-3">
                                                <CheckCircle className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
                                                <span className="text-sm text-gray-700">{detail}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Indicador Visual */}
                                    <div className={`mt-6 h-1 ${colors.bg} rounded-full transition-all duration-300 ${activeBenefit === index ? 'w-full' : 'w-0 group-hover:w-1/2'
                                        }`}></div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Social Proof Estratificado - Depoimentos */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Histórias reais de transformação
                        </h3>
                        <p className="text-lg text-gray-600">
                            Veja como nossas vidas mudaram com as lentes certas e acompanhamento médico
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                {/* Avaliação */}
                                <div className="flex items-center space-x-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>

                                {/* Depoimento */}
                                <blockquote className="text-gray-700 mb-6 italic">
                                    "{testimonial.text}"
                                </blockquote>

                                {/* Métrica de Resultado */}
                                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 mb-6">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-blue-600">
                                            {testimonial.metric}
                                        </div>
                                    </div>
                                </div>

                                {/* Informações do Cliente */}
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold">{testimonial.avatar}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                        <div className="text-sm text-gray-600">{testimonial.profession}</div>
                                        <div className="text-xs text-gray-500">{testimonial.time} • Plano {testimonial.plan}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Casos de Uso por Condição */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Solução para cada necessidade
                        </h3>
                        <p className="text-lg text-gray-600">
                            Temos a lente perfeita para seu tipo de visão e estilo de vida
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {caseStudies.map((caseStudy, index) => (
                            <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-colors duration-300">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Eye className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">{caseStudy.condition}</h4>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Solução:</span>
                                            <span className="text-gray-600 ml-1">{caseStudy.solution}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Resultado:</span>
                                            <span className="text-gray-600 ml-1">{caseStudy.result}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Adaptação:</span>
                                            <span className="text-gray-600 ml-1">{caseStudy.adaptation}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selos e Certificações */}
                <div className="text-center">
                    <div className="inline-flex flex-wrap justify-center items-center gap-8 p-8 bg-gray-50 rounded-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                                <Shield className="w-8 h-8 text-green-600" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">ANVISA</span>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">CNPJ 53.864.119/0001-79</span>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                                <Shield className="w-8 h-8 text-purple-600" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">SSL Seguro</span>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                                <Heart className="w-8 h-8 text-red-600" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">LGPD Compliant</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
