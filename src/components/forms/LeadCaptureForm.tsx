'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { leadFormSchema, type LeadFormData, formatPhone } from '@/lib/validations'
import { openWhatsAppWithContext } from '@/lib/whatsapp'
import { trackEvent } from '@/lib/analytics'
import { trackLeadCapture } from '@/lib/conversion-tracking'
import { MarketingOptIn } from '@/components/privacy/MarketingOptIn'
import { setMarketingConsent } from '@/lib/privacy'
import { Calculator, Phone, MessageCircle, Shield, CheckCircle } from 'lucide-react'

interface LeadCaptureFormProps {
    variant?: 'hero' | 'calculator' | 'inline'
    onSubmit?: (data: LeadFormData) => void
    className?: string
}

export function LeadCaptureForm({
    variant = 'hero',
    onSubmit,
    className = ''
}: LeadCaptureFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [marketingOptIn, setMarketingOptIn] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm<LeadFormData>({
        resolver: zodResolver(leadFormSchema),
        defaultValues: {
            nome: '',
            whatsapp: '',
            email: '',
            lgpdConsent: false
        }
    })

    const watchedPhone = watch('whatsapp')

    // Formatar telefone em tempo real
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value)
        setValue('whatsapp', formatted)
    }

    const handleFormSubmit = async (data: LeadFormData) => {
        setIsSubmitting(true)

        try {
            // Simular envio (aqui você integraria com sua API)
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Save marketing consent
            if (marketingOptIn) {
                setMarketingConsent(true, {
                    email: true,
                    whatsapp: true,
                    sms: false
                })
            }

            // Callback personalizado se fornecido
            if (onSubmit) {
                onSubmit(data)
            } else {
                // Comportamento padrão: redirecionar para WhatsApp
                openWhatsAppWithContext('hero', {
                    page: 'landing-page',
                    section: 'lead-form',
                    userInfo: {
                        nome: data.nome,
                        email: data.email,
                        whatsapp: data.whatsapp
                    }
                })
            }

            setIsSubmitted(true)

            // Analytics tracking
            trackLeadCapture({
                nome: data.nome,
                email: data.email,
                whatsapp: data.whatsapp,
                source: variant || 'hero_form',
                marketingOptIn
            })

        } catch (error) {
            console.error('Erro ao enviar formulário:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCalculateEconomy = () => {
        const formData = watch()
        if (formData.nome && formData.whatsapp && formData.email && formData.lgpdConsent) {
            // Se o formulário está preenchido, prosseguir para calculadora
            onSubmit?.(formData as LeadFormData)
        } else {
            // Focar no primeiro campo vazio
            const firstEmptyField = document.querySelector('input:invalid') as HTMLInputElement
            firstEmptyField?.focus()
        }
    }

    if (isSubmitted) {
        return (
            <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Obrigado pelo interesse!
                </h3>
                <p className="text-green-700 mb-4">
                    Em breve entraremos em contato via WhatsApp para agendar sua consulta.
                </p>
                <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    size="sm"
                >
                    Enviar outro formulário
                </Button>
            </div>
        )
    }

    if (variant === 'inline') {
        return (
            <form onSubmit={handleSubmit(handleFormSubmit)} className={`space-y-4 ${className}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        {...register('nome')}
                        placeholder="Seu nome"
                        error={errors.nome?.message}
                    />
                    <Input
                        {...register('whatsapp')}
                        placeholder="WhatsApp"
                        onChange={handlePhoneChange}
                        error={errors.whatsapp?.message}
                    />
                    <Input
                        {...register('email')}
                        type="email"
                        placeholder="Seu email"
                        error={errors.email?.message}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Checkbox
                        {...register('lgpdConsent')}
                        error={errors.lgpdConsent?.message}
                    >
                        <span className="text-xs text-gray-600">
                            Aceito receber contato e concordo com a{' '}
                            <a href="/politica-privacidade" className="text-primary-600 hover:underline">
                                política de privacidade
                            </a>
                        </span>
                    </Checkbox>

                    <Button
                        type="submit"
                        loading={isSubmitting}
                        disabled={!watch('lgpdConsent')}
                        className="flex items-center space-x-2"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Enviar</span>
                    </Button>
                </div>
            </form>
        )
    }

    return (
        <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}>
            <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calculator className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Calcule sua Economia
                </h3>
                <p className="text-sm text-gray-600">
                    Descubra quanto você pode economizar com nossa assinatura
                </p>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <Input
                    {...register('nome')}
                    label="Nome completo"
                    placeholder="Digite seu nome"
                    error={errors.nome?.message}
                    required
                />

                <Input
                    {...register('whatsapp')}
                    label="WhatsApp"
                    placeholder="(11) 99999-9999"
                    onChange={handlePhoneChange}
                    error={errors.whatsapp?.message}
                    helperText="Usaremos para enviar o resultado da calculadora"
                    required
                />

                <Input
                    {...register('email')}
                    type="email"
                    label="Email"
                    placeholder="seu@email.com"
                    error={errors.email?.message}
                    required
                />

                <Checkbox
                    {...register('lgpdConsent')}
                    error={errors.lgpdConsent?.message}
                    required
                >
                    <span className="text-sm text-gray-700">
                        Aceito receber contato sobre o serviço LAAS e concordo com a{' '}
                        <a
                            href="/politica-privacidade"
                            className="text-primary-600 hover:underline"
                            target="_blank"
                        >
                            política de privacidade
                        </a>
                    </span>
                </Checkbox>

                <MarketingOptIn
                    onOptInChange={setMarketingOptIn}
                    className="pt-2 border-t border-gray-100"
                />

                <div className="space-y-3">
                    <Button
                        onClick={handleCalculateEconomy}
                        type="button"
                        className="w-full flex items-center justify-center space-x-2"
                        disabled={!watch('lgpdConsent')}
                    >
                        <Calculator className="w-4 h-4" />
                        <span>Calcular Economia</span>
                    </Button>

                    <div className="text-center">
                        <span className="text-sm text-gray-500">ou</span>
                    </div>

                    <Button
                        type="submit"
                        variant="outline"
                        loading={isSubmitting}
                        disabled={!watch('lgpdConsent')}
                        className="w-full flex items-center justify-center space-x-2"
                    >
                        <Phone className="w-4 h-4" />
                        <span>Agendar Consulta Direta</span>
                    </Button>
                </div>

                {/* Trust indicators */}
                <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Shield className="w-3 h-3" />
                            <span>100% Seguro</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Sem Compromisso</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}