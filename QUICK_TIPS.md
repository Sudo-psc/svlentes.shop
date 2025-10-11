# ⚡ Dicas Rápidas - SVlentes

Referência ultra-rápida para tarefas comuns.

## 🎨 Cores

```tsx
// Primary (Azul Médico)
className="bg-primary text-primary-foreground"

// Secondary (Verde Saúde)
className="bg-secondary text-secondary-foreground"

// Accent (Laranja Energia)
className="bg-accent text-accent-foreground"

// Adaptativo (muda com tema)
className="bg-background text-foreground"
className="bg-card text-card-foreground"
```

## 🔘 Botões

```tsx
import { Button } from '@/components/ui/Button'

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="whatsapp">WhatsApp</Button>

// Tamanhos
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Full width
<Button fullWidth>Full Width</Button>
```

## 🌓 Dark Mode

```tsx
// Toggle
import { ThemeToggle } from '@/components/theme/ThemeToggle'
<ThemeToggle />

// Hook
import { useTheme } from '@/components/theme/ThemeProvider'
const { theme, setTheme, resolvedTheme } = useTheme()

// Classes adaptativas
className="bg-white dark:bg-gray-900"
className="text-gray-900 dark:text-gray-100"
```

## 📦 Cards

```tsx
// Card padrão
<div className="card">Conteúdo</div>

// Card interativo
<div className="card-interactive">Clicável</div>
```

## 📝 Inputs

```tsx
<input className="input-field" placeholder="Nome" />
<textarea className="input-field" rows={4} />
```

## 🎯 Layout

```tsx
// Container
<div className="container-custom">Conteúdo</div>

// Section
<section className="section-padding">
  <div className="container-custom">
    <h2 className="section-title">Título</h2>
    <p className="section-subtitle">Subtítulo</p>
  </div>
</section>
```

## 🎨 Gradientes

```tsx
// Background
className="bg-gradient-to-r from-primary to-primary-700"
className="bg-gradient-to-br from-primary/5 to-secondary/5"

// Texto
className="text-gradient"
```

## ✨ Animações

```tsx
className="animate-fade-in"
className="animate-slide-up"
className="animate-float"
className="animate-pulse"
className="animate-glow-pulse"
```

## 📱 Responsividade

```tsx
// Mobile first
className="p-4 md:p-6 lg:p-8"

// Ocultar/mostrar
className="hidden lg:block"  // Desktop only
className="lg:hidden"        // Mobile only

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

## 🔗 Navegação

```tsx
import Link from 'next/link'

<Link href="/assinatura">Assinar</Link>

// Client Component
'use client'
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/assinatura')
```

## 📄 Nova Página

```bash
# 1. Criar diretório
mkdir src/app/minha-pagina

# 2. Criar page.tsx
```

```tsx
// src/app/minha-pagina/page.tsx
export const metadata = {
  title: 'Minha Página - SVlentes',
  description: 'Descrição'
}

export default function MinhaPagina() {
  return (
    <div className="container-custom section-padding">
      <h1 className="section-title">Título</h1>
    </div>
  )
}
```

## 🔌 API Route

```tsx
// src/app/api/minha-rota/route.ts
export async function GET(request: Request) {
  return Response.json({ message: 'Hello' })
}

export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ received: body })
}
```

## 🎯 Client Component

```tsx
'use client'
import { useState } from 'react'

export default function MyComponent() {
  const [state, setState] = useState()
  return <div>Client Component</div>
}
```

## 🖥️ Server Component

```tsx
// Padrão - sem 'use client'
export default function MyComponent() {
  return <div>Server Component</div>
}

// Com data fetching
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function MyComponent() {
  const data = await getData()
  return <div>{data.title}</div>
}
```

## 🎨 Classes CSS Úteis

```css
/* Botões */
.btn-primary
.btn-secondary
.btn-accent
.btn-outline
.btn-ghost

/* Cards */
.card
.card-interactive

/* Inputs */
.input-field

/* Layout */
.container-custom
.section-padding
.section-title
.section-subtitle

/* Touch */
.touch-target
.touch-button
```

## 🔍 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm run start

# Lint
npm run lint

# Testes
npm run test
```

## 📚 Documentação Rápida

- **Tudo**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
- **Design**: [DESIGN_SYSTEM_QUICK_GUIDE.md](./DESIGN_SYSTEM_QUICK_GUIDE.md)
- **App Router**: [APP_ROUTER_GUIDE.md](./APP_ROUTER_GUIDE.md)
- **Exemplos**: [DESIGN_SYSTEM_EXAMPLES.md](./DESIGN_SYSTEM_EXAMPLES.md)

## 🚀 URLs Úteis

- Demo: `http://localhost:3000/design-system`
- Home: `http://localhost:3000`
- Assinatura: `http://localhost:3000/assinatura`

## 💡 Lembre-se

1. ✅ Sempre testar em dark mode
2. ✅ Usar classes do sistema (não hardcode)
3. ✅ Manter contraste mínimo 7:1
4. ✅ Touch targets 44px+
5. ✅ Mobile-first

---

**Mais detalhes**: Ver [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
