# 🔀 Plano de Integração: Sistema Híbrido de Personalização

**Data**: ${new Date().toLocaleDateString('pt-BR')}
**Status**: Proposta de Arquitetura Híbrida

---

## 🎯 Objetivo

Combinar a **infraestrutura de edge computing** já implementada (Fase 1) com o **sistema de rastreamento client-side** proposto no novo plano, criando uma solução híbrida que maximiza performance, privacidade e precisão.

---

## 📐 Arquitetura Híbrida Proposta

### Camada 1: Client-Side Tracking (Novo)
**Responsabilidade**: Coleta detalhada de comportamento do usuário

- ✨ Rastreamento de eventos no navegador
- 💾 Armazenamento em localStorage
- 🧠 Inferência de persona via regras locais
- 🍪 Comunicação com servidor via cookie

### Camada 2: Edge Processing (Fase 1 Implementada)
**Responsabilidade**: Performance, cache e fallback

- ⚡ Edge runtime para latência < 50ms
- 🗄️ Redis cache para perfis consolidados
- 🔐 Fingerprinting para sessões anônimas
- 🛡️ LGPD compliance (IP anonymization, SHA-256)

### Camada 3: Server-Side Personalization (Ambos)
**Responsabilidade**: Entrega de conteúdo personalizado

- 🔄 Middleware Next.js lê cookie de persona
- 📄 Rotas paralelas para variações de UI
- 🎨 Server Components com headers customizados

---

## 🔄 Fluxo de Dados Híbrido

### Cenário 1: Novo Visitante

```
1. Usuário acessa site
2. Edge Middleware:
   - Gera fingerprint (server-side)
   - Verifica Redis cache → Miss
   - Define persona inicial: "new_visitor"
   - Cria session_id
3. Cliente:
   - Carrega scripts de tracking
   - Inicia localStorage vazio
   - Começa a registrar eventos
4. Após 5 eventos:
   - Client-side calcula persona (ex: "tech_enthusiast")
   - Grava cookie: user_persona=tech_enthusiast
5. Próxima requisição:
   - Middleware lê cookie
   - Reescreve URL para /home/tech_enthusiast
   - Armazena no Redis para futuras visitas
```

### Cenário 2: Visitante Retornando

```
1. Usuário acessa site
2. Edge Middleware:
   - Gera fingerprint
   - Consulta Redis → Hit (persona: "tech_enthusiast")
   - Verifica cookie do cliente
   - Se cookie diferente de Redis → usa cookie (mais recente)
3. Cliente:
   - Continua rastreamento local
   - Atualiza persona se comportamento mudar
4. Sincronização:
   - A cada 10 eventos, envia atualização para Redis
   - Redis mantém histórico consolidado
```

---

## 🏗️ Estrutura de Diretórios Integrada

```
/src
├── /app
│   ├── /@personalized        # Rotas paralelas (novo plano)
│   │   └── /(personas)
│   │       ├── /@banner
│   │       │   ├── /tech_enthusiast
│   │       │   │   └── page.tsx
│   │       │   ├── /fashion_seeker
│   │       │   │   └── page.tsx
│   │       │   └── default.tsx
│   │       └── /@recommendations
│   │           ├── /tech_enthusiast
│   │           └── default.tsx
│   ├── /api
│   │   └── /personalization
│   │       ├── /sync          # Endpoint para sincronizar localStorage → Redis
│   │       └── /metrics       # Dashboard de métricas
│   └── layout.tsx
│
├── /components
│   ├── /personalization       # Componentes personalizados
│   │   ├── PersonalizedBanner.tsx
│   │   └── RecommendedProducts.tsx
│   └── /tracking              # Componente de debug (novo)
│       └── DebugPanel.tsx
│
├── /lib
│   ├── /tracking              # Novo módulo client-side
│   │   ├── eventTracker.ts
│   │   ├── useTracking.ts
│   │   └── types.ts
│   │
│   ├── /persona               # Novo módulo de inferência
│   │   ├── personaRules.ts
│   │   ├── usePersona.ts
│   │   └── calculatePersona.ts
│   │
│   ├── /personalization       # Módulos da Fase 1
│   │   ├── /cache
│   │   │   └── redis-cache.ts
│   │   ├── /edge
│   │   │   └── fingerprint.ts
│   │   └── config.ts
│   │
│   └── /cookies               # Utilitários de cookie
│       └── index.ts
│
└── middleware.ts              # Middleware híbrido (edge + cookie)
```

