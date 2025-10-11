import { NextRequest, NextResponse } from 'next/server'
import { AsaasWebhookPayload, AsaasWebhookEvent } from '@/types/asaas'

const WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN

// Eventos que vamos processar
const PROCESSED_EVENTS: AsaasWebhookEvent[] = [
    'PAYMENT_CREATED',
    'PAYMENT_CONFIRMED',
    'PAYMENT_RECEIVED',
    'PAYMENT_OVERDUE',
    'PAYMENT_DELETED',
    'PAYMENT_REFUNDED'
]

export async function POST(request: NextRequest) {
    try {
        // Validar token do webhook
        const tokenHeader = request.headers.get('asaas-access-token')
        if (!tokenHeader || tokenHeader !== WEBHOOK_TOKEN) {
            console.error('Webhook ASAAS: Token inválido', {
                receivedToken: tokenHeader,
                expectedToken: WEBHOOK_TOKEN?.substring(0, 10) + '...'
            })
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await request.json()
        const { event, payment } = body as AsaasWebhookPayload

        // Validar estrutura do payload
        if (!event || !payment) {
            console.error('Webhook ASAAS: Payload inválido', { event, payment })
            return new NextResponse('Bad Request', { status: 400 })
        }

        // Verificar se processamos este tipo de evento
        if (!PROCESSED_EVENTS.includes(event)) {
            console.log('Webhook ASAAS: Evento não processado', { event, paymentId: payment.id })
            return NextResponse.json({ ok: true, message: 'Event not processed' })
        }

        // Log do evento recebido
        console.log('Webhook ASAAS: Evento recebido', {
            event,
            paymentId: payment.id,
            customer: payment.customer,
            subscription: payment.subscription,
            value: payment.value,
            status: payment.status,
            billingType: payment.billingType
        })

        // TODO: Implementar idempotência
        // Verificar se este paymentId já foi processado
        // Ex: const alreadyProcessed = await checkPaymentProcessed(payment.id)
        // if (alreadyProcessed) {
        //     return NextResponse.json({ ok: true, message: 'Already processed' })
        // }

        // Processar o evento baseado no tipo
        switch (event) {
            case 'PAYMENT_CREATED':
                await handlePaymentCreated(payment)
                break

            case 'PAYMENT_CONFIRMED':
            case 'PAYMENT_RECEIVED':
                await handlePaymentConfirmed(payment)
                break

            case 'PAYMENT_OVERDUE':
                await handlePaymentOverdue(payment)
                break

            case 'PAYMENT_DELETED':
                await handlePaymentDeleted(payment)
                break

            case 'PAYMENT_REFUNDED':
                await handlePaymentRefunded(payment)
                break

            default:
                console.log('Webhook ASAAS: Evento não tratado', { event })
        }

        return NextResponse.json({
            ok: true,
            message: 'Event processed successfully',
            event,
            paymentId: payment.id
        })

    } catch (error) {
        console.error('Webhook ASAAS: Erro ao processar evento', error)

        // Em caso de erro, ainda retornamos 200 para não retry
        // Mas logamos o erro para monitoramento
        return NextResponse.json({
            ok: false,
            error: 'Internal server error',
            message: 'Event processing failed'
        }, { status: 500 })
    }
}

// Handlers específicos para cada tipo de evento
async function handlePaymentCreated(payment: AsaasWebhookPayload['payment']) {
    console.log('Processando PAYMENT_CREATED', {
        paymentId: payment.id,
        customer: payment.customer,
        value: payment.value
    })

    // TODO: Implementar lógica de negócio
    // - Marcar pagamento como pendente no banco
    // - Enviar email de confirmação de pedido
    // - Criar ordem de serviço
    // - Atualizar dashboard administrativo
}

async function handlePaymentConfirmed(payment: AsaasWebhookPayload['payment']) {
    console.log('Processando PAYMENT_CONFIRMED', {
        paymentId: payment.id,
        customer: payment.customer,
        subscription: payment.subscription,
        value: payment.value,
        paymentDate: payment.paymentDate
    })

    // TODO: Implementar lógica de negócio
    // - Ativar assinatura/se serviço
    // - Enviar email de boas-vindas
    // - Criar/agendar consultas
    // - Atualizar status do pedido
    // - Enviar notificações internas

    // Se for assinatura, pode precisar ativar o acesso
    if (payment.subscription) {
        console.log('Pagamento de assinatura confirmado', {
            subscriptionId: payment.subscription,
            paymentId: payment.id
        })
    }
}

async function handlePaymentOverdue(payment: AsaasWebhookPayload['payment']) {
    console.log('Processando PAYMENT_OVERDUE', {
        paymentId: payment.id,
        customer: payment.customer,
        dueDate: payment.dueDate,
        value: payment.value
    })

    // TODO: Implementar lógica de negócio
    // - Enviar notificação de pagamento em atraso
    // - Bloquear acesso temporariamente
    // - Agendar cobranças adicionais
    // - Notificar equipe de suporte
}

async function handlePaymentDeleted(payment: AsaasWebhookPayload['payment']) {
    console.log('Processando PAYMENT_DELETED', {
        paymentId: payment.id,
        customer: payment.customer,
        value: payment.value
    })

    // TODO: Implementar lógica de negócio
    // - Cancelar ordem de serviço
    // - Notificar cliente sobre cancelamento
    // - Reembolsar se aplicável
    // - Atualizar dashboard
}

async function handlePaymentRefunded(payment: AsaasWebhookPayload['payment']) {
    console.log('Processando PAYMENT_REFUNDED', {
        paymentId: payment.id,
        customer: payment.customer,
        value: payment.value,
        refunds: payment.refunds
    })

    // TODO: Implementar lógica de negócio
    // - Processar reembolso
    // - Cancelar serviços futuros
    // - Enviar confirmação de reembolso
    // - Atualizar relatórios financeiros
}

// Endpoint GET para testes (opcional)
export async function GET() {
    return NextResponse.json({
        message: 'Webhook ASAAS está ativo',
        timestamp: new Date().toISOString(),
        environment: process.env.ASAAS_ENV || 'sandbox'
    })
}
