'use client'

import { Check, Edit2, ShoppingCart, Loader2, CreditCard, QrCode, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { pricingPlans } from '@/data/pricing-plans'
import { useState } from 'react'
import { asaasService } from '@/lib/asaas-service'
import { CreditCardForm } from '@/components/payment/CreditCardForm'
import { PixCheckout } from '@/components/payment/PixCheckout'

interface OrderSummaryProps {
    planId: string
    billingCycle: 'monthly' | 'annual'
    lensData: any
    addOns: string[]
    onBack: () => void
    onConfirm: (contactData: ContactData) => void
}

interface ContactData {
    name: string
    email: string
    phone: string
    cpfCnpj?: string
    billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD'
    acceptsTerms: boolean
    asaasCustomerId?: string
    asaasSubscriptionId?: string
    paymentData?: any
}

const addOnPrices: Record<string, { name: string; price: number }> = {
    solution: { name: 'Solução de Limpeza', price: 25 },
    drops: { name: 'Lágrimas Artificiais', price: 15 },
    case: { name: 'Estojo Premium', price: 10 },
    consultation: { name: 'Consultas Extras', price: 80 },
    insurance: { name: 'Seguro Premium', price: 20 },
    express: { name: 'Entrega Express', price: 30 }
}

export function OrderSummary({ planId, billingCycle, lensData, addOns, onBack, onConfirm }: OrderSummaryProps) {
    const [contactData, setContactData] = useState<ContactData>({
        name: '',
        email: '',
        phone: '',
        cpfCnpj: '',
        billingType: 'PIX',
        acceptsTerms: false
    })
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [paymentStep, setPaymentStep] = useState<'data' | 'payment'>('data')
    const [createdCustomer, setCreatedCustomer] = useState<any>(null)
    const [createdSubscription, setCreatedSubscription] = useState<any>(null)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'credit' | 'pix' | 'boleto'>('credit')

    const plan = pricingPlans.find(p => p.id === planId)
    if (!plan) return null

    const planPrice = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual / 12
    const addOnsTotal = addOns.reduce((sum, addOnId) => sum + (addOnPrices[addOnId]?.price || 0), 0)
    const monthlyTotal = planPrice + addOnsTotal
    const annualTotal = billingCycle === 'annual' ? plan.priceAnnual + (addOnsTotal * 12) : monthlyTotal * 12

    const isValid = contactData.name && contactData.email && contactData.phone && contactData.acceptsTerms

    const handleProceedToPayment = async () => {
        if (!isValid || isProcessing) return

        setIsProcessing(true)
        setError(null)

        try {
            // 1. Criar cliente no ASAAS
            const customer = await asaasService.createCustomer({
                name: contactData.name,
                email: contactData.email,
                mobilePhone: asaasService.formatPhone(contactData.phone),
                phone: asaasService.formatPhone(contactData.phone),
                cpfCnpj: '', // TODO: Adicionar campo CPF no formulário
                externalReference: `subscription_${Date.now()}_${planId}`
            })

            setCreatedCustomer(customer)
            setPaymentStep('payment')

        } catch (err) {
            console.error('Erro ao criar cliente:', err)
            setError(err instanceof Error ? err.message : 'Erro ao processar dados. Tente novamente.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleSubscriptionCreation = async () => {
        if (!createdCustomer || isProcessing) return

        setIsProcessing(true)
        setError(null)

        try {
            // 2. Criar assinatura no ASAAS
            const subscription = await asaasService.createSubscription({
                customer: createdCustomer.id,
                billingType: billingCycle === 'monthly' ? 'CREDIT_CARD' : selectedPaymentMethod.toUpperCase() as any,
                value: billingCycle === 'monthly' ? monthlyTotal : annualTotal,
                nextDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                cycle: billingCycle === 'monthly' ? 'MONTHLY' : 'YEARLY',
                description: `Assinatura ${plan.name} - SV Lentes`,
                externalReference: `subscription_${Date.now()}_${planId}`
            })

            setCreatedSubscription(subscription)
            console.log('Assinatura criada:', subscription.id)

        } catch (err) {
            console.error('Erro ao criar assinatura:', err)
            setError(err instanceof Error ? err.message : 'Erro ao criar assinatura. Tente novamente.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handlePaymentSuccess = (paymentData: any) => {
        onConfirm({
            ...contactData,
            asaasCustomerId: createdCustomer?.id,
            asaasSubscriptionId: createdSubscription?.id,
            paymentData
        })
    }

    const handlePaymentError = (errorMessage: string) => {
        setError(errorMessage)
    }

    const handleBackToData = () => {
        setPaymentStep('data')
        setCreatedCustomer(null)
        setCreatedSubscription(null)
        setError(null)
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Resumo do Pedido
                </h3>
                <p className="text-gray-600">
                    Revise os detalhes antes de finalizar
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Order Details */}
                <div className="space-y-6">
                    {/* Plan Details */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">Plano Selecionado</h4>
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-lg font-bold text-gray-900">{plan.name}</p>
                                <p className="text-sm text-gray-600">
                                    Cobrança {billingCycle === 'monthly' ? 'mensal' : 'anual'}
                                </p>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-gray-600">Valor mensal</span>
                                <span className="text-xl font-bold text-gray-900">
                                    R$ {planPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Lens Details */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">Especificações</h4>
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tipo de lente</span>
                                <span className="font-medium text-gray-900 capitalize">{lensData.type}</span>
                            </div>
                            {lensData.brand && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Marca</span>
                                    <span className="font-medium text-gray-900">{lensData.brand}</span>
                                </div>
                            )}
                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-gray-600 mb-1">Olho Direito (OD)</p>
                                <p className="font-medium text-gray-900">
                                    ESF: {lensData.rightEye.sphere || 'N/A'} |
                                    CIL: {lensData.rightEye.cylinder || 'N/A'} |
                                    EIXO: {lensData.rightEye.axis || 'N/A'}
                                </p>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-gray-600 mb-1">Olho Esquerdo (OE)</p>
                                <p className="font-medium text-gray-900">
                                    ESF: {lensData.leftEye.sphere || 'N/A'} |
                                    CIL: {lensData.leftEye.cylinder || 'N/A'} |
                                    EIXO: {lensData.leftEye.axis || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Add-ons */}
                    {addOns.length > 0 && (
                        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-gray-900">Serviços Adicionais</h4>
                                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {addOns.map(addOnId => {
                                    const addOn = addOnPrices[addOnId]
                                    if (!addOn) return null
                                    return (
                                        <div key={addOnId} className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <Check className="w-4 h-4 text-green-600" />
                                                <span className="text-sm text-gray-700">{addOn.name}</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                +R$ {addOn.price}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Contact Form & Total */}
                <div className="space-y-6">
                    {/* Contact Information */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Seus Dados</h4>
                        <div className="space-y-4">
                            <Input
                                label="Nome completo"
                                placeholder="João Silva"
                                value={contactData.name}
                                onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                            <Input
                                label="WhatsApp"
                                placeholder="(11) 99999-9999"
                                value={contactData.phone}
                                onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                                required
                            />
                            <Input
                                label="E-mail"
                                type="email"
                                placeholder="joao@email.com"
                                value={contactData.email}
                                onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                                required
                            />
                            <Input
                                label="CPF/CNPJ"
                                placeholder="000.000.000-00"
                                value={contactData.cpfCnpj}
                                onChange={(e) => setContactData(prev => ({ ...prev, cpfCnpj: e.target.value }))}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Forma de Pagamento
                                </label>
                                <select
                                    value={contactData.billingType}
                                    onChange={(e) => setContactData(prev => ({ ...prev, billingType: e.target.value as 'PIX' | 'BOLETO' | 'CREDIT_CARD' }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="PIX">PIX</option>
                                    <option value="BOLETO">Boleto Bancário</option>
                                    <option value="CREDIT_CARD">Cartão de Crédito</option>
                                </select>
                            </div>
                            <div className="pt-2">
                                <Checkbox
                                    id="accepts-terms"
                                    checked={contactData.acceptsTerms}
                                    onChange={(e) => setContactData(prev => ({ ...prev, acceptsTerms: e.target.checked }))}
                                    required
                                >
                                    <span className="text-sm text-gray-700">
                                        Aceito os{' '}
                                        <a href="/termos" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                            termos de uso
                                        </a>{' '}
                                        e{' '}
                                        <a href="/privacidade" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                            política de privacidade
                                        </a>
                                    </span>
                                </Checkbox>
                            </div>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
                        <h4 className="font-semibold mb-4">Resumo de Valores</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-primary-100">Plano {plan.name}</span>
                                <span>R$ {planPrice.toFixed(2)}</span>
                            </div>
                            {addOns.length > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-primary-100">Serviços adicionais</span>
                                    <span>R$ {addOnsTotal.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-primary-500">
                                <div className="flex justify-between items-baseline mb-2">
                                    <span className="text-lg font-semibold">Total mensal</span>
                                    <span className="text-3xl font-bold">R$ {monthlyTotal.toFixed(2)}</span>
                                </div>
                                {billingCycle === 'annual' && (
                                    <p className="text-sm text-primary-100">
                                        Cobrança anual de R$ {annualTotal.toFixed(2)}
                                    </p>
                                )}
                            </div>
                            <div className="bg-white/10 rounded-lg p-3 text-sm">
                                <p className="text-primary-100 mb-1">Economia estimada</p>
                                <p className="text-xl font-bold">
                                    ~R$ {(monthlyTotal * 0.35).toFixed(2)}/mês
                                </p>
                                <p className="text-xs text-primary-100 mt-1">
                                    vs compra avulsa tradicional
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    {paymentStep === 'payment' && (
                        <div className="space-y-6">
                            <h4 className="font-semibold text-gray-900">Forma de Pagamento</h4>

                            {billingCycle === 'monthly' ? (
                                /* Assinatura Mensal - Apenas Cartão de Crédito */
                                <div className="space-y-4">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <CreditCard className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-800">
                                                Assinatura Mensal
                                            </span>
                                        </div>
                                        <p className="text-xs text-blue-700">
                                            Cobrança recorrente mensal via cartão de crédito
                                        </p>
                                    </div>

                                    {!createdSubscription ? (
                                        <Button
                                            onClick={handleSubscriptionCreation}
                                            disabled={isProcessing}
                                            className="w-full"
                                            size="lg"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Criando Assinatura...
                                                </>
                                            ) : (
                                                'Criar Assinatura com Cartão'
                                            )}
                                        </Button>
                                    ) : (
                                        <CreditCardForm
                                            customerData={{
                                                name: contactData.name,
                                                email: contactData.email,
                                                cpfCnpj: '', // TODO: Adicionar campo CPF
                                                mobilePhone: contactData.phone
                                            }}
                                            amount={monthlyTotal}
                                            description={`Assinatura ${plan.name} - Mensal`}
                                            onPaymentSuccess={handlePaymentSuccess}
                                            onError={handlePaymentError}
                                            isLoading={isProcessing}
                                        />
                                    )}
                                </div>
                            ) : (
                                /* Assinatura Anual - PIX ou Boleto */
                                <div className="space-y-4">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <FileText className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-medium text-green-800">
                                                Assinatura Anual à Vista
                                            </span>
                                        </div>
                                        <p className="text-xs text-green-700">
                                            Economia de 10% pagando à vista com PIX ou Boleto
                                        </p>
                                    </div>

                                    {/* Seleção de Método de Pagamento */}
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setSelectedPaymentMethod('pix')}
                                            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${selectedPaymentMethod === 'pix'
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <QrCode className="w-5 h-5 mx-auto mb-1 text-green-600" />
                                            <span className="text-sm font-medium">PIX</span>
                                        </button>

                                        <button
                                            onClick={() => setSelectedPaymentMethod('boleto')}
                                            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${selectedPaymentMethod === 'boleto'
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <FileText className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                                            <span className="text-sm font-medium">Boleto</span>
                                        </button>
                                    </div>

                                    {!createdSubscription ? (
                                        <Button
                                            onClick={handleSubscriptionCreation}
                                            disabled={isProcessing}
                                            className="w-full"
                                            size="lg"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Criando Assinatura...
                                                </>
                                            ) : (
                                                `Gerar ${selectedPaymentMethod === 'pix' ? 'PIX' : 'Boleto'}`
                                            )}
                                        </Button>
                                    ) : (
                                        <>
                                            {selectedPaymentMethod === 'pix' && createdSubscription && (
                                                <div className="space-y-4">
                                                    <p className="text-sm text-gray-600 text-center">
                                                        Pagamento gerado com sucesso! Escaneie o QR Code abaixo:
                                                    </p>
                                                    {/* Aqui vamos implementar o componente PIX para assinatura anual */}
                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                                        <QrCode className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                                        <p className="text-sm text-yellow-800">
                                                            Componente PIX para assinatura será implementado
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedPaymentMethod === 'boleto' && createdSubscription && (
                                                <div className="space-y-4">
                                                    <p className="text-sm text-gray-600 text-center">
                                                        Boleto gerado com sucesso!
                                                    </p>
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                                        <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                                        <p className="text-sm text-blue-800">
                                                            Componente Boleto será implementado
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    {paymentStep === 'data' ? (
                        <div className="space-y-3">
                            <Button
                                onClick={handleProceedToPayment}
                                disabled={!isValid || isProcessing}
                                className="w-full text-lg py-6"
                                size="lg"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    'Continuar para Pagamento'
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={onBack}
                                disabled={isProcessing}
                                className="w-full"
                            >
                                Voltar
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                onClick={handleBackToData}
                                disabled={isProcessing}
                                className="w-full"
                            >
                                Voltar para Dados
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
