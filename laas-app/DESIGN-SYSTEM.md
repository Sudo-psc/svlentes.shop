# LAAS Design System

Sistema de design completo para a aplicação LAAS (Lens as a Service) baseado em shadcn/ui e Tailwind CSS.

---

## 🎨 Fundamentos de Design

### Paleta de Cores

#### Cores Primárias (Brand)
```css
/* Azul LAAS - Cor principal da marca */
--laas-blue: #1e3a5f          /* Principal */
--laas-blue-dark: #0b3c6f     /* Hover/Active */
--laas-blue-medium: #2c5282   /* Variante */
--laas-blue-light: #4a90e2    /* Backgrounds */
```

#### Cores Neutras (Grayscale)
```css
--laas-gray-50: #f9fafb   /* Backgrounds muito claros */
--laas-gray-100: #f3f4f6  /* Backgrounds claros */
--laas-gray-200: #e5e7eb  /* Borders */
--laas-gray-300: #d1d5db  /* Borders/Inputs */
--laas-gray-400: #9ca3af  /* Placeholders */
--laas-gray-500: #6b7280  /* Texto secundário */
--laas-gray-600: #4b5563  /* Texto */
--laas-gray-700: #374151  /* Texto principal */
--laas-gray-800: #1f2937  /* Títulos */
--laas-gray-900: #111827  /* Texto escuro */
```

#### Cores de Feedback
```css
--laas-success: #10b981   /* Sucesso/Aprovação */
--laas-warning: #f59e0b   /* Aviso */
--laas-error: #ef4444     /* Erro */
--laas-whatsapp: #25d366  /* WhatsApp oficial */
```

### Tipografia

#### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

#### Escala Tipográfica

**Display (Títulos grandes)**
```css
display-2xl: 72px / 1.1 / -0.02em / 700  /* Hero principal */
display-xl:  60px / 1.1 / -0.02em / 700  /* Hero */
display-lg:  48px / 1.2 / -0.02em / 700  /* Seções principais */
display-md:  36px / 1.2 / -0.01em / 700  /* Títulos seção */
display-sm:  30px / 1.3 / -0.01em / 600  /* Subtítulos */
display-xs:  24px / 1.3 / 0 / 600        /* Títulos card */
```

**Body (Textos)**
```css
text-base:   16px / 1.5 / 0 / 400   /* Texto padrão */
text-lg:     18px / 1.5 / 0 / 400   /* Texto destacado */
text-sm:     14px / 1.5 / 0 / 400   /* Texto pequeno */
text-xs:     12px / 1.5 / 0 / 400   /* Labels/badges */
```

### Espaçamento

Sistema baseado em múltiplos de 4px:

```css
spacing-1:  4px    (0.25rem)
spacing-2:  8px    (0.5rem)
spacing-3:  12px   (0.75rem)
spacing-4:  16px   (1rem)
spacing-6:  24px   (1.5rem)
spacing-8:  32px   (2rem)
spacing-12: 48px   (3rem)
spacing-16: 64px   (4rem)
spacing-24: 96px   (6rem)
```

### Border Radius

```css
rounded-sm:  4px   /* Small elements */
rounded-md:  6px   /* Medium elements */
rounded-lg:  8px   /* Buttons, inputs */
rounded-xl:  12px  /* Cards */
rounded-2xl: 16px  /* Large cards */
rounded-full: 9999px /* Pills, avatars */
```

### Sombras

```css
shadow-laas-sm:  0 1px 2px rgba(0,0,0,0.05)
shadow-laas-md:  0 4px 6px rgba(0,0,0,0.1)
shadow-laas-lg:  0 10px 15px rgba(0,0,0,0.1)
shadow-laas-xl:  0 20px 25px rgba(0,0,0,0.1)
```

---

## 🧩 Componentes Base (shadcn/ui)

### Button

**Variantes:**
- `default` - Botão primário azul
- `outline` - Botão com borda
- `secondary` - Botão secundário
- `ghost` - Botão transparente
- `whatsapp` - Botão WhatsApp
- `link` - Botão como link

**Tamanhos:**
- `sm` - 36px altura
- `default` - 44px altura
- `lg` - 48px altura
- `icon` - 40x40px

**Exemplo:**
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="lg">
  Agendar Consulta
</Button>

<Button variant="whatsapp">
  Falar no WhatsApp
</Button>
```

### Card

Componente para containers de conteúdo.

**Subcomponentes:**
- `CardHeader` - Cabeçalho
- `CardTitle` - Título
- `CardDescription` - Descrição
- `CardContent` - Conteúdo principal
- `CardFooter` - Rodapé

**Exemplo:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Plano Mensal</CardTitle>
    <CardDescription>Para uso regular</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo do card
  </CardContent>
</Card>
```

### Input

Input de formulário estilizado.

**Exemplo:**
```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="email">E-mail</Label>
  <Input
    id="email"
    type="email"
    placeholder="seu@email.com"
  />
</div>
```

### Checkbox

Checkbox com estilo LAAS.

