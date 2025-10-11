# 🚀 Guia Rápido de Teste - Links e Botões

## ⚡ Teste Rápido (5 minutos)

### 1. Iniciar Servidor
```bash
npm run dev
```

### 2. Testar Navegação Principal
Abra: http://localhost:3000

**Header**:
- [ ] Clicar no logo → Deve ir para home
- [ ] Clicar em "Planos" → Deve ir para /assinatura
- [ ] Clicar em "Como Funciona" → Deve ir para /sdd-framework
- [ ] Clicar em "FAQ" → Deve ir para /sdd-framework#faq
- [ ] Clicar em "Assinar Agora" → Deve ir para /assinatura
- [ ] Clicar em "Agendar Consulta" → Deve abrir WhatsApp

**Footer** (scroll até o final):
- [ ] Clicar em "Assinar Agora" → Deve ir para /assinatura
- [ ] Clicar em "Planos e Preços" → Deve ir para /assinatura
- [ ] Clicar em "Como Funciona" → Deve ir para /sdd-framework
- [ ] Clicar em "FAQ" → Deve ir para /sdd-framework#faq
- [ ] Clicar em "Calculadora" → Deve ir para /calculadora
- [ ] Clicar em "Falar com Especialista" → Deve abrir WhatsApp

### 3. Testar Página de Assinatura
Abra: http://localhost:3000/assinatura

- [ ] Scroll até o final
- [ ] Clicar em "Começar Agora" → Deve fazer scroll para o topo
- [ ] Verificar se SubscriptionFlow está visível

### 4. Testar SDD Framework
Abra: http://localhost:3000/sdd-framework

- [ ] Clicar em "ASSINAR AGORA" (hero) → Deve abrir formulário
- [ ] Clicar em "AGENDAR AVALIAÇÃO" → Deve abrir WhatsApp
- [ ] Scroll até os planos
- [ ] Clicar em "ASSINAR AGORA" (Plano Básico) → Deve abrir WhatsApp
- [ ] Clicar em "ASSINAR AGORA" (Plano Padrão) → Deve abrir WhatsApp
- [ ] Clicar em "ASSINAR AGORA" (Plano Premium) → Deve abrir WhatsApp
- [ ] Clicar em toggle "Anual" → Deve mostrar preços com desconto

### 5. Testar Landing de Conversão
Abra: http://localhost:3000/landing-conversao

- [ ] Clicar em "QUERO TRANSFORMAR MINHA VISÃO" → Deve abrir formulário
- [ ] Preencher nome: "João Teste"
- [ ] Preencher telefone: "33998601427"
- [ ] Preencher email: "joao@teste.com"
- [ ] Clicar em "QUERO FALAR COM ESPECIALISTA AGORA" → Deve abrir WhatsApp

---

## 🧪 Teste Automatizado (2 minutos)

### Executar Todos os Testes
```bash
npm run test:e2e
```

### Executar com Interface Visual
```bash
npm run test:e2e:ui
```

### Executar Teste Específico
```bash
npx playwright test test-links-buttons
```

---

## 📱 Teste Mobile (3 minutos)

### 1. Abrir DevTools
- Pressione F12
- Clique no ícone de dispositivo móvel (Ctrl+Shift+M)

### 2. Selecionar Dispositivo
- iPhone 12 Pro (390x844)
- Samsung Galaxy S20 (360x800)
- iPad Air (820x1180)

### 3. Testar Menu Mobile
- [ ] Clicar no ícone de menu (hamburguer)
- [ ] Menu deve abrir
- [ ] Clicar em cada link
- [ ] Menu deve fechar após clicar

### 4. Testar CTAs Mobile
- [ ] Botões devem ter tamanho adequado (44px+)
- [ ] Espaçamento adequado entre elementos
- [ ] Scroll suave funcionando

---

## 🔍 Teste de Acessibilidade (2 minutos)

### 1. Navegação por Teclado
```
Tab → Próximo elemento
Shift+Tab → Elemento anterior
Enter → Ativar link/botão
Esc → Fechar modal
```

