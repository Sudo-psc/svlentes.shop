/**
 * ⚠️ DEPRECADO - NÃO USAR EM PRODUÇÃO ⚠️
 *
 * Este arquivo foi DEPRECADO por questões de segurança críticas.
 *
 * PROBLEMAS:
 * - Expõe API keys no código cliente (bundle JavaScript)
 * - Permite que qualquer usuário extraia credenciais via DevTools
 * - Viola princípios de segurança PCI-DSS e melhores práticas
 * - Não deve ser usado em ambiente de produção
 *
 * SOLUÇÃO:
 * Use SEMPRE as API Routes como proxy:
 * - /api/asaas/customers
 * - /api/asaas/subscriptions
 * - /api/asaas/payments
 *
 * EXEMPLO CORRETO:
 * ```typescript
 * // ❌ NUNCA fazer isso (client-side)
 * import { asaasClient } from '@/lib/asaas-client'
 * const customer = await asaasClient.createCustomer(data)
 *
 * // ✅ SEMPRE fazer isso (via API Route)
 * const response = await fetch('/api/asaas/customers', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify(customerData)
 * })
 * const customer = await response.json()
 * ```
 *
 * Para implementação segura, use:
 * - src/lib/payments/asaas.ts (server-side only)
 * - src/app/api/asaas/* (API Routes)
 *
 * @deprecated Use API Routes em vez de chamadas diretas do cliente
 * @see src/lib/payments/asaas.ts
 * @see src/app/api/asaas/
 */

import { AsaasCustomer, AsaasSubscription, AsaasPayment } from '@/types/asaas'

export interface CreateCustomerData {
    name: string
    email: string
    mobilePhone: string
    phone?: string
    cpfCnpj: string
    postalCode?: string
    address?: string
    addressNumber?: string
    complement?: string
    province?: string
    externalReference?: string
}

export interface CreateSubscriptionData {
    customer: string
    billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX'
    value: number
    nextDueDate: string
    cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY'
    description?: string
    endDate?: string
    maxPayments?: number
    externalReference?: string
}

export interface CreatePaymentData {
    customer: string
    billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX'
    value: number
    dueDate: string
    description?: string
    externalReference?: string
    installmentCount?: number
    installmentValue?: number
}

/**
 * @deprecated NÃO USAR - Expõe API keys no cliente
 * Use src/lib/payments/asaas.ts via API Routes
 */
class AsaasClientDeprecated {
    constructor() {
        throw new Error(
            '❌ AsaasClient foi DEPRECADO por questões de segurança.\n' +
            'Use API Routes em /api/asaas/* para integração segura.\n' +
            'Veja src/lib/payments/asaas.ts para implementação server-side.'
        )
    }
}

/**
 * @deprecated NÃO USAR - Expõe API keys no cliente
 */
export const asaasClient = new Proxy({} as any, {
    get() {
        throw new Error(
            '❌ asaasClient foi DEPRECADO por questões de segurança.\n' +
            'Use fetch() para chamar /api/asaas/* endpoints.\n\n' +
            'Exemplo:\n' +
            'const response = await fetch("/api/asaas/customers", {\n' +
            '  method: "POST",\n' +
            '  body: JSON.stringify(customerData)\n' +
            '})'
        )
    }
})