---

## 📊 Comparação: Edge vs Client-Side

| Aspecto | Edge Processing (Fase 1) | Client-Side (Novo Plano) | Híbrido (Proposta) |
|---------|---------------------------|--------------------------|-------------------|
| **Latência Inicial** | 40-50ms | 0ms (sem overhead) | 40-50ms (primeira visita) |
| **Precisão** | Média (fingerprint) | Alta (eventos detalhados) | **Muito Alta** |
| **Privacidade** | Alta (SHA-256, IP anon) | Média (localStorage) | **Alta** (combina ambos) |
| **Cache Hit Rate** | 95%+ | N/A | **98%+** |
| **Dependência de JS** | Não | Sim | Parcial (fallback) |
| **Custo** | $0-20/mês (Redis) | $0 | $0-20/mês |
| **Complexidade** | Média | Baixa | **Alta** |

**Vantagens do Híbrido**:
- ✅ Inferência instantânea para visitantes retornando (Redis cache)
- ✅ Precisão superior com eventos detalhados (localStorage)
- ✅ Funciona sem JavaScript (fallback para fingerprint)
- ✅ LGPD compliant em todas as camadas

---

## 🛠️ Implementação do Sistema Híbrido

### Fase 2A: Client-Side Tracking (2 semanas)

**Semana 1**: Módulo de Rastreamento

```typescript
// /lib/tracking/eventTracker.ts
export interface TrackingEvent {
  timestamp: number
  eventName: string
  eventData: Record<string, any>
}

export class EventTracker {
  private static readonly STORAGE_KEY = 'user_behavior_log'
  private static readonly MAX_EVENTS = 100

  static track(eventName: string, eventData: Record<string, any>): void {
    const event: TrackingEvent = {
      timestamp: Date.now(),
      eventName,
      eventData
    }

    const events = this.getEvents()
    events.push(event)

    // Limitar tamanho do log
    if (events.length > this.MAX_EVENTS) {
      events.shift() // Remove evento mais antigo
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events))
  }

  static getEvents(): TrackingEvent[] {
    const data = localStorage.getItem(this.STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  static clearEvents(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }
}
```

**Eventos a Implementar**:
- `page_view`: Toda visualização de página
- `category_visit`: Visita a categoria de produto
- `product_view`: Visualização de produto específico
- `search_query`: Busca realizada
- `add_to_cart`: Adicionar ao carrinho
- `form_interaction`: Interação com formulário de prescrição
- `consultation_interest`: Interesse em consulta
- `scroll_depth`: Profundidade de scroll (25%, 50%, 75%, 100%)

**Semana 2**: Hook de Tracking

```typescript
// /lib/tracking/useTracking.ts
'use client'

import { useCallback } from 'react'
import { EventTracker } from './eventTracker'

export function useTracking() {
  const track = useCallback((eventName: string, eventData: Record<string, any> = {}) => {
    try {
      EventTracker.track(eventName, eventData)
    } catch (error) {
      console.error('[Tracking] Error:', error)
    }
  }, [])

  return { track }
}

// Exemplo de uso em componente
function ProductPage({ product }) {
  const { track } = useTracking()

  useEffect(() => {
    track('product_view', {
      productId: product.id,
      categoryId: product.categoryId,
      price: product.price
    })
  }, [product.id])

  return <div>...</div>
}
```

### Fase 2B: Inferência de Persona (2 semanas)

**Semana 3**: Regras de Pontuação

