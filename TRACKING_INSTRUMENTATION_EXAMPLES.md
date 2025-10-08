# 📊 Exemplos de Instrumentação de Tracking

**Guia prático** para adicionar rastreamento de eventos aos componentes existentes do SVlentes.

---

## 🎯 Princípios de Instrumentação

### Fallback Gracioso
Todos os exemplos seguem o princípio de **degradação graciosa**:
- Se tracking falhar → Componente continua funcionando
- Se localStorage não disponível → Rastreamento desabilitado silenciosamente
- Se JavaScript desabilitado → Nenhum erro, experiência padrão

### Onde Instrumentar
- **Páginas**: Auto-track de page views e scroll depth
- **Produtos**: Track de visualizações e add-to-cart
- **Formulários**: Track de interações e submissões
- **CTAs**: Track de interesse em consultas
- **Vídeos**: Track de reprodução e tempo assistido

---

## 📄 Exemplo 1: Página de Produto

```typescript
// src/app/produtos/[slug]/page.tsx
'use client'

import { useEffect } from 'react'
import { usePageViewTracking, useScrollTracking, useTracking } from '@/lib/tracking'

interface ProductPageProps {
  params: { slug: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { track } = useTracking()

  // Auto-track de page view e tempo de permanência
  usePageViewTracking(`/produtos/${params.slug}`)

  // Auto-track de scroll depth (25%, 50%, 75%, 100%)
  useScrollTracking()

  // Track manual de product view
  useEffect(() => {
    // Buscar dados do produto (exemplo simplificado)
    const product = {
      id: 'lens-daily-acuvue',
      name: 'Lentes de Contato Diárias Acuvue',
      categoryId: 'lentes-diarias',
      price: 199.90
    }

    track('product_view', {
      productId: product.id,
      productName: product.name,
      categoryId: product.categoryId,
      price: product.price
    })
  }, [params.slug, track])

  return (
    <div>
      <ProductDetails />
      <AddToCartButton />
    </div>
  )
}

function AddToCartButton() {
  const { track } = useTracking()

  const handleAddToCart = () => {
    track('add_to_cart', {
      productId: 'lens-daily-acuvue',
      productName: 'Lentes de Contato Diárias Acuvue',
      price: 199.90,
      quantity: 1,
      categoryId: 'lentes-diarias'
    })

    // Lógica real de adicionar ao carrinho...
  }

  return (
    <button onClick={handleAddToCart}>
      Adicionar ao Carrinho
    </button>
  )
}
```

---

## 📋 Exemplo 2: Formulário de Prescrição

```typescript
// src/components/forms/PrescriptionForm.tsx
'use client'

import { useFormTracking, useTracking } from '@/lib/tracking'

export function PrescriptionForm() {
  const { track } = useTracking()

  // Auto-track de focus nos campos
  const formRef = useFormTracking('prescription-form', 'prescription')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Track de conclusão do formulário
    track('form_interaction', {
      formId: 'prescription-form',
      formType: 'prescription',
      completed: true
    })

    // Track de upload de prescrição
    track('prescription_upload', {
      source: 'form',
      method: 'upload'
    })

    // Processar formulário...
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <label>
        Nome Completo:
        <input type="text" name="fullName" required />
      </label>

      <label>
        Prescrição (PDF):
        <input type="file" name="prescription" accept=".pdf" required />
      </label>

      <button type="submit">Enviar Prescrição</button>
    </form>
  )
}
```

---

## 🔍 Exemplo 3: Busca de Produtos

```typescript
// src/components/search/SearchBar.tsx
'use client'

import { useState } from 'react'
import { useTracking } from '@/lib/tracking'
import { useDebounce } from '@/hooks/useDebounce'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const { track } = useTracking()

  // Debounce para não rastrear cada tecla digitada
  const debouncedQuery = useDebounce(query, 500)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Buscar produtos...
    const searchResults = await fetchProducts(searchQuery)
    setResults(searchResults)

    // Track da busca
    track('search_query', {
      query: searchQuery,
      resultsCount: searchResults.length
    })
  }

  useEffect(() => {
    if (debouncedQuery) {
      handleSearch(debouncedQuery)
    }
  }, [debouncedQuery])

  const handleResultClick = (product: Product, index: number) => {
    // Track de click no resultado
    track('search_query', {
      query: debouncedQuery,
      selectedResultIndex: index
    })

    // Navegar para produto...
  }

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar lentes..."
      />

      <ul>
        {results.map((product, index) => (
          <li key={product.id} onClick={() => handleResultClick(product, index)}>
            {product.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 🎥 Exemplo 4: Vídeo Explicativo

```typescript
// src/components/media/VideoPlayer.tsx
'use client'

import { useVideoTracking } from '@/lib/tracking'

interface VideoPlayerProps {
  videoId: string
  videoTitle: string
  videoSrc: string
}

export function VideoPlayer({ videoId, videoTitle, videoSrc }: VideoPlayerProps) {
  // Auto-track de play, pause e conclusão
  const videoRef = useVideoTracking(videoId, videoTitle)

  return (
    <div className="video-container">
      <h3>{videoTitle}</h3>
      <video
        ref={videoRef}
        src={videoSrc}
        controls
        className="w-full rounded-lg"
      />
    </div>
  )
}

