# 💡 Exemplos Práticos - Sistema de Ícones SV Lentes

Coleção de exemplos prontos para copy-paste que cobrem os casos de uso mais comuns.

## 📑 Índice

- [Básico](#básico)
- [Seções Comuns](#seções-comuns)
- [Cards e Listas](#cards-e-listas)
- [CTAs e Botões](#ctas-e-botões)
- [Badges e Destaques](#badges-e-destaques)
- [Animações](#animações)
- [Mobile Responsive](#mobile-responsive)

---

## Básico

### Ícone Simples

```tsx
import { Icon } from '@/components/ui/Icon'

export default function SimpleIcon() {
  return <Icon name="delivery" />
}
```

### Ícone com Tamanho

```tsx
import { Icon } from '@/components/ui/Icon'

export default function SizedIcon() {
  return (
    <div className="flex gap-4">
      <Icon name="delivery" size="sm" />
      <Icon name="delivery" size="md" />
      <Icon name="delivery" size="lg" />
      <Icon name="delivery" size="xl" />
    </div>
  )
}
```

### Ícone Clicável

```tsx
import { Icon } from '@/components/ui/Icon'
import { openWhatsAppWithContext } from '@/lib/whatsapp'

export default function ClickableIcon() {
  return (
    <Icon
      name="customerService"
      size="lg"
      onClick={() => openWhatsAppWithContext('hero')}
      className="hover:scale-110 transition-transform cursor-pointer"
    />
  )
}
```

---

## Seções Comuns

### Hero Section com Ícone de Destaque

```tsx
import { Icon } from '@/components/ui/Icon'

export default function HeroSection() {
  return (
    <section className="hero bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto text-center">
        {/* Ícone de destaque */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Icon
              name="atendimento24x7"
              size="xl"
              priority
              className="animate-pulse-subtle"
            />
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-4">
          Nunca Mais Fique Sem Lentes
        </h1>

        <p className="text-xl mb-8">
          Assinatura com acompanhamento médico especializado
        </p>

        <button className="btn-primary">
          Começar Agora
        </button>
      </div>
    </section>
  )
}
```

### Seção de Benefícios

```tsx
import { Icon } from '@/components/ui/Icon'

const benefits = [
  {
    icon: 'shieldSecurity',
    title: '100% Seguro',
    description: 'Dados protegidos com criptografia'
  },
  {
    icon: 'delivery',
    title: 'Entrega Grátis',
    description: 'Para todo o Brasil'
  },
  {
    icon: 'piggyBank',
    title: 'Economia',
    description: 'Até 40% de desconto'
  },
  {
    icon: 'eyeCheckAward',
    title: 'Qualidade',
    description: 'Exames certificados'
  }
]

export default function BenefitsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Por que escolher SV Lentes?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.icon}
              className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Container do ícone */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Icon name={benefit.icon} size="md" />
              </div>

              <h3 className="text-xl font-semibold mb-2">
                {benefit.title}
              </h3>

              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Seção de Calculadora

```tsx
import { Icon } from '@/components/ui/Icon'
import { EconomyCalculator } from '@/components/forms/EconomyCalculator'

export default function EconomySection() {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        {/* Header com ícone */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Icon name="calculator" size="lg" priority />
          </div>

          <h2 className="text-4xl font-bold mb-4">
            Calcule Sua Economia
          </h2>

          <p className="text-xl text-gray-600">
            Descubra quanto você pode economizar
          </p>
        </div>

        {/* Stats com ícones */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Icon name="piggyBank" size="md" className="mx-auto mb-4" />
            <div className="text-2xl font-bold">R$ 800</div>
            <div className="text-sm text-gray-600">Economia média anual</div>
          </div>

          {/* Outros stats... */}
        </div>

        {/* Calculadora */}
        <EconomyCalculator />
      </div>
    </section>
  )
}
```

---

## Cards e Listas

### Lista de Features com Ícones

```tsx
import { Icon } from '@/components/ui/Icon'

const features = [
  { icon: 'delivery', text: 'Entrega automática todo mês' },
  { icon: 'eyeCalendar', text: 'Consultas agendadas' },
  { icon: 'customerService', text: 'Suporte via WhatsApp 24/7' },
  { icon: 'shieldSecurity', text: 'Garantia de satisfação' }
]

export default function FeaturesList() {
  return (
    <ul className="space-y-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name={feature.icon} size="sm" />
          </div>
          <span className="text-gray-700">{feature.text}</span>
        </li>
      ))}
    </ul>
  )
}
```

### Card de Plano com Ícone

```tsx
import { Icon } from '@/components/ui/Icon'

export default function PlanCard({ plan }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Header do plano */}
      <div className="flex items-center gap-3 mb-6">
        <Icon name="premiumQuality" size="lg" />
        <div>
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <p className="text-gray-600">{plan.subtitle}</p>
        </div>
      </div>

      {/* Preço */}
      <div className="mb-6">
        <span className="text-4xl font-bold">R$ {plan.price}</span>
        <span className="text-gray-600">/mês</span>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <Icon name="shieldSecurity" size="sm" className="mt-1" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button className="btn-primary w-full">
        Assinar Agora
      </button>
    </div>
  )
}
```

---

## CTAs e Botões

### CTA com Ícone

```tsx
import { Icon } from '@/components/ui/Icon'

export default function IconCTA() {
  return (
    <button className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
      <Icon name="customerService" size="sm" />
      <span>Falar com Especialista</span>
    </button>
  )
}
```

### Floating Action Button

```tsx
import { Icon } from '@/components/ui/Icon'

export default function FloatingWhatsApp() {
  return (
    <button
      className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all flex items-center justify-center z-50"
      onClick={() => openWhatsApp()}
      aria-label="Abrir WhatsApp"
    >
      <Icon name="customerService" size="md" decorative />
    </button>
  )
}
```

---

## Badges e Destaques

### Card com Badge de Popularidade

```tsx
import { Icon, IconBadge } from '@/components/ui/Icon'

export default function PopularPlanCard({ plan }) {
  return (
    <div className="relative bg-white rounded-xl shadow-lg p-8 border-2 border-blue-500">
      {/* Badge de popularidade */}
      <IconBadge
        name="popularBadge"
        position="top-right"
        offset={-12}
      />

      <div className="flex items-center gap-3 mb-4">
        <Icon name="premiumQuality" size="lg" />
        <h3 className="text-2xl font-bold">{plan.name}</h3>
      </div>

      {/* Resto do card... */}
    </div>
  )
}
```

### Badge de Experiência

```tsx
import { Icon } from '@/components/ui/Icon'

export default function ExperienceBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2">
      <Icon name="anniversaryBadge" size="sm" />
      <span className="text-sm font-medium text-yellow-800">
        10 Anos de Experiência
      </span>
    </div>
  )
}
```

---

## Animações

### Ícone com Pulse

```tsx
import { Icon } from '@/components/ui/Icon'

export default function PulsingIcon() {
  return (
    <div className="relative">
      {/* Ícone principal */}
      <Icon
        name="atendimento24x7"
        size="lg"
        className="relative z-10"
      />

      {/* Pulso animado */}
      <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
    </div>
  )
}
```

### Ícone com Hover Scale

```tsx
import { Icon } from '@/components/ui/Icon'

export default function HoverScaleIcon() {
  return (
    <div className="group cursor-pointer">
      <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
        <Icon
          name="delivery"
          size="lg"
          className="group-hover:scale-125 transition-transform duration-300"
        />
      </div>
    </div>
  )
}
```

### Ícone com Rotação no Click

```tsx
import { Icon } from '@/components/ui/Icon'
import { useState } from 'react'

export default function RotatingIcon() {
  const [isRotating, setIsRotating] = useState(false)

  const handleClick = () => {
    setIsRotating(true)
    setTimeout(() => setIsRotating(false), 600)
  }

  return (
    <Icon
      name="calculator"
      size="lg"
      onClick={handleClick}
      className={`cursor-pointer transition-transform duration-600 ${
        isRotating ? 'rotate-360' : ''
      }`}
    />
  )
}
```

---

## Mobile Responsive

### Ícone Responsivo com Tamanho Adaptativo

```tsx
import { Icon } from '@/components/ui/Icon'

export default function ResponsiveIcon() {
  return (
    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-blue-100 rounded-lg flex items-center justify-center">
      <Icon
        name="delivery"
        className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:w-16"
      />
    </div>
  )
}
```

### Grid Responsivo de Ícones

```tsx
import { IconGroup } from '@/components/ui/Icon'

export default function ResponsiveIconGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {['shieldSecurity', 'delivery', 'piggyBank', 'eyeCheckAward'].map((icon) => (
        <div key={icon} className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <Icon name={icon} size="md" />
          </div>
          <p className="text-sm sm:text-base font-medium">Feature</p>
        </div>
      ))}
    </div>
  )
}
```

### Ícone que Some em Mobile

```tsx
import { Icon } from '@/components/ui/Icon'

