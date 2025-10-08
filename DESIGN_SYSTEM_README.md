# 🎨 Sistema de Design SVlentes

> Sistema de design completo com dark mode, paleta profissional e componentes reutilizáveis

**Arquitetura**: Next.js 14 App Router ✅

## 🚀 Quick Start

### 1. Ver o Sistema
```bash
npm run dev
# Acesse: http://localhost:3000/design-system
```

**Nota**: O projeto já usa App Router. Todas as páginas estão em `src/app/`.

### 2. Usar Componentes
```tsx
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

<Button variant="primary">Assinar Agora</Button>
<ThemeToggle />
```

### 3. Usar Classes CSS
```tsx
<div className="card">
  <h3 className="text-foreground">Título</h3>
  <p className="text-muted-foreground">Descrição</p>
  <button className="btn-primary">Ação</button>
</div>
```

## 🎨 Paleta de Cores

### Light Mode
| Cor | Hex | Uso |
|-----|-----|-----|
| Primary | `#0066CC` | Ações principais, links |
| Secondary | `#10B981` | Sucesso, saúde |
| Accent | `#F97316` | CTAs, urgência |
| Background | `#FFFFFF` | Fundo principal |
| Foreground | `#111827` | Texto principal |

### Dark Mode
| Cor | Hex | Uso |
|-----|-----|-----|
| Primary | `#3B82F6` | Ações principais, links |
| Secondary | `#34D399` | Sucesso, saúde |
| Accent | `#FB923C` | CTAs, urgência |
| Background | `#0F172A` | Fundo principal |
| Foreground | `#F1F5F9` | Texto principal |

## 📦 Componentes

### Button
```tsx
<Button 
  variant="primary"    // primary | secondary | accent | outline | ghost
  size="md"           // sm | md | lg
  fullWidth={false}   // boolean
>
  Texto
</Button>
```

### ThemeToggle
```tsx
<ThemeToggle />
```

### useTheme Hook
```tsx
const { theme, setTheme, resolvedTheme } = useTheme()
```

## 📐 Classes Utilitárias

### Botões
- `.btn-primary` - Azul médico
- `.btn-secondary` - Verde saúde
- `.btn-accent` - Laranja energia
- `.btn-outline` - Borda primary
- `.btn-ghost` - Transparente
- `.btn-whatsapp` - Verde WhatsApp

### Cards
- `.card` - Card padrão
- `.card-interactive` - Card com hover

### Inputs
- `.input-field` - Input touch-friendly (48px)

### Animações
- `.animate-fade-in` - Fade in suave
- `.animate-slide-up` - Slide de baixo para cima
- `.animate-float` - Flutuação suave
- `.animate-glow-pulse` - Brilho pulsante

## 🌓 Dark Mode

### Automático
O dark mode já está configurado! Use as classes do sistema:

```tsx
<div className="bg-background text-foreground">
  Conteúdo adaptativo
</div>
```

### Manual
```tsx
import { useTheme } from '@/components/theme/ThemeProvider'

const { setTheme } = useTheme()
setTheme('dark') // 'light' | 'dark' | 'system'
```

## 📱 Responsividade

### Breakpoints
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Large: 1280px+

### Touch Targets
- Botões: 44px mínimo
- Inputs: 48px mínimo

## ✅ Acessibilidade

- ✅ Contraste WCAG AAA (7:1)
- ✅ Touch targets adequados
- ✅ Focus states visíveis
- ✅ ARIA labels
- ✅ Navegação por teclado

## 📚 Documentação

### Guias
- 📖 [Implementação Completa](./DESIGN_SYSTEM_IMPLEMENTATION.md)
- ⚡ [Guia Rápido](./DESIGN_SYSTEM_QUICK_GUIDE.md)
- 💡 [Exemplos de Código](./DESIGN_SYSTEM_EXAMPLES.md)
- 🧪 [Guia de Testes](./TEST_DESIGN_SYSTEM.md)
- 📊 [Resumo de Melhorias](./DESIGN_IMPROVEMENTS_SUMMARY.md)

### Steering
- 🎯 [Sistema de Design](./.kiro/steering/design-system.md)

## 🎯 Exemplos Rápidos

### Hero Section
```tsx
<section className="bg-gradient-to-br from-primary/5 to-secondary/5">
  <div className="container-custom section-padding">
    <h1 className="section-title">Título</h1>
    <p className="section-subtitle">Subtítulo</p>
    <Button variant="primary" size="lg">CTA</Button>
  </div>
</section>
```

### Card de Plano
```tsx
<div className="card-interactive">
  <h3 className="text-2xl font-bold text-foreground">Plano</h3>
  <div className="text-4xl font-bold text-primary">R$ 99</div>
  <Button variant="primary" fullWidth>Assinar</Button>
</div>
```

### Formulário
```tsx
<form className="space-y-4">
  <input className="input-field" placeholder="Nome" />
  <Button variant="primary" fullWidth type="submit">
    Enviar
  </Button>
</form>
```

## 🔧 Arquivos Principais

### Componentes
- `src/components/theme/ThemeProvider.tsx`
- `src/components/theme/ThemeToggle.tsx`
- `src/components/ui/Button.tsx`

### Configuração
- `tailwind.config.js` - Paleta de cores
- `src/app/globals.css` - CSS variables e classes
- `src/app/layout.tsx` - ThemeProvider

### Demo
- `src/app/design-system/page.tsx` - Página de demonstração

## 🎉 Benefícios

### Para Desenvolvedores
- ✅ Componentes reutilizáveis
- ✅ TypeScript type-safe
- ✅ Documentação completa
- ✅ Fácil manutenção

### Para Usuários
- ✅ Dark mode confortável
- ✅ Design consistente
- ✅ Acessível
- ✅ Responsivo

### Para o Negócio
- ✅ Profissional
- ✅ Moderno
- ✅ Confiável
- ✅ Conversão otimizada

## 🚀 Próximos Passos

1. ✅ Explorar a página de demo: `/design-system`
2. ✅ Ler o guia rápido
3. ✅ Copiar exemplos de código
4. ✅ Aplicar em suas páginas
5. ✅ Testar em dark mode

## 💡 Dicas

1. **Sempre use as classes do sistema** ao invés de cores hardcoded
2. **Teste em dark mode** todas as novas features
3. **Mantenha contraste mínimo** WCAG AAA (7:1)
4. **Use touch targets** de 44px mínimo
5. **Prefira componentes prontos** (Button, ThemeToggle)

## 🐛 Suporte

Encontrou um problema? Verifique:
1. Console do navegador
2. Guia de testes
3. Documentação completa

## 📄 Licença

Desenvolvido para SVlentes - Todos os direitos reservados

---

**Desenvolvido com ❤️ usando Next.js, Tailwind CSS e TypeScript**
