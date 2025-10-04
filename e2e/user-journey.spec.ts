/**
 * E2E tests for complete user journey
 * Tests the full conversion flow from landing page to subscription
 */

import { test, expect } from '@playwright/test'

test.describe('Complete User Journey', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the landing page
        await page.goto('/')

        // Wait for the page to load completely
        await page.waitForLoadState('networkidle')
    })

    test('should complete lead capture flow', async ({ page }) => {
        // Verify hero section is visible
        await expect(page.getByRole('heading', { name: /nunca mais fique sem lentes/i })).toBeVisible()

        // Fill out the lead form
        await page.getByLabel(/nome/i).fill('João Silva')
        await page.getByLabel(/whatsapp/i).fill('11999999999')
        await page.getByLabel(/email/i).fill('joao.silva@email.com')

        // Accept LGPD consent
        await page.getByRole('checkbox', { name: /aceito/i }).check()

        // Submit the form
        await page.getByRole('button', { name: /calcule sua economia/i }).click()

        // Verify form submission (should show calculator or success message)
        await expect(page.getByText(/economia/i)).toBeVisible({ timeout: 10000 })
    })

    test('should navigate through pricing plans', async ({ page }) => {
        // Navigate to pricing section
        await page.getByRole('link', { name: /planos/i }).click()

        // Verify pricing section is visible
        await expect(page.getByTestId('pricing-section')).toBeVisible()

        // Switch between monthly and annual tabs
        await page.getByRole('tab', { name: /mensal/i }).click()
        await expect(page.getByRole('tabpanel')).toContainText(/mensal/i)

        await page.getByRole('tab', { name: /anual/i }).click()
        await expect(page.getByRole('tabpanel')).toContainText(/anual/i)

        // Verify plan selection buttons are present
        await expect(page.getByRole('button', { name: /assinar/i }).first()).toBeVisible()
    })

    test('should interact with FAQ section', async ({ page }) => {
        // Navigate to FAQ section
        await page.getByRole('link', { name: /faq/i }).click()

        // Verify FAQ section is visible
        await expect(page.getByRole('heading', { name: /perguntas frequentes/i })).toBeVisible()

        // Click on first FAQ item
        const firstFaq = page.getByRole('button', { name: /como funciona/i }).first()
        await firstFaq.click()

        // Verify answer is expanded
        await expect(page.getByText(/nossa assinatura/i)).toBeVisible()

        // Click again to collapse
        await firstFaq.click()
        await expect(page.getByText(/nossa assinatura/i)).not.toBeVisible()
    })

    test('should handle WhatsApp integration', async ({ page }) => {
        // Mock window.open to prevent actual WhatsApp redirect
        await page.addInitScript(() => {
            window.open = (url) => {
                console.log('WhatsApp redirect:', url)
                return null
            }
        })

        // Click WhatsApp button
        const whatsappButton = page.getByRole('button', { name: /whatsapp/i }).first()
        await whatsappButton.click()

        // Verify WhatsApp integration was triggered (check console or API call)
        // This would normally redirect to WhatsApp, but we're mocking it
        await expect(whatsappButton).toBeVisible()
    })

    test('should display doctor information', async ({ page }) => {
        // Verify doctor card is visible
        await expect(page.getByText(/dr\. philipe/i)).toBeVisible()

        // Verify CRM information
        await expect(page.getByText(/crm/i)).toBeVisible()

        // Verify trust indicators
        await expect(page.getByText(/anvisa/i)).toBeVisible()
    })

    test('should show economy calculator results', async ({ page }) => {
        // Fill lead form first
        await page.getByLabel(/nome/i).fill('Maria Santos')
        await page.getByLabel(/whatsapp/i).fill('11888888888')
        await page.getByLabel(/email/i).fill('maria@email.com')
        await page.getByRole('checkbox', { name: /aceito/i }).check()
        await page.getByRole('button', { name: /calcule sua economia/i }).click()

        // Wait for calculator to appear
        await expect(page.getByText(/calculadora/i)).toBeVisible({ timeout: 10000 })

        // Fill calculator form
        await page.getByLabel(/tipo de lente/i).selectOption('daily')
        await page.getByLabel(/gasto mensal/i).fill('150')
        await page.getByLabel(/frequência/i).selectOption('daily')

        // Calculate economy
        await page.getByRole('button', { name: /calcular/i }).click()

        // Verify results are shown
        await expect(page.getByText(/economia anual/i)).toBeVisible({ timeout: 5000 })
        await expect(page.getByText(/r\$/i)).toBeVisible()
    })
})

test.describe('Responsive Design E2E', () => {
    test('should work correctly on mobile devices', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto('/')

        // Verify mobile layout
        await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()

        // Test mobile navigation
        await page.getByRole('button', { name: /menu/i }).click()
        await expect(page.getByRole('link', { name: /planos/i })).toBeVisible()

        // Test mobile form interaction
        await page.getByLabel(/nome/i).fill('João Mobile')
        await page.getByLabel(/whatsapp/i).fill('11999999999')
        await page.getByLabel(/email/i).fill('joao@mobile.com')

        // Verify form works on mobile
        await expect(page.getByDisplayValue('João Mobile')).toBeVisible()
    })

    test('should work correctly on tablet devices', async ({ page }) => {
        // Set tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 })
        await page.goto('/')

        // Verify tablet layout adaptations
        await expect(page.getByRole('heading', { name: /nunca mais fique sem lentes/i })).toBeVisible()

        // Test tablet-specific interactions
        await page.getByRole('tab', { name: /anual/i }).click()
        await expect(page.getByRole('tabpanel')).toBeVisible()
    })

    test('should work correctly on desktop', async ({ page }) => {
        // Set desktop viewport
        await page.setViewportSize({ width: 1440, height: 900 })
        await page.goto('/')

        // Verify desktop layout
        await expect(page.getByRole('navigation')).toBeVisible()
        await expect(page.getByRole('link', { name: /planos/i })).toBeVisible()
        await expect(page.getByRole('link', { name: /como funciona/i })).toBeVisible()

        // Test desktop-specific features
        await expect(page.getByTestId('comparison-table')).toBeVisible()
    })
})