// Uso:
// <VideoPlayer
//   videoId="how-to-use-lenses"
//   videoTitle="Como usar lentes de contato"
//   videoSrc="/videos/tutorial-lentes.mp4"
// />
```

---

## 🏥 Exemplo 5: CTA de Consulta

```typescript
// src/components/cta/ConsultationCTA.tsx
'use client'

import { useTracking } from '@/lib/tracking'

interface ConsultationCTAProps {
  source: 'banner' | 'button' | 'chat' | 'whatsapp'
  consultationType?: 'ophthalmologic' | 'lens_fitting' | 'followup'
}

export function ConsultationCTA({ source, consultationType }: ConsultationCTAProps) {
  const { track } = useTracking()

  const handleClick = () => {
    // Track de interesse em consulta
    track('consultation_interest', {
      source,
      consultationType
    })

    // Redirecionar ou abrir modal...
    if (source === 'whatsapp') {
      window.open('https://wa.me/5533998601427', '_blank')
    } else {
      // Abrir modal de agendamento...
    }
  }

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg"
    >
      Agendar Consulta Gratuita
    </button>
  )
}
```

---

## 🛒 Exemplo 6: Comparação de Planos

```typescript
// src/components/subscription/PlanComparison.tsx
'use client'

import { useEffect } from 'react'
import { useTracking } from '@/lib/tracking'

interface Plan {
  id: string
  name: string
  price: number
}

interface PlanComparisonProps {
  plans: Plan[]
  comparisonType: 'side-by-side' | 'table' | 'calculator'
}

export function PlanComparison({ plans, comparisonType }: PlanComparisonProps) {
  const { track } = useTracking()

  useEffect(() => {
    // Track quando componente é montado (usuário visualizou comparação)
    track('plan_comparison', {
      planIds: plans.map(p => p.id).join(','),
      comparisonType
    })
  }, [plans, comparisonType, track])

  return (
    <div className="plan-comparison">
      {/* Renderizar comparação... */}
    </div>
  )
}
```

---

## 💳 Exemplo 7: Checkout Flow

```typescript
// src/app/checkout/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useTracking } from '@/lib/tracking'

export default function CheckoutPage() {
  const { track } = useTracking()
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    // Track de início do checkout
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    track('checkout_start', {
      cartTotal,
      itemCount,
      planId: cart[0]?.planId // Se for assinatura
    })
  }, [])

  const handlePaymentMethodSelect = (method: 'pix' | 'credit_card' | 'boleto') => {
    track('payment_method_select', {
      method,
      installments: method === 'credit_card' ? 12 : undefined
    })

    // Processar pagamento...
  }

  return (
    <div>
      <CartSummary cart={cart} />
      <PaymentMethodSelector onSelect={handlePaymentMethodSelect} />
    </div>
  )
}
```

---

## 🔧 Exemplo 8: Layout Principal com Provider

```typescript
// src/app/layout.tsx
import { TrackingProvider } from '@/components/tracking/TrackingProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <TrackingProvider
          enabled={true}
          debug={process.env.NODE_ENV === 'development'}
          sendToAnalytics={process.env.NODE_ENV === 'production'}
          syncInterval={60000} // 1 minuto
        >
          <Header />
          {children}
          <Footer />
        </TrackingProvider>
      </body>
    </html>
  )
}
```

---

## 📊 Verificando Eventos Rastreados

### Via DevTools Console

```javascript
// Obter todos os eventos
const events = localStorage.getItem('svlentes_user_behavior')
console.table(JSON.parse(events))

// Obter estatísticas
import { EventTracker } from '@/lib/tracking'
console.log(EventTracker.getStats())

// Exportar para JSON
console.log(EventTracker.exportToJSON())

// Limpar eventos
EventTracker.clearEvents()
```

### Via Painel de Debug (Sprint 5)

Painel visual será implementado no Sprint 5 para facilitar debugging em desenvolvimento.

---

## ⚠️ Tratamento de Erros

### Todos os Métodos São Resilientes

```typescript
// ✅ CORRETO: Pode chamar sem try-catch
const { track } = useTracking()
track('product_view', { productId: 'xyz' })

// O hook já tem try-catch interno
// Se falhar, apenas loga erro no console
```

### Verificar se Tracking Está Habilitado

```typescript
const { isEnabled } = useTracking()

if (isEnabled()) {
  // Tracking disponível
} else {
  // Tracking desabilitado (localStorage indisponível, quota excedida, etc)
}
```

---

## 🚀 Próximos Passos

Após instrumentar os componentes principais:

1. **Testar localmente**: Verificar eventos no DevTools
2. **Validar fallbacks**: Testar com localStorage desabilitado
3. **Sprint 2**: Implementar inferência de persona baseada nos eventos coletados
4. **Sprint 3**: Sincronizar com Redis via middleware

---

**Documentação**: [HYBRID_PERSONALIZATION_PLAN.md](HYBRID_PERSONALIZATION_PLAN.md)
**Responsável**: Claude Code + Philipe Cruz
**Data**: ${new Date().toLocaleString('pt-BR')}
