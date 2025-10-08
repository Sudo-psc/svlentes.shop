'use client'

import { CheckCircle, Calendar, CreditCard, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

// Disable static generation for this page (requires user session)
export const dynamic = 'force-dynamic'

export default function SubscriptionSuccessPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Assinatura Confirmada!
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Parabéns! Sua assinatura de lentes de contato foi ativada com sucesso.
                    </p>
                </div>

                {/* Success Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column - Message */}
                        <div className="space-y-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-green-800 mb-3">
                                    O que acontece agora?
                                </h2>
                                <ul className="space-y-3 text-sm text-green-700">
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Você receberá um email de confirmação com todos os detalhes</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Nossa equipe entrará em contato para agendar sua consulta</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Seu primeiro kit de lentes será preparado e enviado</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>Acompanhamento médico contínuo durante todo o período</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                                    Próximos Passos
                                </h3>
                                <ol className="space-y-2 text-sm text-blue-700 list-decimal list-inside">
                                    <li>Aguarde o contato da nossa equipe (24-48h)</li>
                                    <li>Agende sua consulta inicial com Dr. Philipe Saraiva Cruz</li>
                                    <li>Receba seu kit inicial de lentes</li>
                                    <li>Desfrute de suas lentes com acompanhamento médico</li>
                                </ol>
                            </div>
                        </div>

                        {/* Right Column - Contact Info */}
                        <div className="space-y-6">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Informações de Contato
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Phone className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                                            <p className="text-sm text-gray-600">(33) 99986-0142</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Email</p>
                                            <p className="text-sm text-gray-600">contato@svlentes.com.br</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Endereço</p>
                                            <p className="text-sm text-gray-600">Av. Brasil, 1234 - Centro</p>
                                            <p className="text-sm text-gray-600">Vitória da Conquista, MG</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                                    Importante
                                </h3>
                                <p className="text-sm text-yellow-700">
                                    Guarde este email ou faça print screen para futuras referências.
                                    Seu número da assinatura será enviado por email.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="text-center space-y-4">
                    <Button
                        asChild
                        size="lg"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4"
                    >
                        <Link href="/">
                            Voltar para Página Inicial
                        </Link>
                    </Button>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="px-6 py-3"
                        >
                            <Link href="/calculadora">
                                Calcular Economia
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="px-6 py-3"
                        >
                            <Link href="/lentes-diarias">
                                Ver Lentes Diárias
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        O que nossos clientes dizem
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 2.5 0 .478-.548.785-.948.785-1.051 0-1.639-.428-2.5-1.074-2.828-2.828-.478-.548-.785-.948-.785-1.051 0-1.639.428-2.5 1.074-2.828 2.828zm10.602 0c.478-.548.785-.948.785-1.051 0-1.639-.428-2.5-1.074-2.828-2.828-.478-.548-.785-.948-.785-1.051 0-1.639.428-2.5 1.074-2.828 2.828z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 italic mb-2">
                                "A economia é incrível e a conveniência de receber em casa é imbatível."
                            </p>
                            <p className="text-gray-900 font-medium">- Maria S.</p>
                            <p className="text-gray-500 text-sm">Assinante Premium</p>
                        </div>

                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 2.5 0 .478-.548.785-.948.785-1.051 0-1.639-.428-2.5-1.074-2.828-2.828-.478-.548-.785-.948-.785-1.051 0-1.639.428-2.5 1.074-2.828 2.828zm10.602 0c.478-.548.785-.948.785-1.051 0-1.639-.428-2.5-1.074-2.828-2.828-.478-.548-.785-.948-.785-1.051 0-1.639.428-2.5 1.074-2.828 2.828z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 italic mb-2">
                                "O acompanhamento do Dr. Philipe faz toda a diferença. Sinto que posso confiar minha visão."
                            </p>
                            <p className="text-gray-900 font-medium">- João P.</p>
                            <p className="text-gray-500 text-sm">Assinante VIP</p>
                        </div>

                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 2.5 0 .478-.548.785-.948.785-1.051 0-1.639-.428-2.5-1.074-2.828-2.828-.478-.548-.785-.948-.785-1.051 0-1.639.428-2.5 1.074-2.828 2.828zm10.602 0c.478-.548.785-.948.785-1.051 0-1.639-.428-2.5-1.074-2.828-2.828-.478-.548-.785-.948-.785-1.051 0-1.639.428-2.5 1.074-2.828 2.828z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 italic mb-2">
                                "As lentes diárias são muito confortáveis e a qualidade é excelente. Recomendo!"
                            </p>
                            <p className="text-gray-900 font-medium">- Ana C.</p>
                            <p className="text-gray-500 text-sm">Assinante Básico</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-gray-500 text-sm">
                    <p>© 2024 SV Lentes. Todos os direitos reservados.</p>
                    <p className="mt-2">
                        CRM: Dr. Philipe Saraiva Cruz | CNPJ: XX.XXX.XXX/XXXX-XX
                    </p>
                </div>
            </div>
        </div>
    )
}
