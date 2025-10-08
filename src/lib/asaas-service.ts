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

export interface CreateSubscriptionWithCardData extends CreateSubscriptionData {
    creditCard: {
        holderName: string
        number: string
        expiryMonth: string
        expiryYear: string
        ccv: string
    }
    creditCardHolderInfo: {
        name: string
        email: string
        cpfCnpj: string
        postalCode: string
        addressNumber: string
        addressComplement?: string
        phone?: string
        mobilePhone: string
    }
    remoteIp: string
}

export interface CreatePaymentWithCardData extends CreatePaymentData {
    creditCard: {
        holderName: string
        number: string
        expiryMonth: string
        expiryYear: string
        ccv: string
    }
    creditCardHolderInfo: {
        name: string
        email: string
        cpfCnpj: string
        postalCode: string
        addressNumber: string
        addressComplement?: string
        phone?: string
        mobilePhone: string
    }
    remoteIp: string
}

// Cliente ASAAS Service
class AsaasService {
    private baseUrl: string

    constructor() {
        this.baseUrl = '/api/asaas'
    }

    // ========== CLIENTES ==========

    async createCustomer(data: CreateCustomerData): Promise<AsaasCustomer> {
        const response = await fetch(`${this.baseUrl}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || errorData.message || 'Erro ao criar cliente')
        }

        const result = await response.json()

        if (!result.success) {
            throw new Error(result.error || 'Erro ao criar cliente')
        }

        return result.customer
    }

    async getCustomer(customerId: string): Promise<AsaasCustomer> {
        const response = await fetch(`${this.baseUrl}/customers/${customerId}`)

        if (!response.ok) {
            throw new Error('Cliente não encontrado')
        }

        return response.json()
    }

    async findCustomerByEmail(email: string): Promise<AsaasCustomer | null> {
        try {
            const response = await fetch(`${this.baseUrl}/customers?email=${encodeURIComponent(email)}`)

            if (!response.ok) {
                return null
            }

            const result = await response.json()

            if (!result.success || !result.customers || result.customers.length === 0) {
                return null
            }

            return result.customers[0]
        } catch (error) {
            console.error('Erro ao buscar cliente por email:', error)
            return null
        }
    }

    async findCustomerByCpfCnpj(cpfCnpj: string): Promise<AsaasCustomer | null> {
        try {
            const response = await fetch(`${this.baseUrl}/customers?cpfCnpj=${encodeURIComponent(cpfCnpj)}`)

            if (!response.ok) {
                return null
            }

            const result = await response.json()

            if (!result.success || !result.customers || result.customers.length === 0) {
                return null
            }

            return result.customers[0]
        } catch (error) {
            console.error('Erro ao buscar cliente por CPF/CNPJ:', error)
            return null
        }
    }

    // ========== ASSINATURAS ==========

    async createSubscription(data: CreateSubscriptionData): Promise<AsaasSubscription> {
        const response = await fetch(`${this.baseUrl}/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || errorData.message || 'Erro ao criar assinatura')
        }

        const result = await response.json()

        if (!result.success) {
            throw new Error(result.error || 'Erro ao criar assinatura')
        }

