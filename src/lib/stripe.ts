import Stripe from 'stripe'

// Configuração do Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
    typescript: true,
})

// Configuração do Stripe para o cliente (frontend)
export const stripeConfig = {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    apiVersion: '2023-10-16' as const,
}

// Produtos e preços do Stripe (IDs reais serão configurados no dashboard)
export const stripeProducts = {
    basic: {
        productId: 'prod_basic_svlentes',
        prices: {
            monthly: 'price_basic_monthly',
            annual: 'price_basic_annual'
        }
    },
    premium: {
        productId: 'prod_premium_svlentes',
        prices: {
            monthly: 'price_premium_monthly',
            annual: 'price_premium_annual'
        }
    },
    vip: {
        productId: 'prod_vip_svlentes',
        prices: {
            monthly: 'price_vip_monthly',
            annual: 'price_vip_annual'
        }
    }
}

// Função para criar sessão de checkout
export async function createCheckoutSession({
    priceId,
    customerId,
    customerEmail,
    customerName,
    metadata,
    successUrl,
    cancelUrl,
}: {
    priceId: string
    customerId?: string
    customerEmail: string
    customerName: string
    metadata: Record<string, string>
    successUrl: string
    cancelUrl: string
}) {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer: customerId,
            customer_email: customerId ? undefined : customerEmail,
            customer_creation: customerId ? undefined : 'always',
            metadata,
            subscription_data: {
                metadata,
            },
            success_url: successUrl,
            cancel_url: cancelUrl,
            allow_promotion_codes: true,
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['BR'],
            },
            phone_number_collection: {
                enabled: true,
            },
            custom_text: {
                submit: {
                    message: 'Ao confirmar, você concorda com nossos termos de serviço e política de privacidade.',
                },
            },
            locale: 'pt-BR',
        })

        return session
    } catch (error) {
        console.error('Erro ao criar sessão de checkout:', error)
        throw error
    }
}

// Função para criar ou atualizar cliente
export async function createOrUpdateCustomer({
    email,
    name,
    phone,
    metadata,
}: {
    email: string
    name: string
    phone?: string
    metadata?: Record<string, string>
}) {
    try {
        // Verificar se cliente já existe
        const existingCustomers = await stripe.customers.list({
            email,
            limit: 1,
        })

        if (existingCustomers.data.length > 0) {
            // Atualizar cliente existente
            const customer = await stripe.customers.update(existingCustomers.data[0].id, {
                name,
                phone,
                metadata,
            })
            return customer
        } else {
            // Criar novo cliente
            const customer = await stripe.customers.create({
                email,
                name,
                phone,
                metadata,
            })
            return customer
        }
    } catch (error) {
        console.error('Erro ao criar/atualizar cliente:', error)
        throw error
    }
}

// Função para obter detalhes da assinatura
export async function getSubscription(subscriptionId: string) {
    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ['customer', 'items.data.price.product'],
        })
        return subscription
    } catch (error) {
        console.error('Erro ao obter assinatura:', error)
        throw error
    }
}

// Função para cancelar assinatura
export async function cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true) {
    try {
        const subscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: cancelAtPeriodEnd,
        })
        return subscription
    } catch (error) {
        console.error('Erro ao cancelar assinatura:', error)
        throw error
    }
}

// Função para pausar assinatura
export async function pauseSubscription(subscriptionId: string) {
    try {
        const subscription = await stripe.subscriptions.update(subscriptionId, {
            pause_collection: {
                behavior: 'keep_as_draft',
            },
        })
        return subscription
    } catch (error) {
        console.error('Erro ao pausar assinatura:', error)
        throw error
    }
}

// Função para reativar assinatura
export async function resumeSubscription(subscriptionId: string) {
    try {
        const subscription = await stripe.subscriptions.update(subscriptionId, {
            pause_collection: null,
        })
        return subscription
    } catch (error) {
        console.error('Erro ao reativar assinatura:', error)
        throw error
    }
}

// Função para criar portal do cliente
export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        })
        return session
    } catch (error) {
        console.error('Erro ao criar sessão do portal:', error)
        throw error
    }
}

// Função para validar webhook
export function validateWebhook(payload: string, signature: string) {
    try {
        const event = stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
        return event
    } catch (error) {
        console.error('Erro ao validar webhook:', error)
        throw error
    }
}

// Tipos para melhor tipagem
export type StripeCheckoutSession = Stripe.Checkout.Session
export type StripeCustomer = Stripe.Customer
export type StripeSubscription = Stripe.Subscription
export type StripeEvent = Stripe.Event