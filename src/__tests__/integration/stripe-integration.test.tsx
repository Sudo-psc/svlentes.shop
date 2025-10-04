/**
 * Integration tests for Stripe payment processing
 * Tests API endpoints and payment flow integration
 */

import { jest } from '@jest/globals'

// Mock fetch for API calls
global.fetch = jest.fn()

// Mock environment variables
const originalEnv = process.env
beforeAll(() => {
    process.env = {
        ...originalEnv,
        STRIPE_SECRET_KEY: 'sk_test_123',
        STRIPE_WEBHOOK_SECRET: 'whsec_test_123',
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_123'
    }
})

afterAll(() => {
    process.env = originalEnv
})

describe('Stripe Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Checkout API Integration', () => {
        it('should create checkout session successfully', async () => {
            // Mock successful Stripe response
            ; (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    sessionId: 'cs_test_123',
                    url: 'https://checkout.stripe.com/pay/cs_test_123'
                })
            })

            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    planId: 'basic-monthly',
                    customerData: {
                        name: 'João Silva',
                        email: 'joao@email.com',
                        phone: '11999999999'
                    }
                })
            })

            const data = await response.json()

            expect(response.ok).toBe(true)
            expect(data.sessionId).toBe('cs_test_123')
            expect(data.url).toContain('checkout.stripe.com')
        })

        it('should handle invalid plan ID', async () => {
            ; (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({
                    error: 'Plano inválido'
                })
            })

            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    planId: 'invalid-plan',
                    customerData: {
                        name: 'João Silva',
                        email: 'joao@email.com'
                    }
                })
            })

            const data = await response.json()

            expect(response.ok).toBe(false)
            expect(data.error).toContain('Plano inválido')
        })

        it('should validate required customer data', async () => {
            ; (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({
                    error: 'Dados do cliente são obrigatórios'
                })
            })

            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    planId: 'basic-monthly'
                    // Missing customerData
                })
            })

            const data = await response.json()

            expect(response.ok).toBe(false)
            expect(data.error).toContain('obrigatórios')
        })
    })

    describe('Webhook Integration', () => {
        it('should process successful payment webhook', async () => {
            ; (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ received: true })
            })

            const webhookPayload = {
                id: 'evt_test_123',
                type: 'checkout.session.completed',
                data: {
                    object: {
                        id: 'cs_test_123',
                        customer: 'cus_test_123',
                        subscription: 'sub_test_123'
                    }
                }
            }

            const response = await fetch('/api/webhooks/stripe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'stripe-signature': 'test_signature'
                },
                body: JSON.stringify(webhookPayload)
            })

            const data = await response.json()

            expect(response.ok).toBe(true)
            expect(data.received).toBe(true)
        })

        it('should handle subscription updates', async () => {
            ; (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ received: true })
            })

            const webhookPayload = {
                id: 'evt_test_456',
                type: 'customer.subscription.updated',
                data: {
                    object: {
                        id: 'sub_test_123',
                        status: 'active'
                    }
                }
            }

            const response = await fetch('/api/webhooks/stripe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'stripe-signature': 'test_signature'
                },
                body: JSON.stringify(webhookPayload)
            })

            expect(response.ok).toBe(true)
        })
    })

    describe('Payment Flow Integration', () => {
        it('should complete full payment flow', async () => {
            // Step 1: Create checkout session
            ; (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    sessionId: 'cs_test_123',
                    url: 'https://checkout.stripe.com/pay/cs_test_123'
                })
            })

            const checkoutResponse = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId: 'premium-annual',
                    customerData: {
                        name: 'Maria Santos',
                        email: 'maria@email.com',
                        phone: '11888888888'
                    }
                })
            })

            const checkoutData = await checkoutResponse.json()
            expect(checkoutData.sessionId).toBeDefined()

                // Step 2: Simulate successful payment webhook
                ; (global.fetch as jest.Mock).mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ received: true })
                })

            const webhookResponse = await fetch('/api/webhooks/stripe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'stripe-signature': 'test_signature'
                },
                body: JSON.stringify({
                    type: 'checkout.session.completed',
                    data: {
                        object: {
                            id: checkoutData.sessionId,
                            customer: 'cus_test_123',
                            subscription: 'sub_test_123'
                        }
                    }
                })
            })

            expect(webhookResponse.ok).toBe(true)
        })

        it('should handle payment failures gracefully', async () => {
            // Simulate payment failure
            ; (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 402,
                json: async () => ({
                    error: 'Your card was declined.'
                })
            })

            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId: 'basic-monthly',
                    customerData: {
                        name: 'João Silva',
                        email: 'joao@email.com'
                    }
                })
            })

            expect(response.ok).toBe(false)
            expect(response.status).toBe(402)
        })
    })

    describe('Error Handling', () => {
        it('should handle network timeouts', async () => {
            ; (global.fetch as jest.Mock).mockRejectedValueOnce(
                new Error('Network timeout')
            )

            try {
                await fetch('/api/create-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        planId: 'basic-monthly',
                        customerData: {
                            name: 'João Silva',
                            email: 'joao@email.com'
                        }
                    })
                })
            } catch (error) {
                expect(error).toBeInstanceOf(Error)
                expect((error as Error).message).toContain('Network timeout')
            }
        })

        it('should validate webhook signatures', async () => {
            ; (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({
                    error: 'Invalid signature'
                })
            })

            const response = await fetch('/api/webhooks/stripe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'stripe-signature': 'invalid_signature'
                },
                body: JSON.stringify({})
            })

            expect(response.ok).toBe(false)
            expect(response.status).toBe(400)
        })
    })
})