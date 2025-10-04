// Tipos para integração com Stripe

export interface StripeCustomer {
    id: string;
    email: string;
    name: string;
    phone?: string;
    metadata: {
        prescription: string; // JSON serializado
        preferences: string; // JSON serializado
    };
}

export interface StripeSubscription {
    id: string;
    customer: string;
    status: 'active' | 'canceled' | 'past_due';
    current_period_start: number;
    current_period_end: number;
    items: {
        data: Array<{
            price: {
                id: string;
                product: string;
                unit_amount: number;
                recurring: {
                    interval: 'month' | 'year';
                };
            };
        }>;
    };
}

export interface StripeProduct {
    id: string;
    name: string;
    description: string;
    metadata: {
        planType: 'basic' | 'premium' | 'vip';
        features: string; // JSON serializado
    };
}

export interface StripePrice {
    id: string;
    product: string;
    unit_amount: number;
    currency: string;
    recurring: {
        interval: 'month' | 'year';
        interval_count: number;
    };
    metadata: {
        planName: string;
        recommended?: string;
    };
}

export interface CheckoutSessionData {
    priceId: string;
    customerId?: string;
    customerEmail: string;
    customerName: string;
    metadata: {
        leadData: string; // JSON serializado
        planType: string;
        source: string;
    };
    successUrl: string;
    cancelUrl: string;
}