// lib/asaas.ts - Cliente HTTP para API Asaas
export const ASAAS_BASE = process.env.ASAAS_API_BASE!;
const API_KEY = process.env.ASAAS_API_KEY!;

export interface AsaasCustomer {
    id?: string;
    name: string;
    email: string;
    mobilePhone: string;
    cpfCnpj: string;
    postalCode?: string;
    address?: string;
    addressNumber?: string;
    complement?: string;
    province?: string;
    notificationDisabled?: boolean;
}

export interface AsaasSubscription {
    id?: string;
    customer: string;
    billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
    nextDueDate: string;
    value: number;
    cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';
    description?: string;
    creditCard?: {
        holderName: string;
        number: string;
        expiryMonth: string;
        expiryYear: string;
        ccv: string;
    };
    creditCardHolderInfo?: {
        name: string;
        email: string;
        cpfCnpj: string;
        postalCode: string;
        addressNumber: string;
        addressComplement?: string;
        phone?: string;
        mobilePhone: string;
    };
    creditCardToken?: string;
    remoteIp?: string;
}

export interface AsaasPayment {
    id?: string;
    customer: string;
    billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
    value: number;
    dueDate: string;
    description?: string;
    creditCard?: {
        holderName: string;
        number: string;
        expiryMonth: string;
        expiryYear: string;
        ccv: string;
    };
    creditCardHolderInfo?: {
        name: string;
        email: string;
        cpfCnpj: string;
        postalCode: string;
        addressNumber: string;
        addressComplement?: string;
        phone?: string;
        mobilePhone: string;
    };
    creditCardToken?: string;
    remoteIp?: string;
    callback?: {
        successUrl: string;
        autoRedirect: boolean;
    };
}

async function asaas<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${ASAAS_BASE}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'access_token': API_KEY,
            ...(init?.headers || {})
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Asaas ${res.status}: ${body}`);
    }

    return res.json() as Promise<T>;
}

export const Asaas = {
    createCustomer: (payload: AsaasCustomer) =>
        asaas('/customers', { method: 'POST', body: JSON.stringify(payload) }),

    createSubscription: (payload: AsaasSubscription) =>
        asaas('/subscriptions', { method: 'POST', body: JSON.stringify(payload) }),

    createPayment: (payload: AsaasPayment) =>
        asaas('/payments', { method: 'POST', body: JSON.stringify(payload) }),

    getPayment: (id: string) =>
        asaas(`/payments/${id}`, { method: 'GET' }),

    getPixQrCode: (id: string) =>
        asaas(`/payments/${id}/pixQrCode`, { method: 'GET' }),

    getSubscriptionPayments: (id: string) =>
        asaas(`/subscriptions/${id}/payments`, { method: 'GET' }),
};
