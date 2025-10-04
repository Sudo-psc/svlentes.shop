import { NextRequest, NextResponse } from 'next/server'
import { validateWebhook } from '@/lib/stripe'
import Stripe from 'stripe'

// Interface para logging estruturado
interface WebhookLog {
    eventType: string
    eventId: string
    timestamp: string
    customerId?: string
    subscriptionId?: string
    amount?: number
    status: 'success' | 'error'
    details?: any
    error?: string
}

// Função para log estruturado
function logWebhookEvent(log: WebhookLog) {
    const logEntry = {
        ...log,
        timestamp: new Date().toISOString(),
        source: 'stripe_webhook'
    }

    console.log('WEBHOOK_EVENT:', JSON.stringify(logEntry))

    // Em produção, você pode enviar para um serviço de logging como:
    // - DataDog
    // - New Relic
    // - CloudWatch
    // - Sentry
}

// Função para processar eventos de checkout completado
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    try {
        const customerEmail = session.customer_email
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string
        const metadata = session.metadata || {}

        logWebhookEvent({
            eventType: 'checkout.session.completed',
            eventId: session.id,
            timestamp: new Date().toISOString(),
            customerId,
            subscriptionId,
            amount: session.amount_total ? session.amount_total / 100 : undefined,
            status: 'success',
            details: {
                customerEmail,
                planId: metadata.planId,
                billingInterval: metadata.billingInterval,
                planName: metadata.planName,
                source: metadata.source
            }
        })

        // Lógica de negócio após checkout completado:

        // 1. Registrar conversão para analytics
        if (metadata.planId && metadata.billingInterval) {
            console.log('CONVERSION_EVENT:', {
                event: 'subscription_purchased',
                planId: metadata.planId,
                billingInterval: metadata.billingInterval,
                customerId,
                value: session.amount_total ? session.amount_total / 100 : 0,
                currency: 'BRL'
            })
        }

        // 2. Preparar dados para próximos passos
        const customerData = {
            stripeCustomerId: customerId,
            email: customerEmail,
            subscriptionId,
            planId: metadata.planId,
            planName: metadata.planName,
            billingInterval: metadata.billingInterval,
            checkoutCompletedAt: new Date().toISOString()
        }

        // 3. Aqui você integraria com:
        // - Banco de dados para salvar o cliente
        // - Sistema de email para boas-vindas
        // - CRM para criar lead/cliente
        // - Sistema de agendamento para primeira consulta
        // - Sistema de logística para primeira entrega

        console.log('CUSTOMER_ONBOARDING:', customerData)

        return { success: true, customerData }

    } catch (error) {
        logWebhookEvent({
            eventType: 'checkout.session.completed',
            eventId: session.id,
            timestamp: new Date().toISOString(),
            customerId: session.customer as string,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
        throw error
    }
}

// Função para processar eventos de assinatura criada
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
    try {
        const customerId = subscription.customer as string
        const priceId = subscription.items.data[0]?.price.id
        const subscriptionId = subscription.id
        const status = subscription.status
        const currentPeriodStart = new Date(subscription.current_period_start * 1000)
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
        const metadata = subscription.metadata || {}

        logWebhookEvent({
            eventType: 'customer.subscription.created',
            eventId: subscriptionId,
            timestamp: new Date().toISOString(),
            customerId,
            subscriptionId,
            status: 'success',
            details: {
                priceId,
                status,
                currentPeriodStart: currentPeriodStart.toISOString(),
                currentPeriodEnd: currentPeriodEnd.toISOString(),
                trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
                metadata
            }
        })

        // Lógica de ativação da assinatura:

        // 1. Determinar tipo de plano baseado no price ID
        let planType = 'unknown'
        if (priceId?.includes('basic')) planType = 'basic'
        else if (priceId?.includes('premium')) planType = 'premium'
        else if (priceId?.includes('vip')) planType = 'vip'

        // 2. Preparar dados para ativação
        const activationData = {
            customerId,
            subscriptionId,
            planType,
            priceId,
            status,
            activatedAt: new Date().toISOString(),
            nextBillingDate: currentPeriodEnd.toISOString(),
            isTrialActive: subscription.trial_end ? subscription.trial_end > Date.now() / 1000 : false
        }

        // 3. Aqui você integraria com:
        // - Sistema de entrega para programar primeira remessa
        // - Sistema de agendamento para consulta médica inicial
        // - Plataforma de email para sequência de onboarding
        // - App móvel para ativar acesso do usuário
        // - Sistema de atendimento para criar perfil de suporte

        console.log('SUBSCRIPTION_ACTIVATION:', activationData)

        // 4. Programar lembretes e follow-ups
        const followUpSchedule = {
            welcome_email: 'immediate',
            prescription_reminder: '+1 day',
            first_delivery_notification: '+3 days',
            consultation_scheduling: '+7 days',
            satisfaction_survey: '+30 days'
        }

        console.log('FOLLOW_UP_SCHEDULE:', { subscriptionId, schedule: followUpSchedule })

        return { success: true, activationData }

    } catch (error) {
        logWebhookEvent({
            eventType: 'customer.subscription.created',
            eventId: subscription.id,
            timestamp: new Date().toISOString(),
            customerId: subscription.customer as string,
            subscriptionId: subscription.id,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
        throw error
    }
}

// Função para processar eventos de pagamento bem-sucedido
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    try {
        const subscriptionId = invoice.subscription as string
        const customerId = invoice.customer as string
        const amountPaid = invoice.amount_paid / 100
        const currency = invoice.currency.toUpperCase()
        const invoiceId = invoice.id
        const billingReason = invoice.billing_reason
        const periodStart = invoice.period_start ? new Date(invoice.period_start * 1000) : null
        const periodEnd = invoice.period_end ? new Date(invoice.period_end * 1000) : null

        logWebhookEvent({
            eventType: 'invoice.payment_succeeded',
            eventId: invoiceId,
            timestamp: new Date().toISOString(),
            customerId,
            subscriptionId,
            amount: amountPaid,
            status: 'success',
            details: {
                currency,
                billingReason,
                periodStart: periodStart?.toISOString(),
                periodEnd: periodEnd?.toISOString(),
                invoiceNumber: invoice.number,
                hostedInvoiceUrl: invoice.hosted_invoice_url
            }
        })

        // Lógica após pagamento bem-sucedido:

        // 1. Determinar se é primeiro pagamento ou renovação
        const isFirstPayment = billingReason === 'subscription_create'
        const isRenewal = billingReason === 'subscription_cycle'

        // 2. Preparar dados do pagamento
        const paymentData = {
            customerId,
            subscriptionId,
            invoiceId,
            amountPaid,
            currency,
            paidAt: new Date().toISOString(),
            billingPeriod: {
                start: periodStart?.toISOString(),
                end: periodEnd?.toISOString()
            },
            isFirstPayment,
            isRenewal,
            receiptUrl: invoice.hosted_invoice_url
        }

        // 3. Ações baseadas no tipo de pagamento
        if (isFirstPayment) {
            console.log('FIRST_PAYMENT_SUCCESS:', paymentData)

            // Ações para primeiro pagamento:
            // - Ativar acesso completo
            // - Programar primeira entrega
            // - Enviar email de boas-vindas com comprovante
            // - Agendar consulta médica inicial

        } else if (isRenewal) {
            console.log('RENEWAL_PAYMENT_SUCCESS:', paymentData)

            // Ações para renovação:
            // - Confirmar próxima entrega
            // - Enviar comprovante de pagamento
            // - Atualizar status de assinatura ativa
            // - Verificar se precisa de nova consulta médica
        }

        // 4. Integração com sistemas externos:
        // - Sistema de entrega: confirmar/programar próxima remessa
        // - Sistema de email: enviar comprovante
        // - CRM: atualizar status do cliente
        // - Sistema financeiro: registrar receita
        // - Analytics: registrar evento de receita

        console.log('PAYMENT_PROCESSING:', paymentData)

        return { success: true, paymentData }

    } catch (error) {
        logWebhookEvent({
            eventType: 'invoice.payment_succeeded',
            eventId: invoice.id,
            timestamp: new Date().toISOString(),
            customerId: invoice.customer as string,
            subscriptionId: invoice.subscription as string,
            amount: invoice.amount_paid / 100,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
        throw error
    }
}

// Função para processar eventos de pagamento falhado
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    try {
        const subscriptionId = invoice.subscription as string
        const customerId = invoice.customer as string
        const customerEmail = invoice.customer_email
        const amountDue = invoice.amount_due / 100
        const currency = invoice.currency.toUpperCase()
        const invoiceId = invoice.id
        const attemptCount = invoice.attempt_count
        const nextPaymentAttempt = invoice.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000) : null

        logWebhookEvent({
            eventType: 'invoice.payment_failed',
            eventId: invoiceId,
            timestamp: new Date().toISOString(),
            customerId,
            subscriptionId,
            amount: amountDue,
            status: 'error',
            details: {
                customerEmail,
                currency,
                attemptCount,
                nextPaymentAttempt: nextPaymentAttempt?.toISOString(),
                failureCode: invoice.last_finalization_error?.code,
                failureMessage: invoice.last_finalization_error?.message
            }
        })

        // Lógica de recuperação de pagamento:

        // 1. Preparar dados da falha
        const paymentFailureData = {
            customerId,
            subscriptionId,
            invoiceId,
            customerEmail,
            amountDue,
            currency,
            attemptCount,
            failedAt: new Date().toISOString(),
            nextRetryAt: nextPaymentAttempt?.toISOString(),
            failureReason: invoice.last_finalization_error?.message || 'Payment failed'
        }

        // 2. Determinar ações baseadas no número de tentativas
        if (attemptCount === 1) {
            // Primeira falha - notificação suave
            console.log('FIRST_PAYMENT_FAILURE:', paymentFailureData)

            // Ações:
            // - Enviar email informativo sobre falha
            // - Sugerir atualização do método de pagamento
            // - Manter serviço ativo por alguns dias

        } else if (attemptCount === 2) {
            // Segunda falha - alerta mais urgente
            console.log('SECOND_PAYMENT_FAILURE:', paymentFailureData)

            // Ações:
            // - Enviar email urgente
            // - SMS de alerta
            // - Pausar próximas entregas
            // - Oferecer suporte direto

        } else if (attemptCount >= 3) {
            // Múltiplas falhas - ação crítica
            console.log('CRITICAL_PAYMENT_FAILURE:', paymentFailureData)

            // Ações:
            // - Pausar assinatura temporariamente
            // - Contato direto por telefone
            // - Oferecer plano de recuperação
            // - Preparar para possível cancelamento
        }

        // 3. Integração com sistemas de recuperação:
        // - Sistema de email: campanhas de recuperação
        // - Sistema de SMS: alertas urgentes
        // - CRM: criar task para equipe de retenção
        // - Sistema de entrega: pausar próximas remessas
        // - Atendimento: criar ticket de suporte prioritário

        console.log('PAYMENT_RECOVERY_INITIATED:', paymentFailureData)

        return { success: true, paymentFailureData }

    } catch (error) {
        logWebhookEvent({
            eventType: 'invoice.payment_failed',
            eventId: invoice.id,
            timestamp: new Date().toISOString(),
            customerId: invoice.customer as string,
            subscriptionId: invoice.subscription as string,
            amount: invoice.amount_due / 100,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
        throw error
    }
}

// Função para processar eventos de assinatura cancelada
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    try {
        const subscriptionId = subscription.id
        const customerId = subscription.customer as string
        const canceledAt = subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : new Date()
        const cancelAtPeriodEnd = subscription.cancel_at_period_end
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
        const cancellationReason = subscription.cancellation_details?.reason
        const cancellationComment = subscription.cancellation_details?.comment

        logWebhookEvent({
            eventType: 'customer.subscription.deleted',
            eventId: subscriptionId,
            timestamp: new Date().toISOString(),
            customerId,
            subscriptionId,
            status: 'success',
            details: {
                canceledAt: canceledAt.toISOString(),
                cancelAtPeriodEnd,
                currentPeriodEnd: currentPeriodEnd.toISOString(),
                cancellationReason,
                cancellationComment,
                wasActive: subscription.status === 'active'
            }
        })

        // Lógica de processamento do cancelamento:

        // 1. Preparar dados do cancelamento
        const cancellationData = {
            customerId,
            subscriptionId,
            canceledAt: canceledAt.toISOString(),
            finalBillingDate: currentPeriodEnd.toISOString(),
            cancellationReason: cancellationReason || 'not_specified',
            cancellationComment,
            wasImmediateCancellation: !cancelAtPeriodEnd,
            accessExpiresAt: cancelAtPeriodEnd ? currentPeriodEnd.toISOString() : canceledAt.toISOString()
        }

        // 2. Determinar tipo de cancelamento
        if (cancelAtPeriodEnd) {
            // Cancelamento ao final do período - cliente ainda tem acesso
            console.log('SCHEDULED_CANCELLATION:', cancellationData)

            // Ações:
            // - Manter acesso até o final do período
            // - Enviar email de confirmação
            // - Programar desativação para data final
            // - Oferecer pesquisa de feedback
            // - Campanha de retenção suave

        } else {
            // Cancelamento imediato
            console.log('IMMEDIATE_CANCELLATION:', cancellationData)

            // Ações:
            // - Desativar acesso imediatamente
            // - Cancelar entregas pendentes
            // - Processar reembolso se aplicável
            // - Enviar confirmação de cancelamento
        }

        // 3. Ações de offboarding:
        const offboardingActions = {
            disable_access: cancelAtPeriodEnd ? currentPeriodEnd : canceledAt,
            cancel_deliveries: 'immediate',
            send_confirmation_email: 'immediate',
            schedule_feedback_survey: '+1 day',
            create_winback_campaign: '+7 days',
            archive_customer_data: '+90 days' // Conforme LGPD
        }

        // 4. Integração com sistemas:
        // - Sistema de entrega: cancelar remessas futuras
        // - Sistema de acesso: programar desativação
        // - CRM: marcar como ex-cliente e motivo
        // - Email marketing: mover para lista de winback
        // - Atendimento: criar histórico de cancelamento
        // - Analytics: registrar churn event

        console.log('SUBSCRIPTION_OFFBOARDING:', {
            ...cancellationData,
            actions: offboardingActions
        })

        // 5. Preparar campanha de reativação (se apropriado)
        if (cancellationReason !== 'fraudulent' && cancellationReason !== 'duplicate') {
            const winbackCampaign = {
                customerId,
                canceledAt: canceledAt.toISOString(),
                reason: cancellationReason,
                scheduleWinbackEmail: '+30 days',
                offerSpecialDiscount: true,
                maxWinbackAttempts: 3
            }

            console.log('WINBACK_CAMPAIGN_SCHEDULED:', winbackCampaign)
        }

        return { success: true, cancellationData }

    } catch (error) {
        logWebhookEvent({
            eventType: 'customer.subscription.deleted',
            eventId: subscription.id,
            timestamp: new Date().toISOString(),
            customerId: subscription.customer as string,
            subscriptionId: subscription.id,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
        throw error
    }
}

// Função para processar eventos de atualização de assinatura
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    try {
        const subscriptionId = subscription.id
        const customerId = subscription.customer as string
        const status = subscription.status
        const previousAttributes = subscription.previous_attributes || {}

        logWebhookEvent({
            eventType: 'customer.subscription.updated',
            eventId: subscriptionId,
            timestamp: new Date().toISOString(),
            customerId,
            subscriptionId,
            status: 'success',
            details: {
                currentStatus: status,
                previousAttributes,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
            }
        })

        // Detectar mudanças importantes
        const statusChanged = previousAttributes.status && previousAttributes.status !== status
        const cancelationChanged = 'cancel_at_period_end' in previousAttributes

        if (statusChanged) {
            console.log('SUBSCRIPTION_STATUS_CHANGED:', {
                subscriptionId,
                customerId,
                from: previousAttributes.status,
                to: status,
                timestamp: new Date().toISOString()
            })
        }

        if (cancelationChanged) {
            console.log('SUBSCRIPTION_CANCELLATION_CHANGED:', {
                subscriptionId,
                customerId,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                timestamp: new Date().toISOString()
            })
        }

        return { success: true }

    } catch (error) {
        logWebhookEvent({
            eventType: 'customer.subscription.updated',
            eventId: subscription.id,
            timestamp: new Date().toISOString(),
            customerId: subscription.customer as string,
            subscriptionId: subscription.id,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
        throw error
    }
}

// Função para processar eventos de disputa (chargeback)
async function handleChargeDisputeCreated(dispute: Stripe.Dispute) {
    try {
        const disputeId = dispute.id
        const chargeId = dispute.charge as string
        const amount = dispute.amount / 100
        const currency = dispute.currency.toUpperCase()
        const reason = dispute.reason
        const status = dispute.status

        logWebhookEvent({
            eventType: 'charge.dispute.created',
            eventId: disputeId,
            timestamp: new Date().toISOString(),
            amount,
            status: 'error',
            details: {
                chargeId,
                currency,
                reason,
                disputeStatus: status,
                evidenceDueBy: dispute.evidence_details?.due_by ? new Date(dispute.evidence_details.due_by * 1000).toISOString() : null
            }
        })

        // Ações críticas para disputa:
        console.log('CHARGEBACK_ALERT:', {
            disputeId,
            chargeId,
            amount,
            currency,
            reason,
            status,
            urgentAction: 'evidence_required',
            dueDate: dispute.evidence_details?.due_by ? new Date(dispute.evidence_details.due_by * 1000).toISOString() : null
        })

        return { success: true }

    } catch (error) {
        console.error('Error handling dispute:', error)
        throw error
    }
}

export async function POST(request: NextRequest) {
    const startTime = Date.now()
    let eventType = 'unknown'
    let eventId = 'unknown'

    try {
        const body = await request.text()
        const signature = request.headers.get('stripe-signature')

        if (!signature) {
            logWebhookEvent({
                eventType: 'webhook.signature_missing',
                eventId: 'n/a',
                timestamp: new Date().toISOString(),
                status: 'error',
                error: 'Missing stripe-signature header'
            })

            return NextResponse.json(
                { error: 'Assinatura do webhook ausente' },
                { status: 400 }
            )
        }

        // Validar webhook do Stripe
        const event = validateWebhook(body, signature)
        eventType = event.type
        eventId = event.id

        console.log(`WEBHOOK_RECEIVED: ${eventType} (${eventId})`)

        // Processar diferentes tipos de eventos
        let result
        switch (event.type) {
            case 'checkout.session.completed':
                result = await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
                break

            case 'customer.subscription.created':
                result = await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
                break

            case 'customer.subscription.updated':
                result = await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
                break

            case 'customer.subscription.deleted':
                result = await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
                break

            case 'invoice.payment_succeeded':
                result = await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
                break

            case 'invoice.payment_failed':
                result = await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
                break

            case 'charge.dispute.created':
                result = await handleChargeDisputeCreated(event.data.object as Stripe.Dispute)
                break

            // Eventos adicionais importantes para assinaturas
            case 'customer.subscription.paused':
            case 'customer.subscription.resumed':
            case 'invoice.created':
            case 'invoice.finalized':
            case 'payment_method.attached':
            case 'customer.created':
            case 'customer.updated':
                console.log(`WEBHOOK_INFO: ${eventType} received but not processed`)
                result = { success: true, processed: false }
                break

            default:
                console.log(`WEBHOOK_UNHANDLED: ${eventType}`)
                result = { success: true, processed: false }
        }

        const processingTime = Date.now() - startTime

        // Log de sucesso
        logWebhookEvent({
            eventType,
            eventId,
            timestamp: new Date().toISOString(),
            status: 'success',
            details: {
                processingTimeMs: processingTime,
                processed: result?.success || false
            }
        })

        return NextResponse.json({
            received: true,
            processed: result?.success || false,
            eventType,
            eventId,
            processingTimeMs: processingTime
        })

    } catch (error) {
        const processingTime = Date.now() - startTime

        // Log de erro
        logWebhookEvent({
            eventType,
            eventId,
            timestamp: new Date().toISOString(),
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            details: {
                processingTimeMs: processingTime
            }
        })

        console.error('WEBHOOK_ERROR:', {
            eventType,
            eventId,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        })

        // Retornar erro apropriado
        if (error instanceof Error && error.message.includes('Invalid signature')) {
            return NextResponse.json(
                { error: 'Assinatura inválida' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            {
                error: 'Erro ao processar webhook',
                message: error instanceof Error ? error.message : 'Erro desconhecido',
                eventType,
                eventId
            },
            { status: 500 }
        )
    }
}

// Método GET para verificar se o webhook está funcionando
export async function GET() {
    return NextResponse.json({
        success: true,
        message: 'Webhook do Stripe funcionando',
        timestamp: new Date().toISOString(),
    })
}