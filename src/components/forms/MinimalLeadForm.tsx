'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { formatPhone } from '@/lib/validations'
import { openWhatsAppWithContext } from '@/lib/whatsapp'
import { trackLeadCapture } from '@/lib/conversion-tracking'
import { Phone, Shield, CheckCircle } from 'lucide-react'

// Schema minimalista - apenas WhatsApp + LGPD
const minimalLeadSchema = z.object({
    whatsapp: z.string()
        .min(14, 'WhatsApp inválido')
        .max(15, 'WhatsApp inválido')
        .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Formato: (11) 99999-9999'),
    lgpdConsent: z.boolean().refine(val => val === true, {
        message: 'Você precisa aceitar para continuar'
    })
})

type MinimalLeadData = z.infer<typeof minimalLeadSchema>

interface MinimalLeadFormProps {
    variant?: 'hero' | 'inline' | 'popup'
    onSubmit?: (data: MinimalLeadData) => void
    className?: string
    ctaText?: string
}

export function MinimalLeadForm({
    variant = 'hero',
    onSubmit,
    className = '',
    ctaText = 'Agendar Consulta Grátis'
}: MinimalLeadFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm<MinimalLeadData>({
        resolver: zodResolver(minimalLeadSchema),
        defaultValues: {
            whatsapp: '',
            lgpdConsent: false
        }
    })

    // Formatar telefone em tempo real
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value)
        setValue('whatsapp', formatted)
    }

    const handleFormSubmit = async (data: MinimalLeadData) => {
        setIsSubmitting(true)

        try {
            // Simular envio
            await new Promise(resolve => setTimeout(resolve, 500))

            // Callback personalizado se fornecido
            if (onSubmit) {
                onSubmit(data)
            } else {
                // Comportamento padrão: redirecionar para WhatsApp
                openWhatsAppWithContext('consultation', {
                    page: 'landing-page',
                    section: 'minimal-lead-form',
                    userInfo: {
                        whatsapp: data.whatsapp
                    }
                })
            }

            setIsSubmitted(true)

            // Analytics tracking
            trackLeadCapture({
                nome: 'Lead Minimal Form', // Nome será coletado no WhatsApp
                email: 'pending@svlentes.com', // Email será coletado no WhatsApp
                whatsapp: data.whatsapp,
                source: `minimal_form_${variant}`
            })

        } catch (error) {
            console.error('Erro ao enviar formulário:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className={`bg-green-50 border border-green-200 rounded-xl p-6 text-center ${className}`}>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Perfeito! Vamos conversar no WhatsApp
                </h3>
                <p className="text-green-700 text-sm">
                    Você será redirecionado em instantes...
                </p>
            </div>
        )
    }

    // Variante inline (mais compacta)
    if (variant === 'inline') {
        return (
            <form onSubmit={handleSubmit(handleFormSubmit)} className={`space-y-3 ${className}`}>
                <Input
                    {...register('whatsapp')}
                    placeholder="(11) 99999-9999"
                    onChange={handlePhoneChange}
                    error={errors.whatsapp?.message}
                    className="text-center"
                />

                <Checkbox
                    {...register('lgpdConsent')}
                    error={errors.lgpdConsent?.message}
                >
                    <span className="text-xs text-gray-600">
                        Aceito receber contato via WhatsApp e concordo com a{' '}
                        <a href="/politica-privacidade" className="text-primary-600 hover:underline" target="_blank">
                            política de privacidade
                        </a>
                    </span>
                </Checkbox>

                <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!watch('lgpdConsent')}
                    className="w-full"
                    size="lg"
                >
                    <Phone className="w-5 h-5 mr-2" />
                    {ctaText}
                </Button>
            </form>
        )
    }

    // Variante hero (padrão)
    return (
        <div className={`bg-white rounded-2xl shadow-xl border border-gray-200 p-6 lg:p-8 ${className}`}>
            <div className="text-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Agende sua Consulta Grátis
                </h3>
                <p className="text-sm text-gray-600">
                    Informe seu WhatsApp e entraremos em contato
                </p>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div>
                    <Input
                        {...register('whatsapp')}
                        id="minimal-whatsapp"
                        label="Seu WhatsApp"
                        placeholder="(11) 99999-9999"
                        onChange={handlePhoneChange}
                        error={errors.whatsapp?.message}
                        required
                        className="text-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Responderemos em até 5 minutos
                    </p>
                </div>

                <Checkbox
                    {...register('lgpdConsent')}
                    id="minimal-lgpd-consent"
                    error={errors.lgpdConsent?.message}
                    required
                >
                    <span className="text-sm text-gray-700 leading-relaxed">
                        Aceito receber contato sobre o serviço de assinatura de lentes e concordo com a{' '}
                        <a
                            href="/politica-privacidade"
                            className="text-primary-600 hover:text-primary-700 underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            política de privacidade
                        </a>
                    </span>
                </Checkbox>

                <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!watch('lgpdConsent')}
                    className="w-full text-lg font-bold"
                    size="xl"
                >
                    <Phone className="w-6 h-6 mr-2" />
                    {ctaText}
                </Button>

                {/* Trust indicators */}
                <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-6 text-xs">
                        <div className="flex items-center space-x-1.5 text-green-700">
                            <Shield className="w-4 h-4" />
                            <span className="font-medium">100% Seguro</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-blue-700">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-medium">Sem Compromisso</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
