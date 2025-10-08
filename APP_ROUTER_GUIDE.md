# 📘 Guia do App Router - SVlentes

**Status**: ✅ App Router já implementado no projeto

## 🏗️ Estrutura Atual

O projeto SVlentes já utiliza **Next.js 14 App Router**. Todas as páginas estão organizadas em `src/app/`.

### Estrutura de Diretórios

```
src/app/
├── page.tsx                          # Landing page principal (/)
├── layout.tsx                        # Layout raiz com ThemeProvider
├── globals.css                       # Estilos globais
├── loading.tsx                       # Loading state global
├── error.tsx                         # Error boundary global
├── not-found.tsx                     # Página 404
│
├── assinatura/
│   └── page.tsx                      # Página de assinatura
│
├── agendar-consulta/
│   ├── page.tsx                      # Agendamento de consulta
│   ├── layout.tsx                    # Layout específico
│   └── metadata.ts                   # Metadata SEO
│
├── design-system/
│   └── page.tsx                      # Demo do sistema de design
│
├── landing-conversao/
│   ├── page.tsx                      # Landing de conversão
│   └── layout.tsx                    # Layout específico
│
├── sdd-framework/
│   └── page.tsx                      # Framework SDD
│
├── calculadora/
│   └── page.tsx                      # Calculadora de economia
│
├── success/
│   ├── page.tsx                      # Página de sucesso
│   └── layout.tsx                    # Layout específico
│
├── cancel/
│   ├── page.tsx                      # Página de cancelamento
│   └── layout.tsx                    # Layout específico
│
├── politica-privacidade/
│   └── page.tsx                      # Política de privacidade
│
├── termos-uso/
│   └── page.tsx                      # Termos de uso
│
└── api/                              # API Routes
    ├── asaas/
    │   └── subscriptions/
    │       └── route.ts              # POST /api/asaas/subscriptions
    ├── lead-capture/
    │   └── route.ts                  # POST /api/lead-capture
    ├── schedule-consultation/
    │   └── route.ts                  # POST /api/schedule-consultation
    ├── health-check/
    │   └── route.ts                  # GET /api/health-check
    ├── webhooks/
    │   └── stripe/
    │       └── route.ts              # POST /api/webhooks/stripe
    └── whatsapp-redirect/
        └── route.ts                  # GET /api/whatsapp-redirect
```

## 🎯 Características do App Router

### 1. Server Components por Padrão
Todos os componentes são Server Components por padrão, exceto quando marcados com `'use client'`.

```tsx
// Server Component (padrão)
export default function Page() {
  return <div>Server Component</div>
}

// Client Component (quando necessário)
'use client'
export default function InteractiveComponent() {
  const [state, setState] = useState()
  return <div>Client Component</div>
}
```

### 2. Layouts Aninhados
Layouts são compartilhados entre rotas e mantêm estado durante navegação.

```tsx
// src/app/layout.tsx (Layout raiz)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

// src/app/assinatura/layout.tsx (Layout específico)
export default function AssinaturaLayout({ children }) {
  return (
    <div className="assinatura-wrapper">
      {children}
    </div>
  )
}
```

### 3. Loading States
Arquivos `loading.tsx` criam suspense boundaries automaticamente.

```tsx
// src/app/loading.tsx
export default function Loading() {
  return <div>Carregando...</div>
}

// src/app/assinatura/loading.tsx
export default function AssinaturaLoading() {
  return <div>Carregando assinatura...</div>
}
```

### 4. Error Boundaries
Arquivos `error.tsx` capturam erros em rotas específicas.

```tsx
// src/app/error.tsx
'use client'
export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Algo deu errado!</h2>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  )
}
```

### 5. Metadata API
Metadata pode ser estática ou dinâmica.

```tsx
// Metadata estática
export const metadata = {
  title: 'SVlentes - Lentes por Assinatura',
  description: 'Receba suas lentes em casa'
}

// Metadata dinâmica
export async function generateMetadata({ params }) {
  return {
    title: `Plano ${params.id}`,
  }
}
```

### 6. API Routes
API Routes usam Web Standard Request/Response.

```tsx
// src/app/api/lead-capture/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  
  // Processar dados
  
  return Response.json({ success: true })
}
```

## 🔄 Padrões de Uso

### Client Components
Use `'use client'` quando precisar de:
- Estado (useState, useReducer)
- Efeitos (useEffect)
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)
- Hooks customizados que usam os acima

**Exemplos no projeto:**
- `src/components/theme/ThemeProvider.tsx` - Gerencia estado de tema
- `src/components/theme/ThemeToggle.tsx` - Usa onClick
- `src/components/layout/Header.tsx` - Usa useState para menu mobile
- `src/components/ui/Button.tsx` - Pode ser Server ou Client