```typescript
// /lib/persona/personaRules.ts
export type Persona =
  | 'tech_enthusiast'
  | 'fashion_seeker'
  | 'home_improver'
  | 'health_conscious'    // Específico para lentes
  | 'price_sensitive'     // Busca melhor custo-benefício
  | 'premium_seeker'      // Prioriza qualidade
  | 'new_visitor'

export interface PersonaScore {
  [persona: string]: number
}

export const PERSONA_RULES = {
  // Regras baseadas em eventos
  category_visit: {
    'lentes-contato': { health_conscious: 5, tech_enthusiast: 3 },
    'tecnologia': { tech_enthusiast: 10 },
    'moda': { fashion_seeker: 10 },
    'decoracao': { home_improver: 10 }
  },

  product_view: {
    // Regra genérica: +3 pontos para categoria relacionada
    default: 3
  },

  search_query: {
    // Análise de keywords na busca
    keywords: {
      'barato|desconto|promoção': { price_sensitive: 8 },
      'premium|luxo|qualidade': { premium_seeker: 8 },
      'saúde|oftalmológico|visão': { health_conscious: 5 },
      'tecnologia|inovação|moderno': { tech_enthusiast: 5 }
    }
  },

  add_to_cart: {
    // Analisa faixa de preço do produto
    price_range: {
      low: { price_sensitive: 5 },    // < R$ 100
      medium: { health_conscious: 3 }, // R$ 100-300
      high: { premium_seeker: 8 }      // > R$ 300
    }
  },

  consultation_interest: {
    default: { health_conscious: 10 }
  }
}

export const PERSONA_THRESHOLD = 20 // Mínimo de pontos para definir persona
```

**Semana 4**: Função de Cálculo

```typescript
// /lib/persona/calculatePersona.ts
import { EventTracker } from '../tracking/eventTracker'
import { PERSONA_RULES, PERSONA_THRESHOLD, type Persona, type PersonaScore } from './personaRules'

export function calculatePersona(): Persona {
  const events = EventTracker.getEvents()
  const scores: PersonaScore = {}

  // Inicializar scores
  const personas: Persona[] = [
    'tech_enthusiast',
    'fashion_seeker',
    'home_improver',
    'health_conscious',
    'price_sensitive',
    'premium_seeker'
  ]

  personas.forEach(persona => {
    scores[persona] = 0
  })

  // Processar cada evento
  events.forEach(event => {
    const { eventName, eventData } = event

    // Aplicar regras específicas do evento
    if (eventName === 'category_visit' && eventData.categoryId) {
      const categoryRules = PERSONA_RULES.category_visit[eventData.categoryId]
      if (categoryRules) {
        Object.entries(categoryRules).forEach(([persona, points]) => {
          scores[persona] = (scores[persona] || 0) + points
        })
      }
    }

    if (eventName === 'product_view') {
      scores[eventData.primaryInterest] =
        (scores[eventData.primaryInterest] || 0) + PERSONA_RULES.product_view.default
    }

    if (eventName === 'search_query' && eventData.query) {
      const query = eventData.query.toLowerCase()
      Object.entries(PERSONA_RULES.search_query.keywords).forEach(([pattern, personaPoints]) => {
        const regex = new RegExp(pattern)
        if (regex.test(query)) {
          Object.entries(personaPoints).forEach(([persona, points]) => {
            scores[persona] = (scores[persona] || 0) + points
          })
        }
      })
    }

    if (eventName === 'add_to_cart' && eventData.price) {
      const price = eventData.price
      let range: 'low' | 'medium' | 'high'
      if (price < 100) range = 'low'
      else if (price < 300) range = 'medium'
      else range = 'high'

      const priceRules = PERSONA_RULES.add_to_cart.price_range[range]
      Object.entries(priceRules).forEach(([persona, points]) => {
        scores[persona] = (scores[persona] || 0) + points
      })
    }

    if (eventName === 'consultation_interest') {
      Object.entries(PERSONA_RULES.consultation_interest.default).forEach(([persona, points]) => {
        scores[persona] = (scores[persona] || 0) + points
      })
    }
  })

  // Encontrar persona com maior pontuação
  let maxScore = 0
  let topPersona: Persona = 'new_visitor'

  Object.entries(scores).forEach(([persona, score]) => {
    if (score > maxScore && score >= PERSONA_THRESHOLD) {
      maxScore = score
      topPersona = persona as Persona
    }
  })

  return topPersona
}
```

### Fase 2C: Hook de Persona (1 semana)