**Exemplo:**
```tsx
import { Checkbox } from "@/components/ui/checkbox"

<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <label htmlFor="terms">Aceito os termos</label>
</div>
```

### Accordion

Componente expansível para FAQ.

**Exemplo:**
```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Como funciona a assinatura?</AccordionTrigger>
    <AccordionContent>
      Você recebe suas lentes automaticamente...
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Badge

Badges para labels e indicadores.

**Variantes:**
- `default` - Azul padrão
- `secondary` - Cinza
- `success` - Verde
- `warning` - Amarelo
- `destructive` - Vermelho
- `pioneer` - Badge "Pioneiro no Brasil"

**Exemplo:**
```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="pioneer">PIONEIRO NO BRASIL</Badge>
<Badge variant="success">Ativo</Badge>
```

---

## 🎯 Componentes Customizados LAAS

### TrustBadge

Badge de confiança com ícone de verificação.

**Props:**
- `text: string` - Texto do badge
- `icon?: ReactNode` - Ícone customizado (padrão: Check)
- `className?: string`

**Exemplo:**
```tsx
import { TrustBadge, TrustBadgeGrid } from "@/components/laas/trust-badge"
import { Shield } from "lucide-react"

<TrustBadge text="Remessa grátis" />

<TrustBadgeGrid
  badges={[
    { text: "Remessa grátis" },
    { text: "Aprovado ANVISA", icon: <Shield /> },
    { text: "Preço transparente" },
    { text: "CRM 69.870" },
  ]}
/>
```

### PricingCard

Card de plano de preços.

**Props:**
- `title: string` - Nome do plano
- `price: number | string` - Preço
- `period?: string` - Período (padrão: "mês")
- `description?: string` - Descrição do plano
- `features: Array<{text: string, included: boolean}>` - Lista de features
- `highlighted?: boolean` - Se é o plano em destaque
- `badge?: string` - Badge superior (ex: "MAIS POPULAR")
- `ctaText?: string` - Texto do botão
- `onSelectPlan?: () => void` - Callback ao selecionar

**Exemplo:**
```tsx
import { PricingCard } from "@/components/laas/pricing-card"

<PricingCard
  title="Plano Anual"
  price="24.90"
  period="mês"
  description="Economia de 30% no plano anual"
  badge="MAIS POPULAR"
  highlighted={true}
  features={[
    { text: "12 pares de lentes/ano", included: true },
    { text: "2 consultas incluídas", included: true },
    { text: "Frete grátis", included: true },
    { text: "Telemedicina 24h", included: false },
  ]}
  onSelectPlan={() => console.log("Plano selecionado")}
/>
```

### LeadForm

Formulário de captura de leads com upload de prescrição.

**Props:**
- `onSubmit?: (data: FormData) => void | Promise<void>`
- `className?: string`

**Campos:**
- Upload de imagem/PDF (prescrição)
- Nome completo
- WhatsApp
- E-mail
- Checkbox LGPD (obrigatório)

**Exemplo:**
```tsx
import { LeadForm } from "@/components/laas/lead-form"

<LeadForm
  onSubmit={async (formData) => {
    // Processar dados
    console.log(formData)
  }}
/>
```

---

## 📐 Layouts e Containers

### Container Principal

```tsx
<div className="laas-container">
  {/* Conteúdo com padding responsivo */}
</div>
```

### Seção

```tsx
<section className="laas-section">
  {/* Seção com padding vertical responsivo */}
</section>
```

### Card Padrão

```tsx
<div className="laas-card">
  {/* Card com estilo LAAS */}
</div>
```

---

## 🎭 Padrões de Uso

### Hero Section

```tsx
<section className="laas-section gradient-light">
  <div className="laas-container">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Conteúdo esquerdo */}
      <div className="space-y-6">
        <Badge variant="pioneer">PIONEIRO NO BRASIL</Badge>

        <h1 className="hero-title">
          Nunca mais fique sem lentes
        </h1>

        <p className="hero-subtitle">
          Assinatura integrada com logística e consulta,
          envio semestral otimizado
        </p>

        <div className="flex flex-wrap gap-4">
          <Button size="lg">Agendar Consulta</Button>
          <Button variant="whatsapp" size="lg">
            Falar no WhatsApp
          </Button>
        </div>

        <TrustBadgeGrid badges={[...]} />
      </div>

      {/* Formulário direito */}
      <div>
        <LeadForm onSubmit={handleSubmit} />
      </div>
    </div>
  </div>
</section>
```

### FAQ Section

```tsx
<section className="laas-section">
  <div className="laas-container max-w-3xl">
    <h2 className="text-display-md text-center mb-12">
      Perguntas Frequentes
    </h2>

    <Accordion type="single" collapsible className="space-y-4">
      <AccordionItem value="q1">
        <AccordionTrigger>
          Como funciona a assinatura?
        </AccordionTrigger>
        <AccordionContent>
          Resposta detalhada...
        </AccordionContent>
      </AccordionItem>
      {/* Mais perguntas... */}
    </Accordion>
  </div>