        return result.subscription
    }

    async createSubscriptionWithCard(data: CreateSubscriptionWithCardData): Promise<AsaasSubscription> {
        const response = await fetch(`${this.baseUrl}/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || errorData.message || 'Erro ao criar assinatura')
        }

        const result = await response.json()

        if (!result.success) {
            throw new Error(result.error || 'Erro ao criar assinatura')
        }

        return result.subscription
    }

    async getSubscription(subscriptionId: string): Promise<AsaasSubscription> {
        const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`)

        if (!response.ok) {
            throw new Error('Assinatura não encontrada')
        }

        return response.json()
    }

    async listSubscriptions(customerId?: string): Promise<AsaasSubscription[]> {
        const params = customerId ? `?customer=${customerId}` : ''
        const response = await fetch(`${this.baseUrl}/subscriptions${params}`)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || errorData.message || 'Erro ao buscar assinaturas')
        }

        const result = await response.json()

        if (!result.success) {
            throw new Error(result.error || 'Erro ao buscar assinaturas')
        }

        return result.subscriptions || []
    }

    // ========== PAGAMENTOS ==========

    async createPayment(data: CreatePaymentData): Promise<AsaasPayment> {
        const response = await fetch(`${this.baseUrl}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || errorData.message || 'Erro ao criar pagamento')
        }

        const result = await response.json()

        if (!result.success) {
            throw new Error(result.error || 'Erro ao criar pagamento')
        }

        return result.payment
    }

    async createPaymentWithCard(data: CreatePaymentWithCardData): Promise<AsaasPayment> {
        const response = await fetch(`${this.baseUrl}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || errorData.message || 'Erro ao criar pagamento')
        }

        const result = await response.json()

        if (!result.success) {
            throw new Error(result.error || 'Erro ao criar pagamento')
        }

        return result.payment
    }

    async getPayment(paymentId: string): Promise<AsaasPayment> {
        const response = await fetch(`${this.baseUrl}/payments/${paymentId}`)

        if (!response.ok) {
            throw new Error('Pagamento não encontrado')
        }

        return response.json()
    }

    async listPayments(customerId?: string, subscriptionId?: string): Promise<AsaasPayment[]> {
        const params = new URLSearchParams()
        if (customerId) params.append('customer', customerId)
        if (subscriptionId) params.append('subscription', subscriptionId)

        const response = await fetch(`${this.baseUrl}/payments?${params.toString()}`)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || errorData.message || 'Erro ao buscar pagamentos')
        }

        const result = await response.json()

        if (!result.success) {
            throw new Error(result.error || 'Erro ao buscar pagamentos')
        }

        return result.payments || []
    }

    // ========== PIX ==========

    async getPixQrCode(paymentId: string): Promise<{
        encodedImage: string
        payload: string
        expirationDate?: string
    }> {
        const response = await fetch(`${this.baseUrl}/pix/${paymentId}`)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || errorData.message || 'Erro ao buscar QR Code PIX')
        }

        const result = await response.json()

        if (!result.success) {
            throw new Error(result.error || 'Erro ao buscar QR Code PIX')
        }

        return result.qrCode
    }

    // ========== UTILITÁRIOS ==========

    async getCustomerIp(): Promise<string> {
        try {
            const response = await fetch('https://api.ipify.org?format=json')
            const data = await response.json()
            return data.ip
        } catch (error) {
            console.warn('Não foi possível obter IP do cliente:', error)
            return '0.0.0.0'
        }
    }

    formatPhone(phone: string): string {
        // Remove todos os caracteres não numéricos
        const cleaned = phone.replace(/\D/g, '')

        // Verifica se é celular (começa com 9) ou telefone
        if (cleaned.length === 11 && cleaned[2] === '9') {
            // Celular: (99) 99999-9999
            return cleaned.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2$3-$4')
        } else if (cleaned.length === 10) {
            // Telefone fixo: (99) 9999-9999
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
        }

        return phone // Retorna original se não conseguir formatar
    }

    formatCpfCnpj(cpfCnpj: string): string {
        const cleaned = cpfCnpj.replace(/\D/g, '')

        if (cleaned.length === 11) {
            // CPF: 999.999.999-99
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        } else if (cleaned.length === 14) {
            // CNPJ: 99.999.999/9999-99
            return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
        }

        return cpfCnpj // Retorna original se não conseguir formatar
    }

    validateCpf(cpf: string): boolean {
        const cleaned = cpf.replace(/\D/g, '')

        if (cleaned.length !== 11) return false

        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cleaned)) return false

        // Validação do CPF
        let sum = 0
        let remainder

        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i)
        }

        remainder = (sum * 10) % 11
        if (remainder === 10 || remainder === 11) remainder = 0
        if (remainder !== parseInt(cleaned.substring(9, 10))) return false

        sum = 0
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i)
        }

        remainder = (sum * 10) % 11
        if (remainder === 10 || remainder === 11) remainder = 0
        if (remainder !== parseInt(cleaned.substring(10, 11))) return false

        return true
    }

    validateCnpj(cnpj: string): boolean {
        const cleaned = cnpj.replace(/\D/g, '')

        if (cleaned.length !== 14) return false

        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cleaned)) return false

        // Validação do CNPJ (simplificada)
        const weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        let sum = 0

        for (let i = 0; i < 12; i++) {
            sum += parseInt(cleaned[i]) * weights[i + 1]
        }

        let remainder = sum % 11
        const digit1 = remainder < 2 ? 0 : 11 - remainder

        sum = 0
        for (let i = 0; i < 13; i++) {
            sum += parseInt(cleaned[i]) * weights[i]
        }

        remainder = sum % 11
        const digit2 = remainder < 2 ? 0 : 11 - remainder

        return digit1 === parseInt(cleaned[12]) && digit2 === parseInt(cleaned[13])
    }
}

// Export singleton instance
export const asaasService = new AsaasService()