```typescript
// /lib/persona/usePersona.ts
'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { calculatePersona, type Persona } from './calculatePersona'
import { EventTracker } from '../tracking/eventTracker'

const PERSONA_COOKIE = 'user_persona'
const RECALC_INTERVAL = 5 // Recalcular a cada 5 novos eventos

export function usePersona() {
  const [persona, setPersona] = useState<Persona>('new_visitor')
  const [lastEventCount, setLastEventCount] = useState(0)

  useEffect(() => {
    // Ler persona do cookie no mount
    const cookiePersona = Cookies.get(PERSONA_COOKIE) as Persona | undefined
    if (cookiePersona) {
      setPersona(cookiePersona)
    }

    // Função para atualizar persona
    const updatePersona = () => {
      const events = EventTracker.getEvents()
      const eventCount = events.length

      // Só recalcular se houver eventos suficientes novos
      if (eventCount >= lastEventCount + RECALC_INTERVAL || eventCount >= 5) {
        const newPersona = calculatePersona()

        if (newPersona !== persona) {
          setPersona(newPersona)
          Cookies.set(PERSONA_COOKIE, newPersona, {
            path: '/',
            expires: 365, // 1 ano
            sameSite: 'lax'
          })

          // Opcional: Sincronizar com Redis via API
          syncPersonaToServer(newPersona)
        }

        setLastEventCount(eventCount)
      }
    }

    // Verificar periodicamente
    const interval = setInterval(updatePersona, 5000) // A cada 5 segundos

    return () => clearInterval(interval)
  }, [persona, lastEventCount])

  return { persona }
}

async function syncPersonaToServer(persona: Persona) {
  try {
    await fetch('/api/personalization/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persona })
    })
  } catch (error) {
    console.error('[Persona] Sync failed:', error)
  }
}
```

### Fase 2D: Middleware Híbrido (1 semana)

```typescript
// middleware.ts (atualizado para híbrido)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { EdgeFingerprint, FingerprintRateLimit } from '@/lib/personalization/edge/fingerprint'
import { getRedisCache } from '@/lib/personalization/cache/redis-cache'

export const config = {
  runtime: 'edge',
  regions: ['gru1', 'gig1'],
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images).*)',
  ],
}

export async function middleware(request: NextRequest) {
  const startTime = Date.now()
  const response = NextResponse.next()

  try {
    // 1. PRIORIDADE: Ler cookie de persona (client-side)
    const clientPersona = request.cookies.get('user_persona')?.value

    if (clientPersona && clientPersona !== 'new_visitor') {
      // Cliente já tem persona definida → Usar e fazer cache
      response.headers.set('x-user-persona', clientPersona)
      response.headers.set('x-persona-source', 'client-cookie')

      // Armazenar no Redis para próximas visitas
      const fingerprint = await EdgeFingerprint.generate(request)
      const cache = getRedisCache()
      await cache.set(`persona:${fingerprint.hash}`, clientPersona, 7 * 24 * 60 * 60) // 7 dias

      return response
    }

    // 2. FALLBACK: Tentar Redis (fingerprint server-side)
    const fingerprint = await EdgeFingerprint.generate(request)

    // Rate limiting
    if (!FingerprintRateLimit.checkLimit(fingerprint.hash)) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }

    // Bot detection
    if (EdgeFingerprint.isBotLikely(fingerprint.components)) {
      response.headers.set('x-bot-detected', 'true')
      return response
    }

    // Consultar Redis
    const cache = getRedisCache()
    const cachedPersona = await cache.get<string>(`persona:${fingerprint.hash}`)

    if (cachedPersona) {
      response.headers.set('x-user-persona', cachedPersona)
      response.headers.set('x-persona-source', 'redis-cache')
      response.headers.set('x-persona-confidence', '0.85')
    } else {
      // Novo visitante sem histórico
      response.headers.set('x-user-persona', 'new_visitor')
      response.headers.set('x-persona-source', 'default')
      response.headers.set('x-persona-confidence', '0.00')
    }

    // Adicionar headers de performance
    response.headers.set('x-personalization-latency', (Date.now() - startTime).toString())
    response.headers.set('x-fingerprint', fingerprint.hash.substring(0, 16))

    return response
  } catch (error) {
    console.error('[Hybrid Middleware] Error:', error)
    response.headers.set('x-personalization-error', 'true')
    return response
  }
}
```

