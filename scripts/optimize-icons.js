#!/usr/bin/env node

/**
 * Script de Otimização de Ícones - SV Lentes
 *
 * Este script:
 * 1. Converte ícones PNG/JPEG para WebP
 * 2. Gera versões responsivas (1x, 2x, 3x)
 * 3. Comprime imagens mantendo qualidade
 * 4. Gera relatório de economia de espaço
 *
 * Uso:
 *   node scripts/optimize-icons.js
 *
 * Requisitos:
 *   npm install sharp --save-dev
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// Configurações
const CONFIG = {
  sourceDir: path.join(__dirname, '../public/icones'),
  outputDir: path.join(__dirname, '../public/icones/optimized'),
  formats: ['webp', 'png'], // WebP com fallback PNG
  qualities: {
    webp: 85,
    png: 90,
    jpeg: 85
  },
  responsive: {
    scales: [1, 2, 3], // 1x, 2x, 3x para diferentes densidades de tela
    enabled: true
  },
  skipFiles: [
    '.DS_Store',
    'optimized', // Pular diretório de saída
    'ChatGPT 2025-10-01 12.25.17.tiff' // Arquivo TIFF não processável
  ]
}

// Metadados dos ícones (sincronizado com src/lib/icons.ts)
const ICON_METADATA = {
  'customer_service_icon.png': { width: 64, height: 64, category: 'atendimento' },
  'icon_atend24:7.png': { width: 80, height: 80, category: 'atendimento' },
  'icon_amoresaude.png': { width: 48, height: 48, category: 'atendimento' },
  'blue_shield_checkmark_icon.png': { width: 72, height: 72, category: 'beneficios' },
  'diamond_and_star_icon.png': { width: 64, height: 64, category: 'beneficios' },
  'piggy_bank_with_dollar_coin.png': { width: 80, height: 80, category: 'beneficios' },
  'colorful_calculator_icon.png': { width: 64, height: 64, category: 'beneficios' },
  'hand_holding_package_icon.png': { width: 72, height: 72, category: 'processos' },
  'cartoon-character-location-icon.png': { width: 80, height: 80, category: 'processos' },
  'eye-calendar-icon.png': { width: 72, height: 72, category: 'medico' },
  'eye_check_award_icon.png': { width: 80, height: 80, category: 'medico' },
  'flaming_crown_popular_badge.png': { width: 56, height: 56, category: 'badges' },
  'ten_year_anniversary_badge.png': { width: 64, height: 64, category: 'badges' },
  'drphilipe_perfil.jpeg': { width: 120, height: 120, category: 'perfil' },
  'Pin_icon_menino.png': { width: 48, height: 48, category: 'perfil' }
}

// Estatísticas de processamento
const stats = {
  processed: 0,
  failed: 0,
  totalOriginalSize: 0,
  totalOptimizedSize: 0,
  files: []
}

/**
 * Formata bytes para leitura humana
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Otimiza uma imagem individual
 */
async function optimizeImage(filename) {
  const sourcePath = path.join(CONFIG.sourceDir, filename)
  const metadata = ICON_METADATA[filename]

  if (!metadata) {
    console.log(`⚠️  Sem metadata para ${filename}, pulando...`)
    return
  }

  try {
    const originalSize = fs.statSync(sourcePath).size
    stats.totalOriginalSize += originalSize

    const baseNameWithoutExt = path.parse(filename).name
    const outputCategory = path.join(CONFIG.outputDir, metadata.category)

    // Criar diretório de categoria se não existir
    if (!fs.existsSync(outputCategory)) {
      fs.mkdirSync(outputCategory, { recursive: true })
    }

    let totalOptimizedSize = 0

    // Processar cada formato
    for (const format of CONFIG.formats) {
      const quality = CONFIG.qualities[format]

      // Processar escalas responsivas
      for (const scale of CONFIG.responsive.scales) {
        const width = metadata.width * scale
        const height = metadata.height * scale
        const scaleSuffix = scale > 1 ? `@${scale}x` : ''
        const outputFilename = `${baseNameWithoutExt}${scaleSuffix}.${format}`
        const outputPath = path.join(outputCategory, outputFilename)

        await sharp(sourcePath)
          .resize(width, height, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .toFormat(format, { quality })
          .toFile(outputPath)

        const optimizedSize = fs.statSync(outputPath).size
        totalOptimizedSize += optimizedSize

        console.log(`  ✓ ${outputFilename} (${formatBytes(optimizedSize)})`)
      }
    }

    stats.totalOptimizedSize += totalOptimizedSize
    const savings = ((1 - totalOptimizedSize / originalSize) * 100).toFixed(1)

    stats.files.push({
      filename,
      originalSize,
      optimizedSize: totalOptimizedSize,
      savings: `${savings}%`
    })

    stats.processed++
    console.log(`✅ ${filename}: ${formatBytes(originalSize)} → ${formatBytes(totalOptimizedSize)} (${savings}% menor)\n`)

  } catch (error) {
    console.error(`❌ Erro ao processar ${filename}:`, error.message)
    stats.failed++
  }
}

/**
 * Gera relatório de otimização
 */
function generateReport() {
  const reportPath = path.join(CONFIG.outputDir, 'optimization-report.json')

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      processed: stats.processed,
      failed: stats.failed,
      totalOriginalSize: formatBytes(stats.totalOriginalSize),
      totalOptimizedSize: formatBytes(stats.totalOptimizedSize),
      totalSavings: formatBytes(stats.totalOriginalSize - stats.totalOptimizedSize),
      savingsPercentage: ((1 - stats.totalOptimizedSize / stats.totalOriginalSize) * 100).toFixed(1) + '%'
    },
    files: stats.files.map(file => ({
      ...file,
      originalSize: formatBytes(file.originalSize),
      optimizedSize: formatBytes(file.optimizedSize)
    })),
    config: CONFIG
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

  console.log('\n📊 RELATÓRIO DE OTIMIZAÇÃO')
  console.log('═══════════════════════════════════════════')
  console.log(`Arquivos processados: ${report.summary.processed}`)
  console.log(`Arquivos com erro: ${report.summary.failed}`)
  console.log(`Tamanho original total: ${report.summary.totalOriginalSize}`)
  console.log(`Tamanho otimizado total: ${report.summary.totalOptimizedSize}`)
  console.log(`Economia total: ${report.summary.totalSavings} (${report.summary.savingsPercentage})`)
  console.log('═══════════════════════════════════════════')
  console.log(`\n📄 Relatório completo salvo em: ${reportPath}`)
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando otimização de ícones...\n')

  // Verificar se sharp está instalado
  try {
    require.resolve('sharp')
  } catch (e) {
    console.error('❌ Sharp não está instalado. Execute: npm install sharp --save-dev')
    process.exit(1)
  }

  // Criar diretório de saída
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true })
  }

  // Listar arquivos no diretório fonte
  const files = fs.readdirSync(CONFIG.sourceDir)
    .filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.png', '.jpg', '.jpeg'].includes(ext) &&
        !CONFIG.skipFiles.includes(file)
    })

  console.log(`📁 Encontrados ${files.length} arquivos para processar\n`)

  // Processar cada arquivo
  for (const file of files) {
    await optimizeImage(file)
  }

  // Gerar relatório
  generateReport()

  console.log('\n✨ Otimização concluída!')
}

// Executar
main().catch(error => {
  console.error('❌ Erro fatal:', error)
  process.exit(1)
})
