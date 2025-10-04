#!/usr/bin/env node

/**
 * Script de Otimização da Logo - SV Lentes
 *
 * Este script:
 * 1. Converte logo PNG para WebP
 * 2. Gera versões responsivas otimizadas
 * 3. Mantém PNG original como fallback
 * 4. Gera relatório de economia
 *
 * Uso:
 *   node scripts/optimize-logo.js
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// Configurações
const CONFIG = {
  sourceFile: path.join(__dirname, '../public/logosv.png'),
  outputDir: path.join(__dirname, '../public'),
  sizes: [
    { name: 'sm', width: 120, height: 40 },
    { name: 'md', width: 180, height: 60 },
    { name: 'lg', width: 240, height: 80 },
    { name: 'xl', width: 300, height: 100 },
    { name: 'original', width: null, height: null } // Mantém dimensões originais
  ],
  formats: [
    { ext: 'webp', quality: 90, description: 'WebP otimizado' },
    { ext: 'png', quality: 95, description: 'PNG fallback' }
  ]
}

// Estatísticas
const stats = {
  originalSize: 0,
  optimizedFiles: [],
  totalOptimizedSize: 0
}

/**
 * Formata bytes para leitura humana
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Otimiza logo em diferentes tamanhos e formatos
 */
async function optimizeLogo() {
  console.log('🎨 Otimizando logo SV Lentes...\n')

  // Verificar se arquivo existe
  if (!fs.existsSync(CONFIG.sourceFile)) {
    console.error('❌ Arquivo logosv.png não encontrado!')
    process.exit(1)
  }

  // Tamanho original
  stats.originalSize = fs.statSync(CONFIG.sourceFile).size
  console.log(`📊 Tamanho original: ${formatBytes(stats.originalSize)}\n`)

  // Processar cada tamanho e formato
  for (const size of CONFIG.sizes) {
    for (const format of CONFIG.formats) {
      try {
        const sizeName = size.name === 'original' ? '' : `-${size.name}`
        const outputFilename = `logosv${sizeName}.${format.ext}`
        const outputPath = path.join(CONFIG.outputDir, outputFilename)

        let processor = sharp(CONFIG.sourceFile)

        // Aplicar resize se não for tamanho original
        if (size.width && size.height) {
          processor = processor.resize(size.width, size.height, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
        }

        // Converter para formato específico
        await processor
          .toFormat(format.ext, { quality: format.quality })
          .toFile(outputPath)

        const optimizedSize = fs.statSync(outputPath).size
        stats.totalOptimizedSize += optimizedSize

        const savings = stats.originalSize > 0
          ? ((1 - optimizedSize / stats.originalSize) * 100).toFixed(1)
          : '0.0'

        stats.optimizedFiles.push({
          filename: outputFilename,
          size: formatBytes(optimizedSize),
          savings: `${savings}%`,
          format: format.description
        })

        console.log(`✅ ${outputFilename}`)
        console.log(`   Tamanho: ${formatBytes(optimizedSize)} (${savings}% menor)`)
        console.log(`   Formato: ${format.description}\n`)

      } catch (error) {
        console.error(`❌ Erro ao processar ${size.name} ${format.ext}:`, error.message)
      }
    }
  }
}

/**
 * Gera relatório de otimização
 */
function generateReport() {
  const totalSavings = stats.originalSize - (stats.totalOptimizedSize / stats.optimizedFiles.length)
  const savingsPercentage = ((1 - (stats.totalOptimizedSize / stats.optimizedFiles.length) / stats.originalSize) * 100).toFixed(1)

  console.log('\n═══════════════════════════════════════════')
  console.log('📊 RELATÓRIO DE OTIMIZAÇÃO DA LOGO')
  console.log('═══════════════════════════════════════════')
  console.log(`Arquivo original: ${formatBytes(stats.originalSize)}`)
  console.log(`Arquivos gerados: ${stats.optimizedFiles.length}`)
  console.log(`Economia média: ${formatBytes(totalSavings)} (${savingsPercentage}%)`)
  console.log('═══════════════════════════════════════════')

  console.log('\n📁 Arquivos gerados:')
  stats.optimizedFiles.forEach(file => {
    console.log(`   - ${file.filename}: ${file.size} (${file.format})`)
  })

  console.log('\n💡 Próximos passos:')
  console.log('   1. Componente Logo já usa Next.js Image para lazy loading')
  console.log('   2. Versões WebP serão servidas automaticamente em navegadores compatíveis')
  console.log('   3. PNG serve como fallback para navegadores antigos')
  console.log('   4. Tamanhos responsivos otimizam carregamento por dispositivo')
}

/**
 * Função principal
 */
async function main() {
  try {
    // Verificar se sharp está instalado
    require.resolve('sharp')
  } catch (e) {
    console.error('❌ Sharp não está instalado. Execute: npm install sharp --save-dev')
    process.exit(1)
  }

  await optimizeLogo()
  generateReport()

  console.log('\n✨ Otimização da logo concluída com sucesso!')
}

// Executar
main().catch(error => {
  console.error('❌ Erro fatal:', error)
  process.exit(1)
})
