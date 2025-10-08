import { defineConfig, devices } from '@playwright/test'

/**
 * Configuração do Playwright para testes manuais com servidor já rodando
 * Use: npx playwright test --config=playwright.config.manual.ts
 */
export default defineConfig({
    testDir: './e2e',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: 1,
    reporter: 'list',
    timeout: 30000,

    use: {
        baseURL: 'http://localhost:3002',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    // Sem webServer - assume que o servidor já está rodando
})
