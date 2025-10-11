# 🚀 Guia de Chamadas Diretas à API Asaas

## 📋 Visão Geral

Este guia explica como fazer chamadas diretas à API do Asaas a partir dos componentes React, sem usar rotas intermediárias do Next.js.

## ⚠️ Importante - Segurança

**ATENÇÃO:** Fazer chamadas diretas à API externa do client-side expõe sua API key no navegador. Isso é aceitável apenas em ambientes de desenvolvimento ou quando:

1. Você está usando a API key de **sandbox** (não produção)
2. A API key tem permissões limitadas
3. Você implementa rate limiting e validações no backend

**Para produção, recomenda-se usar API routes como proxy.**

---

## 🔧 Configuração

### 1. Variáveis de Ambiente

Adicione ao seu `.env.local`:

```bash
# API Asaas - Chamadas Diretas (Client-side)
NEXT_PUBLIC_ASAAS_API_URL=https://sandbox.asaas.com/api/v3
NEXT_PUBLIC_ASAAS_API_KEY=sua_api_key_aqui
```

**Sandbox:**
```bash
NEXT_PUBLIC_ASAAS_API_URL=https://sandbox.asaas.com/api/v3
```

**Produção:**
```bash
NEXT_PUBLIC_ASAAS_API_URL=https://api.asaas.com/v3
```

### 2. Verificar Configuração

```typescript
import { asaasClient } from '@/lib/asaas-client'

// Verificar se está configurado
if (asaasClient.isConfigured()) {
    console.log('✅ API Asaas configurada')
    console.log('Ambiente:', asaasClient.getEnvironment())
} else {
    console.error('❌ API Asaas não configurada')
}
```

---

## 💻 Uso Básico

### Importar o Cliente

```typescript
import { asaasClient } from '@/lib/asaas-client'
```

### Criar Cliente

```typescript
const customer = await asaasClient.createCustomer({
    name: 'João Silva',
    email: 'joao@example.com',
    cpfCnpj: '12345678900',
    mobilePhone: '11999999999',
    postalCode: '01310100',
    address: 'Av. Paulista',
    addressNumber: '1000'
})

console.log('Cliente criado:', customer.id)
```

### Buscar Cliente

```typescript
// Por email
const customer = await asaasClient.findCustomerByEmail('joao@example.com')

// Por CPF
const customer = await asaasClient.findCustomerByCpfCnpj('12345678900')

// Por ID
const customer = await asaasClient.getCustomer('cus_000005161268')
```

### Criar Assinatura

```typescript
const subscription = await asaasClient.createSubscription({
    customer: 'cus_000005161268',
    billingType: 'CREDIT_CARD',
    value: 149.90,
    nextDueDate: '2025-06-17',
    cycle: 'MONTHLY',
    description: 'Assinatura Plano Premium'
})

console.log('Assinatura criada:', subscription.id)
```

### Criar Assinatura com Cartão

```typescript
const remoteIp = await asaasClient.getCustomerIp()

const subscription = await asaasClient.createSubscriptionWithCard({
    customer: 'cus_000005161268',
    billingType: 'CREDIT_CARD',
    value: 149.90,
    nextDueDate: '2025-06-17',
    cycle: 'MONTHLY',
    description: 'Assinatura Plano Premium',
    creditCard: {
        holderName: 'João Silva',
        number: '5162306219378829',
        expiryMonth: '12',
        expiryYear: '2028',
        ccv: '318'
    },
    creditCardHolderInfo: {
        name: 'João Silva',
        email: 'joao@example.com',
        cpfCnpj: '12345678900',
        postalCode: '01310100',
        addressNumber: '1000',
        mobilePhone: '11999999999'
    },
    remoteIp
})
```

### Criar Pagamento PIX

```typescript
const payment = await asaasClient.createPayment({
    customer: 'cus_000005161268',
    billingType: 'PIX',
    value: 149.90,
    dueDate: '2025-06-17',
    description: 'Pagamento Único'
})

// Buscar QR Code
const qrCode = await asaasClient.getPixQrCode(payment.id)
console.log('QR Code:', qrCode.encodedImage)
console.log('Payload:', qrCode.payload)
```

