'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Phone, Mail, User, CheckCircle, Shield, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ConversionFormProps {
    onBack: () => void
}

interface FormData {
    nome: string
    telefone: string
    email: string
}

export function ConversionForm({ onBack }: ConversionFormProps) {
    const [formData, setFormData] = useState<FormData>({
        nome: '',
        telefone: '',
        email: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const router = useRouter()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const formatPhoneNumber = (value: string) => {
        // Remove todos os caracteres não numéricos
        const cleaned = value.replace(/\D/g, '')

        // Aplica a máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
        if (cleaned.length <= 11) {
            if (cleaned.length <= 10) {
                return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '')
            } else {
                return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '')
            }
        }
        return value
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value)
        setFormData(prev => ({
            ...prev,
            telefone: formatted
        }))
    }

    const validateForm = (): boolean => {
        // Validação simplificada para alta conversão
        if (!formData.nome.trim() || formData.nome.length < 3) {
            return false
        }

        if (!formData.telefone.trim() || formData.telefone.replace(/\D/g, '').length < 10) {
            return false
        }

        // Email é opcional para reduzir fricção, mas se preenchido deve ser válido
        if (formData.email && formData.email.includes('@')) {
            return true
        }

        return !formData.email // Permite continuar se email estiver vazio
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            // Simulação de envio para API
            const response = await fetch('/api/lead-capture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    source: 'landing-conversao',
                    timestamp: new Date().toISOString()
                })
            })

            if (response.ok) {
                setIsSubmitted(true)

                // Redirecionar para WhatsApp após 2 segundos
                setTimeout(() => {
                    const message = `Olá! Meu nome é ${formData.nome} e acabei de preencher o formulário no site SV Lentes. Gostaria de agendar minha consulta para iniciar a assinatura de lentes. Meu telefone: ${formData.telefone}`
                    const whatsappLink = `https://wa.me/5533998601427?text=${encodeURIComponent(message)}`
                    window.open(whatsappLink, '_blank')
                }, 2000)
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitted) {
        return (
            <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden min-h-screen flex items-center">
                <div className="container-custom">
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <div className="mb-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                almost there!
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Seus dados foram recebidos com sucesso. Redirecionando para o WhatsApp em segundos...
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
                            <div className="flex items-center justify-center mb-6">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                            <p className="text-gray-600">
                                Aguarde enquanto conectamos você com nosso especialista...
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden min-h-screen">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container-custom relative">
                <div className="max-w-2xl mx-auto py-16">

                    {/* Botão Voltar */}
                    <button
                        onClick={onBack}
                        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mb-8"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Voltar</span>
                    </button>

                    {/* Formulário de Conversão */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">

                        {/* Header do Formulário */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                                <Phone className="w-8 h-8 text-primary-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Último Passo para Transformar Sua Visão
                            </h2>
                            <p className="text-lg text-gray-600">
                                Preencha seus dados e nosso especialista entrará em contato imediatamente
                            </p>
                        </div>

                        {/* Elementos de Confiança */}
                        <div className="flex items-center justify-center space-x-6 mb-8">
                            <div className="flex items-center space-x-1">
                                <Shield className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-600">Dados Seguros</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm text-gray-600">4.9/5 Avaliação</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-600">Atendimento Imediato</span>
                            </div>
                        </div>

                        {/* Formulário Simplificado - 3 Campos Essenciais */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                                    Seu nome completo *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleInputChange}
                                        className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                                        placeholder="Como gostaria de ser chamado"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Seu WhatsApp *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="telefone"
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handlePhoneChange}
                                        className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                                        placeholder="(00) 00000-0000"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Seu e-mail (opcional)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Opcional: usamos apenas para enviar confirmações
                                </p>
                            </div>

                            {/* Gatilho de Urgência */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-yellow-800">
                                        ⚠️ Últimas 10 vagas disponíveis este mês
                                    </span>
                                </div>
                            </div>

                            {/* CTA Principal */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !validateForm()}
                                className="w-full relative group"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold py-6 px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                            <span>Processando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Phone className="w-6 h-6" />
                                            <span>QUERO FALAR COM ESPECIALISTA AGORA</span>
                                        </>
                                    )}
                                </div>
                            </button>

                            {/* Garantias */}
                            <div className="text-center space-y-2">
                                <p className="text-sm text-gray-600">
                                    🛡️ 100% Gratuito • Sem compromisso • Atendimento imediato
                                </p>
                                <p className="text-xs text-gray-500">
                                    Ao clicar, você concorda em ser contatado via WhatsApp
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
