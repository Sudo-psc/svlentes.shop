# 🔄 Exemplo de Migração - SubscriptionFlow

## Objetivo

Migrar o `SubscriptionFlow` e `OrderSummary` para usar chamadas diretas à API Asaas.

---

## Antes (API Routes)

### OrderSummary.tsx

```typescript
import { asaasService } from '@/lib/asaas-service'

const handleProceedToPayment = async () => {
    try {
        // Chama API route que chama Asaas
        const customer = await asaasService.createCustomer({
            name: contactData.name,
            email: contactData.email,
            mobilePhone: contactData.phone,
            cpfCnpj: ''
        })
        
        setCreatedCustomer(customer)
    } catch (error) {
        setError(error.message)
    }
}
```

### asaas-service.ts

```typescript
async createCustomer(data: CreateCustomerData): Promise<AsaasCustomer> {
    // Faz fetch para API route
    const response = await fetch(`${this.baseUrl}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })

    const result = await response.json()
    
    if (!result.success) {
        throw new Error(result.error || 'Erro ao criar cliente')
    }

    return result.customer
}
```

### API Route (src/app/api/asaas/customers/route.ts)

```typescript
export async function POST(request: Request) {
    try {
        const data = await request.json()
        
        // Chama API Asaas
        const response = await fetch('https://sandbox.asaas.com/api/v3/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access_token': process.env.ASAAS_API_KEY_SANDBOX
            },
            body: JSON.stringify(data)
        })
        
        const customer = await response.json()
        
        return Response.json({ success: true, customer })
    } catch (error) {
        return Response.json({ success: false, error: error.message })
    }
}
```

**Fluxo:**
```
OrderSummary → asaasService → API Route → Asaas API
```

---

## Depois (Direct API)

### OrderSummary.tsx

```typescript
import { asaasClient } from '@/lib/asaas-client'

const handleProceedToPayment = async () => {
    try {
        // Chama diretamente a API Asaas
        const customer = await asaasClient.createCustomer({
            name: contactData.name,
            email: contactData.email,
            mobilePhone: contactData.phone,
            cpfCnpj: contactData.cpf // Adicionar campo CPF
        })
        
        setCreatedCustomer(customer)
    } catch (error) {
        setError(error.message)
    }
}
```

### asaas-client.ts

```typescript
async createCustomer(data: CreateCustomerData): Promise<AsaasCustomer> {
    // Chama diretamente a API Asaas
    return this.request<AsaasCustomer>('/customers', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const headers = {
        'Content-Type': 'application/json',
        'access_token': this.apiKey,
        ...options.headers,
    }

    const response = await fetch(url, { ...options, headers })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.errors?.[0]?.description || 'Erro na API')
    }

    return data
}
```

**Fluxo:**
```
OrderSummary → asaasClient → Asaas API
```

---

## Código Completo Atualizado

### OrderSummary.tsx (Versão Direct API)

```typescript
'use client'

import { useState } from 'react'
import { asaasClient } from '@/lib/asaas-client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Loader2, CreditCard, QrCode, FileText } from 'lucide-react'
import { pricingPlans } from '@/data/pricing-plans'

interface OrderSummaryProps {
    planId: string
    billingCycle: 'monthly' | 'annual'
    lensData: any
    addOns: string[]
    onBack: () => void
    onConfirm: (data: any) => void
}