---

## 🎨 Implementação de Rotas Paralelas

### Estrutura de Diretórios

```
/app
├── /@banner              # Slot para banner principal
│   ├── /tech_enthusiast
│   │   └── page.tsx
│   ├── /health_conscious
│   │   └── page.tsx
│   ├── /price_sensitive
│   │   └── page.tsx
│   └── default.tsx       # Fallback
│
├── /@recommendations     # Slot para recomendações
│   ├── /tech_enthusiast
│   │   └── page.tsx
│   ├── /health_conscious
│   │   └── page.tsx
│   └── default.tsx
│
├── layout.tsx            # Renderiza os slots
└── page.tsx              # Conteúdo principal
```

### Layout Principal

```typescript
// /app/layout.tsx
export default function RootLayout({
  children,
  banner,
  recommendations,
}: {
  children: React.ReactNode
  banner: React.ReactNode
  recommendations: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        {banner}
        <main>{children}</main>
        {recommendations}
        <Footer />
      </body>
    </html>
  )
}
```

### Componentes Personalizados

```typescript
// /app/@banner/health_conscious/page.tsx
export default function HealthBanner() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-green-500">
      <h2>Cuide da saúde dos seus olhos</h2>
      <p>
        Lentes de contato com tecnologia avançada para sua visão.
        Consulta oftalmológica gratuita.
      </p>
      <button>Agendar Consulta</button>
    </section>
  )
}

// /app/@banner/price_sensitive/page.tsx
export default function PriceBanner() {
  return (
    <section className="bg-gradient-to-r from-yellow-500 to-orange-500">
      <h2>Economia que cabe no seu bolso</h2>
      <p>
        Assinatura de lentes a partir de R$ 79,90/mês.
        Sem taxas escondidas.
      </p>
      <button>Ver Planos</button>
    </section>
  )
}

// /app/@banner/default.tsx
export default function DefaultBanner() {
  return (
    <section className="bg-gradient-to-r from-primary-500 to-blue-500">
      <h2>SV Lentes - Saraiva Vision</h2>
      <p>Assinatura de lentes com acompanhamento médico contínuo</p>
      <button>Saiba Mais</button>
    </section>
  )
}
```

---

## 📊 API de Sincronização

```typescript
// /app/api/personalization/sync/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getRedisCache } from '@/lib/personalization/cache/redis-cache'
import { EdgeFingerprint } from '@/lib/personalization/edge/fingerprint'

export async function POST(request: NextRequest) {
  try {
    const { persona } = await request.json()

    // Validar persona
    const validPersonas = [
      'tech_enthusiast',
      'fashion_seeker',
      'home_improver',
      'health_conscious',
      'price_sensitive',
      'premium_seeker',
      'new_visitor'
    ]

    if (!validPersonas.includes(persona)) {
      return NextResponse.json({ error: 'Invalid persona' }, { status: 400 })
    }

    // Gerar fingerprint para armazenar no Redis
    const fingerprint = await EdgeFingerprint.generate(request)

    // Armazenar no Redis
    const cache = getRedisCache()
    await cache.set(`persona:${fingerprint.hash}`, persona, 7 * 24 * 60 * 60) // 7 dias

    return NextResponse.json({
      success: true,
      persona,
      fingerprint: fingerprint.hash.substring(0, 16)
    })
  } catch (error) {
    console.error('[Sync API] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

---

## 🧪 Painel de Debug

```typescript
// /components/tracking/DebugPanel.tsx
'use client'

import { useEffect, useState } from 'react'
import { EventTracker } from '@/lib/tracking/eventTracker'
import { calculatePersona } from '@/lib/persona/calculatePersona'
import Cookies from 'js-cookie'

