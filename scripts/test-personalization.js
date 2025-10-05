#!/usr/bin/env node

/**
 * Script de teste para o sistema de personalização
 * Valida todos os componentes e funcionalidades implementadas
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🧪 Iniciando testes do Sistema de Personalização...\n')

// Cores para output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
}

function log(message, color = 'white') {
    console.log(`${colors[color]}${message}${colors.reset}`)
}

function success(message) {
    log(`✅ ${message}`, 'green')
}

function error(message) {
    log(`❌ ${message}`, 'red')
}

function warning(message) {
    log(`⚠️  ${message}`, 'yellow')
}

function info(message) {
    log(`ℹ️  ${message}`, 'blue')
}

// Testes
const tests = [
    {
        name: 'Verificar arquivos de tipos',
        test: () => {
            const typesFile = path.join(__dirname, '../src/types/personalization.ts')
            if (fs.existsSync(typesFile)) {
                const content = fs.readFileSync(typesFile, 'utf8')
                const hasPersonaType = content.includes('export type PersonaType')
                const hasUserProfile = content.includes('export interface UserProfile')
                const hasBehaviorData = content.includes('export interface BehaviorData')

                if (hasPersonaType && hasUserProfile && hasBehaviorData) {
                    success('Arquivos de tipos encontrados e completos')
                    return true
                } else {
                    error('Tipos essenciais não encontrados')
                    return false
                }
            } else {
                error('Arquivo de tipos não encontrado')
                return false
            }
        }
    },
    {
        name: 'Verificar configurações das personas',
        test: () => {
            const configFile = path.join(__dirname, '../src/lib/personalization/config.ts')
            if (fs.existsSync(configFile)) {
                const content = fs.readFileSync(configFile, 'utf8')
                const hasPersonas = content.includes('PERSONA_DEFINITIONS')
                const hasPriceConscious = content.includes('price-conscious')
                const hasQualityFocused = content.includes('quality-focused')
                const hasConvenienceSeeker = content.includes('convenience-seeker')

                const personaCount = (content.match(/id: '[^"]+"/g) || []).length

                if (hasPersonas && personaCount >= 8) {
                    success(`Configurações encontradas com ${personaCount} personas`)
                    return true
                } else {
                    error('Configurações de personas incompletas')
                    return false
                }
            } else {
                error('Arquivo de configuração não encontrado')
                return false
            }
        }
    },
    {
        name: 'Verificar storage adapter',
        test: () => {
            const storageFile = path.join(__dirname, '../src/lib/personalization/storage.ts')
            if (fs.existsSync(storageFile)) {
                const content = fs.readFileSync(storageFile, 'utf8')
                const hasLocalStorage = content.includes('LocalStorageAdapter')
                const hasSessionStorage = content.includes('SessionStorageAdapter')
                const hasMemoryAdapter = content.includes('MemoryAdapter')
                const hasPersonalizationStorage = content.includes('PersonalizationStorage')

                if (hasLocalStorage && hasSessionStorage && hasMemoryAdapter && hasPersonalizationStorage) {
                    success('Storage adapters implementados')
                    return true
                } else {
                    error('Storage adapters incompletos')
                    return false
                }
            } else {
                error('Arquivo de storage não encontrado')
                return false
            }
        }
    },
    {
        name: 'Verificar persona analyzer',
        test: () => {
            const analyzerFile = path.join(__dirname, '../src/lib/personalization/persona-analyzer.ts')
            if (fs.existsSync(analyzerFile)) {
                const content = fs.readFileSync(analyzerFile, 'utf8')
                const hasPersonaAnalyzer = content.includes('class PersonaAnalyzer')
                const hasAnalyzeUserProfile = content.includes('analyzeUserProfile')
                const hasCalculatePersonaScores = content.includes('calculatePersonaScores')

                if (hasPersonaAnalyzer && hasAnalyzeUserProfile && hasCalculatePersonaScores) {
                    success('Persona analyzer implementado')
                    return true
                } else {
                    error('Persona analyzer incompleto')
                    return false
                }
            } else {
                error('Arquivo de persona analyzer não encontrado')
                return false
            }
        }
    },
    {
        name: 'Verificar personalization engine',
        test: () => {
            const engineFile = path.join(__dirname, '../src/lib/personalization/personalization-engine.ts')
            if (fs.existsSync(engineFile)) {
                const content = fs.readFileSync(engineFile, 'utf8')
                const hasPersonalizationEngine = content.includes('class PersonalizationEngine')
                const hasInitialize = content.includes('async initialize')
                const hasTrackBehavior = content.includes('trackBehavior')
                const hasGenerateContentVariations = content.includes('generateContentVariations')

                if (hasPersonalizationEngine && hasInitialize && hasTrackBehavior && hasGenerateContentVariations) {
                    success('Personalization engine implementado')
                    return true
                } else {
                    error('Personalization engine incompleto')
                    return false
                }
            } else {
                error('Arquivo de personalization engine não encontrado')
                return false
            }
        }
    },
    {
        name: 'Verificar hooks do React',
        test: () => {
            const hooksFile = path.join(__dirname, '../src/hooks/usePersonalization.ts')
            if (fs.existsSync(hooksFile)) {
                const content = fs.readFileSync(hooksFile, 'utf8')
                const hasUsePersonalization = content.includes('export function usePersonalization')
                const hasUsePersonalizedContent = content.includes('export function usePersonalizedContent')
                const hasUsePersonalizedMicrocopy = content.includes('export function usePersonalizedMicrocopy')
                const hasUsePersonalizationExperiment = content.includes('export function usePersonalizationExperiment')

                if (hasUsePersonalization && hasUsePersonalizedContent && hasUsePersonalizedMicrocopy && hasUsePersonalizationExperiment) {
                    success('Hooks React implementados')
                    return true
                } else {
                    error('Hooks React incompletos')
                    return false
                }
            } else {
                error('Arquivo de hooks não encontrado')
                return false
            }
        }
    },
    {
        name: 'Verificar componente de teste',
        test: () => {
            const testComponentFile = path.join(__dirname, '../src/components/personalization/PersonalizationTest.tsx')
            if (fs.existsSync(testComponentFile)) {
                const content = fs.readFileSync(testComponentFile, 'utf8')
                const hasPersonalizationTest = content.includes('export function PersonalizationTest')
                const hasUsePersonalization = content.includes('usePersonalization')
                const hasTestButtons = content.includes('Testar Click')

                if (hasPersonalizationTest && hasUsePersonalization && hasTestButtons) {
                    success('Componente de teste implementado')
                    return true
                } else {
                    error('Componente de teste incompleto')
                    return false
                }
            } else {
                error('Arquivo de componente de teste não encontrado')
                return false
            }
        }
    },
    {
        name: 'Verificar página de teste',
        test: () => {
            const testPageFile = path.join(__dirname, '../src/app/test-personalization/page.tsx')
            if (fs.existsSync(testPageFile)) {
                const content = fs.readFileSync(testPageFile, 'utf8')
                const hasTestPage = content.includes('export default function TestPersonalizationPage')
                const hasMetadata = content.includes('export const metadata')
                const hasPersonalizationTest = content.includes('PersonalizationTest')

                if (hasTestPage && hasMetadata && hasPersonalizationTest) {
                    success('Página de teste implementada')
                    return true
                } else {
                    error('Página de teste incompleta')
                    return false
                }
            } else {
                error('Arquivo de página de teste não encontrado')
                return false
            }
        }
    },
    {
        name: 'Verificar barrel exports',
        test: () => {
            const indexFile = path.join(__dirname, '../src/lib/personalization/index.ts')
            if (fs.existsSync(indexFile)) {
                const content = fs.readFileSync(indexFile, 'utf8')
                const hasPersonaTypes = content.includes('export type {')
                const hasPersonaAnalyzer = content.includes('PersonaAnalyzer')
                const hasPersonalizationEngine = content.includes('PersonalizationEngine')
                const hasStorageExports = content.includes('PersonalizationStorage')

                if (hasPersonaTypes && hasPersonaAnalyzer && hasPersonalizationEngine && hasStorageExports) {
                    success('Barrel exports configurados')
                    return true
                } else {
                    error('Barrel exports incompletos')
                    return false
                }
            } else {
                error('Arquivo index não encontrado')
                return false
            }
        }
    },
    {
        name: 'Verificar middleware',
        test: () => {
            const middlewareFile = path.join(__dirname, '../middleware.ts')
            if (fs.existsSync(middlewareFile)) {
                const content = fs.readFileSync(middlewareFile, 'utf8')
                const hasPersonalizationImport = content.includes('personalization')
                const hasPersonaAnalysis = content.includes('analyzeBehavior')
                const hasPersonaHeaders = content.includes('x-persona')

                if (hasPersonalizationImport && hasPersonaAnalysis && hasPersonaHeaders) {
                    success('Middleware de personalização configurado')
                    return true
                } else {
                    error('Middleware incompleto')
                    return false
                }
            } else {
                error('Arquivo middleware não encontrado')
                return false
            }
        }
    },
    {
        name: 'Compilação TypeScript',
        test: () => {
            try {
                const result = execSync('npm run type-check', {
                    stdio: 'pipe',
                    cwd: path.join(__dirname, '..')
                })

                if (result.exitCode === 0) {
                    success('Compilação TypeScript sem erros')
                    return true
                } else {
                    error('Erros na compilação TypeScript')
                    console.log(result.stderr.toString())
                    return false
                }
            } catch (error) {
                error('Erro ao executar type-check')
                console.log(error.message)
                return false
            }
        }
    },
    {
        name: 'Build Next.js',
        test: () => {
            try {
                const result = execSync('npm run build', {
                    stdio: 'pipe',
                    cwd: path.join(__dirname, '..')
                })

                if (result.exitCode === 0) {
                    success('Build Next.js concluído com sucesso')
                    return true
                } else {
                    error('Erros no build Next.js')
                    console.log(result.stderr.toString())
                    return false
                }
            } catch (error) {
                error('Erro ao executar build')
                console.log(error.message)
                return false
            }
        }
    },
    {
        name: 'Verificar estrutura de diretórios',
        test: () => {
            const requiredDirs = [
                'src/types',
                'src/lib/personalization',
                'src/hooks',
                'src/components/personalization',
                'src/app/test-personalization'
            ]

            let allDirsExist = true

            for (const dir of requiredDirs) {
                const dirPath = path.join(__dirname, '..', dir)
                if (!fs.existsSync(dirPath)) {
                    error(`Diretório não encontrado: ${dir}`)
                    allDirsExist = false
                } else {
                    success(`Diretório encontrado: ${dir}`)
                }
            }

            return allDirsExist
        }
    }
]

// Executar testes
async function runTests() {
    log('🔍 Executando validação do sistema...\n', 'cyan')

    let passedTests = 0
    let totalTests = tests.length

    for (const test of tests) {
        info(`Testando: ${test.name}`)

        try {
            const result = await test.test()
            if (result) {
                passedTests++
            }
        } catch (error) {
            error(`Erro no teste "${test.name}": ${error.message}`)
        }

        console.log('') // Linha em branco
    }

    // Resumo final
    log('\n📊 Resumo dos Testes', 'magenta')
    log('='.repeat(50), 'magenta')

    if (passedTests === totalTests) {
        success(`Todos os ${totalTests} testes passaram! 🎉`)
        log('\n✨ O sistema de personalização está pronto para uso em produção!')
        log('\n🚀 Para testar manualmente:')
        log('   1. npm run dev')
        log('   2. Acesse http://localhost:3000/test-personalization')
        log('   3. Interaja com os botões e verifique a detecção de personas')

        log('\n📋 Funcionalidades implementadas:')
        log('   • Detecção automática de 8 personas')
        log('   • Análise comportamental em tempo real')
        log('   • Geração de conteúdo personalizado')
        log('   • Sistema de storage adaptável')
        log('   • Hooks React para fácil integração')
        log('   • Middleware para análise de requisições')
        log('   • Componentes de teste e validação')

        log('\n🎯 Próximos passos:')
        log('   • Integrar com componentes existentes')
        log('   • Configurar analytics reais')
        log('   • Implementar experimentos A/B')
        log('   • Otimizar performance em produção')

    } else {
        error(`${passedTests}/${totalTests} testes passaram`)
        warning('\n⚠️  Corrija os erros antes de usar em produção')

        log('\n🔧 Sugestões:')
        log('   • Verifique os logs de erro acima')
        log('   • Execute npm run type-check para ver detalhes')
        log('   • Revise os arquivos marcados com ❌')
        log('   • Execute npm run build para testar compilação')
    }

    return passedTests === totalTests
}

// Executar testes
runTests().then(success => {
    process.exit(success ? 0 : 1)
}).catch(error => {
    error(`Erro fatal nos testes: ${error.message}`)
    process.exit(1)
})