export function OrderSummary({ 
    planId, 
    billingCycle, 
    lensData, 
    addOns, 
    onBack, 
    onConfirm 
}: OrderSummaryProps) {
    const [contactData, setContactData] = useState({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        acceptsTerms: false
    })
    
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'PIX' | 'BOLETO'>('CREDIT_CARD')
    const [cardData, setCardData] = useState({
        holderName: '',
        number: '',
        expiryMonth: '',
        expiryYear: '',
        ccv: ''
    })

    const plan = pricingPlans.find(p => p.id === planId)
    if (!plan) return null

    const planPrice = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual / 12

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)
        setError(null)

        try {
            // 1. Verificar configuração
            if (!asaasClient.isConfigured()) {
                throw new Error('Sistema de pagamento não configurado')
            }

            // 2. Validar CPF
            if (!asaasClient.validateCpf(contactData.cpf)) {
                throw new Error('CPF inválido')
            }

            // 3. Buscar ou criar cliente
            let customer = await asaasClient.findCustomerByEmail(contactData.email)
            
            if (!customer) {
                customer = await asaasClient.createCustomer({
                    name: contactData.name,
                    email: contactData.email,
                    cpfCnpj: contactData.cpf.replace(/\D/g, ''),
                    mobilePhone: contactData.phone.replace(/\D/g, ''),
                    externalReference: `web-${Date.now()}`
                })
            }

            // 4. Calcular próxima data de vencimento
            const nextDueDate = new Date()
            nextDueDate.setDate(nextDueDate.getDate() + 7)
            const nextDueDateStr = nextDueDate.toISOString().split('T')[0]

            // 5. Criar assinatura
            let subscription

            if (paymentMethod === 'CREDIT_CARD') {
                const remoteIp = await asaasClient.getCustomerIp()
                
                subscription = await asaasClient.createSubscriptionWithCard({
                    customer: customer.id,
                    billingType: 'CREDIT_CARD',
                    value: planPrice,
                    nextDueDate: nextDueDateStr,
                    cycle: billingCycle === 'monthly' ? 'MONTHLY' : 'YEARLY',
                    description: `Assinatura ${plan.name}`,
                    creditCard: {
                        holderName: cardData.holderName,
                        number: cardData.number.replace(/\s/g, ''),
                        expiryMonth: cardData.expiryMonth,
                        expiryYear: cardData.expiryYear,
                        ccv: cardData.ccv
                    },
                    creditCardHolderInfo: {
                        name: contactData.name,
                        email: contactData.email,
                        cpfCnpj: contactData.cpf.replace(/\D/g, ''),
                        postalCode: '00000000',
                        addressNumber: '0',
                        mobilePhone: contactData.phone.replace(/\D/g, '')
                    },
                    remoteIp
                })
            } else {
                subscription = await asaasClient.createSubscription({
                    customer: customer.id,
                    billingType: paymentMethod,
                    value: planPrice,
                    nextDueDate: nextDueDateStr,
                    cycle: billingCycle === 'monthly' ? 'MONTHLY' : 'YEARLY',
                    description: `Assinatura ${plan.name}`
                })
            }

            // 6. Sucesso!
            onConfirm({
                ...contactData,
                customerId: customer.id,
                subscriptionId: subscription.id
            })

            // 7. Redirecionar
            window.location.href = `/assinatura-sucesso?subscription=${subscription.id}`

        } catch (err) {
            console.error('Erro ao processar:', err)
            setError(err instanceof Error ? err.message : 'Erro ao processar')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Finalizar Assinatura</h2>

            {/* Resumo do Plano */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-primary-900">{plan.name}</h3>
                <p className="text-2xl font-bold text-primary-600">
                    R$ {planPrice.toFixed(2).replace('.', ',')}
                    <span className="text-sm font-normal">
                        /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                    </span>
                </p>
            </div>

            {/* Método de Pagamento */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                    Método de Pagamento
                </label>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('CREDIT_CARD')}
                        className={`p-3 rounded-lg border-2 ${
                            paymentMethod === 'CREDIT_CARD'
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200'
                        }`}
                    >
                        <CreditCard className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-sm">Cartão</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('PIX')}
                        className={`p-3 rounded-lg border-2 ${
                            paymentMethod === 'PIX'
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200'
                        }`}
                    >
                        <QrCode className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-sm">PIX</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setPaymentMethod('BOLETO')}
                        className={`p-3 rounded-lg border-2 ${
                            paymentMethod === 'BOLETO'
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200'
                        }`}
                    >
                        <FileText className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-sm">Boleto</span>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados Pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nome Completo"
                        required
                        value={contactData.name}
                        onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    />
                    <Input
                        label="Email"
                        type="email"
                        required
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    />
                    <Input
                        label="CPF"
                        required
                        value={contactData.cpf}
                        onChange={(e) => setContactData({ ...contactData, cpf: e.target.value })}
                    />
                    <Input
                        label="Celular"
                        required
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    />
                </div>

                {/* Dados do Cartão */}
                {paymentMethod === 'CREDIT_CARD' && (
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
                                value={cardData.number}
                                onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
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
                            maxLength={4}
                            value={cardData.ccv}
                            onChange={(e) => setCardData({ ...cardData, ccv: e.target.value })}
                        />
                    </div>
                )}

                {/* Termos */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="terms"
                        checked={contactData.acceptsTerms}
                        onCheckedChange={(checked) => 
                            setContactData({ ...contactData, acceptsTerms: checked as boolean })
                        }
                    />
                    <label htmlFor="terms" className="text-sm">
                        Aceito os termos e condições
                    </label>
                </div>

                {/* Erro */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-900">
                        {error}
                    </div>
                )}

                {/* Botões */}
                <div className="flex space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="flex-1"
                    >
                        Voltar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isProcessing || !contactData.acceptsTerms}
                        className="flex-1"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            'Finalizar'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
```

---

## Mudanças Principais

### 1. Import

```typescript
// Antes
import { asaasService } from '@/lib/asaas-service'

// Depois
import { asaasClient } from '@/lib/asaas-client'
```

### 2. Chamadas de API

```typescript
// Antes
const customer = await asaasService.createCustomer(data)

// Depois
const customer = await asaasClient.createCustomer(data)
```

### 3. Validações

```typescript
// Antes
// Validação no servidor

// Depois
if (!asaasClient.validateCpf(cpf)) {
    throw new Error('CPF inválido')
}
```

### 4. Verificação de Configuração

```typescript
// Novo
if (!asaasClient.isConfigured()) {
    throw new Error('Sistema não configurado')
}
```

---

## Benefícios da Migração

### Código
- ✅ Menos linhas de código
- ✅ Mais direto e simples
- ✅ Melhor tipagem TypeScript

### Performance
- ✅ Menos latência (sem hop extra)
- ✅ Resposta mais rápida

### Manutenção
- ✅ Menos arquivos para manter
- ✅ Um único ponto de integração
- ✅ Mais fácil de debugar

---

## Checklist de Migração

- [ ] Configurar variáveis de ambiente
- [ ] Importar `asaasClient`
- [ ] Substituir chamadas `asaasService` por `asaasClient`
- [ ] Adicionar validações client-side
- [ ] Testar fluxo completo
- [ ] Remover API routes (opcional)
- [ ] Atualizar documentação

---

**Versão:** 1.0.0  
**Data:** 10/06/2025  
**Status:** ✅ Exemplo completo