### Server Components
Use Server Components (padrão) para:
- Buscar dados
- Acessar backend diretamente
- Manter código sensível no servidor
- Reduzir bundle JavaScript

**Exemplos no projeto:**
- `src/app/page.tsx` - Landing page principal
- `src/app/design-system/page.tsx` - Página de demo
- Layouts que não precisam de interatividade

## 📝 Como Criar Nova Página

### 1. Página Simples
```bash
# Criar diretório
mkdir src/app/nova-pagina

# Criar page.tsx
touch src/app/nova-pagina/page.tsx
```

```tsx
// src/app/nova-pagina/page.tsx
export const metadata = {
  title: 'Nova Página - SVlentes',
  description: 'Descrição da página'
}

export default function NovaPagina() {
  return (
    <div className="container-custom section-padding">
      <h1 className="section-title">Nova Página</h1>
      <p className="section-subtitle">Conteúdo da página</p>
    </div>
  )
}
```

### 2. Página com Layout Customizado
```tsx
// src/app/nova-pagina/layout.tsx
export default function NovaPaginaLayout({ children }) {
  return (
    <div className="nova-pagina-wrapper">
      <aside>Sidebar</aside>
      <main>{children}</main>
    </div>
  )
}
```

### 3. Página com Loading State
```tsx
// src/app/nova-pagina/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}
```

### 4. API Route
```tsx
// src/app/api/nova-rota/route.ts
export async function GET(request: Request) {
  return Response.json({ message: 'Hello' })
}

export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ received: body })
}
```

## 🎨 Integração com Sistema de Design

### Usar Componentes do Sistema
```tsx
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function MinhaPage() {
  return (
    <div className="container-custom">
      <ThemeToggle />
      <Button variant="primary">Ação</Button>
    </div>
  )
}
```

### Usar Classes CSS
```tsx
export default function MinhaPage() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container-custom">
        <h1 className="section-title">Título</h1>
        <p className="section-subtitle">Subtítulo</p>
        <div className="card">
          <p className="text-foreground">Conteúdo</p>
        </div>
      </div>
    </section>
  )
}
```

## 🚀 Navegação

### Link Component
```tsx
import Link from 'next/link'

<Link href="/assinatura" className="btn-primary">
  Assinar Agora
</Link>
```

### useRouter Hook (Client Component)
```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function MyComponent() {
  const router = useRouter()
  
  const handleClick = () => {
    router.push('/assinatura')
  }
  
  return <button onClick={handleClick}>Ir para Assinatura</button>
}
```

### redirect (Server Component)
```tsx
import { redirect } from 'next/navigation'

export default function Page() {
  const shouldRedirect = true
  
  if (shouldRedirect) {
    redirect('/assinatura')
  }
  
  return <div>Página</div>
}
```

## 📊 Data Fetching

### Server Component (Recomendado)
```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store' // ou 'force-cache'
  })
  return res.json()
}

export default async function Page() {
  const data = await getData()
  
  return <div>{data.title}</div>
}
```

### Client Component
```tsx
'use client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])
  
  return <div>{data?.title}</div>
}
```

## 🔧 Configuração

### next.config.js
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router já está habilitado por padrão no Next.js 14
}

module.exports = nextConfig
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📚 Recursos

### Documentação Oficial
- [App Router](https://nextjs.org/docs/app)
- [Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

### Guias do Projeto
- [Sistema de Design](./DESIGN_SYSTEM_README.md)
- [Guia Rápido](./DESIGN_SYSTEM_QUICK_GUIDE.md)
- [Exemplos](./DESIGN_SYSTEM_EXAMPLES.md)

## ✅ Checklist para Nova Página

- [ ] Criar diretório em `src/app/`
- [ ] Criar `page.tsx`
- [ ] Adicionar metadata (SEO)
- [ ] Usar componentes do sistema de design
- [ ] Testar em dark mode
- [ ] Verificar responsividade
- [ ] Adicionar loading state se necessário
- [ ] Adicionar error boundary se necessário
- [ ] Testar navegação
- [ ] Validar acessibilidade

## 🎯 Boas Práticas

1. **Use Server Components por padrão** - Só use Client Components quando necessário
2. **Coloque 'use client' o mais baixo possível** - Mantenha a maior parte do código no servidor
3. **Use layouts para código compartilhado** - Evite duplicação
4. **Aproveite streaming e suspense** - Melhore performance
5. **Use metadata API** - Melhore SEO
6. **Organize por feature** - Mantenha código relacionado junto
7. **Use TypeScript** - Type safety é importante
8. **Teste em dark mode** - Sempre valide ambos os temas

---

**Última atualização**: 07/10/2025
**Next.js Version**: 14
**Status**: ✅ App Router implementado e funcionando
