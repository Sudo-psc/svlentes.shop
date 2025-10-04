/**
 * E2E tests for checkout and payment flow
 * Tests Stripe integration and subscription process
 */

import { test, expect } from '@playwright/test'

test.describe('Checkout Flow E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
    })

    test('should initiate checkout process', async ({ page }) => {
        // Navigate to pricing section
        await page.getByRole('link', { name: /planos/i }).click()

        // Select a plan
        const basicPlanButton = page.getByRole('button', { name: /assinar.*básico/i }).first()
        await expect(basicPlanButton).toBeVisible()

        // Mock the checkout redirect to prevent actual Stripe redirect
        await page.route('/api/create-checkout', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    sessionId: 'cs_test_123',
                    url: 'https://checkout.stripe.com/pay/cs_test_123'
                })
            })
        })

        // Mock window.location.href assignment
        await page.addInitScript(() => {
            let href = window.location.href
            Object.defineProperty(window.location, 'href', {
                get: () => href,
                set: (value) => {
                    href = value
                    console.log('Redirecting to:', value)
                }
            })
        })

        // Click the plan button
        await basicPlanButton.click()

        // Verify API call was made
        await page.waitForResponse('/api/create-checkout')
    })

    test('should handle checkout errors gracefully', async ({ page }) => {
        // Navigate to pricing section
        await page.getByRole('link', { name: /planos/i }).click()

        // Mock failed checkout response
        await page.route('/api/create-checkout', async (route) => {
            await route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({
                    error: 'Payment processing unavailable'
                })
            })
        })

        // Select a plan
        const premiumPlanButton = page.getByRole('button', { name: /assinar.*premium/i }).first()
        await premiumPlanButton.click()

        // Verify error handling
        await expect(page.getByText(/erro/i)).toBeVisible({ timeout: 5000 })
    })

    test('should display correct plan information', async ({ page }) => {
        // Navigate to pricing section
        await page.getByRole('link', { name: /planos/i }).click()

        // Verify plan details are displayed
        await expect(page.getByText(/básico/i)).toBeVisible()
        await expect(page.getByText(/premium/i)).toBeVisible()
        await expect(page.getByText(/vip/i)).toBeVisible()

        // Verify pricing information
        await expect(page.getByText(/r\$/i)).toBeVisible()

        // Switch to annual pricing
        await page.getByRole('tab', { name: /anual/i }).click()

        // Verify annual pricing is different
        await expect(page.getByText(/economia/i)).toBeVisible()
    })

    test('should handle plan comparison', async ({ page }) => {
        // Navigate to pricing section
        await page.getByRole('link', { name: /planos/i }).click()

        // Verify comparison table on desktop
        await page.setViewportSize({ width: 1440, height: 900 })
        await expect(page.getByTestId('comparison-table')).toBeVisible()

        // Verify plan features are listed
        await expect(page.getByText(/lentes incluídas/i)).toBeVisible()
        await expect(page.getByText(/consulta médica/i)).toBeVisible()
    })
})

test.describe('Consultation Booking E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
    })

    test('should navigate to consultation booking', async ({ page }) => {
        // Click "Agendar Consulta" button
        const agendarButton = page.getByRole('button', { name: /agendar consulta/i }).first()
        await agendarButton.click()

        // Should navigate to booking page
        await expect(page).toHaveURL(/agendar-consulta/)

        // Verify booking form is present
        await expect(page.getByRole('heading', { name: /agendar/i })).toBeVisible()
    })

    test('should fill consultation booking form', async ({ page }) => {
        // Navigate to booking page
        await page.goto('/agendar-consulta')

        // Fill personal information
        await page.getByLabel(/nome completo/i).fill('João Silva Santos')
        await page.getByLabel(/email/i).fill('joao.santos@email.com')
        await page.getByLabel(/telefone/i).fill('11999999999')
        await page.getByLabel(/cpf/i).fill('123.456.789-00')

        // Fill address information
        await page.getByLabel(/cep/i).fill('01234-567')
        await page.getByLabel(/cidade/i).fill('São Paulo')
        await page.getByLabel(/estado/i).selectOption('SP')

        // Fill prescription information
        await page.getByRole('radio', { name: /tenho receita/i }).check()
        await page.getByLabel(/grau olho direito/i).fill('-2.50')
        await page.getByLabel(/grau olho esquerdo/i).fill('-2.25')

        // Select preferred date and time
        await page.getByLabel(/data preferida/i).fill('2024-12-15')
        await page.getByLabel(/horário preferido/i).selectOption('14:00')

        // Accept terms
        await page.getByRole('checkbox', { name: /aceito os termos/i }).check()

        // Submit form
        await page.getByRole('button', { name: /agendar consulta/i }).click()

        // Verify submission
        await expect(page.getByText(/agendamento confirmado/i)).toBeVisible({ timeout: 10000 })
    })

    test('should validate consultation form fields', async ({ page }) => {
        await page.goto('/agendar-consulta')

        // Try to submit without filling required fields
        await page.getByRole('button', { name: /agendar consulta/i }).click()

        // Verify validation messages
        await expect(page.getByText(/nome é obrigatório/i)).toBeVisible()
        await expect(page.getByText(/email é obrigatório/i)).toBeVisible()
        await expect(page.getByText(/telefone é obrigatório/i)).toBeVisible()
    })
})

