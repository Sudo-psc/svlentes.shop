import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { asaas } from '@/lib/payments/asaas'

// Schema para validação de criação de cliente
const createCustomerSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    mobilePhone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
    phone: z.string().optional(),
    cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
    postalCode: z.string().optional(),
    address: z.string().optional(),
    addressNumber: z.string().optional(),
    complement: z.string().optional(),
    province: z.string().optional(),
    externalReference: z.string().optional(),
    notificationDisabled: z.boolean().optional().default(false),
    observations: z.string().optional()
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validar dados de entrada
        const validatedData = createCustomerSchema.parse(body)

        // Criar cliente no ASAAS
        const customer = await asaas.createCustomer(validatedData)

        // Log para desenvolvimento
        console.log('Cliente ASAAS criado:', {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            cpfCnpj: customer.cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') // Mascara CPF
        })

        return NextResponse.json({
            success: true,
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                mobilePhone: customer.mobilePhone,
                phone: customer.phone,
                cpfCnpj: customer.cpfCnpj,
                address: customer.address,
                addressNumber: customer.addressNumber,
                complement: customer.complement,
                province: customer.province,
                postalCode: customer.postalCode,
                externalReference: customer.externalReference
            }
        })

    } catch (error) {
        console.error('Erro ao criar cliente ASAAS:', error)

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
            if (errorMessage.includes('already exists')) {
                return NextResponse.json({
                    success: false,
                    error: 'Já existe um cliente com este email ou CPF/CNPJ'
                }, { status: 409 })
            }

            if (errorMessage.includes('invalid')) {
                return NextResponse.json({
                    success: false,
                    error: 'Dados inválidos. Verifique as informações e tente novamente.'
                }, { status: 400 })
            }
        }

        // Erro genérico
        return NextResponse.json({
            success: false,
            error: 'Erro ao criar cliente. Tente novamente.'
        }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl
        const email = searchParams.get('email')
        const cpfCnpj = searchParams.get('cpfCnpj')
        const limit = searchParams.get('limit')
        const offset = searchParams.get('offset')

        // Montar parâmetros de busca
        const params: any = {}
        if (email) params.email = email
        if (cpfCnpj) params.cpfCnpj = cpfCnpj
        if (limit) params.limit = parseInt(limit)
        if (offset) params.offset = parseInt(offset)

        // Buscar clientes
        const customers = await asaas.listCustomers(params)

        return NextResponse.json({
            success: true,
            customers: customers.data.map(customer => ({
                id: customer.id,
                name: customer.name,
                email: customer.email,
                mobilePhone: customer.mobilePhone,
                phone: customer.phone,
                cpfCnpj: customer.cpfCnpj,
                address: customer.address,
                addressNumber: customer.addressNumber,
                complement: customer.complement,
                province: customer.province,
                postalCode: customer.postalCode,
                externalReference: customer.externalReference,
                deleted: customer.deleted
            })),
            pagination: {
                hasMore: customers.hasMore,
                totalCount: customers.totalCount,
                limit: customers.limit,
                offset: customers.offset
            }
        })

    } catch (error) {
        console.error('Erro ao buscar clientes ASAAS:', error)

        return NextResponse.json({
            success: false,
            error: 'Erro ao buscar clientes'
        }, { status: 500 })
    }
}