export default function HideOnMobile() {
  return (
    <div className="flex items-center gap-3">
      <Icon
        name="delivery"
        size="md"
        className="hidden sm:block"
      />
      <span>Entrega Grátis</span>
    </div>
  )
}
```

---

## Casos Avançados

### Grupo de Ícones com Estado

```tsx
import { IconGroup } from '@/components/ui/Icon'
import { useState } from 'react'

export default function IconGroupWithState() {
  const [selectedIcon, setSelectedIcon] = useState(null)

  const icons = ['shieldSecurity', 'delivery', 'piggyBank']

  return (
    <div className="flex gap-4">
      {icons.map((icon) => (
        <div
          key={icon}
          onClick={() => setSelectedIcon(icon)}
          className={`w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
            selectedIcon === icon
              ? 'bg-blue-500 scale-110'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Icon name={icon} size="md" />
        </div>
      ))}
    </div>
  )
}
```

### Ícone com Tooltip

```tsx
import { Icon } from '@/components/ui/Icon'
import { useState } from 'react'

export default function IconWithTooltip() {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Icon name="shieldSecurity" size="md" />

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap">
          Dados protegidos com AES-256
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  )
}
```

### Ícone de Loading

```tsx
import { Icon } from '@/components/ui/Icon'

export default function LoadingIcon() {
  return (
    <div className="flex items-center gap-3">
      <Icon
        name="delivery"
        size="md"
        className="animate-spin opacity-50"
      />
      <span className="text-gray-600">Processando...</span>
    </div>
  )
}
```

---

## 🎯 Dicas de Uso

### Performance

```tsx
// ✅ BOM: Ícone acima da dobra com priority
<Icon name="atendimento24x7" size="xl" priority />

// ✅ BOM: Ícone abaixo da dobra com lazy loading (padrão)
<Icon name="delivery" size="md" />

// ❌ RUIM: Todos os ícones com priority
<Icon name="piggyBank" priority /> {/* Desnecessário se abaixo da dobra */}
```

### Acessibilidade

```tsx
// ✅ BOM: Alt text descritivo
<Icon name="delivery" alt="Entrega grátis para todo o Brasil" />

// ✅ BOM: Ícone decorativo (background)
<Icon name="location" decorative />

// ❌ RUIM: Alt vazio sem decorative
<Icon name="delivery" alt="" />
```

### Consistência

```tsx
// ✅ BOM: Tamanhos predefinidos
<Icon name="delivery" size="lg" />

// ⚠️ CUIDADO: Custom size (apenas quando necessário)
<Icon name="drPhilipe" customSize={{ width: 120, height: 120 }} />

// ❌ RUIM: Custom size arbitrário
<Icon name="delivery" customSize={{ width: 73, height: 59 }} />
```

---

**Última atualização**: 04/10/2025
**Versão**: 1.0.0

Para mais exemplos, consulte:
- [Catálogo Completo](../ICONES.md)
- [Design System](../DESIGN_SYSTEM_ICONS.md)
- [Guia de Início Rápido](README.md)
