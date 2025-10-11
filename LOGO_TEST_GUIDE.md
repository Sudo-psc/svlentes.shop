# Guia de Teste - Logo SVlentes

## 🧪 Como Testar a Nova Logo

### 1. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Aguarde o servidor iniciar em `http://localhost:3000`

## 📍 Onde Verificar a Logo

### ✅ Checklist de Páginas

#### 1. Página Principal (/)
```
http://localhost:3000/
```
- [ ] Logo aparece no header
- [ ] Logo aparece no footer
- [ ] Hover effect funciona
- [ ] Responsivo em mobile

#### 2. Página de Assinatura (/assinatura)
```
http://localhost:3000/assinatura
```
- [ ] Logo visível no header
- [ ] Logo visível no footer
- [ ] Scroll behavior correto

#### 3. Página SDD Framework (/sdd-framework)
```
http://localhost:3000/sdd-framework
```
- [ ] Logo consistente
- [ ] Navegação funcional

#### 4. Outras Páginas
```
http://localhost:3000/agendar-consulta
http://localhost:3000/calculadora
http://localhost:3000/landing-conversao
```
- [ ] Logo em todas as páginas
- [ ] Comportamento consistente

## 🎨 Testes Visuais

### 1. Teste de Tema (Light/Dark)

#### Light Mode
1. Abra o site
2. Verifique a logo no header
3. Cores esperadas: Azuis escuros (#1e3a8a → #0066CC)

#### Dark Mode
1. Clique no botão de tema (🌙/☀️)
2. Verifique a logo adapta as cores
3. Cores esperadas: Azuis claros (#3b82f6 → #60a5fa)

```
✅ Checklist Dark Mode:
- [ ] Logo visível em fundo escuro
- [ ] Contraste adequado
- [ ] Gradiente ajustado
- [ ] Ícone legível
```

### 2. Teste de Responsividade

#### Desktop (≥1024px)
```bash
# Redimensione o navegador para 1920x1080
```
- [ ] Logo tamanho médio
- [ ] Ícone + texto visíveis
- [ ] Espaçamento adequado
- [ ] Hover effect suave

#### Tablet (768px - 1023px)
```bash
# Redimensione para 768x1024
```
- [ ] Logo reduzida apropriadamente
- [ ] Ainda legível
- [ ] Não sobrepõe menu

#### Mobile (<768px)
```bash
# Redimensione para 375x667 (iPhone SE)
```
- [ ] Logo compacta
- [ ] Ícone visível
- [ ] Texto legível
- [ ] Touch-friendly

### 3. Teste de Scroll

1. Abra a página principal
2. Role a página para baixo
3. Observe o header

```
✅ Checklist Scroll:
- [ ] Logo reduz suavemente
- [ ] Mantém proporções
- [ ] Transição suave (300ms)
- [ ] Barra de progresso aparece
```

### 4. Teste de Hover

1. Passe o mouse sobre a logo
2. Observe a animação

```
✅ Checklist Hover:
- [ ] Scale up para 105%
- [ ] Transição suave (200ms)
- [ ] Cursor pointer
- [ ] Sem distorção
```

## 🔍 Testes de Acessibilidade

### 1. Teste com Leitor de Tela

#### macOS (VoiceOver)
```bash
# Ativar: Cmd + F5
```
1. Navegue até a logo
2. Deve anunciar: "SVlentes - Saraiva Vision Oftalmologia"

#### Windows (NVDA/JAWS)
1. Navegue até a logo
2. Verifique anúncio correto

```
✅ Checklist Leitor de Tela:
- [ ] Texto alternativo presente
- [ ] Descrição clara
- [ ] Navegação por teclado
- [ ] Foco visível
```

### 2. Teste de Contraste

#### Ferramentas
- Chrome DevTools > Lighthouse
- WAVE Extension
- Contrast Checker

```
✅ Checklist Contraste:
- [ ] WCAG AAA (7:1) em light mode
- [ ] WCAG AAA (7:1) em dark mode
- [ ] Legível em todos os fundos
- [ ] Sem problemas reportados
```

### 3. Teste de Teclado

1. Use apenas o teclado (Tab)
2. Navegue até a logo
3. Pressione Enter

```
✅ Checklist Teclado:
- [ ] Focável com Tab
- [ ] Foco visível
- [ ] Enter funciona
- [ ] Sem trap de foco
```

## 📱 Testes em Dispositivos Reais

### iOS (Safari)
```
Dispositivos: iPhone 12, iPhone 14, iPad Pro
```
- [ ] Logo renderiza corretamente
- [ ] Gradientes funcionam
- [ ] Touch funciona
- [ ] Sem problemas de performance

### Android (Chrome)
```
Dispositivos: Samsung Galaxy, Pixel
```
- [ ] Logo renderiza corretamente
- [ ] Cores consistentes
- [ ] Touch responsivo
- [ ] Sem lag

## 🚀 Testes de Performance

### 1. Lighthouse Audit

```bash
# Chrome DevTools > Lighthouse
# Executar audit
```

```
✅ Métricas Esperadas:
- [ ] Performance: ≥90
- [ ] Accessibility: 100
- [ ] Best Practices: ≥90
- [ ] SEO: 100
```

### 2. Network Analysis

```bash
# Chrome DevTools > Network
# Recarregar página
```

```
✅ Checklist Network:
- [ ] Logo não faz HTTP requests (SVG inline)
- [ ] Sem imagens externas
- [ ] Carregamento instantâneo
- [ ] Sem bloqueio de renderização
```

### 3. Rendering Performance

```bash
# Chrome DevTools > Performance
# Gravar interação com logo
```

```
✅ Checklist Rendering:
- [ ] Sem layout shifts
- [ ] Animações a 60fps
- [ ] Sem repaints desnecessários
- [ ] GPU-accelerated
```

## 🐛 Testes de Regressão

### Funcionalidades Existentes

```
✅ Verificar que não quebrou:
- [ ] Navegação do header
- [ ] Menu mobile
- [ ] Botões de CTA
- [ ] Theme toggle
- [ ] Links do footer
- [ ] Scroll behavior
```

## 📊 Checklist Final

### Visual
- [ ] Logo aparece em todas as páginas
- [ ] Cores corretas (light/dark)
- [ ] Proporções mantidas
- [ ] Hover effect funciona
- [ ] Responsivo em todos os breakpoints

### Funcional
- [ ] Clique na logo leva à home
- [ ] Navegação não quebrada
- [ ] Menu mobile funciona
- [ ] Theme toggle funciona
- [ ] Scroll behavior correto

### Performance
- [ ] Sem HTTP requests extras
- [ ] Carregamento instantâneo
- [ ] Animações suaves (60fps)
- [ ] Sem layout shifts

### Acessibilidade
- [ ] Contraste WCAG AAA
- [ ] Leitor de tela funciona
- [ ] Navegação por teclado
- [ ] Foco visível

### Compatibilidade
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Chrome (Android)

## 🔧 Troubleshooting

### Problema: Logo não aparece

```bash
# Verificar se o componente está importado
grep -r "LogoHeader" src/components/layout/Header.tsx

# Verificar se não há erros de compilação
npm run build
```

### Problema: Cores erradas

```bash
# Verificar tema
# Abrir DevTools > Elements
# Inspecionar elemento da logo
# Verificar classes CSS aplicadas
```

### Problema: Hover não funciona

```bash
# Verificar CSS
# Inspecionar elemento
# Verificar transition e transform
```

### Problema: Responsividade quebrada

```bash
# Verificar breakpoints
# DevTools > Toggle device toolbar
# Testar em diferentes tamanhos
```

## 📝 Relatório de Teste

### Template

```markdown
## Teste da Logo SVlentes

**Data**: [DATA]
**Testador**: [NOME]
**Navegador**: [CHROME/FIREFOX/SAFARI]
**Dispositivo**: [DESKTOP/MOBILE/TABLET]

### Resultados

#### Visual
- Logo Header: ✅/❌
- Logo Footer: ✅/❌
- Dark Mode: ✅/❌
- Responsivo: ✅/❌

#### Funcional
- Navegação: ✅/❌
- Hover: ✅/❌
- Scroll: ✅/❌

#### Performance
- Lighthouse: [SCORE]
- Carregamento: ✅/❌

#### Acessibilidade
- Contraste: ✅/❌
- Leitor de Tela: ✅/❌
- Teclado: ✅/❌

### Problemas Encontrados
[DESCREVER PROBLEMAS]

### Observações
[OBSERVAÇÕES ADICIONAIS]
```

## ✅ Aprovação Final

```
Todos os testes passaram? ✅

A logo está pronta para produção! 🚀
```

---

**Guia de Teste**: v1.0  
**Última Atualização**: Janeiro 2025  
**Status**: Pronto para uso
