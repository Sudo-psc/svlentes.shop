'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
    ChevronDown,
    ChevronUp,
    HelpCircle,
    Shield,
    Truck,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    Phone,
    FileText,
    CreditCard,
    RefreshCcw
} from 'lucide-react'

interface SDDFAQProps {
    className?: string
}

interface FAQItem {
    question: string
    answer: string
    icon: React.ReactNode
    category: 'basico' | 'processo' | 'seguranca'
}

export function SDDFAQ({ className = '' }: SDDFAQProps) {
    const [expandedItem, setExpandedItem] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState<'todos' | 'basico' | 'processo' | 'seguranca'>('todos')

    const faqItems: FAQItem[] = [
        {
            question: "Preciso de receita?",
            answer: "Sim, e garantimos a validade por 1 ano inteiro. Emitimos ou atualizamos sua receita na Saraiva Vision com Dr. Philipe Saraiva Cruz (CRM-MG 69.870). Se você já tem receita, validamos e incluímos no seu plano sem custo adicional.",
            icon: <FileText className="w-5 h-5 text-blue-600" />,
            category: 'basico'
        },
        {
            question: "Quando recebo minhas lentes?",
            answer: "Recebimento rápido e organizado: primeira entrega em até 7 dias após prescrição, depois remessas semestrais automáticas. Frete grátis com rastreio via WhatsApp. Você sabe exatamente quando suas lentes chegam.",
            icon: <Truck className="w-5 h-5 text-green-600" />,
            category: 'processo'
        },
        {
            question: "E se não adaptar às lentes?",
            answer: "Ajuste garantido: oferecemos teleorientação imediata e consulta de retorno sem custo. Se necessário, trocamos o tipo de lente até encontrar a perfeita para você. Sua adaptação é nossa prioridade.",
            icon: <RefreshCcw className="w-5 h-5 text-purple-600" />,
            category: 'seguranca'
        },
        {
            question: "Posso cancelar a assinatura?",
            answer: "Sim, cancelamento flexível. Pode cancelar ao término do ciclo vigente sem multa ou justificativa. Basta avisar com 30 dias de antecedência. Sem pegadinhas, sem letras miúdas.",
            icon: <Calendar className="w-5 h-5 text-red-600" />,
            category: 'processo'
        },
        {
            question: "Como funciona o pagamento?",
            answer: "Pagamento simples e seguro: cobrança mensal via cartão de crédito ou boleto. Aceitamos todas as bandeiras. Primeira mensalidade só após aprovação e adaptação inicial. Transparente do início ao fim.",
            icon: <CreditCard className="w-5 h-5 text-yellow-600" />,
            category: 'processo'
        },
        {
            question: "Qual a diferença entre os planos?",
            answer: "Básico (R$99): lentes esféricas para miopia/hipermetropia. Padrão (R$139): inclui tóricas e multifocais para astigmatismo/presbiopia. Premium (R$199): materiais avançados e casos especiais. Todos incluem acompanhamento médico.",
            icon: <Shield className="w-5 h-5 text-blue-600" />,
            category: 'basico'
        },
        {
            question: "O acompanhamento médico é presencial?",
            answer: "Flexibilidade total: primeira consulta presencial em Caratinga com Dr. Philipe. Acompanhamentos trimestrais podem ser híbridos (presenciais ou via telemedicina). Adaptamos à sua conveniência.",
            icon: <Phone className="w-5 h-5 text-green-600" />,
            category: 'seguranca'
        },
        {
            question: "E se eu perder minhas lentes?",
            answer: "Solução rápida: contato imediato via WhatsApp, enviamos reposição emergencial em até 48h. Custo adicional mínimo apenas das lentes. Você nunca fica sem.",
            icon: <Clock className="w-5 h-5 text-purple-600" />,
            category: 'seguranca'
        },
        {
            question: "As lentes são certificadas?",
            answer: "Total segurança: todas as lentes têm certificação ANVISA. Trabalhamos apenas com laboratórios internacionais reconhecidos (Johnson & Johnson, Alcon, Bausch + Lomb). Qualidade e segurança garantidas.",
            icon: <Shield className="w-5 h-5 text-green-600" />,
            category: 'seguranca'
        }
    ]

    const categories = [
        { id: 'todos', label: 'Todas', color: 'gray' },
        { id: 'basico', label: 'Básico', color: 'blue' },
        { id: 'processo', label: 'Processo', color: 'green' },
        { id: 'seguranca', label: 'Segurança', color: 'purple' }
    ]

    const filteredItems = activeCategory === 'todos'
        ? faqItems
        : faqItems.filter(item => item.category === activeCategory)

    const toggleItem = (question: string) => {
        setExpandedItem(expandedItem === question ? null : question)
    }

    const getCategoryColor = (category: string) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-800 border-blue-200',
            green: 'bg-green-100 text-green-800 border-green-200',
            purple: 'bg-purple-100 text-purple-800 border-purple-200',
            red: 'bg-red-100 text-red-800 border-red-200',
            yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            gray: 'bg-gray-100 text-gray-800 border-gray-200'
        }
        return colors[category as keyof typeof colors] || colors.gray
    }

    const processSteps = [
        {
            step: 1,
            title: "Assinar um plano",
            description: "Escolha o plano ideal para sua necessidade e orçamento",
            icon: <FileText className="w-6 h-6" />
        },
        {
            step: 2,
            title: "Agendar avaliação",
            description: "Consulta obrigatória com Dr. Philipe para prescrição precisa",
            icon: <Calendar className="w-6 h-6" />
        },
        {
            step: 3,
            title: "Receber em casa",
            description: "Entrega 2x/ano com rastreio e lembretes automáticos",
            icon: <Truck className="w-6 h-6" />
        },
        {
            step: 4,
            title: "Acompanhar",
            description: "Suporte contínuo via WhatsApp e app",
            icon: <Phone className="w-6 h-6" />
        }
    ]

    return (
        <section className={`py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white ${className}`}>
            <div className="container-custom">
                {/* Header da Seção */}
                <div className="text-center mb-16">
                    <Badge
                        variant="secondary"
                        size="lg"
                        className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200"
                    >
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Tudo que você precisa saber
                    </Badge>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Suas dúvidas,
                        <span className="block text-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            nossas respostas claras
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Transparência total em cada etapa. Sem surpresas, sem letras miúdas,
                        apenas segurança e confiança para sua decisão.
                    </p>
                </div>

                {/* Processo Claro */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Como funciona nosso processo
                        </h3>
                        <p className="text-lg text-gray-600">
                            Quatro passos simples para sua transformação visual
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {processSteps.map((step, index) => (
                            <div key={index} className="relative">
                                {/* Conector */}
                                {index < processSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200"
                                        style={{ width: 'calc(100% - 4rem)' }}></div>
                                )}

                                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 relative z-10">
                                    {/* Número do Passo */}
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-6 mx-auto">
                                        {step.step}
                                    </div>

                                    {/* Ícone */}
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <div className="text-blue-600">{step.icon}</div>
                                    </div>

                                    {/* Conteúdo */}
                                    <h4 className="text-lg font-bold text-gray-900 mb-3 text-center">
                                        {step.title}
                                    </h4>
                                    <p className="text-gray-600 text-center text-sm">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filtros de Categoria */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={activeCategory === category.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveCategory(category.id as any)}
                            className={`px-6 py-2 rounded-full transition-all duration-300 ${activeCategory === category.id
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            {category.label}
                        </Button>
                    ))}
                </div>

                {/* FAQ Items */}
                <div className="max-w-4xl mx-auto space-y-4 mb-20">
                    {filteredItems.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleItem(item.question)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                            >
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className="flex-shrink-0">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {item.question}
                                        </h4>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                    {expandedItem === item.question ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                            </button>

                            {/* Resposta Expandida */}
                            <div className={`overflow-hidden transition-all duration-300 ${expandedItem === item.question ? 'max-h-96' : 'max-h-0'
                                }`}>
                                <div className="px-8 pb-6 pt-0">
                                    <div className="pl-9">
                                        <p className="text-gray-700 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Transparência Radical - Preços */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Preços transparentes, sem surpresas
                        </h3>
                        <p className="text-lg text-gray-600">
                            O que você vê é o que você paga. Taxa única mensal.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
                            <div className="text-center mb-6">
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Básico</h4>
                                <div className="text-3xl font-bold text-gray-900">R$ 99</div>
                                <div className="text-gray-500">/mês</div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Lentes esféricas diárias/mensais</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Acompanhamento médico</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Entrega semestral</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border-2 border-blue-300 hover:border-blue-400 transition-all duration-300 relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                                    Mais Popular
                                </Badge>
                            </div>
                            <div className="text-center mb-6">
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Padrão</h4>
                                <div className="text-3xl font-bold text-gray-900">R$ 139</div>
                                <div className="text-gray-500">/mês</div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Tudo do Básico +</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Lentes tóricas/multifocais</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Topografia anual</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:border-purple-300 transition-all duration-300">
                            <div className="text-center mb-6">
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Premium</h4>
                                <div className="text-3xl font-bold text-gray-900">R$ 199</div>
                                <div className="text-gray-500">/mês</div>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Tudo do Padrão +</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Materiais avançados</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Casos especiais</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Garantias e Selos */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            Sua segurança é nossa prioridade
                        </h3>
                        <p className="text-xl text-white/90">
                            Garantias que você pode confiar
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-bold mb-2">LGPD Compliant</h4>
                            <p className="text-sm text-white/80">
                                Seus dados protegidos por lei
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-bold mb-2">SSL Seguro</h4>
                            <p className="text-sm text-white/80">
                                Conexão criptografada
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-bold mb-2">CRM-MG 69.870</h4>
                            <p className="text-sm text-white/80">
                                Médico especialista
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-bold mb-2">Satisfação</h4>
                            <p className="text-sm text-white/80">
                                Garantia de adaptação
                            </p>
                        </div>
                    </div>

                    {/* CTA Final */}
                    <div className="text-center mt-12">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                            <p className="text-lg mb-6 text-white/90">
                                Ainda com dúvidas? Fale diretamente com nosso especialista.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    onClick={() => window.location.href = 'tel:+5533998601427'}
                                    className="bg-white text-blue-600 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>(33) 99860-1427</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => window.location.href = 'https://wa.me/5533998601427'}
                                    className="border-white text-white hover:bg-white hover:text-blue-600 flex items-center space-x-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>WhatsApp</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