---

## 🎯 Exemplo Completo em Componente

```typescript
'use client'

import { useState } from 'react'
import { asaasClient } from '@/lib/asaas-client'
import { Button } from '@/components/ui/Button'

export function CheckoutComponent() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleCheckout = async () => {
        setLoading(true)
        setError(null)

        try {
            // 1. Criar ou buscar cliente
            let customer = await asaasClient.findCustomerByEmail('cliente@example.com')
            
            if (!customer) {
                customer = await asaasClient.createCustomer({
                    name: 'Cliente Teste',
                    email: 'cliente@example.com',
                    cpfCnpj: '12345678900',
                    mobilePhone: '11999999999'
                })
            }

            // 2. Criar assinatura
            const subscription = await asaasClient.createSubscription({
                customer: customer.id,
                billingType: 'PIX',
                value: 149.90,
                nextDueDate: '2025-06-17',
                cycle: 'MONTHLY',
                description: 'Assinatura Premium'
            })

            // 3. Redirecionar para sucesso
            window.location.href = `/success?subscription=${subscription.id}`

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {error && <div className="text-red-600">{error}</div>}
            
            <Button 
                onClick={handleCheckout} 
                disabled={loading}
            >
                {loading ? 'Processando...' : 'Finalizar Compra'}
            </Button>
        </div>
    )
}
```

---

## 🛠️ Métodos Disponíveis

### Clientes

| Método | Descrição |
|--------|-----------|
| `createCustomer(data)` | Criar novo cliente |
| `getCustomer(id)` | Buscar cliente por ID |
| `findCustomerByEmail(email)` | Buscar por email |
| `findCustomerByCpfCnpj(cpf)` | Buscar por CPF/CNPJ |
| `updateCustomer(id, data)` | Atualizar cliente |

### Assinaturas

| Método | Descrição |
|--------|-----------|
| `createSubscription(data)` | Criar assinatura |
| `createSubscriptionWithCard(data)` | Criar com cartão |
| `getSubscription(id)` | Buscar assinatura |
| `listSubscriptions(customerId?)` | Listar assinaturas |
| `cancelSubscription(id)` | Cancelar assinatura |

### Pagamentos

| Método | Descrição |
|--------|-----------|
| `createPayment(data)` | Criar pagamento |
| `createPaymentWithCard(data)` | Criar com cartão |
| `getPayment(id)` | Buscar pagamento |
| `listPayments(customerId?, subscriptionId?)` | Listar pagamentos |

### PIX

| Método | Descrição |
|--------|-----------|
| `getPixQrCode(paymentId)` | Buscar QR Code PIX |

### Utilitários

| Método | Descrição |
|--------|-----------|
| `getCustomerIp()` | Obter IP do cliente |
| `formatPhone(phone)` | Formatar telefone |
| `formatCpfCnpj(cpfCnpj)` | Formatar CPF/CNPJ |
| `validateCpf(cpf)` | Validar CPF |
| `validateCnpj(cnpj)` | Validar CNPJ |
| `isConfigured()` | Verificar configuração |
| `getEnvironment()` | Obter ambiente (sandbox/production) |

---

## 🔒 Boas Práticas de Segurança

### 1. Validação Client-Side

```typescript
// Validar CPF antes de enviar
if (!asaasClient.validateCpf(cpf)) {
    throw new Error('CPF inválido')
}

// Validar dados do cartão
if (cardNumber.length < 13 || cardNumber.length > 19) {
    throw new Error('Número de cartão inválido')
}
```

### 2. Tratamento de Erros

```typescript
try {
    const customer = await asaasClient.createCustomer(data)
} catch (error) {
    if (error instanceof Error) {
        // Erro específico da API
        console.error('Erro Asaas:', error.message)
        
        // Mostrar mensagem amigável ao usuário
        if (error.message.includes('já existe')) {
            alert('Cliente já cadastrado')
        } else {
            alert('Erro ao processar. Tente novamente.')
        }
    }
}
```

### 3. Loading States

```typescript
const [loading, setLoading] = useState(false)

const handleSubmit = async () => {
    setLoading(true)
    try {
        await asaasClient.createSubscription(data)
    } finally {
        setLoading(false)
    }
}
```

