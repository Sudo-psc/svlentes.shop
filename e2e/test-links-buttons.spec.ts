import { test, expect } from '@playwright/test'

test.describe('Links and Buttons Test Suite', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test.describe('Header Navigation', () => {
        test('should have working logo link', async ({ page }) => {
            const logo = page.locator('header a[href="/"]').first()
            await expect(logo).toBeVisible()
            await logo.click()
            await expect(page).toHaveURL('/')
        })

        test('should navigate to Planos page', async ({ page }) => {
            await page.click('text=Planos')
            await expect(page).toHaveURL('/assinatura')
        })

        test('should navigate to Como Funciona page', async ({ page }) => {
            await page.click('text=Como Funciona')
            await expect(page).toHaveURL('/sdd-framework')
        })

        test('should navigate to FAQ section', async ({ page }) => {
            await page.click('text=FAQ')
            await expect(page).toHaveURL(/\/sdd-framework#faq/)
        })

        test('should have working Assinar Agora button', async ({ page }) => {
            const button = page.locator('header button:has-text("Assinar Agora")')
            await expect(button).toBeVisible()
            await button.click()
            await expect(page).toHaveURL('/assinatura')
        })

        test('should open WhatsApp on Agendar Consulta', async ({ page }) => {
            const button = page.locator('header button:has-text("Agendar Consulta")')
            await expect(button).toBeVisible()

            // Listen for popup
            const [popup] = await Promise.all([
                page.waitForEvent('popup'),
                button.click()
            ])

            expect(popup.url()).toContain('wa.me')
        })

        test('should toggle mobile menu', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 })

            const menuButton = page.locator('header button[aria-label="Toggle menu"]')
            await expect(menuButton).toBeVisible()

            await menuButton.click()
            await expect(page.locator('header nav')).toBeVisible()

            await menuButton.click()
            await expect(page.locator('header nav')).not.toBeVisible()
        })
    })

    test.describe('Footer Navigation', () => {
        test('should have all quick links working', async ({ page }) => {
            await page.goto('/')

            // Scroll to footer
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

            const links = [
                { text: 'Assinar Agora', url: '/assinatura' },
                { text: 'Planos e Preços', url: '/assinatura' },
                { text: 'Como Funciona', url: '/sdd-framework' },
                { text: 'FAQ', url: '/sdd-framework#faq' },
                { text: 'Calculadora', url: '/calculadora' }
            ]

            for (const link of links) {
                const element = page.locator(`footer a:has-text("${link.text}")`).first()
                await expect(element).toBeVisible()
                await expect(element).toHaveAttribute('href', link.url)
            }
        })

        test('should open privacy modals', async ({ page }) => {
            await page.goto('/')
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

            // Test Privacy Policy modal
            await page.click('footer button:has-text("Política de Privacidade")')
            await expect(page.locator('[role="dialog"]')).toBeVisible()
            await page.keyboard.press('Escape')

            // Test Privacy Settings modal
            await page.click('footer button:has-text("Configurações de Privacidade")')
            await expect(page.locator('[role="dialog"]')).toBeVisible()
            await page.keyboard.press('Escape')

            // Test Data Control modal
            await page.click('footer button:has-text("Meus Dados")')
            await expect(page.locator('[role="dialog"]')).toBeVisible()
        })

        test('should have working contact links', async ({ page }) => {
            await page.goto('/')
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

            // Phone link
            const phoneLink = page.locator('footer a[href^="tel:"]').first()
            await expect(phoneLink).toBeVisible()
            await expect(phoneLink).toHaveAttribute('href', /tel:\+?\d+/)

            // Email link
            const emailLink = page.locator('footer a[href^="mailto:"]').first()
            await expect(emailLink).toBeVisible()
            await expect(emailLink).toHaveAttribute('href', /mailto:.+@.+/)
        })

        test('should open WhatsApp from footer', async ({ page }) => {
            await page.goto('/')
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

            const button = page.locator('footer button:has-text("Falar com Especialista")')
            await expect(button).toBeVisible()

            const [popup] = await Promise.all([
                page.waitForEvent('popup'),
                button.click()
            ])

            expect(popup.url()).toContain('wa.me')
        })
    })

    test.describe('Subscription Page', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/assinatura')
        })

        test('should have working Começar Agora button', async ({ page }) => {
            // Scroll to bottom
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

            const button = page.locator('button:has-text("Começar Agora")')
            await expect(button).toBeVisible()

            // Get initial scroll position
            const initialScroll = await page.evaluate(() => window.scrollY)

            // Click button
            await button.click()

            // Wait for scroll animation
            await page.waitForTimeout(1000)

            // Check if scrolled to top
            const finalScroll = await page.evaluate(() => window.scrollY)
            expect(finalScroll).toBeLessThan(initialScroll)
        })

        test('should have SubscriptionFlow component', async ({ page }) => {
            const subscriptionFlow = page.locator('[data-testid="subscription-flow"]')
            await expect(subscriptionFlow).toBeVisible()
        })
    })

    test.describe('SDD Framework Page', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/sdd-framework')
        })

        test('should have working hero CTAs', async ({ page }) => {
            const assinarButton = page.locator('button:has-text("ASSINAR AGORA")').first()
            await expect(assinarButton).toBeVisible()

            const agendarButton = page.locator('button:has-text("AGENDAR AVALIAÇÃO")').first()
            await expect(agendarButton).toBeVisible()
        })

        test('should have 3 pricing plans with CTAs', async ({ page }) => {
            const plans = page.locator('[data-testid="pricing-plan"]')
            await expect(plans).toHaveCount(3)

            // Check each plan has CTA buttons
            for (let i = 0; i < 3; i++) {
                const plan = plans.nth(i)
                const assinarButton = plan.locator('button:has-text("ASSINAR AGORA")')
                const agendarButton = plan.locator('button:has-text("AGENDAR AVALIAÇÃO")')

                await expect(assinarButton).toBeVisible()
                await expect(agendarButton).toBeVisible()
            }
        })

        test('should open WhatsApp when clicking plan CTA', async ({ page }) => {
            const firstPlanButton = page.locator('button:has-text("ASSINAR AGORA")').first()

            const [popup] = await Promise.all([
                page.waitForEvent('popup'),
                firstPlanButton.click()
            ])

            expect(popup.url()).toContain('wa.me')
            expect(popup.url()).toContain('5533998601427')
        })

        test('should toggle billing cycle', async ({ page }) => {
            const monthlyButton = page.locator('button:has-text("Mensal")')
            const annualButton = page.locator('button:has-text("Anual")')

            await expect(monthlyButton).toBeVisible()
            await expect(annualButton).toBeVisible()

            // Click annual
            await annualButton.click()
            await expect(annualButton).toHaveClass(/bg-gradient/)

            // Click monthly
            await monthlyButton.click()
            await expect(monthlyButton).toHaveClass(/bg-gradient/)
        })
    })

    test.describe('Landing Conversao Page', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/landing-conversao')
        })

        test('should have hero CTA', async ({ page }) => {
            const ctaButton = page.locator('button:has-text("QUERO TRANSFORMAR MINHA VISÃO")')
            await expect(ctaButton).toBeVisible()
            await ctaButton.click()

            // Should show form
            await expect(page.locator('form')).toBeVisible()
        })

        test('should have final CTA', async ({ page }) => {
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

            const ctaButton = page.locator('button:has-text("GARANTIR MINHA VAGA AGORA")')
            await expect(ctaButton).toBeVisible()
        })

        test('should submit conversion form', async ({ page }) => {
            // Click CTA to show form
            await page.click('button:has-text("QUERO TRANSFORMAR MINHA VISÃO")')

            // Fill form
            await page.fill('input[name="nome"]', 'João Teste')
            await page.fill('input[name="telefone"]', '33998601427')
            await page.fill('input[name="email"]', 'joao@teste.com')

            // Submit
            const [popup] = await Promise.all([
                page.waitForEvent('popup'),
                page.click('button[type="submit"]')
            ])

            // Should redirect to WhatsApp
            expect(popup.url()).toContain('wa.me')
        })

        test('should validate form fields', async ({ page }) => {
            await page.click('button:has-text("QUERO TRANSFORMAR MINHA VISÃO")')

            const submitButton = page.locator('button[type="submit"]')

            // Should be disabled initially
            await expect(submitButton).toBeDisabled()

            // Fill only name
            await page.fill('input[name="nome"]', 'Jo')
            await expect(submitButton).toBeDisabled()

            // Fill valid name
            await page.fill('input[name="nome"]', 'João Teste')
            await expect(submitButton).toBeDisabled()

            // Fill valid phone
            await page.fill('input[name="telefone"]', '33998601427')
            await expect(submitButton).toBeEnabled()
        })

        test('should format phone number', async ({ page }) => {
            await page.click('button:has-text("QUERO TRANSFORMAR MINHA VISÃO")')

            const phoneInput = page.locator('input[name="telefone"]')
            await phoneInput.fill('33998601427')

            const value = await phoneInput.inputValue()
            expect(value).toMatch(/\(\d{2}\) \d{5}-\d{4}/)
        })
    })

    test.describe('Responsive Behavior', () => {
        test('should work on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 })
            await page.goto('/')

            // Mobile menu should be visible
            const menuButton = page.locator('header button[aria-label="Toggle menu"]')
            await expect(menuButton).toBeVisible()

            // Desktop nav should be hidden
            const desktopNav = page.locator('header nav.hidden')
            await expect(desktopNav).toHaveCount(0)
        })

        test('should work on tablet', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 })
            await page.goto('/')

            // Check responsive layout
            const header = page.locator('header')
            await expect(header).toBeVisible()
        })

        test('should work on desktop', async ({ page }) => {
            await page.setViewportSize({ width: 1920, height: 1080 })
            await page.goto('/')

            // Desktop nav should be visible
            const desktopNav = page.locator('header nav')
            await expect(desktopNav).toBeVisible()

            // Mobile menu button should be hidden
            const menuButton = page.locator('header button[aria-label="Toggle menu"]')
            await expect(menuButton).not.toBeVisible()
        })
    })

    test.describe('Accessibility', () => {
        test('should have proper ARIA labels', async ({ page }) => {
            await page.goto('/')

            // Check buttons have aria-labels
            const buttons = page.locator('button[aria-label]')
            const count = await buttons.count()
            expect(count).toBeGreaterThan(0)
        })

        test('should be keyboard navigable', async ({ page }) => {
            await page.goto('/')

            // Tab through elements
            await page.keyboard.press('Tab')
            await page.keyboard.press('Tab')
            await page.keyboard.press('Tab')

            // Check if focus is visible
            const focusedElement = page.locator(':focus')
            await expect(focusedElement).toBeVisible()
        })

        test('should have proper heading hierarchy', async ({ page }) => {
            await page.goto('/')

            const h1 = page.locator('h1')
            await expect(h1).toHaveCount(1)

            const h2 = page.locator('h2')
            const h2Count = await h2.count()
            expect(h2Count).toBeGreaterThan(0)
        })
    })

    test.describe('Performance', () => {
        test('should load quickly', async ({ page }) => {
            const startTime = Date.now()
            await page.goto('/')
            const loadTime = Date.now() - startTime

            expect(loadTime).toBeLessThan(3000) // 3 seconds
        })

        test('should have smooth scroll', async ({ page }) => {
            await page.goto('/')

            // Scroll to bottom
            await page.evaluate(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
            })

            await page.waitForTimeout(1000)

            const scrollY = await page.evaluate(() => window.scrollY)
            expect(scrollY).toBeGreaterThan(0)
        })
    })
})
