import { Metadata } from 'next'
import { SubscriptionFlow } from '@/components/subscription/SubscriptionFlow'

export const metadata: Metadata = {
    title: 'Assinar Lentes de Contato - SV Lentes',
    description: 'Assine lentes de contato com acompanhamento médico especializado. Planos mensais e anuais com economia garantida.',
    keywords: [
        'assinar lentes de contato',
        'assinatura lentes',
        'lentes diárias',
        'acompanhamento médico',
        'Dr. Philipe Saraiva Cruz',
        'SV Lentes',
        'Vitória da Conquista'
    ],
    openGraph: {
        title: 'Assinar Lentes de Contato - SV Lentes',
        description: 'Assine lentes de contato com acompanhamento médico especializado. Planos mensais e anuais com economia garantida.',
        type: 'website',
        url: 'https://saraivavision.com.br/assinatura',
        images: [
            {
                url: 'https://saraivavision.com.br/og-image-assinatura.jpg',
                width: 1200,
                height: 630,
                alt: 'Assinar Lentes de Contato - SV Lentes'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Assinar Lentes de Contato - SV Lentes',
        description: 'Assine lentes de contato com acompanhamento médico especializado. Planos mensais e anuais com economia garantida.',
        images: ['https://saraivavision.com.br/og-image-assinatura.jpg']
    },
    alternates: {
        canonical: 'https://saraivavision.com.br/assinatura'
    }
}

export default function SubscriptionPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 py-16">
                <div className="container-custom">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Assine Suas Lentes de Contato
                        </h1>
                        <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
                            Assinatura mensal ou anual com acompanhamento médico especializado do Dr. Philipe Saraiva Cruz.
                            Nunca mais fique sem lentes com a comodidade e segurança que você merece.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-white">
                                <p className="text-sm font-medium">
                                    ✅ CRM-MG 69.870 | ANVISA | Acompanhamento Médico
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-white">
                                <p className="text-sm font-medium">
                                    🚗 Entrega para todo Brasil | Suporte 24/7
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscription Flow */}
            <div className="py-12">
                <div className="container-custom">
                    <SubscriptionFlow />
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white py-16">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Por que assinar com a SV Lentes?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Benefícios exclusivos para assinantes com acompanhamento médico especializado
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Acompanhamento Médico
                            </h3>
                            <p className="text-gray-600">
                                Consultas regulares com Dr. Philipe Saraiva Cruz para avaliação e ajuste da sua visão.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                            <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                                    <path d="M18 9a1 1 0 00-1 1H5a1 1 0 00-1-1v8a1 1 0 001 1h12a1 1 0 001-1V9z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Entrega Mensal Garantida
                            </h3>
                            <p className="text-gray-600">
                                Receba suas lentes todos os meses no conforto da sua casa, sem se preocupar com estoque.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                            <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 9.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h1v3.586l-1.293-1.293zM7 11a1 1 0 100-2h6a1 1 0 100 2H7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Economia Garantida
                            </h3>
                            <p className="text-gray-600">
                                Planos com até 20% de economia em comparação com compras avulsas de lentes de contato.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <div className="bg-gray-50 rounded-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Comece sua assinatura hoje
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                Junte-se a milhares de clientes que confiam na SV Lentes para cuidar da sua visão
                                com qualidade, segurança e economia.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Cartão de crédito ou débito</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-4.834 9.5-10.834 9.5a12.02 12.02 0 01-.833-2.5 2.998 2.998 0 01.833-2.5zm-13.332 0a6.002 6.002 0 0110.834-5c.11.65.166 1.32.166 2.001 0a3.998 3.998 0 01-2.834 5H3.998z" clipRule="evenodd" />
                                    </svg>
                                    <span>Boleto e PIX</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H6zm0 2h6v6H6V7z" clipRule="evenodd" />
                                    </svg>
                                    <span>Cancelamento a qualquer momento</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="bg-gray-50 py-16">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            O que nossos clientes dizem
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Mais de 10.000 clientes satisfeitos em todo Brasil
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 01-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.118-.364l1.07-3.292a1 1 0 00.95-.69h3.462c.969 0 1.371-1.24.588-1.81l-2.8-2.034a1 1 0 01-.364-1.118L10.951 1.05c-.3-.921-1.603-.921-1.902 0z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 mb-4">
                                "Excelente serviço! As lentes chegam sempre no prazo e o acompanhamento médico faz toda a diferença.
                                Super recomendo!"
                            </p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                                <div>
                                    <p className="font-semibold text-gray-900">Maria Silva</p>
                                    <p className="text-sm text-gray-500">São Paulo, SP</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 01-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.118-.364l1.07-3.292a1 1 0 00.95-.69h3.462c.969 0 1.371-1.24.588-1.81l-2.8-2.034a1 1 0 01-.364-1.118L10.951 1.05c-.3-.921-1.603-.921-1.902 0z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 mb-4">
                                "Economia incrível! Pago muito menos por minhas lentes e ainda tenho acompanhamento com um dos
                                melhores médicos da área. Serviço impecável."
                            </p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                                <div>
                                    <p className="font-semibold text-gray-900">João Santos</p>
                                    <p className="text-sm text-gray-500">Rio de Janeiro, RJ</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 01-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.118-.364l1.07-3.292a1 1 0 00.95-.69h3.462c.969 0 1.371-1.24.588-1.81l-2.8-2.034a1 1 0 01-.364-1.118L10.951 1.05c-.3-.921-1.603-.921-1.902 0z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 mb-4">
                                "A conveniência de receber em casa mudou minha rotina. O suporte é excelente e sempre que
                                preciso trocar o grau, eles me ajudam rapidamente."
                            </p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                                <div>
                                    <p className="font-semibold text-gray-900">Ana Costa</p>
                                    <p className="text-sm text-gray-500">Belo Horizonte, MG</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white py-16">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Dúvidas Frequentes
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Tudo o que você precisa saber sobre nossa assinatura
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-6">
                            <div className="border-b pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Como funciona a assinatura?
                                </h3>
                                <p className="text-gray-600">
                                    Após escolher seu plano, você receberá suas lentes mensalmente. O Dr. Philipe Saraiva Cruz
                                    fará uma avaliação inicial e consultas regulares para garantir que sua prescrição
                                    esteja sempre atualizada.
                                </p>
                            </div>

                            <div className="border-b pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Posso cancelar a qualquer momento?
                                </h3>
                                <p className="text-gray-600">
                                    Sim! Você pode cancelar sua assinatura a qualquer momento sem multas.
                                    Se precisar pausar temporariamente, também oferecemos essa opção.
                                </p>
                            </div>

                            <div className="border-b pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    As consultas médicas estão incluídas?
                                </h3>
                                <p className="text-gray-600">
                                    Sim! Todas as assinaturas incluem consultas de acompanhamento regulares
                                    com Dr. Philipe Saraiva Cruz para avaliação e ajuste da sua visão.
                                </p>
                            </div>

                            <div className="border-b pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Qual o prazo de entrega?
                                </h3>
                                <p className="text-gray-600">
                                    Fazemos entregas em todo Brasil. O prazo padrão é de 3 a 5 dias úteis
                                    após a confirmação do pagamento.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    E se eu precisar trocar meu grau ou tipo de lente?
                                </h3>
                                <p className="text-gray-600">
                                    Entre em contato com nossa equipe e faremos uma nova avaliação médica.
                                    Se necessário, ajustaremos sua assinatura sem custos adicionais.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 py-16">
                <div className="container-custom">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Pronto para começar?
                        </h2>
                        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                            Junte-se a milhares de clientes que já transformaram sua experiência com lentes de contato.
                        </p>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Começar Agora
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
