#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando performance e problemas do site SVlentes...\n');

// Função para executar comandos e capturar saída
function runCommand(command, description) {
    console.log(`📋 ${description}...`);
    try {
        const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
        console.log('✅ Sucesso\n');
        return output;
    } catch (error) {
        console.log(`❌ Erro: ${error.message}\n`);
        return null;
    }
}

// Função para verificar arquivos
function checkFile(filePath, description) {
    console.log(`📁 Verificando ${description}...`);
    if (fs.existsSync(filePath)) {
        console.log('✅ Arquivo encontrado\n');
        return true;
    } else {
        console.log(`❌ Arquivo não encontrado: ${filePath}\n`);
        return false;
    }
}

// Verificações de arquivos críticos
console.log('=== VERIFICAÇÃO DE ARQUIVOS CRÍTICOS ===\n');

const criticalFiles = [
    { path: 'src/app/layout.tsx', desc: 'Layout principal' },
    { path: 'src/app/page.tsx', desc: 'Página inicial' },
    { path: 'src/components/layout/Header.tsx', desc: 'Header' },
    { path: 'src/components/sections/FAQ.tsx', desc: 'FAQ' },
    { path: 'src/components/forms/EconomyCalculator.tsx', desc: 'Calculadora' },
    { path: 'src/app/termos-uso/page.tsx', desc: 'Termos de uso' },
    { path: 'next.config.js', desc: 'Configuração Next.js' },
];

let allFilesExist = true;
criticalFiles.forEach(file => {
    if (!checkFile(file.path, file.desc)) {
        allFilesExist = false;
    }
});

// Verificação de build
console.log('=== VERIFICAÇÃO DE BUILD ===\n');
const buildOutput = runCommand('npm run build', 'Build do projeto');

// Verificação de lint
console.log('=== VERIFICAÇÃO DE LINT ===\n');
runCommand('npm run lint', 'Verificação de código');

// Verificação de tipos TypeScript
console.log('=== VERIFICAÇÃO DE TIPOS ===\n');
runCommand('npx tsc --noEmit', 'Verificação de tipos TypeScript');

// Análise de bundle
console.log('=== ANÁLISE DE BUNDLE ===\n');
if (fs.existsSync('.next')) {
    console.log('📊 Analisando tamanho do bundle...');

    // Verificar se existe o arquivo de build stats
    const buildStatsPath = '.next/static/chunks';
    if (fs.existsSync(buildStatsPath)) {
        const chunks = fs.readdirSync(buildStatsPath);
        console.log(`📦 Total de chunks: ${chunks.length}`);

        // Verificar tamanhos dos chunks principais
        const mainChunks = chunks.filter(chunk =>
            chunk.includes('main') ||
            chunk.includes('pages') ||
            chunk.includes('app')
        );

        console.log('📋 Chunks principais:');
        mainChunks.forEach(chunk => {
            const chunkPath = path.join(buildStatsPath, chunk);
            const stats = fs.statSync(chunkPath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            console.log(`   ${chunk}: ${sizeKB} KB`);
        });
    }
    console.log('✅ Análise de bundle concluída\n');
} else {
    console.log('❌ Build não encontrado. Execute npm run build primeiro.\n');
}

// Verificação de variáveis de ambiente
console.log('=== VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE ===\n');
checkFile('.env.example', 'Arquivo de exemplo de variáveis');
checkFile('.env.local', 'Arquivo de variáveis locais');

// Verificação de dependências
console.log('=== VERIFICAÇÃO DE DEPENDÊNCIAS ===\n');
runCommand('npm audit --audit-level=moderate', 'Auditoria de segurança');

// Verificação de performance
console.log('=== VERIFICAÇÃO DE PERFORMANCE ===\n');

const performanceChecks = [
    {
        name: 'Imagens otimizadas',
        check: () => {
            const publicDir = 'public';
            if (!fs.existsSync(publicDir)) return false;

            const images = fs.readdirSync(publicDir).filter(file =>
                file.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)
            );

            console.log(`📸 Encontradas ${images.length} imagens em /public`);
            return images.length > 0;
        }
    },
    {
        name: 'Configuração de cache',
        check: () => {
            const nextConfig = fs.readFileSync('next.config.js', 'utf8');
            return nextConfig.includes('headers') && nextConfig.includes('Cache-Control');
        }
    },
    {
        name: 'Compressão habilitada',
        check: () => {
            const nextConfig = fs.readFileSync('next.config.js', 'utf8');
            return nextConfig.includes('compress: true');
        }
    }
];

performanceChecks.forEach(check => {
    console.log(`🔍 Verificando ${check.name}...`);
    if (check.check()) {
        console.log('✅ OK\n');
    } else {
        console.log('⚠️  Pode ser melhorado\n');
    }
});

// Resumo final
console.log('=== RESUMO FINAL ===\n');

if (allFilesExist) {
    console.log('✅ Todos os arquivos críticos estão presentes');
} else {
    console.log('❌ Alguns arquivos críticos estão faltando');
}

if (buildOutput) {
    console.log('✅ Build executado com sucesso');
} else {
    console.log('❌ Problemas no build detectados');
}

console.log('\n🎯 PRÓXIMOS PASSOS RECOMENDADOS:');
console.log('1. Execute npm run dev para testar localmente');
console.log('2. Teste a navegação entre seções');
console.log('3. Verifique o funcionamento da calculadora');
console.log('4. Teste o FAQ e formulários');
console.log('5. Execute npm run lighthouse para análise completa');

console.log('\n✨ Verificação concluída!');