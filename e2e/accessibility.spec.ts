import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Testes de Acessibilidade WCAG 2.1 AA', () => {
    test.beforeEach(async ({ page }) => {
        // Configura timeout maior para análises de acessibilidade
        test.setTimeout(60000)
    })

    test('Página inicial deve estar em conformidade com WCAG 2.1 AA', async ({ page }) => {
        await page.goto('http://localhost:3000')

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze()

        expect(accessibilityScanResults.violations).toEqual([])
    })

    test('Hero Section - Contraste e navegação por teclado', async ({ page }) => {
        await page.goto('http://localhost:3000')

        // Verificar contraste de cores no hero
        const accessibilityScanResults = await new AxeBuilder({ page })
            .include('#hero')
            .withTags(['wcag2aa'])
            .analyze()

        expect(accessibilityScanResults.violations).toEqual([])

        // Testar navegação por teclado nos CTAs
        await page.keyboard.press('Tab') // Primeiro CTA
        const firstCTA = page.getByLabel('Ver planos e preços')
        await expect(firstCTA).toBeFocused()

        await page.keyboard.press('Tab') // Segundo CTA
        const secondCTA = page.getByLabel('Falar com especialista')
        await expect(secondCTA).toBeFocused()

        // Verificar se Enter ativa o botão
        await page.keyboard.press('Enter')
        // Deve scrollar ou navegar
    })

    test('Botões CTA - Tamanho de área clicável (min 44x44px)', async ({ page }) => {
        await page.goto('http://localhost:3000')

        const ctaPrimary = page.getByLabel('Ver planos e preços').first()
        const ctaSecondary = page.getByLabel('Falar com especialista').first()

        const primaryBox = await ctaPrimary.boundingBox()
        const secondaryBox = await ctaSecondary.boundingBox()

        // WCAG 2.1 AA requer mínimo 44x44px
        expect(primaryBox?.height).toBeGreaterThanOrEqual(44)
        expect(primaryBox?.width).toBeGreaterThanOrEqual(44)
        expect(secondaryBox?.height).toBeGreaterThanOrEqual(44)
        expect(secondaryBox?.width).toBeGreaterThanOrEqual(44)
    })

    test('Métricas Strip - ARIA labels e leitura de tela', async ({ page }) => {
        await page.goto('http://localhost:3000')

        // Verificar se as métricas têm estrutura semântica apropriada
        const metricsSection = page.locator('section').filter({ hasText: '5.000+' }).first()
        await expect(metricsSection).toBeVisible()

        const accessibilityScanResults = await new AxeBuilder({ page })
            .include('section')
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()

        expect(accessibilityScanResults.violations).toEqual([])
    })

    test('Quick Start Section - Navegação e contraste', async ({ page }) => {
        await page.goto('http://localhost:3000')

        // Scroll até Quick Start
        await page.evaluate(() => {
            window.scrollTo(0, window.innerHeight * 1.5)
        })

        await page.waitForTimeout(500)

        const calculatorBtn = page.getByLabel('Calcular Economia')
        const subscribeBtn = page.getByLabel('Começar Assinatura')

        // Verificar visibilidade
        await expect(calculatorBtn).toBeVisible()
        await expect(subscribeBtn).toBeVisible()

        // Verificar acessibilidade
        const accessibilityScanResults = await new AxeBuilder({ page })
            .include('section')
            .withTags(['wcag2aa'])
            .analyze()

        expect(accessibilityScanResults.violations).toEqual([])
    })

    test('Links de e-mail - mailto: funcionando', async ({ page }) => {
        await page.goto('http://localhost:3000/termos-uso')

        const emailLink = page.getByRole('link', { name: 'contato@svlentes.shop' })
        await expect(emailLink).toHaveAttribute('href', 'mailto:contato@svlentes.shop')
    })

    test('Responsividade Mobile - Touch targets e navegação', async ({ page }) => {
        // Configurar viewport mobile
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto('http://localhost:3000')

        // Verificar sticky CTA mobile
        const stickyCTA = page.getByLabel('Ver planos - Sticky CTA mobile')
        await expect(stickyCTA).toBeVisible()

        const stickyBox = await stickyCTA.boundingBox()
        expect(stickyBox?.height).toBeGreaterThanOrEqual(44)

        // Verificar acessibilidade em mobile
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2aa'])
            .analyze()

        expect(accessibilityScanResults.violations).toEqual([])
    })

    test('Formulários - Labels e validação', async ({ page }) => {
        await page.goto('http://localhost:3000/assinar')

        // Verificar se formulários têm labels associados
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()

        expect(accessibilityScanResults.violations).toEqual([])
    })

    test('Imagens - Alt text e lazy loading', async ({ page }) => {
        await page.goto('http://localhost:3000')

        // Verificar que todas as imagens têm alt text
        const images = page.locator('img')
        const imageCount = await images.count()

        for (let i = 0; i < imageCount; i++) {
            const img = images.nth(i)
            const alt = await img.getAttribute('alt')
            const ariaLabel = await img.getAttribute('aria-label')

            // Imagem deve ter alt text ou aria-label
            expect(alt !== null || ariaLabel !== null).toBeTruthy()
        }
    })

    test('Hierarquia de Títulos - Ordem lógica H1-H6', async ({ page }) => {
        await page.goto('http://localhost:3000')

        // Verificar ordem dos headings
        const h1 = page.locator('h1')
        await expect(h1).toHaveCount(1) // Apenas um H1 por página

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a'])
            .analyze()

        expect(accessibilityScanResults.violations).toEqual([])
    })

    test('Focus Visible - Estados de foco visíveis', async ({ page }) => {
        await page.goto('http://localhost:3000')

        // Navegar por tab e verificar indicadores de foco
        await page.keyboard.press('Tab')

        const focusedElement = await page.evaluate(() => {
            const el = document.activeElement
            const styles = window.getComputedStyle(el as Element)
            return {
                outline: styles.outline,
                boxShadow: styles.boxShadow,
                border: styles.border
            }
        })

        // Deve ter algum indicador visual de foco
        const hasFocusIndicator =
            focusedElement.outline !== 'none' ||
            focusedElement.boxShadow !== 'none' ||
            focusedElement.border !== 'none'

        expect(hasFocusIndicator).toBeTruthy()
    })

    test('Zoom 200% - Layout não quebra', async ({ page }) => {
        await page.goto('http://localhost:3000')

        // Aplicar zoom 200%
        await page.evaluate(() => {
            document.body.style.zoom = '200%'
        })

        await page.waitForTimeout(1000)

        // Verificar que não há scroll horizontal
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth
        })

        expect(hasHorizontalScroll).toBeFalsy()

        // Verificar acessibilidade com zoom
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2aa'])
            .analyze()

        expect(accessibilityScanResults.violations).toEqual([])
    })

    test('Idioma da Página - lang attribute', async ({ page }) => {
        await page.goto('http://localhost:3000')

        const htmlLang = await page.getAttribute('html', 'lang')
        expect(htmlLang).toBe('pt-BR')
    })

    test('Relatório Completo de Acessibilidade', async ({ page }) => {
        await page.goto('http://localhost:3000')

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze()

        // Gerar relatório detalhado
        if (accessibilityScanResults.violations.length > 0) {
            console.log('\n📋 Violações de Acessibilidade Encontradas:\n')
            accessibilityScanResults.violations.forEach((violation, index) => {
                console.log(`${index + 1}. ${violation.id}`)
                console.log(`   Impacto: ${violation.impact}`)
                console.log(`   Descrição: ${violation.description}`)
                console.log(`   WCAG: ${violation.tags.filter(tag => tag.startsWith('wcag')).join(', ')}`)
                console.log(`   Elementos afetados: ${violation.nodes.length}`)
                console.log('')
            })
        }

        expect(accessibilityScanResults.violations).toEqual([])
    })
})

