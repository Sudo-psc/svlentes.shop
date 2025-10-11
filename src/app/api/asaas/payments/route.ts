import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { asaas } from '@/lib/payments/asaas'

// Schema para validação de criação de pagamento
const createPaymentSchema = z.object({
    customer: z.string().min(1, 'ID do cliente é obrigatório'),
    billingType: z.enum(['BOLETO', 'CREDIT_CARD', 'PIX'], {
        errorMap: () => ({ message: 'Tipo de cobrança inválido' })
    }),
    value: z.number().min(1, 'Valor deve ser maior que 0'),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
    description: z.string().optional(),
    externalReference: z.string().optional(),
    installmentCount: z.number().optional(),
    installmentValue: z.number().optional(),
    discount: z.object({
        value: z.number(),
        dueDateLimitDays: z.number().optional(),
        type: z.enum(['FIXED', 'PERCENTAGE']).optional()
    }).optional(),
    interest: z.object({
        value: z.number()
    }).optional(),
    fine: z.object({
        value: z.number()
    }).optional(),
    postalService: z.boolean().optional(),
    split: z.array(z.object({
        walletId: z.string(),
        percentualValue: z.number().optional(),
        fixedValue: z.number().optional()
    })).optional()
})

// Schema para pagamento com cartão de crédito
const createPaymentWithCardSchema = createPaymentSchema.extend({
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
    try {
        const body = await request.json()

        // Verificar se é pagamento com cartão ou sem cartão
        const hasCreditCard = body.creditCard && body.creditCardHolderInfo

        // Validar dados de entrada
        let validatedData
        if (hasCreditCard) {
            validatedData = createPaymentWithCardSchema.parse(body)
        } else {
            validatedData = createPaymentSchema.parse(body)
        }

        // Criar pagamento no ASAAS
        const payment = await asaas.createPayment(validatedData)

        // Log para desenvolvimento
        console.log('Pagamento ASAAS criado:', {
            id: payment.id,
            customer: payment.customer,
            value: payment.value,
            billingType: payment.billingType,
            dueDate: payment.dueDate,
            status: payment.status
        })

        return NextResponse.json({
            success: true,
            payment: {
                id: payment.id,
                customer: payment.customer,
                subscription: payment.subscription,
                billingType: payment.billingType,
                value: payment.value,
                netValue: payment.netValue,
                dueDate: payment.dueDate,
                status: payment.status,
                description: payment.description,
                externalReference: payment.externalReference,
                invoiceUrl: payment.invoiceUrl,
                bankSlipUrl: payment.bankSlipUrl,
                nossoNumero: payment.nossoNumero,
                transactionReceiptUrl: payment.transactionReceiptUrl
            }
        })

    } catch (error) {
        console.error('Erro ao criar pagamento ASAAS:', error)

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
            error: 'Erro ao criar pagamento. Tente novamente.'
        }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl
        const customer = searchParams.get('customer')
        const subscription = searchParams.get('subscription')
        const status = searchParams.get('status')
        const limit = searchParams.get('limit')
        const offset = searchParams.get('offset')

        // Montar parâmetros de busca
        const params: any = {}
        if (customer) params.customer = customer
        if (subscription) params.subscription = subscription
        if (status) params.status = status
        if (limit) params.limit = parseInt(limit)
        if (offset) params.offset = parseInt(offset)

        // Buscar pagamentos
        const payments = await asaas.listPayments(params)

        return NextResponse.json({
            success: true,
            payments: payments.data.map(payment => ({
                id: payment.id,
                customer: payment.customer,
                subscription: payment.subscription,
                billingType: payment.billingType,
                value: payment.value,
                netValue: payment.netValue,
                dueDate: payment.dueDate,
                status: payment.status,
                description: payment.description,
                externalReference: payment.externalReference,
                invoiceUrl: payment.invoiceUrl,
                bankSlipUrl: payment.bankSlipUrl,
                nossoNumero: payment.nossoNumero,
                confirmedDate: payment.confirmedDate,
                paymentDate: payment.paymentDate,
                deleted: payment.deleted
            })),
            pagination: {
                hasMore: payments.hasMore,
                totalCount: payments.totalCount,
                limit: payments.limit,
                offset: payments.offset
            }
        })

    } catch (error) {
        console.error('Erro ao buscar pagamentos ASAAS:', error)

        return NextResponse.json({
            success: false,
            error: 'Erro ao buscar pagamentos'
        }, { status: 500 })
    }
}
