# ⚡ Comandos Rápidos - SV Lentes

## 🚀 Iniciar/Reiniciar

```bash
# Limpeza completa + reinício (RECOMENDADO)
./clean-restart.sh

# Reinício rápido
./restart-dev.sh

# Manual
npm run dev
```

## 🧹 Limpeza

```bash
# Limpar cache Next.js
rm -rf .next

# Limpar tudo
rm -rf .next node_modules/.cache .swc

# Limpar cache npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json && npm install
```

## 🔍 Diagnóstico

```bash
# Verificar processos Next.js
ps aux | grep next

# Verificar porta 3000
lsof -i :3000

# Matar processo na porta 3000
kill -9 $(lsof -ti:3000)

# Verificar versões
node --version
npm --version
```

## 🏗️ Build e Testes

```bash
# Build de produção
npm run build

# Verificar erros de linting
npm run lint

# Iniciar servidor de produção
npm run start
```

## 📦 Dependências

```bash
# Listar dependências
npm list

# Verificar versões do React
npm list react react-dom next

# Atualizar dependências
npm update

# Verificar dependências desatualizadas
npm outdated
```

## 🐛 Debug

```bash
# Modo verbose
npm run dev -- --verbose

# Porta diferente
npm run dev -- -p 3001

# Limpar cache e modo verbose
rm -rf .next && npm run dev -- --verbose
```

## 📊 Análise

```bash
# Analisar bundle
npm run build && npm run analyze

# Verificar tamanho dos arquivos
du -sh .next/static/*

# Contar linhas de código
find src -name '*.tsx' -o -name '*.ts' | xargs wc -l
```

## 🔧 Manutenção

```bash
# Verificar integridade
npm audit

# Corrigir vulnerabilidades
npm audit fix

# Formatar código
npm run format

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 📝 Git

```bash
# Status
git status

# Adicionar mudanças
git add .

# Commit
git commit -m "feat: implementar fluxo de assinatura"

# Push
git push origin main
```

## 🌐 URLs Importantes

```bash
# Homepage
open http://localhost:3000

# Calculadora
open http://localhost:3000/calculadora

# Fluxo de assinatura
open http://localhost:3000/assinar

# Shadcn demo
open http://localhost:3000/shadcn-demo
```

## 🎯 Atalhos Úteis

### No Terminal
- `Ctrl + C` - Parar servidor
- `Ctrl + L` - Limpar terminal
- `↑` - Comando anterior

### No Navegador
- `Cmd/Ctrl + Shift + R` - Hard reload
- `F12` - DevTools
- `Cmd/Ctrl + Shift + C` - Inspecionar elemento

## 📋 Checklist Rápido

```bash
# 1. Limpar e reiniciar
./clean-restart.sh

# 2. Aguardar compilação
# Verificar no terminal: ✓ Compiled

# 3. Abrir navegador
open http://localhost:3000

# 4. Limpar cache do navegador
# Cmd+Shift+R (Mac) ou Ctrl+Shift+R (Windows/Linux)

# 5. Testar
# ✓ Homepage
# ✓ Calculadora
# ✓ Fluxo de assinatura
```

## 🆘 Solução Rápida de Problemas

### Erro: Port already in use
```bash
kill -9 $(lsof -ti:3000)
npm run dev
```

### Erro: Module not found
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erro: MIME type
```bash
rm -rf .next
pkill -f "next dev"
npm run dev
```

### Erro: Cannot read properties
```bash
rm -rf .next node_modules/.cache
npm cache clean --force
npm run dev
```

### Página em branco
```bash
# 1. Verificar console do navegador (F12)
# 2. Verificar terminal do servidor
# 3. Limpar cache
rm -rf .next
npm run dev
# 4. Hard reload no navegador (Cmd+Shift+R)
```

## 📚 Documentação

```bash
# Abrir documentação
open IMPLEMENTATION_SUMMARY.md
open QUICK_START_GUIDE.md
open TROUBLESHOOTING.md
open FINAL_CHECKLIST.md
```

## 🎉 Tudo Funcionando?

Se tudo estiver funcionando:
1. ✅ Marque os itens do `FINAL_CHECKLIST.md`
2. ✅ Teste em diferentes navegadores
3. ✅ Teste em mobile
4. ✅ Prossiga com integração backend

---

**Comando mais importante:**
```bash
./clean-restart.sh
```

**Depois disso, acesse:**
```
http://localhost:3000
```

**E pronto! 🚀**
