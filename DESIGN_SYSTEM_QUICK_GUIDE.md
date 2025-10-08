# Guia Rápido - Sistema de Design

## 🎨 Paleta de Cores

### Uso Recomendado

```tsx
// Primary - Ações principais, links importantes
<Button variant="primary">Assinar Agora</Button>
className="bg-primary text-primary-foreground"

// Secondary - Ações secundárias, sucesso
<Button variant="secondary">Confirmar</Button>
className="bg-secondary text-secondary-foreground"

// Accent - CTAs de destaque, urgência
<Button variant="accent">Oferta Limitada</Button>
className="bg-accent text-accent-foreground"

// Outline - Ações alternativas
<Button variant="outline">Saiba Mais</Button>

// Ghost - Ações sutis
<Button variant="ghost">Cancelar</Button>

// WhatsApp - Contato direto
<Button variant="whatsapp">Falar no WhatsApp</Button>
```

## 🌓 Dark Mode

### Implementação Automática
O dark mode já está configurado! Todas as cores se adaptam automaticamente.

### Classes Adaptativas
```tsx
// Cores que mudam automaticamente
className="bg-background text-foreground"
className="bg-card text-card-foreground"
className="border-border"

// Cores específicas com dark mode
className="bg-white dark:bg-gray-900"
className="text-gray-900 dark:text-gray-100"
```

### Toggle Manual
```tsx
import { ThemeToggle } from '@/components/theme/ThemeToggle'

<ThemeToggle />
```

## 📐 Tamanhos e Espaçamento

### Botões
```tsx
<Button size="sm">Pequeno (40px)</Button>
<Button size="md">Médio (44px)</Button>
<Button size="lg">Grande (52px)</Button>
<Button fullWidth>Largura Total</Button>
```

### Inputs
```tsx
// Altura mínima 48px (touch-friendly)
<input className="input-field" />
```

### Cards
```tsx
// Card padrão
<div className="card">Conteúdo</div>

// Card interativo
<div className="card-interactive">Clicável</div>
```

## 🎯 Componentes Prontos

### Button
```tsx
import { Button } from '@/components/ui/Button'

<Button 
  variant="primary"    // primary | secondary | accent | outline | ghost
  size="md"           // sm | md | lg
  fullWidth={false}   // boolean
  disabled={false}    // boolean
>
  Texto do Botão
</Button>
```

### ThemeToggle
```tsx
import { ThemeToggle } from '@/components/theme/ThemeToggle'

<ThemeToggle className="custom-class" />
```

### useTheme Hook
```tsx
import { useTheme } from '@/components/theme/ThemeProvider'

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  
  // theme: 'light' | 'dark' | 'system'
  // resolvedTheme: 'light' | 'dark' (tema atual)
  
  return (
    <button onClick={() => setTheme('dark')}>
      Modo Escuro
    </button>
  )
}
```

## 🎨 Classes Utilitárias

### Botões (CSS)
```css
.btn-primary    /* Azul médico */
.btn-secondary  /* Verde saúde */
.btn-accent     /* Laranja energia */
.btn-outline    /* Borda primary */
.btn-ghost      /* Transparente */
.btn-whatsapp   /* Verde WhatsApp */
.btn-success    /* Verde sucesso */
.btn-warning    /* Amarelo aviso */
```

### Cards
```css
.card              /* Card padrão */
.card-interactive  /* Card com hover */
```

### Inputs
```css
.input-field       /* Input padrão (48px) */
```

### Touch Targets
```css
.touch-target      /* Mínimo 44x44px */
.touch-button      /* Botão touch-friendly */
```

## 🌈 Gradientes

```tsx
// Gradiente de texto
<h1 className="text-gradient">Título</h1>

// Background gradiente
<div className="bg-gradient-to-r from-primary to-primary-700">
  Conteúdo
</div>

// Gradiente animado
<div className="bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
  Animado
</div>
```

## ✨ Animações

```tsx
// Fade in
<div className="animate-fade-in">Conteúdo</div>

// Slide up
<div className="animate-slide-up">Conteúdo</div>

// Float
<div className="animate-float">Flutuante</div>

// Pulse
<div className="animate-pulse">Pulsante</div>

// Glow
<div className="animate-glow-pulse">Brilho</div>
```

## 📱 Responsividade

```tsx
// Mobile first
<div className="p-4 md:p-6 lg:p-8">
  Padding responsivo
</div>

// Ocultar/mostrar
<div className="hidden lg:block">Desktop only</div>
<div className="lg:hidden">Mobile only</div>

// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  Cards
</div>
```

## 🎯 Exemplos Práticos

### Hero Section
```tsx
<section className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
  <div className="container-custom section-padding">
    <h1 className="section-title">
      Título Principal
    </h1>
    <p className="section-subtitle">
      Subtítulo descritivo
    </p>
    <div className="flex gap-4">
      <Button variant="primary" size="lg">
        CTA Principal
      </Button>
      <Button variant="outline" size="lg">
        CTA Secundário
      </Button>
    </div>
  </div>
</section>
```

### Card de Plano
```tsx
<div className="card-interactive">
  <h3 className="text-2xl font-bold text-foreground mb-2">
    Plano Mensal
  </h3>
  <p className="text-muted-foreground mb-4">
    Descrição do plano
  </p>
  <div className="text-4xl font-bold text-primary mb-6">
    R$ 99,90<span className="text-lg">/mês</span>
  </div>
  <Button variant="primary" fullWidth>
    Assinar Agora
  </Button>
</div>
```

### Formulário
```tsx
<form className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-foreground mb-2">
      Nome
    </label>
    <input 
      type="text"
      className="input-field"
      placeholder="Seu nome completo"
    />
  </div>
  
  <Button variant="primary" fullWidth type="submit">
    Enviar
  </Button>
</form>
```

## 🔍 Dicas

1. **Sempre use as classes do sistema** ao invés de cores hardcoded
2. **Teste em dark mode** todas as novas features
3. **Mantenha contraste mínimo** WCAG AAA (7:1)
4. **Use touch targets** de 44px mínimo em mobile
5. **Prefira componentes prontos** (Button, ThemeToggle)
6. **Animações sutis** melhoram UX sem distrair

## 🚀 Performance

- CSS Variables permitem mudança instantânea de tema
- Animações usam GPU (transform, opacity)
- Classes utilitárias reduzem CSS duplicado
- Dark mode não recarrega a página

## 📚 Referências

- [Tailwind CSS](https://tailwindcss.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/design)
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)