</section>
```

### Pricing Section

```tsx
<section className="laas-section bg-laas-gray-50">
  <div className="laas-container">
    <h2 className="text-display-md text-center mb-12">
      Escolha seu Plano
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PricingCard {...planMensal} />
      <PricingCard {...planAnual} highlighted />
      <PricingCard {...planSemestral} />
    </div>
  </div>
</section>
```

---

## 🎨 Utilitários CSS Customizados

### Gradientes

```css
/* Gradiente primário */
.gradient-primary {
  @apply bg-gradient-to-br from-laas-blue to-laas-blue-dark;
}

/* Gradiente claro */
.gradient-light {
  @apply bg-gradient-to-br from-laas-gray-50 to-white;
}

/* Texto com gradiente */
.text-gradient-primary {
  @apply bg-gradient-to-r from-laas-blue to-laas-blue-medium bg-clip-text text-transparent;
}
```

### Animações

```css
/* Fade in */
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Slide up */
.animate-slide-up {
  animation: slide-up 0.4s ease-out;
}
```

### Focus Ring

```css
/* Focus acessível */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-laas-blue focus:ring-offset-2;
}
```

---

## 📱 Responsividade

### Breakpoints

```css
sm:  640px   /* Tablets pequenos */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Desktops grandes */
```

### Padrões Mobile-First

```tsx
{/* Mobile: 1 coluna, Tablet: 2 colunas, Desktop: 3 colunas */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  ...
</div>

{/* Texto responsivo */}
<h1 className="text-4xl md:text-5xl lg:text-6xl">
  Título
</h1>

{/* Padding responsivo */}
<section className="py-12 md:py-16 lg:py-24">
  ...
</section>
```

---

## ♿ Acessibilidade

### Checklist

- ✅ Contraste mínimo 4.5:1 para texto
- ✅ Focus visible em todos os elementos interativos
- ✅ Labels descritivos em formulários
- ✅ ARIA labels onde necessário
- ✅ Navegação por teclado completa
- ✅ Suporte a screen readers

### Exemplo de Formulário Acessível

```tsx
<div className="space-y-2">
  <Label htmlFor="email">
    E-mail <span className="text-laas-error">*</span>
  </Label>
  <Input
    id="email"
    type="email"
    aria-required="true"
    aria-describedby="email-error"
  />
  <span id="email-error" className="text-sm text-laas-error" role="alert">
    {error}
  </span>
</div>
```

---

## 📦 Estrutura de Arquivos

```
src/
├── components/
│   ├── ui/                    # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── checkbox.tsx
│   │   ├── accordion.tsx
│   │   └── badge.tsx
│   └── laas/                  # LAAS custom components
│       ├── trust-badge.tsx
│       ├── pricing-card.tsx
│       └── lead-form.tsx
├── lib/
│   └── utils.ts              # Utility functions (cn)
├── app/
│   └── globals.css           # Global styles
└── tailwind.config.ts        # Tailwind configuration
```

---

## 🚀 Como Usar

### 1. Instalação

```bash
npm install
```

### 2. Importar Componentes

```tsx
// Componentes base
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Componentes LAAS
import { TrustBadge } from "@/components/laas/trust-badge"
import { PricingCard } from "@/components/laas/pricing-card"
import { LeadForm } from "@/components/laas/lead-form"
```

### 3. Usar Estilos Customizados

```tsx
<div className="laas-container laas-section">
  <h1 className="hero-title">Título</h1>
  <Button className="btn-primary">Ação</Button>
</div>
```

---

## 📝 Guia de Estilo

### Nomenclatura de Classes

- Use kebab-case para classes CSS
- Prefixo `laas-` para componentes customizados
- Nomes descritivos e semânticos

### Ordem de Classes Tailwind

1. Layout (flex, grid, position)
2. Dimensões (w-, h-, max-w-)
3. Espaçamento (p-, m-, gap-)
4. Tipografia (text-, font-)
5. Cores (bg-, text-, border-)
6. Efeitos (shadow-, opacity-)
7. Estados (hover:, focus:, active:)
8. Responsividade (md:, lg:)

### Exemplo

```tsx
<Button className="
  flex items-center gap-2
  w-full md:w-auto
  px-6 py-3
  text-base font-semibold
  bg-laas-blue text-white
  shadow-laas-md
  hover:bg-laas-blue-dark hover:shadow-laas-lg
  md:px-8
">
  Texto
</Button>
```

---

## 🎯 Próximos Passos

- [ ] Adicionar variantes dark mode
- [ ] Criar mais componentes de formulário (Select, Radio, Textarea)
- [ ] Implementar componentes de feedback (Toast, Alert)
- [ ] Adicionar componentes de navegação (Navbar, Footer)
- [ ] Criar biblioteca de ícones customizados
- [ ] Documentar animações e transições
- [ ] Criar Storybook para documentação visual

---

**Versão**: 1.0.0
**Data**: Outubro 2025
**Projeto**: LAAS - Lens as a Service