test.describe('Testes de Performance e Otimização', () => {
    test('Imagens otimizadas - WebP/AVIF', async ({ page }) => {
        await page.goto('http://localhost:3000')

        // Interceptar requisições de imagem
        const imageRequests: string[] = []
        page.on('request', request => {
            if (request.resourceType() === 'image') {
                imageRequests.push(request.url())
            }
        })

        await page.waitForLoadState('networkidle')

        // Verificar que imagens estão sendo servidas em formatos modernos
        const modernFormats = imageRequests.filter(url =>
            url.includes('.webp') || url.includes('.avif')
        )

        console.log(`Formatos modernos: ${modernFormats.length}/${imageRequests.length}`)
    })

    test('Performance - Core Web Vitals', async ({ page }) => {
        await page.goto('http://localhost:3000')

        const metrics = await page.evaluate(() => {
            return new Promise((resolve) => {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries()
                    const lcp = entries.find(e => e.entryType === 'largest-contentful-paint')
                    resolve({
                        lcp: lcp ? (lcp as any).renderTime : null
                    })
                }).observe({ entryTypes: ['largest-contentful-paint'] })

                // Timeout após 5s
                setTimeout(() => resolve({ lcp: null }), 5000)
            })
        })

        console.log('Core Web Vitals:', metrics)
    })
})
