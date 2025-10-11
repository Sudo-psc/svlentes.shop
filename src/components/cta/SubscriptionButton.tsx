'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CreditCard, QrCode, FileText, Loader2, Check } from 'lucide-react'
import { SubscriptionFlow } from '@/components/subscription/SubscriptionFlow'

interface SubscriptionButtonProps {
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'lg' | 'default' | 'xl'
    className?: string
    text?: string
    planId?: string
    billingCycle?: 'monthly' | 'annual'
}

export function SubscriptionButton({
    variant = 'primary',
    size = 'lg',
    className = '',
    text = 'Assinar Agora',
    planId,
    billingCycle = 'monthly',
    ...props
}: SubscriptionButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleOpen = () => {
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false)
        setIsSubmitting(false)
    }

    const handleSubscribe = async (data: any) => {
        setIsSubmitting(true)

        // Simular processamento
        await new Promise(resolve => setTimeout(resolve, 2000))

        setIsSubmitting(false)
        setIsOpen(false)

        // Navegar para página de sucesso sem reload
        router.push('/assinatura-sucesso')
    }

    const getIcon = () => {
        if (billingCycle === 'monthly') {
            return <CreditCard className="w-4 h-4" />
        }
        return <QrCode className="w-4 h-4" />
    }

    const getBillingTypeText = () => {
        if (billingCycle === 'monthly') {
            return 'Cartão de Crédito'
        }
        return 'PIX ou Boleto'
    }

    return (
        <>
            <Button
                onClick={handleOpen}
                variant={variant}
                size={size}
                className={`font-semibold ${className}`}
                {...props}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                    </>
                ) : (
                    <>
                        {getIcon()}
                        <span className="ml-2">{text}</span>
                    </>
                )}
            </Button>

            {/* Modal de Assinatura */}
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={handleClose}
                        />

                        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 rounded-t-lg">
                                <div className="flex items-center justify-between">
                                    <div className="text-white">
                                        <h3 className="text-lg font-semibold">Assinar Plano</h3>
                                        <p className="text-sm text-primary-100">
                                            {billingCycle === 'monthly' ? 'Cobrança mensal' : 'Pagamento à vista'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <SubscriptionFlow
                                    onConfirm={handleSubscribe}
                                    onBack={handleClose}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// Botão simplificado para uso rápido
export function QuickSubscriptionButton({
    variant = 'primary' as const,
    size = 'lg' as const,
    className = '',
    text = 'Assinar Agora',
    planId,
    billingCycle = 'monthly',
    onClick
}: SubscriptionButtonProps & {
    onClick?: () => void
}) {
    return (
        <Button
            onClick={onClick}
            variant={variant}
            size={size}
            className={`font-semibold ${className}`}
        >
            <CreditCard className="w-4 h-4 mr-2" />
            <span>{text}</span>
        </Button>
    )
}

// Botão para assinatura anual com destaque
export function AnnualSubscriptionButton({
    variant = 'secondary',
    size = 'lg',
    className = '',
    text = 'Assinar Anual e Economize 10%',
    planId,
    onClick
}: SubscriptionButtonProps & {
    onClick?: () => void
}) {
    return (
        <Button
            onClick={onClick}
            variant={variant}
            size={size}
            className={`font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 ${className}`}
        >
            <FileText className="w-4 h-4 mr-2" />
            <span>{text}</span>
        </Button>
    )
}

// Botão inline para uso em cards
export function InlineSubscriptionButton({
    variant = 'outline' as const,
    size = 'sm' as const,
    className = '',
    text = 'Assinar',
    planId,
    billingCycle = 'monthly',
    onClick
}: SubscriptionButtonProps & {
    onClick?: () => void
}) {
    return (
        <Button
            onClick={onClick}
            variant={variant}
            size={size}
            className={`font-medium ${className}`}
        >
            <CreditCard className="w-3 h-3 mr-1" />
            {text}
        </Button>
    )
}
