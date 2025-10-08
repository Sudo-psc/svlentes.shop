'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { ArrowLeft, Phone, CheckCircle, Shield, AlertCircle } from 'lucide-react'

interface SDDConversionFormProps {
    onBack: () => void
}

export function SDDConversionForm({ onBack }: SDDConversionFormProps) {
    const [whatsapp, setWhatsapp] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState('')

    const validateWhatsApp = (value: string) => {
        const cleanValue = value.replace(/\D/g, '')
        return cleanValue.length >= 10 && cleanValue.length <= 11
    }

    const formatWhatsApp = (value: string) => {
        const cleanValue = value.replace(/\D/g, '')

        if (cleanValue.length <= 2) {
            return `(${cleanValue}`
        } else if (cleanValue.length <= 7) {
            return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`
        } else if (cleanValue.length <= 11) {
            return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7)}`
        }

        return value
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!validateWhatsApp(whatsapp)) {
            setError('Por favor, informe um WhatsApp válido')
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
                    whatsapp: whatsapp.replace(/\D/g, ''),
                    source: 'sdd-hero-form',
                    plan: undefined, // Será definido no próximo passo
                }),
            })

            if (response.ok) {
                setIsSubmitted(true)
                // Redirecionar para checkout ou WhatsApp após 2 segundos
                setTimeout(() => {
                    window.location.href = `https://wa.me/5533998601427?text=Olá! Tenho interesse na assinatura de lentes. Meu WhatsApp: ${whatsapp}`
                }, 2000)
            } else {
                throw new Error('Erro ao processar sua solicitação')
            }
        } catch (err) {
            setError('Ocorreu um erro. Tente novamente ou ligue diretamente: (33) 99860-1427')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatWhatsApp(e.target.value)
        setWhatsapp(formattedValue)
        setError('')
    }

    if (isSubmitted) {
        return (
            <section className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto py-16 lg:py-24 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            <span className="text-green-600">Perfeito!</span> Estamos te redirecionando...
                        </h2>

                        <p className="text-xl text-gray-600 mb-8">
                            Em 2 segundos você vai conversar diretamente com nossa equipe via WhatsApp para finalizar sua assinatura.
                        </p>

                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <Phone className="w-6 h-6 text-green-600" />
                                <span className="font-semibold text-gray-900">WhatsApp:</span>
                                <span className="text-gray-700">(33) 99860-1427</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Dr. Philipe Saraiva Cruz - CRM-MG 69.870
                            </p>
                        </div>

                        <div className="mt-8">
                            <Button
                                variant="outline"
                                onClick={() => window.location.href = `https://wa.me/5533998601427?text=Olá! Tenho interesse na assinatura de lentes. Meu WhatsApp: ${whatsapp}`}
                                className="flex items-center space-x-2 mx-auto"
                            >
                                <Phone className="w-4 h-4" />
                                <span>Abrir WhatsApp Agora</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
            <div className="container-custom">
                <div className="max-w-2xl mx-auto py-16 lg:py-24">

                    {/* Botão Voltar */}
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="mb-8 flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                    </Button>

                    {/* Header do Formulário */}
                    <div className="text-center mb-12">
                        <Badge
                            variant="success"
                            size="lg"
                            className="mb-6 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            100% Gratuito e Sem Compromisso
                        </Badge>

                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Qual seu WhatsApp?
                        </h2>

                        <p className="text-xl text-gray-600 mb-4">
                            Receba sua proposta personalizada em <span className="font-semibold text-green-600">menos de 1 minuto</span>
                        </p>

                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <AlertCircle className="w-4 h-4" />
                            <span>Vamos te ligar ou enviar mensagem no WhatsApp</span>
                        </div>
                    </div>

                    {/* Formulário Minimalista */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <label htmlFor="whatsapp" className="block text-lg font-semibold text-gray-900 mb-4">
                                Seu melhor WhatsApp
                            </label>

                            <Input
                                id="whatsapp"
                                type="tel"
                                value={whatsapp}
                                onChange={handleWhatsAppChange}
                                placeholder="(00) 00000-0000"
                                className="text-lg py-4 px-6 text-center"
                                maxLength={15}
                                required
                                aria-label="Seu número de WhatsApp"
                            />

                            {error && (
                                <div className="mt-4 flex items-center space-x-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Gatilhos de Confiança */}
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center space-x-3 text-sm text-gray-600">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <span>Sem spam, apenas sua proposta personalizada</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-gray-600">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <span>Atendimento médico especializado</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-gray-600">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <span>Cancelamento a qualquer momento</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Principal */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !validateWhatsApp(whatsapp)}
                                variant="cta"
                                size="xl"
                                className="relative w-full flex items-center justify-center space-x-3 text-lg py-6"
                                aria-label="Receber minha proposta agora"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Processando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Phone className="w-6 h-6" />
                                        <span className="font-bold">RECEBER MINHA PROPOSTA AGORA</span>
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Informações de Segurança */}
                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <Shield className="w-4 h-4" />
                                    <span>LGPD Compliant</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Shield className="w-4 h-4" />
                                    <span>SSL Seguro</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Shield className="w-4 h-4" />
                                    <span>CRM-MG 69.870</span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-400">
                                Ao informar seu WhatsApp, você concorda com nossa{' '}
                                <a href="/politica-privacidade" className="text-blue-600 hover:underline">
                                    Política de Privacidade
                                </a>{' '}
                                e{' '}
                                <a href="/termos-uso" className="text-blue-600 hover:underline">
                                    Termos de Uso
                                </a>
                            </p>
                        </div>
                    </form>

                    {/* Contato Direto */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-600 mb-4">
                            Prefere falar diretamente agora?
                        </p>
                        <a
                            href="tel:+5533998601427"
                            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            (33) 99860-1427
                        </a>
                        <p className="text-sm text-gray-500 mt-2">
                            Dr. Philipe Saraiva Cruz - CRM-MG 69.870
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