### 4. Não Expor Dados Sensíveis

```typescript
// ❌ NÃO FAZER
console.log('Dados do cartão:', cardData)

// ✅ FAZER
console.log('Processando pagamento...')
```

---

## 🧪 Testes

### Dados de Teste (Sandbox)

**Cartão de Crédito Aprovado:**
```
Número: 5162306219378829
CVV: 318
Validade: 12/2028
```

**Cartão de Crédito Recusado:**
```
Número: 5184019740373151
CVV: 318
Validade: 12/2028
```

**CPF de Teste:**
```
123.456.789-00
```

### Testar Configuração

```typescript
// Verificar se API está acessível
const testConnection = async () => {
    try {
        const customer = await asaasClient.findCustomerByEmail('teste@example.com')
        console.log('✅ Conexão OK')
    } catch (error) {
        console.error('❌ Erro de conexão:', error)
    }
}
```

---

## 🐛 Troubleshooting

### Erro: "API Key não configurada"

**Solução:**
```bash
# Adicionar ao .env.local
NEXT_PUBLIC_ASAAS_API_KEY=sua_chave_aqui
```

### Erro: "CORS blocked"

**Causa:** API Asaas não permite chamadas diretas do browser em produção.

**Solução:** Use API routes como proxy:
```typescript
// Ao invés de chamar direto
const customer = await asaasClient.createCustomer(data)

// Chamar via API route
const response = await fetch('/api/asaas/customers', {
    method: 'POST',
    body: JSON.stringify(data)
})
```

### Erro: "Invalid API Key"

**Verificar:**
1. API key está correta
2. Está usando a key do ambiente correto (sandbox/production)
3. Key tem as permissões necessárias

### Erro: "Customer already exists"

**Solução:**
```typescript
// Buscar antes de criar
let customer = await asaasClient.findCustomerByEmail(email)
if (!customer) {
    customer = await asaasClient.createCustomer(data)
}
```

---

## 📊 Comparação: Direct API vs API Routes

| Aspecto | Direct API | API Routes |
|---------|-----------|------------|
| **Segurança** | ⚠️ API key exposta | ✅ API key protegida |
| **Performance** | ✅ Mais rápido | ⚠️ Hop extra |
| **CORS** | ⚠️ Pode ter problemas | ✅ Sem problemas |
| **Complexidade** | ✅ Mais simples | ⚠️ Mais código |
| **Recomendado para** | Desenvolvimento/Sandbox | Produção |

---

## 🚀 Migração de API Routes para Direct API

### Antes (API Route)

```typescript
// Component
const response = await fetch('/api/asaas/customers', {
    method: 'POST',
    body: JSON.stringify(data)
})
const result = await response.json()
```

### Depois (Direct API)

```typescript
// Component
import { asaasClient } from '@/lib/asaas-client'

const customer = await asaasClient.createCustomer(data)
```

**Benefícios:**
- ✅ Menos código
- ✅ Tipagem TypeScript
- ✅ Mais rápido
- ✅ Menos arquivos

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [Asaas API Docs](https://docs.asaas.com/)
- [Asaas Sandbox](https://sandbox.asaas.com/)

### Arquivos do Projeto
- `src/lib/asaas-client.ts` - Cliente principal
- `src/components/payment/DirectAsaasCheckout.tsx` - Exemplo completo
- `.env.example` - Variáveis de ambiente

### Suporte
- Issues: Reportar problemas no repositório
- Docs: Consultar documentação do Asaas

---

## ✅ Checklist de Implementação

- [ ] Configurar variáveis de ambiente
- [ ] Importar `asaasClient` no componente
- [ ] Verificar se API está configurada
- [ ] Implementar tratamento de erros
- [ ] Adicionar loading states
- [ ] Validar dados antes de enviar
- [ ] Testar em sandbox
- [ ] Implementar feedback ao usuário
- [ ] Adicionar logs para debug
- [ ] Testar fluxo completo

---

**Versão:** 1.0.0  
**Data:** 10/06/2025  
**Status:** ✅ Pronto para uso
