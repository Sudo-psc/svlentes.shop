'use client'

import { useState } from 'react'
import { asaasClient } from '@/lib/asaas-client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface DirectAsaasCheckoutProps {
    planId: string
    planValue: number
    planName: string
    billingCycle: 'monthly' | 'annual'
}

export function DirectAsaasCheckout({
    planId,
    planValue,
    planName,
    billingCycle
}: DirectAsaasCheckoutProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'PIX' | 'BOLETO'>('CREDIT_CARD')

    // Dados do cliente
    const [customerData, setCustomerData] = useState({
        name: '',
        email: '',
        cpfCnpj: '',
        mobilePhone: '',
        postalCode: '',
        address: '',
        addressNumber: '',
        complement: ''
    })

    // Dados do cartão
    const [cardData, setCardData] = useState({
        holderName: '',
        number: '',
        expiryMonth: '',
        expiryYear: '',
        ccv: ''
    })

    /**
     * Validar dados do formulário
     */
    const validateForm = (): boolean => {
        // Validar dados do cliente
        if (!customerData.name.trim()) {
            setError('Nome é obrigatório')
            return false
        }

        if (!customerData.email.trim() || !customerData.email.includes('@')) {
            setError('Email inválido')
            return false
        }

        if (!asaasClient.validateCpf(customerData.cpfCnpj)) {
            setError('CPF inválido')
            return false
        }

        if (!customerData.mobilePhone.trim() || customerData.mobilePhone.replace(/\D/g, '').length < 10) {
            setError('Celular inválido')
            return false
        }

        if (!customerData.postalCode.trim() || customerData.postalCode.replace(/\D/g, '').length !== 8) {
            setError('CEP inválido')
            return false
        }

        if (!customerData.address.trim()) {
            setError('Endereço é obrigatório')
            return false
        }

        if (!customerData.addressNumber.trim()) {
            setError('Número é obrigatório')
            return false
        }

        // Validar dados do cartão (se for cartão)
        if (paymentMethod === 'CREDIT_CARD') {
            if (!cardData.holderName.trim()) {
                setError('Nome no cartão é obrigatório')
                return false
            }

            const cardNumber = cardData.number.replace(/\s/g, '')
            if (cardNumber.length < 13 || cardNumber.length > 19) {
                setError('Número do cartão inválido')
                return false
            }

            const month = parseInt(cardData.expiryMonth)
            const year = parseInt(cardData.expiryYear)
            const currentYear = new Date().getFullYear()
            const currentMonth = new Date().getMonth() + 1

            if (!month || month < 1 || month > 12) {
                setError('Mês de validade inválido')
                return false
            }

            if (!year || year < currentYear || (year === currentYear && month < currentMonth)) {
                setError('Cartão expirado')
                return false
            }

            if (!cardData.ccv.trim() || cardData.ccv.length < 3 || cardData.ccv.length > 4) {
                setError('CVV inválido')
                return false
            }
        }

        return true
    }

    /**
     * Processar assinatura
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validar formulário
        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            // 1. Verificar se API está configurada
            if (!asaasClient.isConfigured()) {
                throw new Error('API Asaas não configurada. Verifique as variáveis de ambiente.')
            }

            // 2. Buscar ou criar cliente
            let customer = await asaasClient.findCustomerByEmail(customerData.email)

            if (!customer) {
                console.log('Criando novo cliente...')
                customer = await asaasClient.createCustomer({
                    name: customerData.name,
                    email: customerData.email,
                    cpfCnpj: customerData.cpfCnpj.replace(/\D/g, ''),
                    mobilePhone: customerData.mobilePhone.replace(/\D/g, ''),
                    postalCode: customerData.postalCode.replace(/\D/g, ''),
                    address: customerData.address,
                    addressNumber: customerData.addressNumber,
                    complement: customerData.complement,
                    externalReference: `web-${Date.now()}`
                })
                console.log('Cliente criado:', customer.id)
            } else {
                console.log('Cliente existente:', customer.id)
            }

            // 3. Obter IP do cliente
            const remoteIp = await asaasClient.getCustomerIp()

            // 4. Calcular próxima data de vencimento
            const nextDueDate = new Date()
            nextDueDate.setDate(nextDueDate.getDate() + 7) // 7 dias a partir de hoje
            const nextDueDateStr = nextDueDate.toISOString().split('T')[0]

            // 5. Criar assinatura
            let subscription

            if (paymentMethod === 'CREDIT_CARD') {
                console.log('Criando assinatura com cartão...')
                subscription = await asaasClient.createSubscriptionWithCard({
                    customer: customer.id,
                    billingType: 'CREDIT_CARD',
                    value: planValue,
                    nextDueDate: nextDueDateStr,
                    cycle: billingCycle === 'monthly' ? 'MONTHLY' : 'YEARLY',
                    description: `Assinatura ${planName}`,
                    externalReference: `plan-${planId}-${Date.now()}`,
                    creditCard: {
                        holderName: cardData.holderName,
                        number: cardData.number.replace(/\s/g, ''),
                        expiryMonth: cardData.expiryMonth.padStart(2, '0'),
                        expiryYear: cardData.expiryYear,
                        ccv: cardData.ccv
                    },
                    creditCardHolderInfo: {
                        name: customerData.name,
                        email: customerData.email,
                        cpfCnpj: customerData.cpfCnpj.replace(/\D/g, ''),
                        postalCode: customerData.postalCode.replace(/\D/g, ''),
                        addressNumber: customerData.addressNumber,
                        addressComplement: customerData.complement,
                        mobilePhone: customerData.mobilePhone.replace(/\D/g, '')
                    },
                    remoteIp
                })
            } else {
                console.log('Criando assinatura com', paymentMethod)
                subscription = await asaasClient.createSubscription({
                    customer: customer.id,
                    billingType: paymentMethod,
                    value: planValue,
                    nextDueDate: nextDueDateStr,
                    cycle: billingCycle === 'monthly' ? 'MONTHLY' : 'YEARLY',
                    description: `Assinatura ${planName}`,
                    externalReference: `plan-${planId}-${Date.now()}`
                })
            }

            console.log('Assinatura criada:', subscription.id)

            // 6. Sucesso!
            setSuccess(true)

            // 7. Redirecionar para página de sucesso
            setTimeout(() => {
                window.location.href = `/assinatura-sucesso?subscription=${subscription.id}`
            }, 2000)

        } catch (err) {
            console.error('Erro ao processar assinatura:', err)
            setError(err instanceof Error ? err.message : 'Erro ao processar assinatura')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Assinatura Criada com Sucesso!
                </h2>
                <p className="text-gray-600">
                    Redirecionando para confirmação...
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Finalizar Assinatura
                </h2>

                {/* Resumo do Plano */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-primary-900 mb-2">{planName}</h3>
                    <p className="text-2xl font-bold text-primary-600">
                        R$ {planValue.toFixed(2).replace('.', ',')}
                        <span className="text-sm font-normal text-primary-700">
                            /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                        </span>
                    </p>
                </div>

                {/* Método de Pagamento */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Método de Pagamento
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('CREDIT_CARD')}
                            className={`p-3 rounded-lg border-2 text-center transition-all ${paymentMethod === 'CREDIT_CARD'
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <CreditCard className="w-6 h-6 mx-auto mb-1" />
                            <span className="text-sm font-medium">Cartão</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('PIX')}
                            className={`p-3 rounded-lg border-2 text-center transition-all ${paymentMethod === 'PIX'
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <span className="text-2xl">💳</span>
                            <span className="text-sm font-medium block">PIX</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('BOLETO')}
                            className={`p-3 rounded-lg border-2 text-center transition-all ${paymentMethod === 'BOLETO'
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <span className="text-2xl">📄</span>
                            <span className="text-sm font-medium block">Boleto</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dados do Cliente */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Dados Pessoais
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nome Completo"
                                required
                                value={customerData.name}
                                onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                            />
                            <Input
                                label="Email"
                                type="email"
                                required
                                value={customerData.email}
                                onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                            />
                            <Input
                                label="CPF"
                                required
                                placeholder="000.000.000-00"
                                value={asaasClient.formatCpfCnpj(customerData.cpfCnpj)}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    if (value.length <= 11) {
                                        setCustomerData({ ...customerData, cpfCnpj: value })
                                    }
                                }}
                            />
                            <Input
                                label="Celular"
                                required
                                placeholder="(00) 00000-0000"
                                value={asaasClient.formatPhone(customerData.mobilePhone)}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    if (value.length <= 11) {
                                        setCustomerData({ ...customerData, mobilePhone: value })
                                    }
                                }}
                            />
                            <Input
                                label="CEP"
                                required
                                placeholder="00000-000"
                                value={customerData.postalCode}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    if (value.length <= 8) {
                                        setCustomerData({ ...customerData, postalCode: value })
                                    }
                                }}
                            />
                            <Input
                                label="Endereço"
                                required
                                value={customerData.address}
                                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                            />
                            <Input
                                label="Número"
                                required
                                value={customerData.addressNumber}
                                onChange={(e) => setCustomerData({ ...customerData, addressNumber: e.target.value })}
                            />
                            <Input
                                label="Complemento"
                                value={customerData.complement}
                                onChange={(e) => setCustomerData({ ...customerData, complement: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Dados do Cartão (apenas se for cartão) */}
                    {paymentMethod === 'CREDIT_CARD' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Dados do Cartão
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Nome no Cartão"
                                        required
                                        value={cardData.holderName}
                                        onChange={(e) => setCardData({ ...cardData, holderName: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Input
                                        label="Número do Cartão"
                                        required
                                        placeholder="0000 0000 0000 0000"
                                        value={cardData.number}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\s/g, '')
                                            const formatted = value.replace(/(.{4})/g, '$1 ').trim()
                                            if (value.length <= 19) {
                                                setCardData({ ...cardData, number: formatted })
                                            }
                                        }}
                                    />
                                </div>
                                <Input
                                    label="Mês"
                                    placeholder="MM"
                                    required
                                    maxLength={2}
                                    value={cardData.expiryMonth}
                                    onChange={(e) => setCardData({ ...cardData, expiryMonth: e.target.value })}
                                />
                                <Input
                                    label="Ano"
                                    placeholder="AAAA"
                                    required
                                    maxLength={4}
                                    value={cardData.expiryYear}
                                    onChange={(e) => setCardData({ ...cardData, expiryYear: e.target.value })}
                                />
                                <Input
                                    label="CVV"
                                    required
                                    placeholder="123"
                                    maxLength={4}
                                    value={cardData.ccv}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '')
                                        if (value.length <= 4) {
                                            setCardData({ ...cardData, ccv: value })
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Erro */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-red-900">
                                <p className="font-medium mb-1">Erro ao processar pagamento</p>
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Botão de Submissão */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            <>
                                Finalizar Assinatura
                            </>
                        )}
                    </Button>

                    {/* Informação de Segurança */}
                    <p className="text-xs text-gray-500 text-center">
                        🔒 Pagamento seguro processado via Asaas
                        <br />
                        Ambiente: {asaasClient.getEnvironment()}
                    </p>
                </form>
            </div>
        </div>
    )
}
