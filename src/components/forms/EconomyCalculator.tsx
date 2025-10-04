'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectOption } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { calculatorSchema, type CalculatorData } from '@/lib/validations'
import { trackEvent } from '@/lib/analytics'
import { trackCalculatorUsage } from '@/lib/conversion-tracking'
import { calculateEconomy, formatEconomyResults, type EconomyCalculationResult } from '@/lib/economy-calculator'
import { openWhatsAppWithContext } from '@/lib/whatsapp'
import { formatCurrency } from '@/lib/utils'
import {
    Calculator,
    TrendingDown,
    DollarSign,
    Calendar,
    CheckCircle,
    ArrowRight,
    Sparkles,
    Target,
    MessageCircle,
    Phone
} from 'lucide-react'

interface EconomyCalculatorProps {
    variant?: 'full' | 'compact' | 'embedded'
    initialData?: Partial<CalculatorData>
    onCalculate?: (data: CalculatorData, result: EconomyCalculationResult) => void
    className?: string
}

export function EconomyCalculator({
    variant = 'full',
    initialData,
    onCalculate,
    className = ''
}: EconomyCalculatorProps) {
    const [result, setResult] = useState<EconomyCalculationResult | null>(null)
    const [isCalculating, setIsCalculating] = useState(false)

    const lensTypeOptions: SelectOption[] = [
        {
            value: 'daily',
            label: 'Lentes Diárias',
            description: 'Uso único, máxima higiene'
        },
        {
            value: 'weekly',
            label: 'Lentes Semanais',
            description: 'Duração de 1 semana'
        },
        {
            value: 'monthly',
            label: 'Lentes Mensais',
            description: 'Duração de 1 mês'
        }
    ]

    const usageOptions: SelectOption[] = [
        {
            value: 'occasional',
            label: 'Uso Ocasional',
            description: '~10 dias por mês'
        },
        {
            value: 'regular',
            label: 'Uso Regular',
            description: '~20 dias por mês'
        },
        {
            value: 'daily',
            label: 'Uso Diário',
            description: 'Todos os dias'
        }
    ]

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm<CalculatorData>({
        resolver: zodResolver(calculatorSchema),
        defaultValues: {
            nome: initialData?.nome || '',
            whatsapp: initialData?.whatsapp || '',
            email: initialData?.email || '',
            lgpdConsent: initialData?.lgpdConsent || false,
            currentSpending: initialData?.currentSpending || 0,
            lensType: initialData?.lensType || 'monthly',
            usage: initialData?.usage || 'regular'
        }
    })

    const handleCalculate = async (data: CalculatorData) => {
        setIsCalculating(true)

        try {
            // Simular processamento
            await new Promise(resolve => setTimeout(resolve, 1000))

            const calculationResult = calculateEconomy({
                lensType: data.lensType,
                usage: data.usage,
                currentSpending: data.currentSpending || undefined
            })

            setResult(calculationResult)

            // Callback personalizado
            onCalculate?.(data, calculationResult)

            // Analytics tracking
            trackCalculatorUsage({
                currentSpending: data.currentSpending,
                lensType: data.lensType,
                usage: data.usage,
                economyCalculated: calculationResult.annualSavings,
            })

        } catch (error) {
            console.error('Erro no cálculo:', error)
        } finally {
            setIsCalculating(false)
        }
    }

    const handleWhatsAppContact = () => {
        const formData = watch()
        openWhatsAppWithContext('calculator', {
            page: 'landing-page',
            section: 'economy-calculator',
            calculatedEconomy: result?.annualSavings,
            planInterest: result?.recommendedPlan.name,
            userInfo: {
                nome: formData.nome,
                email: formData.email,
                whatsapp: formData.whatsapp
            }
        })
    }

    const handleScheduleConsultation = () => {
        const formData = watch()
        openWhatsAppWithContext('consultation', {
            page: 'landing-page',
            section: 'economy-calculator-consultation',
            calculatedEconomy: result?.annualSavings,
            planInterest: result?.recommendedPlan.name,
            userInfo: {
                nome: formData.nome,
                email: formData.email,
                whatsapp: formData.whatsapp
            }
        })
    }

    if (variant === 'compact' && result) {
        return (
            <div className={`bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 ${className}`}>
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingDown className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                        Você pode economizar
                    </h3>
                    <div className="text-3xl font-bold text-green-600 mb-4">
                        {formatCurrency(result.annualSavings)} por ano
                    </div>
                    <Button
                        onClick={handleWhatsAppContact}
                        variant="whatsapp"
                        className="w-full"
                    >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Quero Economizar Agora
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
                <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calculator className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Calculadora de Economia</h2>
                    <p className="text-primary-100">
                        Descubra quanto você pode economizar com nossa assinatura
                    </p>
                </div>
            </div>

            <div className="p-6">
                {!result ? (
                    /* Formulário de Cálculo */
                    <form onSubmit={handleSubmit(handleCalculate)} className="space-y-6">

                        {/* Dados Pessoais */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Target className="w-5 h-5 mr-2 text-primary-600" />
                                Seus Dados
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    {...register('nome')}
                                    label="Nome"
                                    placeholder="Seu nome"
                                    error={errors.nome?.message}
                                    required
                                />

                                <Input
                                    {...register('whatsapp')}
                                    label="WhatsApp"
                                    placeholder="(11) 99999-9999"
                                    error={errors.whatsapp?.message}
                                    required
                                />
                            </div>

                            <Input
                                {...register('email')}
                                type="email"
                                label="Email"
                                placeholder="seu@email.com"
                                error={errors.email?.message}
                                required
                            />
                        </div>

                        {/* Configurações das Lentes */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Sparkles className="w-5 h-5 mr-2 text-primary-600" />
                                Suas Lentes Atuais
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    {...register('lensType')}
                                    label="Tipo de Lente"
                                    options={lensTypeOptions}
                                    error={errors.lensType?.message}
                                    required
                                />

                                <Select
                                    {...register('usage')}
                                    label="Frequência de Uso"
                                    options={usageOptions}
                                    error={errors.usage?.message}
                                    required
                                />
                            </div>

                            <Input
                                {...register('currentSpending', { valueAsNumber: true })}
                                type="number"
                                label="Gasto Mensal Atual (opcional)"
                                placeholder="Ex: 150"
                                error={errors.currentSpending?.message}
                                helperText="Se souber quanto gasta por mês, isso tornará o cálculo mais preciso"
                            />
                        </div>

                        {/* LGPD */}
                        <div className="pt-4 border-t border-gray-200">
                            <label className="flex items-start space-x-3">
                                <input
                                    {...register('lgpdConsent')}
                                    type="checkbox"
                                    className="mt-1"
                                    required
                                />
                                <span className="text-sm text-gray-700">
                                    Aceito receber o resultado por WhatsApp e concordo com a{' '}
                                    <a href="/politica-privacidade" className="text-primary-600 hover:underline">
                                        política de privacidade
                                    </a>
                                </span>
                            </label>
                            {errors.lgpdConsent && (
                                <p className="text-sm text-red-600 mt-1">{errors.lgpdConsent.message}</p>
                            )}
                        </div>

                        {/* Botão de Cálculo */}
                        <Button
                            type="submit"
                            loading={isCalculating}
                            disabled={!watch('lgpdConsent')}
                            className="w-full flex items-center justify-center space-x-2 text-lg py-4"
                        >
                            <Calculator className="w-5 h-5" />
                            <span>Calcular Minha Economia</span>
                        </Button>
                    </form>
                ) : (
                    /* Resultado do Cálculo */
                    <div className="space-y-6">

                        {/* Resultado Principal */}
                        <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingDown className="w-10 h-10 text-green-600" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Sua Economia Anual
                            </h3>

                            <div className="text-4xl font-bold text-green-600 mb-4">
                                {formatCurrency(result.annualSavings)}
                            </div>

                            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span>{result.savingsPercentage.toFixed(0)}% de economia</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatCurrency(result.monthlySavings)}/mês</span>
                                </div>
                            </div>
                        </div>

                        {/* Comparação */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h4 className="font-semibold text-red-800 mb-2">Comprando Avulso</h4>
                                <div className="text-2xl font-bold text-red-600">
                                    {formatCurrency(result.currentAnnualCost)}/ano
                                </div>
                                <p className="text-sm text-red-700">
                                    {formatCurrency(result.currentMonthlyCost)}/mês
                                </p>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-semibold text-green-800 mb-2">Com LAAS</h4>
                                <div className="text-2xl font-bold text-green-600">
                                    {formatCurrency(result.subscriptionAnnualCost)}/ano
                                </div>
                                <p className="text-sm text-green-700">
                                    {formatCurrency(result.subscriptionMonthlyCost)}/mês
                                </p>
                            </div>
                        </div>

                        {/* Plano Recomendado */}
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                            <h4 className="font-semibold text-primary-800 mb-3 flex items-center">
                                <Target className="w-5 h-5 mr-2" />
                                Plano Recomendado para Você
                            </h4>

                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h5 className="text-lg font-bold text-primary-900">
                                        {result.recommendedPlan.name}
                                    </h5>
                                    <p className="text-primary-700">
                                        {formatCurrency(result.recommendedPlan.price)}/mês
                                    </p>
                                </div>
                                <Badge variant="success" size="lg">
                                    Recomendado
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                {result.additionalBenefits.slice(0, 4).map((benefit, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm text-primary-700">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleScheduleConsultation}
                                className="w-full flex items-center justify-center space-x-2 text-lg py-4"
                            >
                                <Phone className="w-5 h-5" />
                                <span>Agendar Consulta Gratuita</span>
                                <ArrowRight className="w-5 h-5" />
                            </Button>

                            <Button
                                onClick={handleWhatsAppContact}
                                variant="whatsapp"
                                className="w-full flex items-center justify-center space-x-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>Conversar no WhatsApp</span>
                            </Button>

                            <Button
                                onClick={() => setResult(null)}
                                variant="outline"
                                className="w-full"
                            >
                                Calcular Novamente
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}