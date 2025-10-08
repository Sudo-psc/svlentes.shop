'use client'

import { useState } from 'react'
import { CreditCard, Lock, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { asaasService } from '@/lib/asaas-service'

interface CreditCardFormProps {
    onPaymentSuccess?: (data: any) => void
    onError?: (error: string) => void
    isLoading?: boolean
    customerData: {
        name: string
        email: string
        cpfCnpj: string
        mobilePhone: string
        postalCode?: string
        addressNumber?: string
        addressComplement?: string
    }
    amount: number
    description: string
}

export function CreditCardForm({
    onPaymentSuccess,
    onError,
    isLoading = false,
    customerData,
    amount,
    description
}: CreditCardFormProps) {
    const [cardData, setCardData] = useState({
        holderName: '',
        number: '',
        expiryMonth: '',
        expiryYear: '',
        ccv: ''
    })

    const [addressData, setAddressData] = useState({
        postalCode: customerData.postalCode || '',
        addressNumber: customerData.addressNumber || '',
        addressComplement: customerData.addressComplement || ''
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isProcessing, setIsProcessing] = useState(false)

    const validateCard = () => {
        const newErrors: Record<string, string> = {}

        if (!cardData.holderName.trim()) {
            newErrors.holderName = 'Nome do titular é obrigatório'
        }

        if (!cardData.number.trim()) {
            newErrors.number = 'Número do cartão é obrigatório'
        } else if (!/^\d{13,19}$/.test(cardData.number.replace(/\s/g, ''))) {
            newErrors.number = 'Número do cartão inválido'
        }

        if (!cardData.expiryMonth) {
            newErrors.expiryMonth = 'Mês é obrigatório'
        } else if (!/^(0[1-9]|1[0-2])$/.test(cardData.expiryMonth)) {
            newErrors.expiryMonth = 'Mês inválido'
        }

        if (!cardData.expiryYear) {
            newErrors.expiryYear = 'Ano é obrigatório'
        } else if (!/^\d{4}$/.test(cardData.expiryYear)) {
            newErrors.expiryYear = 'Ano inválido'
        } else {
            const currentYear = new Date().getFullYear()
            const expiryYear = parseInt(cardData.expiryYear)
            const expiryMonth = parseInt(cardData.expiryMonth)
            const currentMonth = new Date().getMonth() + 1

            if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
                newErrors.expiryYear = 'Cartão expirado'
            }
        }

        if (!cardData.ccv.trim()) {
            newErrors.ccv = 'CVV é obrigatório'
        } else if (!/^\d{3,4}$/.test(cardData.ccv)) {
            newErrors.ccv = 'CVV inválido'
        }

        if (!addressData.postalCode.trim()) {
            newErrors.postalCode = 'CEP é obrigatório'
        } else if (!/^\d{8}$/.test(addressData.postalCode.replace(/\D/g, ''))) {
            newErrors.postalCode = 'CEP inválido'
        }

        if (!addressData.addressNumber.trim()) {
            newErrors.addressNumber = 'Número é obrigatório'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, '')
        const chunks = cleaned.match(/.{1,4}/g) || []
        return chunks.join(' ').substr(0, 19)
    }

    const handleCardSubmit = async () => {
        if (!validateCard() || isProcessing) return

        setIsProcessing(true)
        setErrors({})

        try {
            const customerIp = await asaasService.getCustomerIp()

            // Criar pagamento com cartão de crédito
            const payment = await asaasService.createPaymentWithCard({
                customer: '', // Será preenchido após criar o cliente
                billingType: 'CREDIT_CARD',
                value: amount,
                dueDate: new Date().toISOString().split('T')[0],
                description,
                creditCard: {
                    holderName: cardData.holderName,
                    number: cardData.number.replace(/\s/g, ''),
                    expiryMonth: cardData.expiryMonth,
                    expiryYear: cardData.expiryYear,
                    ccv: cardData.ccv
                },
                creditCardHolderInfo: {
                    name: customerData.name,
                    email: customerData.email,
                    cpfCnpj: customerData.cpfCnpj,
                    postalCode: addressData.postalCode.replace(/\D/g, ''),
                    addressNumber: addressData.addressNumber,
                    addressComplement: addressData.addressComplement,
                    mobilePhone: asaasService.formatPhone(customerData.mobilePhone),
                    phone: asaasService.formatPhone(customerData.mobilePhone)
                },
                remoteIp: customerIp
            })

            onPaymentSuccess?.(payment)

        } catch (error) {
            console.error('Erro no pagamento com cartão:', error)
            onError?.(error instanceof Error ? error.message : 'Erro ao processar pagamento')
        } finally {
            setIsProcessing(false)
        }
    }

    const getCardType = (number: string) => {
        const cleaned = number.replace(/\s/g, '')
        if (cleaned.startsWith('4')) return 'visa'
        if (cleaned.startsWith('5')) return 'mastercard'
        if (cleaned.startsWith('3')) return 'amex'
        return 'unknown'
    }

    const cardType = getCardType(cardData.number)

    return (
        <div className="space-y-6">
            {/* Segurança */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">
                        Pagamento 100% seguro criptografado
                    </span>
                </div>
            </div>

            {/* Dados do Cartão */}
            <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Dados do Cartão
                </h4>

                <div className="grid grid-cols-1 gap-4">
                    <Input
                        label="Nome do Titular"
                        placeholder="Como está impresso no cartão"
                        value={cardData.holderName}
                        onChange={(e) => setCardData(prev => ({ ...prev, holderName: e.target.value.toUpperCase() }))}
                        error={errors.holderName}
                        disabled={isProcessing}
                    />

                    <Input
                        label="Número do Cartão"
                        placeholder="0000 0000 0000 0000"
                        value={formatCardNumber(cardData.number)}
                        onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value }))}
                        error={errors.number}
                        disabled={isProcessing}
                        maxLength={19}
                    />

                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            label="Mês"
                            placeholder="MM"
                            value={cardData.expiryMonth}
                            onChange={(e) => setCardData(prev => ({ ...prev, expiryMonth: e.target.value }))}
                            error={errors.expiryMonth}
                            disabled={isProcessing}
                            maxLength={2}
                        />

                        <Input
                            label="Ano"
                            placeholder="YYYY"
                            value={cardData.expiryYear}
                            onChange={(e) => setCardData(prev => ({ ...prev, expiryYear: e.target.value }))}
                            error={errors.expiryYear}
                            disabled={isProcessing}
                            maxLength={4}
                        />

                        <Input
                            label="CVV"
                            placeholder="123"
                            value={cardData.ccv}
                            onChange={(e) => setCardData(prev => ({ ...prev, ccv: e.target.value }))}
                            error={errors.ccv}
                            disabled={isProcessing}
                            maxLength={4}
                            type="password"
                        />
                    </div>
                </div>
            </div>

            {/* Endereço de Cobrança */}
            <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Endereço de Cobrança</h4>

                <div className="grid grid-cols-1 gap-4">
                    <Input
                        label="CEP"
                        placeholder="00000-000"
                        value={addressData.postalCode}
                        onChange={(e) => setAddressData(prev => ({ ...prev, postalCode: e.target.value }))}
                        error={errors.postalCode}
                        disabled={isProcessing}
                        maxLength={9}
                    />

                    <Input
                        label="Número"
                        placeholder="123"
                        value={addressData.addressNumber}
                        onChange={(e) => setAddressData(prev => ({ ...prev, addressNumber: e.target.value }))}
                        error={errors.addressNumber}
                        disabled={isProcessing}
                    />

                    <Input
                        label="Complemento (opcional)"
                        placeholder="Apto 101"
                        value={addressData.addressComplement}
                        onChange={(e) => setAddressData(prev => ({ ...prev, addressComplement: e.target.value }))}
                        disabled={isProcessing}
                    />
                </div>
            </div>

            {/* Resumo */}
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total a pagar</span>
                    <span className="text-2xl font-bold text-gray-900">
                        R$ {amount.toFixed(2)}
                    </span>
                </div>
                <p className="text-sm text-gray-500">
                    Cobrança mensal recorrente
                </p>
            </div>

            {/* Botão de Pagamento */}
            <Button
                onClick={handleCardSubmit}
                disabled={isProcessing || isLoading}
                className="w-full py-4"
                size="lg"
            >
                {isProcessing ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processando...
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4 mr-2" />
                        Pagar com Cartão de Crédito
                    </>
                )}
            </Button>

            {/* Bandeiras Aceitas */}
            <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Aceitamos as seguintes bandeiras:</p>
                <div className="flex justify-center space-x-4">
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                        VISA
                    </div>
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                        MASTERCARD
                    </div>
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                        AMEX
                    </div>
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                        ELO
                    </div>
                </div>
            </div>
        </div>
    )
}