export function DebugPanel() {
  const [events, setEvents] = useState([])
  const [currentPersona, setCurrentPersona] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(EventTracker.getEvents())
      setCurrentPersona(Cookies.get('user_persona') || 'new_visitor')
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleClearEvents = () => {
    EventTracker.clearEvents()
    setEvents([])
  }

  const handleForcePersona = (persona: string) => {
    Cookies.set('user_persona', persona, { path: '/' })
    setCurrentPersona(persona)
    window.location.reload()
  }

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-2xl rounded-lg p-4 max-w-md max-h-96 overflow-auto z-50">
      <h3 className="font-bold text-lg mb-2">🛠️ Personalization Debug</h3>

      <div className="mb-4">
        <p className="text-sm font-semibold">Current Persona:</p>
        <p className="text-lg text-blue-600">{currentPersona}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold">Force Persona:</p>
        <div className="flex gap-2 flex-wrap mt-2">
          {['tech_enthusiast', 'health_conscious', 'price_sensitive', 'new_visitor'].map(p => (
            <button
              key={p}
              onClick={() => handleForcePersona(p)}
              className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold">Events ({events.length}):</p>
        <div className="text-xs max-h-32 overflow-auto bg-gray-100 p-2 rounded mt-1">
          {events.length === 0 ? (
            <p className="text-gray-500">No events yet</p>
          ) : (
            events.slice(-10).map((e, i) => (
              <div key={i} className="mb-1">
                <span className="font-mono">{e.eventName}</span>
                {' - '}
                <span className="text-gray-600">{JSON.stringify(e.eventData)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={handleClearEvents}
        className="w-full px-3 py-2 bg-red-500 text-white text-sm rounded"
      >
        Clear Events
      </button>
    </div>
  )
}
```

---

## 📈 Roadmap de Implementação

### Sprint 1: Client-Side Tracking (2 semanas)
- ✅ Implementar `EventTracker`
- ✅ Criar hook `useTracking`
- ✅ Instrumentar componentes principais
- ✅ Testes unitários

### Sprint 2: Persona Inference (2 semanas)
- ✅ Definir regras de pontuação
- ✅ Implementar `calculatePersona`
- ✅ Criar hook `usePersona`
- ✅ Testes de integração

### Sprint 3: Middleware Híbrido (1 semana)
- ✅ Atualizar middleware para ler cookie
- ✅ Implementar fallback para Redis
- ✅ API de sincronização
- ✅ Testes E2E

### Sprint 4: Rotas Paralelas (2 semanas)
- ✅ Estrutura de slots
- ✅ Componentes personalizados
- ✅ Fallbacks
- ✅ Testes visuais

### Sprint 5: Debug & Monitoring (1 semana)
- ✅ Painel de debug
- ✅ Analytics integration
- ✅ Performance monitoring
- ✅ Documentação

---

## 🎯 Critérios de Sucesso

| Métrica | Target | Como Medir |
|---------|--------|------------|
| Latência P95 | < 50ms | Vercel Analytics |
| Precisão de Persona | > 85% | A/B testing + Analytics |
| Cache Hit Rate | > 98% | Redis metrics |
| Client-Side Overhead | < 50ms | Lighthouse |
| Taxa de Conversão | +15% | Google Analytics |
| Custo Mensal | < $20 | Upstash + Vercel billing |

---

## 💰 Estimativa de Custos

| Serviço | Tier | Custo/mês |
|---------|------|-----------|
| Upstash Redis | Free | $0 |
| Vercel Edge Functions | Incluído no Pro | $0 |
| **Total** | | **$0** |

**Escalabilidade**:
- 10k req/dia: Free tier suficiente
- 100k req/dia: Upstash Pro ($10/mês)
- 1M+ req/dia: Upstash Scale ($50/mês)

---

## 📚 Documentação e Recursos

### Documentação Interna
- [Fase 1: Edge Computing](PHASE_1_SUMMARY.md)
- [Status da Fase 1](PHASE_1_STATUS.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Plano de P&D Completo](RESEARCH_DEVELOPMENT_PLAN.md)

### Recursos Externos
- [Next.js Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
- [Vercel Edge Middleware](https://vercel.com/docs/functions/edge-middleware)
- [localStorage Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [js-cookie Documentation](https://github.com/js-cookie/js-cookie)

---

**Responsável**: Claude Code + Philipe Cruz
**Data**: ${new Date().toLocaleString('pt-BR')}
**Versão**: 1.0
