import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { stripe, createOrUpdateCustomer, createCheckoutSession } from '@/lib/stripe'
import { pricingPlans } from '@/data/pricing-plans'

// Schema para validação dos dados do checkout
const checkoutRequestSchema = z.object({
    planId: z.enum(['basic', 'premium', 'vip'], {
        errorMap: () => ({ message: 'Plano inválido' })
    }),
    billingInterval: z.enum(['monthly', 'annual'], {
        errorMap: () => ({ message: 'Intervalo de cobrança inválido' })
    }),
    customerData: z.object({
        name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
        email: z.string().email('Email inválido'),
        phone: z.string().optional(),
    }),
    metadata: z.record(z.string()).optional(),
    successUrl: z.string().url('URL de sucesso inválida').optional(),
    cancelUrl: z.string().url('URL de cancelamento inválida').optional(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validar dados de entrada
        const validatedData = checkoutRequestSchema.parse(body)

        const { planId, billingInterval, customerData, metadata = {}, successUrl, cancelUrl } = validatedData

        // Encontrar o plano selecionado
        const selectedPlan = pricingPlans.find(plan => plan.id === planId)
        if (!selectedPlan) {
            return NextResponse.json(
                { error: 'Plano não encontrado' },
                { status: 400 }
            )
        }

        // Determinar o price ID baseado no plano e intervalo
        let priceId: string

        if (billingInterval === 'annual') {
            // Para planos anuais, usar os price IDs anuais
            const annualPriceIds = {
                basic: 'price_basic_annual',
                premium: 'price_premium_annual',
                vip: 'price_vip_annual'
            }
            priceId = annualPriceIds[planId]
        } else {
            // Para planos mensais, usar os price IDs mensais
            const monthlyPriceIds = {
                basic: 'price_basic_monthly',
                premium: 'price_premium_monthly',
                vip: 'price_vip_monthly'
            }
            priceId = monthlyPriceIds[planId]
        }

        // Verificar se o price ID existe no Stripe
        try {
            await stripe.prices.retrieve(priceId)
        } catch (error) {
            console.error('Price ID não encontrado no Stripe:', priceId, error)
            return NextResponse.json(
                { error: 'Configuração de preço não encontrada. Entre em contato com o suporte.' },
                { status: 400 }
            )
        }

        // Criar ou atualizar cliente no Stripe
        const customer = await createOrUpdateCustomer({
            email: customerData.email,
            name: customerData.name,
            phone: customerData.phone,
            metadata: {
                ...metadata,
                planId,
                billingInterval,
                source: 'landing_page',
                createdAt: new Date().toISOString(),
            }
        })

        // URLs padrão se não fornecidas
        const baseUrl = request.nextUrl.origin
        const defaultSuccessUrl = successUrl || `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`
        const defaultCancelUrl = cancelUrl || `${baseUrl}/cancel`

        // Criar sessão de checkout
        const session = await createCheckoutSession({
            priceId,
            customerId: customer.id,
            customerEmail: customer.email!,
            customerName: customer.name!,
            metadata: {
                ...metadata,
                planId,
                billingInterval,
                customerId: customer.id,
                planName: selectedPlan.name,
                source: 'landing_page',
            },
            successUrl: defaultSuccessUrl,
            cancelUrl: defaultCancelUrl,
        })

        // Log da criação da sessão para analytics
        console.log('Checkout session created:', {
            sessionId: session.id,
            customerId: customer.id,
            planId,
            billingInterval,
            amount: billingInterval === 'annual' ? selectedPlan.priceAnnual : selectedPlan.priceMonthly,
        })

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
            customer: {
                id: customer.id,
                email: customer.email,
                name: customer.name,
            },
            plan: {
                id: planId,
                name: selectedPlan.name,
                billingInterval,
                amount: billingInterval === 'annual' ? selectedPlan.priceAnnual : selectedPlan.priceMonthly,
            }
        })

    } catch (error) {
        console.error('Erro ao criar checkout session:', error)

        // Tratar erros de validação
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Dados inválidos',
                    details: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                },
                { status: 400 }
            )
        }

        // Tratar erros do Stripe
        if (error instanceof Error && error.message.includes('stripe')) {
            return NextResponse.json(
                { error: 'Erro no processamento do pagamento. Tente novamente.' },
                { status: 500 }
            )
        }

        // Erro genérico
        return NextResponse.json(
            { error: 'Erro interno do servidor. Tente novamente.' },
            { status: 500 }
        )
    }
}

// Endpoint GET para obter informações dos planos disponíveis
export async function GET() {
    try {
        // Retornar informações dos planos para o frontend
        const plansInfo = pricingPlans.map(plan => ({
            id: plan.id,
            name: plan.name,
            priceMonthly: plan.priceMonthly,
            priceAnnual: plan.priceAnnual,
            features: plan.features,
            recommended: plan.recommended,
            ctaText: plan.ctaText,
        }))

        return NextResponse.json({
            plans: plansInfo,
            currency: 'BRL',
            locale: 'pt-BR',
        })

    } catch (error) {
        console.error('Erro ao obter informações dos planos:', error)
        return NextResponse.json(
            { error: 'Erro ao carregar informações dos planos' },
            { status: 500 }
        )
    }
}