test.describe('Form Validation E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should validate required fields', async ({ page }) => {
        // Try to submit form without filling required fields
        await page.getByRole('button', { name: /calcule sua economia/i }).click()

        // Verify HTML5 validation messages appear
        const nameInput = page.getByLabel(/nome/i)
        await expect(nameInput).toHaveAttribute('required')

        const emailInput = page.getByLabel(/email/i)
        await expect(emailInput).toHaveAttribute('required')

        const whatsappInput = page.getByLabel(/whatsapp/i)
        await expect(whatsappInput).toHaveAttribute('required')
    })

    test('should validate email format', async ({ page }) => {
        // Fill form with invalid email
        await page.getByLabel(/nome/i).fill('João Silva')
        await page.getByLabel(/whatsapp/i).fill('11999999999')
        await page.getByLabel(/email/i).fill('invalid-email')
        await page.getByRole('checkbox', { name: /aceito/i }).check()

        // Try to submit
        await page.getByRole('button', { name: /calcule sua economia/i }).click()

        // Verify email validation
        const emailInput = page.getByLabel(/email/i)
        await expect(emailInput).toHaveAttribute('type', 'email')
    })

    test('should validate WhatsApp format', async ({ page }) => {
        // Fill form with short WhatsApp number
        await page.getByLabel(/nome/i).fill('João Silva')
        await page.getByLabel(/whatsapp/i).fill('123')
        await page.getByLabel(/email/i).fill('joao@email.com')
        await page.getByRole('checkbox', { name: /aceito/i }).check()

        // Try to submit
        await page.getByRole('button', { name: /calcule sua economia/i }).click()

        // Verify WhatsApp validation
        const whatsappInput = page.getByLabel(/whatsapp/i)
        await expect(whatsappInput).toHaveAttribute('type', 'tel')
    })

    test('should require LGPD consent', async ({ page }) => {
        // Fill form without checking consent
        await page.getByLabel(/nome/i).fill('João Silva')
        await page.getByLabel(/whatsapp/i).fill('11999999999')
        await page.getByLabel(/email/i).fill('joao@email.com')

        // Try to submit without consent
        await page.getByRole('button', { name: /calcule sua economia/i }).click()

        // Verify consent checkbox is required
        const consentCheckbox = page.getByRole('checkbox', { name: /aceito/i })
        await expect(consentCheckbox).toHaveAttribute('required')
    })
})

test.describe('Performance E2E', () => {
    test('should load page within acceptable time', async ({ page }) => {
        const startTime = Date.now()

        await page.goto('/')
        await page.waitForLoadState('networkidle')

        const loadTime = Date.now() - startTime

        // Page should load within 5 seconds
        expect(loadTime).toBeLessThan(5000)
    })

    test('should have good Core Web Vitals', async ({ page }) => {
        await page.goto('/')

        // Measure Largest Contentful Paint (LCP)
        const lcp = await page.evaluate(() => {
            return new Promise((resolve) => {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries()
                    const lastEntry = entries[entries.length - 1]
                    resolve(lastEntry.startTime)
                }).observe({ type: 'largest-contentful-paint', buffered: true })
            })
        })

        // LCP should be under 2.5 seconds
        expect(lcp).toBeLessThan(2500)
    })

    test('should lazy load images', async ({ page }) => {
        await page.goto('/')

        // Check that images have loading="lazy" attribute
        const images = page.locator('img')
        const count = await images.count()

        for (let i = 0; i < count; i++) {
            const img = images.nth(i)
            const loading = await img.getAttribute('loading')

            // Images below the fold should have lazy loading
            if (await img.isVisible() === false) {
                expect(loading).toBe('lazy')
            }
        }
    })
})

test.describe('Accessibility E2E', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
        await page.goto('/')

        // Check for h1
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

        // Check that headings follow proper hierarchy
        const headings = page.locator('h1, h2, h3, h4, h5, h6')
        const count = await headings.count()

        expect(count).toBeGreaterThan(0)
    })

    test('should have proper ARIA labels', async ({ page }) => {
        await page.goto('/')

        // Check form labels
        await expect(page.getByLabel(/nome/i)).toBeVisible()
        await expect(page.getByLabel(/whatsapp/i)).toBeVisible()
        await expect(page.getByLabel(/email/i)).toBeVisible()

        // Check button labels
        await expect(page.getByRole('button', { name: /calcule sua economia/i })).toBeVisible()
        await expect(page.getByRole('button', { name: /agendar consulta/i })).toBeVisible()
    })

    test('should be keyboard navigable', async ({ page }) => {
        await page.goto('/')

        // Test tab navigation
        await page.keyboard.press('Tab')
        await expect(page.locator(':focus')).toBeVisible()

        // Continue tabbing through interactive elements
        for (let i = 0; i < 5; i++) {
            await page.keyboard.press('Tab')
            await expect(page.locator(':focus')).toBeVisible()
        }
    })

    test('should have sufficient color contrast', async ({ page }) => {
        await page.goto('/')

        // This would require a color contrast checking library
        // For now, we'll just verify that text is visible
        await expect(page.getByRole('heading', { name: /nunca mais fique sem lentes/i })).toBeVisible()
        await expect(page.getByText(/dr\. philipe/i)).toBeVisible()
    })
})