### 2. Verificar
- [ ] Todos os elementos são alcançáveis por Tab
- [ ] Foco visível em todos os elementos
- [ ] Modais fecham com Esc
- [ ] Formulários funcionam com teclado

### 3. Screen Reader (Opcional)
- Windows: NVDA (gratuito)
- Mac: VoiceOver (nativo)
- [ ] Testar navegação com leitor de tela

---

## ⚡ Teste de Performance (1 minuto)

### 1. Lighthouse
```bash
npm run lighthouse
```

### 2. Verificar Métricas
- [ ] Performance > 90
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90

### 3. Network
- Abrir DevTools → Network
- [ ] Tempo de carregamento < 3s
- [ ] Recursos otimizados
- [ ] Sem erros 404

---

## 🐛 Checklist de Problemas Comuns

### Links Não Funcionam
```bash
# Verificar console do navegador
# Procurar por erros JavaScript
# Verificar se href está correto
```

### Botões Não Respondem
```bash
# Verificar se onClick está definido
# Verificar console para erros
# Testar em navegador diferente
```

### WhatsApp Não Abre
```bash
# Verificar número: 5533998601427
# Verificar formato da URL
# Testar em dispositivo real
```

### Scroll Não Funciona
```bash
# Verificar se behavior: 'smooth' está definido
# Testar em navegador diferente
# Verificar CSS overflow
```

---

## 📊 Relatório Rápido

### Após Testes, Preencher:

**Data**: ___/___/2025  
**Testador**: _______________

**Navegação Header**: ☐ OK ☐ Problemas  
**Navegação Footer**: ☐ OK ☐ Problemas  
**Página Assinatura**: ☐ OK ☐ Problemas  
**SDD Framework**: ☐ OK ☐ Problemas  
**Landing Conversão**: ☐ OK ☐ Problemas  
**Mobile**: ☐ OK ☐ Problemas  
**Acessibilidade**: ☐ OK ☐ Problemas  
**Performance**: ☐ OK ☐ Problemas  

**Problemas Encontrados**:
```
1. _________________________________
2. _________________________________
3. _________________________________
```

**Status Final**: ☐ APROVADO ☐ REPROVADO

---

## 🚨 Em Caso de Erro

### Erro 1: Página não carrega
```bash
# Limpar cache
rm -rf .next
npm run dev
```

### Erro 2: Links quebrados
```bash
# Verificar arquivos modificados
git status

# Reverter se necessário
git checkout src/components/layout/Header.tsx
git checkout src/components/layout/Footer.tsx
git checkout src/app/assinatura/page.tsx
```

### Erro 3: Testes falhando
```bash
# Atualizar dependências
npm install

# Reinstalar Playwright
npx playwright install

# Executar novamente
npm run test:e2e
```

---

## 📞 Suporte

### Documentação Completa
- `LINK_BUTTON_TEST_RESULTS.md` - Relatório detalhado
- `FIXES_APPLIED.md` - Correções aplicadas
- `TEST_SUMMARY.md` - Resumo executivo

### Comandos Úteis
```bash
# Ver logs do servidor
npm run dev

# Build de produção
npm run build

# Executar em produção
npm run start

# Verificar erros
npm run lint

# Executar testes unitários
npm run test
```

---

## ✅ Checklist Final

Antes de aprovar para produção:

- [ ] Todos os testes manuais passaram
- [ ] Testes automatizados passaram
- [ ] Teste mobile OK
- [ ] Teste de acessibilidade OK
- [ ] Performance > 90
- [ ] Sem erros no console
- [ ] WhatsApp funcionando
- [ ] Formulários validando
- [ ] Modais abrindo/fechando
- [ ] Scroll suave funcionando

**Assinatura**: _______________  
**Data**: ___/___/2025

---

## 🎉 Pronto para Deploy!

Se todos os testes passaram:

```bash
# Commit das alterações
git add .
git commit -m "fix: corrigir links e botões quebrados"

# Push para repositório
git push origin main

# Deploy (se configurado)
npm run deploy:production
```

---

**Tempo Total de Teste**: ~15 minutos  
**Última Atualização**: 07/10/2025