test.describe('Success and Cancel Pages E2E', () => {
    test('should display success page correctly', async ({ page }) => {
        await page.goto('/success')

        // Verify success message
        await expect(page.getByRole('heading', { name: /sucesso/i })).toBeVisible()
        await expect(page.getByText(/pagamento aprovado/i)).toBeVisible()

        // Verify next steps information
        await expect(page.getByText(/próximos passos/i)).toBeVisible()
        await expect(page.getByText(/entraremos em contato/i)).toBeVisible()

        // Verify return to home link
        await expect(page.getByRole('link', { name: /voltar ao início/i })).toBeVisible()
    })

    test('should display cancel page correctly', async ({ page }) => {
        await page.goto('/cancel')

        // Verify cancel message
        await expect(page.getByRole('heading', { name: /cancelado/i })).toBeVisible()
        await expect(page.getByText(/pagamento cancelado/i)).toBeVisible()

        // Verify try again option
        await expect(page.getByRole('link', { name: /tentar novamente/i })).toBeVisible()

        // Verify contact support option
        await expect(page.getByText(/dúvidas/i)).toBeVisible()
    })

    test('should navigate from cancel back to pricing', async ({ page }) => {
        await page.goto('/cancel')

        // Click try again
        await page.getByRole('link', { name: /tentar novamente/i }).click()

        // Should return to main page or pricing section
        await expect(page).toHaveURL('/')
        await expect(page.getByRole('heading', { name: /nunca mais fique sem lentes/i })).toBeVisible()
    })
})

test.describe('API Integration E2E', () => {
    test('should handle WhatsApp redirect API', async ({ page }) => {
        await page.goto('/')

        // Mock WhatsApp redirect API
        await page.route('/api/whatsapp-redirect', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    whatsappUrl: 'https://wa.me/5511999999999?text=Olá%20LAAS'
                })
            })
        })

        // Mock window.open
        await page.addInitScript(() => {
            window.open = (url) => {
                console.log('WhatsApp redirect:', url)
                return null
            }
        })

        // Click WhatsApp button
        await page.getByRole('button', { name: /whatsapp/i }).first().click()

        // Verify API call was made
        await page.waitForResponse('/api/whatsapp-redirect')
    })

    test('should handle consultation scheduling API', async ({ page }) => {
        await page.goto('/agendar-consulta')

        // Mock scheduling API
        await page.route('/api/schedule-consultation', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    consultationId: 'cons_123',
                    scheduledDate: '2024-12-15T14:00:00Z'
                })
            })
        })

        // Fill and submit form
        await page.getByLabel(/nome completo/i).fill('Maria Santos')
        await page.getByLabel(/email/i).fill('maria@email.com')
        await page.getByLabel(/telefone/i).fill('11888888888')
        await page.getByRole('checkbox', { name: /aceito/i }).check()

        await page.getByRole('button', { name: /agendar consulta/i }).click()

        // Verify API call and response
        await page.waitForResponse('/api/schedule-consultation')
        await expect(page.getByText(/agendamento confirmado/i)).toBeVisible({ timeout: 5000 })
    })
})

test.describe('Error Handling E2E', () => {
    test('should handle network errors gracefully', async ({ page }) => {
        await page.goto('/')

        // Simulate network failure
        await page.route('/api/create-checkout', async (route) => {
            await route.abort('failed')
        })

        // Try to select a plan
        await page.getByRole('link', { name: /planos/i }).click()
        await page.getByRole('button', { name: /assinar.*básico/i }).first().click()

        // Should show error message
        await expect(page.getByText(/erro de conexão/i)).toBeVisible({ timeout: 5000 })
    })

    test('should handle server errors gracefully', async ({ page }) => {
        await page.goto('/')

        // Mock server error
        await page.route('/api/create-checkout', async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({
                    error: 'Internal server error'
                })
            })
        })

        // Try to select a plan
        await page.getByRole('link', { name: /planos/i }).click()
        await page.getByRole('button', { name: /assinar.*premium/i }).first().click()

        // Should show error message
        await expect(page.getByText(/erro interno/i)).toBeVisible({ timeout: 5000 })
    })

    test('should handle timeout errors', async ({ page }) => {
        await page.goto('/')

        // Mock slow response
        await page.route('/api/create-checkout', async (route) => {
            await new Promise(resolve => setTimeout(resolve, 10000)) // 10 second delay
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ sessionId: 'cs_test_123' })
            })
        })

        // Set shorter timeout for this test
        page.setDefaultTimeout(5000)

        // Try to select a plan
        await page.getByRole('link', { name: /planos/i }).click()

        try {
            await page.getByRole('button', { name: /assinar.*básico/i }).first().click()
            await page.waitForResponse('/api/create-checkout', { timeout: 3000 })
        } catch (error) {
            // Should handle timeout gracefully
            expect(error.message).toContain('timeout')
        }
    })
})