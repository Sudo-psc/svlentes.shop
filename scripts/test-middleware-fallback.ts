#!/usr/bin/env ts-node

/**
 * Script de Teste do Sistema de Fallback
 * 
 * Simula diferentes cenários de falha e verifica
 * se o sistema de fallback responde corretamente.
 * 
 * Uso:
 *   npm run test:middleware-fallback
 *   ou
 *   ts-node scripts/test-middleware-fallback.ts
 */

interface TestResult {
    scenario: string
    passed: boolean
    message: string
    duration: number
}

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000'

async function testScenario(
    name: string,
    url: string,
    expectedHeaders: Record<string, string | RegExp>
): Promise<TestResult> {
    const startTime = Date.now()

    try {
        const response = await fetch(url, {
            method: 'HEAD',
            cache: 'no-store'
        })

        const duration = Date.now() - startTime

        // Verificar headers esperados
        for (const [header, expected] of Object.entries(expectedHeaders)) {
            const actual = response.headers.get(header)

            if (expected instanceof RegExp) {
                if (!actual || !expected.test(actual)) {
                    return {
                        scenario: name,
                        passed: false,
                        message: `Header ${header} não corresponde ao padrão esperado. Valor: ${actual}`,
                        duration
                    }
                }
            } else {
                if (actual !== expected) {
                    return {
                        scenario: name,
                        passed: false,
                        message: `Header ${header} esperado: ${expected}, recebido: ${actual}`,
                        duration
                    }
                }
            }
        }

        return {
            scenario: name,
            passed: true,
            message: 'Todos os headers corretos',
            duration
        }

    } catch (error) {
        return {
            scenario: name,
            passed: false,
            message: `Erro na requisição: ${error instanceof Error ? error.message : String(error)}`,
            duration: Date.now() - startTime
        }
    }
}

async function testHealthEndpoint(): Promise<TestResult> {
    const startTime = Date.now()

    try {
        const response = await fetch(`${BASE_URL}/api/middleware-health`)
        const data = await response.json()
        const duration = Date.now() - startTime

        // Verificar estrutura da resposta
        const requiredFields = ['status', 'timestamp', 'circuitBreaker', 'metrics']
        const missingFields = requiredFields.filter(field => !(field in data))

        if (missingFields.length > 0) {
            return {
                scenario: 'Health Endpoint',
                passed: false,
                message: `Campos faltando: ${missingFields.join(', ')}`,
                duration
            }
        }

        // Verificar valores válidos
        const validStatuses = ['healthy', 'degraded', 'unhealthy']
        if (!validStatuses.includes(data.status)) {
            return {
                scenario: 'Health Endpoint',
                passed: false,
                message: `Status inválido: ${data.status}`,
                duration
            }
        }

        return {
            scenario: 'Health Endpoint',
            passed: true,
            message: `Status: ${data.status}, Error Rate: ${data.metrics.errorRate}%`,
            duration
        }

    } catch (error) {
        return {
            scenario: 'Health Endpoint',
            passed: false,
            message: `Erro: ${error instanceof Error ? error.message : String(error)}`,
            duration: Date.now() - startTime
        }
    }
}

async function simulateLoad(requests: number, delayMs: number): Promise<TestResult> {
    const startTime = Date.now()
    const results: boolean[] = []

    try {
        for (let i = 0; i < requests; i++) {
            const response = await fetch(`${BASE_URL}/`, {
                method: 'HEAD',
                cache: 'no-store'
            })

            results.push(response.ok)

            if (delayMs > 0) {
                await new Promise(resolve => setTimeout(resolve, delayMs))
            }
        }

        const duration = Date.now() - startTime
        const successRate = (results.filter(r => r).length / results.length) * 100

        return {
            scenario: `Load Test (${requests} requests)`,
            passed: successRate >= 95,
            message: `Taxa de sucesso: ${successRate.toFixed(1)}%, Duração: ${duration}ms`,
            duration
        }

    } catch (error) {
        return {
            scenario: `Load Test (${requests} requests)`,
            passed: false,
            message: `Erro: ${error instanceof Error ? error.message : String(error)}`,
            duration: Date.now() - startTime
        }
    }
}

async function runTests() {
    console.log('🧪 Iniciando testes do sistema de fallback...\n')
    console.log(`Base URL: ${BASE_URL}\n`)

    const results: TestResult[] = []

    // Teste 1: Requisição normal
    console.log('📋 Teste 1: Requisição normal')
    results.push(await testScenario(
        'Requisição Normal',
        `${BASE_URL}/`,
        {
            'x-personalization-status': /^(active|fallback|simplified)$/,
            'x-user-persona': /.+/
        }
    ))

    // Teste 2: Health endpoint
    console.log('📋 Teste 2: Health endpoint')
    results.push(await testHealthEndpoint())

    // Teste 3: Diferentes páginas
    console.log('📋 Teste 3: Diferentes páginas')
    results.push(await testScenario(
        'Página de Pricing',
        `${BASE_URL}/pricing`,
        {
            'x-personalization-status': /^(active|fallback|simplified)$/
        }
    ))

    results.push(await testScenario(
        'Página de Calculadora',
        `${BASE_URL}/calculadora`,
        {
            'x-personalization-status': /^(active|fallback|simplified)$/
        }
    ))

    // Teste 4: Load test
    console.log('📋 Teste 4: Load test (50 requisições)')
    results.push(await simulateLoad(50, 10))

    // Teste 5: Burst test
    console.log('📋 Teste 5: Burst test (20 requisições simultâneas)')
    results.push(await simulateLoad(20, 0))

    // Relatório final
    console.log('\n' + '='.repeat(80))
    console.log('📊 RELATÓRIO DE TESTES')
    console.log('='.repeat(80) + '\n')

    results.forEach((result, index) => {
        const icon = result.passed ? '✅' : '❌'
        console.log(`${icon} ${result.scenario}`)
        console.log(`   ${result.message}`)
        console.log(`   Duração: ${result.duration}ms\n`)
    })

    const totalPassed = results.filter(r => r.passed).length
    const totalTests = results.length
    const successRate = (totalPassed / totalTests) * 100

    console.log('='.repeat(80))
    console.log(`Testes passados: ${totalPassed}/${totalTests} (${successRate.toFixed(1)}%)`)
    console.log('='.repeat(80) + '\n')

    // Exit code baseado no resultado
    if (successRate < 80) {
        console.error('❌ Taxa de sucesso abaixo de 80%. Verifique os erros acima.')
        process.exit(1)
    } else if (successRate < 100) {
        console.warn('⚠️  Alguns testes falharam. Revise os resultados.')
        process.exit(0)
    } else {
        console.log('✅ Todos os testes passaram!')
        process.exit(0)
    }
}

// Executar testes
runTests().catch(error => {
    console.error('❌ Erro fatal ao executar testes:', error)
    process.exit(1)
})
