# 🧪 Teste do Sistema de Design

## Como Testar

### 1. Iniciar o Servidor
```bash
npm run dev
```

### 2. Acessar a Página de Demo
Abra no navegador: `http://localhost:3000/design-system`

### 3. Checklist de Testes

#### ✅ Dark Mode
- [ ] Clicar no toggle de tema no header
- [ ] Verificar se todas as cores mudam suavemente
- [ ] Verificar se o ícone anima (sol ↔ lua)
- [ ] Recarregar a página e verificar se mantém a preferência
- [ ] Testar em diferentes páginas

#### ✅ Botões
- [ ] Hover em cada variante (primary, secondary, accent, etc.)
- [ ] Verificar animação de scale (1.02)
- [ ] Testar botões disabled
- [ ] Verificar altura mínima (44px)
- [ ] Testar em mobile (touch-friendly)

#### ✅ Cores
- [ ] Verificar contraste de texto em light mode
- [ ] Verificar contraste de texto em dark mode
- [ ] Testar todas as escalas (50-950)
- [ ] Verificar se cores são consistentes

#### ✅ Cards
- [ ] Hover no card interativo
- [ ] Verificar animação de scale
- [ ] Verificar sombras
- [ ] Testar em dark mode

#### ✅ Inputs
- [ ] Focus em cada input
- [ ] Verificar ring de focus
- [ ] Verificar altura (48px)
- [ ] Testar placeholder
- [ ] Testar em dark mode

#### ✅ Responsividade
- [ ] Testar em mobile (320px)
- [ ] Testar em tablet (768px)
- [ ] Testar em desktop (1024px)
- [ ] Verificar menu mobile
- [ ] Verificar botões full-width em mobile

#### ✅ Acessibilidade
- [ ] Navegar com Tab
- [ ] Verificar focus states
- [ ] Testar com leitor de tela
- [ ] Verificar ARIA labels
- [ ] Testar contraste (usar ferramenta)

#### ✅ Performance
- [ ] Mudança de tema é instantânea?
- [ ] Animações são suaves (60fps)?
- [ ] Não há flash de conteúdo?
- [ ] Carregamento é rápido?

## 🔍 Ferramentas de Teste

### Contraste
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)

### Acessibilidade
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- Lighthouse (Chrome DevTools)

### Responsividade
- Chrome DevTools (Device Toolbar)
- Firefox Responsive Design Mode
- Safari Web Inspector

### Performance
- Chrome DevTools (Performance tab)
- Lighthouse (Performance audit)

## 🐛 Problemas Comuns

### Dark Mode não funciona
```bash
# Limpar cache do navegador
# Verificar localStorage
localStorage.getItem('theme')

# Forçar tema
localStorage.setItem('theme', 'dark')
```

### Cores não aparecem
```bash
# Rebuild do Tailwind
npm run dev

# Verificar se as classes estão no tailwind.config.js
```

### Botões não animam
```bash
# Verificar se tailwindcss-animate está instalado
npm list tailwindcss-animate

# Reinstalar se necessário
npm install tailwindcss-animate
```

## ✅ Resultado Esperado

### Light Mode
- Background branco (#FFFFFF)
- Texto escuro (#111827)
- Botão primary azul (#0066CC)
- Botão secondary verde (#10B981)
- Botão accent laranja (#F97316)

### Dark Mode
- Background azul escuro (#0F172A)
- Texto claro (#F1F5F9)
- Botão primary azul claro (#3B82F6)
- Botão secondary verde vibrante (#34D399)
- Botão accent laranja suave (#FB923C)

## 📸 Screenshots Recomendados

Tire screenshots para documentação:
1. Página completa em light mode
2. Página completa em dark mode
3. Seção de botões
4. Seção de cores
5. Cards em hover
6. Inputs com focus
7. Menu mobile aberto
8. Toggle de tema em ação

## 🎯 Critérios de Sucesso

- [ ] Todas as cores têm contraste adequado (WCAG AAA)
- [ ] Dark mode funciona perfeitamente
- [ ] Todos os botões são touch-friendly (44px+)
- [ ] Animações são suaves e não causam lag
- [ ] Design é consistente em todas as páginas
- [ ] Responsivo em todos os breakpoints
- [ ] Acessível via teclado
- [ ] Sem erros no console

## 📝 Relatório de Bugs

Se encontrar problemas, documente:

```markdown
### Bug: [Título]
**Descrição**: [O que aconteceu]
**Esperado**: [O que deveria acontecer]
**Passos para reproduzir**:
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

**Ambiente**:
- Navegador: [Chrome/Firefox/Safari]
- Versão: [Versão do navegador]
- OS: [Windows/Mac/Linux]
- Resolução: [1920x1080]

**Screenshot**: [Anexar se possível]
```

## 🚀 Próximos Testes

Após validar o sistema de design:
1. Aplicar em todas as páginas existentes
2. Testar fluxo completo de assinatura
3. Testar formulários
4. Testar modais e popups
5. Testar notificações/toasts
6. Testar loading states

---

**Boa sorte nos testes! 🎉**
