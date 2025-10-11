import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { asaas } from '@/lib/payments/asaas'

// Schema para validação de criação de assinatura
const createSubscriptionSchema = z.object({
    customer: z.string().min(1, 'ID do cliente é obrigatório'),
    billingType: z.enum(['BOLETO', 'CREDIT_CARD', 'PIX'], {
        errorMap: () => ({ message: 'Tipo de cobrança inválido' })
    }),
    value: z.number().min(1, 'Valor deve ser maior que 0'),
    nextDueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
    cycle: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMIANNUALLY', 'YEARLY'], {
        errorMap: () => ({ message: 'Ciclo de cobrança inválido' })
    }),
    description: z.string().optional(),
    endDate: z.string().optional(),
    maxPayments: z.number().optional(),
    externalReference: z.string().optional(),
    split: z.array(z.object({
        walletId: z.string(),
        percentualValue: z.number().optional(),
        fixedValue: z.number().optional()
    })).optional()
})

// Schema para assinatura com cartão de crédito
const createSubscriptionWithCardSchema = createSubscriptionSchema.extend({
    creditCard: z.object({
        holderName: z.string().min(1, 'Nome do titular é obrigatório'),
        number: z.string().min(13, 'Número do cartão inválido'),
        expiryMonth: z.string().min(2, 'Mês de validade inválido'),
        expiryYear: z.string().min(4, 'Ano de validade inválido'),
        ccv: z.string().min(3, 'CVV inválido')
    }),
    creditCardHolderInfo: z.object({
        name: z.string().min(1, 'Nome do titular é obrigatório'),
        email: z.string().email('Email inválido'),
        cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
        postalCode: z.string().min(8, 'CEP inválido'),
        addressNumber: z.string().min(1, 'Número do endereço é obrigatório'),
        addressComplement: z.string().optional(),
        phone: z.string().optional(),
        mobilePhone: z.string().min(10, 'Celular é obrigatório')
    }),
    remoteIp: z.string().ip('IP inválido')
})

export async function POST(request: NextRequest) {
    let hasCreditCard = false

    try {
        const body = await request.json()

        // Verificar se é assinatura com cartão ou sem cartão
        hasCreditCard = body.creditCard && body.creditCardHolderInfo

        // Validar dados de entrada
        let validatedData
        if (hasCreditCard) {
            validatedData = createSubscriptionWithCardSchema.parse(body)
        } else {
            validatedData = createSubscriptionSchema.parse(body)
        }

        // Criar assinatura no ASAAS
        const subscription = await asaas.createSubscription(validatedData)

        // Log para desenvolvimento (sem dados sensíveis)
        console.log('Assinatura ASAAS criada:', {
            id: subscription.id,
            customer: subscription.customer,
            value: subscription.value,
            billingType: subscription.billingType,
            cycle: subscription.cycle,
            nextDueDate: subscription.nextDueDate,
            timestamp: new Date().toISOString()
        })

        return NextResponse.json({
            success: true,
            subscription: {
                id: subscription.id,
                customer: subscription.customer,
                billingType: subscription.billingType,
                value: subscription.value,
                nextDueDate: subscription.nextDueDate,
                cycle: subscription.cycle,
                description: subscription.description,
                status: subscription.status,
                endDate: subscription.endDate,
                maxPayments: subscription.maxPayments,
                externalReference: subscription.externalReference
            }
        })

    } catch (error) {
        console.error('Erro ao criar assinatura ASAAS:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            // Não logar dados sensíveis do cartão
            hasCreditCard: hasCreditCard
        })

        // Tratar erros de validação
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                error: 'Dados inválidos',
                details: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            }, { status: 400 })
        }

        // Tratar erros do ASAAS
        if (error instanceof Error) {
            const errorMessage = error.message

            // Erros comuns do ASAAS
            if (errorMessage.includes('customer not found')) {
                return NextResponse.json({
                    success: false,
                    error: 'Cliente não encontrado'
                }, { status: 404 })
            }

            if (errorMessage.includes('invalid')) {
                return NextResponse.json({
                    success: false,
                    error: 'Dados inválidos. Verifique as informações e tente novamente.'
                }, { status: 400 })
            }

            if (errorMessage.includes('credit card')) {
                return NextResponse.json({
                    success: false,
                    error: 'Dados do cartão inválidos. Verifique as informações e tente novamente.'
                }, { status: 400 })
            }
        }

        // Erro genérico
        return NextResponse.json({
            success: false,
            error: 'Erro ao criar assinatura. Tente novamente.'
        }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    let customer: string | null = null
    let status: string | null = null

    try {
        const { searchParams } = request.nextUrl
        customer = searchParams.get('customer')
        status = searchParams.get('status')
        const limit = searchParams.get('limit')
        const offset = searchParams.get('offset')

        // Montar parâmetros de busca
        const params: any = {}
        if (customer) params.customer = customer
        if (status) params.status = status
        if (limit) params.limit = parseInt(limit)
        if (offset) params.offset = parseInt(offset)

        // Buscar assinaturas
        const subscriptions = await asaas.listSubscriptions(params)

        return NextResponse.json({
            success: true,
            subscriptions: subscriptions.data.map(subscription => ({
                id: subscription.id,
                customer: subscription.customer,
                billingType: subscription.billingType,
                value: subscription.value,
                nextDueDate: subscription.nextDueDate,
                cycle: subscription.cycle,
                description: subscription.description,
                status: subscription.status,
                endDate: subscription.endDate,
                maxPayments: subscription.maxPayments,
                externalReference: subscription.externalReference,
                deleted: subscription.deleted
            })),
            pagination: {
                hasMore: subscriptions.hasMore,
                totalCount: subscriptions.totalCount,
                limit: subscriptions.limit,
                offset: subscriptions.offset
            }
        })

    } catch (error) {
        console.error('Erro ao buscar assinaturas ASAAS:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            customer: customer || undefined,
            status: status || undefined
        })

        return NextResponse.json({
            success: false,
            error: 'Erro ao buscar assinaturas'
        }, { status: 500 })
    }
}
