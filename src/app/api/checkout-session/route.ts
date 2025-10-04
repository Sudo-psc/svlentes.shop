import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20'
})

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const sessionId = searchParams.get('session_id')

        if (!sessionId) {
            return NextResponse.json({
                success: false,
                error: 'Session ID é obrigatório'
            }, { status: 400 })
        }

        // Buscar dados da sessão no Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['subscription', 'customer', 'line_items']
        })

        if (!session) {
            return NextResponse.json({
                success: false,
                error: 'Sessão não encontrada'
            }, { status: 404 })
        }

        // Formatar dados da sessão para o frontend
        const sessionData = {
            id: session.id,
            customer_email: session.customer_email,
            customer_details: {
                name: session.customer_details?.name || '',
                email: session.customer_details?.email || session.customer_email || '',
                phone: session.customer_details?.phone || ''
            },
            subscription: session.subscription ? {
                id: typeof session.subscription === 'string'
                    ? session.subscription
                    : session.subscription.id,
                status: typeof session.subscription === 'string'
                    ? 'active'
                    : session.subscription.status
            } : null,
            amount_total: session.amount_total || 0,
            currency: session.currency || 'brl',
            payment_status: session.payment_status,
            created: session.created,
            metadata: session.metadata || {}
        }

        // Log para desenvolvimento
        console.log('Sessão recuperada:', {
            sessionId,
            customerEmail: sessionData.customer_email,
            paymentStatus: sessionData.payment_status,
            subscriptionId: sessionData.subscription?.id
        })

        return NextResponse.json({
            success: true,
            session: sessionData
        })

    } catch (error) {
        console.error('Erro ao recuperar sessão:', error)

        if (error instanceof Stripe.errors.StripeError) {
            return NextResponse.json({
                success: false,
                error: 'Erro ao acessar dados do pagamento',
                details: error.message
            }, { status: 400 })
        }

        return NextResponse.json({
            success: false,
            error: 'Erro interno do servidor'
        }, { status: 500 })
    }
}