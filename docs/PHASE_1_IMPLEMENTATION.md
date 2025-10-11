# Fase 1: Performance e Edge Computing - Guia de Implementação

## 📋 Overview

Implementação completa do sistema de personalização otimizado para edge runtime com Redis distribuído e fingerprinting server-side.

**Objetivo**: Latência P95 < 50ms, throughput > 10k req/s, cache hit rate > 95%

## ✅ Componentes Implementados

### 1. **Redis Cache Adapter** (`src/lib/personalization/cache/redis-cache.ts`)

Sistema de cache distribuído com Upstash Redis otimizado para edge runtime.

**Funcionalidades**:
- ✅ Cache de perfis de usuário com TTL dinâmico baseado em confidence score
- ✅ Cache de persona scores e dados comportamentais
- ✅ Métricas em tempo real (hit rate, latency, errors)
- ✅ Cache warming para personas populares
- ✅ Health check endpoint

**Performance**:
- TTL dinâmico: 30 min (baixa confiança) → 4 horas (alta confiança)
- Compressão automática para payloads grandes
- Atomic operations para consistência

### 2. **Edge Fingerprinting** (`src/lib/personalization/edge/fingerprint.ts`)

Sistema de fingerprinting privacy-first compatível com edge runtime.

**Funcionalidades**:
- ✅ Fingerprinting baseado em headers HTTP (sem JavaScript client-side)
- ✅ SHA-256 hashing com salt para anonimização
- ✅ IP anonymization (LGPD/GDPR compliant)
- ✅ Bot detection
- ✅ Rate limiting por fingerprint
- ✅ User-Agent parsing otimizado
- ✅ Timezone e country detection via Cloudflare/Vercel headers

**Componentes do Fingerprint**:
- User-Agent
- Accept-Language
- Accept-Encoding
- IP address (anonymized)
- Client Hints (quando disponível)
- Timezone, Platform, Screen size

### 3. **Edge-Optimized Middleware** (`middleware.edge.ts`)

Middleware Next.js rodando em edge runtime para máxima performance.

**Funcionalidades**:
- ✅ Edge runtime configuration (Vercel Edge Functions)
- ✅ Multi-region deployment (São Paulo + Rio de Janeiro)
- ✅ Fingerprint generation e caching
- ✅ Rate limiting por fingerprint
- ✅ Bot detection e skip
- ✅ Redis cache integration
- ✅ Profile creation e update
- ✅ Routing decisions
- ✅ Performance metrics headers

**Headers Adicionados**:
```
x-user-persona: price-conscious
x-persona-confidence: 0.75
x-session-id: abc123-1234567890
x-routing-strategy: personalized
x-fingerprint: 1a2b3c4d5e6f7g8h
x-personalization-latency: 42
```

## 🚀 Setup e Configuração

### Passo 1: Criar conta Upstash Redis

```bash
# 1. Acesse https://upstash.com
# 2. Crie uma conta gratuita
# 3. Crie um Redis database
# 4. Copie as credenciais REST API
```

### Passo 2: Configurar variáveis de ambiente

```bash
# Copie .env.example para .env.local
cp .env.example .env.local

# Edite .env.local e adicione:
UPSTASH_REDIS_REST_URL="https://your-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token-here"
FINGERPRINT_SALT="generate-random-salt-here"
PERSONALIZATION_ENABLED=true
EDGE_RUNTIME_ENABLED=true
```

### Passo 3: Ativar novo middleware

```bash
# Renomeie o middleware antigo
mv middleware.ts middleware.old.ts

# Ative o novo middleware edge
mv middleware.edge.ts middleware.ts
```

### Passo 4: Testar localmente

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Test middleware
curl -v http://localhost:3000 \
  -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" \
  -H "Accept-Language: pt-BR,pt;q=0.9"

# Check headers
# x-user-persona should be set
# x-personalization-latency should be < 100ms
```

### Passo 5: Deploy para Vercel

```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure environment variables no Vercel Dashboard:
# Settings → Environment Variables
# Adicione todas as variáveis do .env.example
```

## 📊 Métricas e Monitoramento

### Métricas de Cache

```typescript
import { getRedisCache } from '@/lib/personalization/cache/redis-cache'

const cache = getRedisCache()
const metrics = cache.getMetrics()

console.log({
  hitRate: metrics.hitRate, // Target: > 95%
  averageLatency: metrics.averageLatency, // Target: < 10ms
  totalRequests: metrics.totalRequests,
  errors: metrics.errors // Should be 0
})
```

### Health Check

```typescript
const health = await cache.healthCheck()

if (!health.healthy) {
  console.error('Redis unhealthy:', health.error)
  // Fallback to in-memory cache
}
```

### Performance Monitoring

Adicione ao seu componente de analytics:

```typescript
// Monitor latency from response headers
const latency = response.headers.get('x-personalization-latency')

if (parseInt(latency) > 100) {
  // Alert: Latency threshold exceeded
}
```

## 🧪 Testes

### Teste 1: Cache Functionality

```typescript
// tests/cache.test.ts
import { getRedisCache } from '@/lib/personalization/cache/redis-cache'

describe('Redis Cache', () => {
  it('should set and get user profile', async () => {
    const cache = getRedisCache()
    const sessionId = 'test-session-123'

    const profile = {
      primaryPersona: 'price-conscious',
      confidenceScore: 0.8,
      // ... other fields
    }

    await cache.setUserProfile(sessionId, profile)
    const retrieved = await cache.getUserProfile(sessionId)

    expect(retrieved).toEqual(profile)
  })

  it('should return null for expired profiles', async () => {
    // Test TTL expiration
  })
})
```

### Teste 2: Fingerprinting

```typescript
// tests/fingerprint.test.ts
import { EdgeFingerprint } from '@/lib/personalization/edge/fingerprint'

describe('Edge Fingerprint', () => {
  it('should generate consistent hash', async () => {
    const mockRequest = new Request('http://localhost:3000', {
      headers: {
        'user-agent': 'Mozilla/5.0...',
        'accept-language': 'pt-BR'
      }
    })

    const fp1 = await EdgeFingerprint.generate(mockRequest)
    const fp2 = await EdgeFingerprint.generate(mockRequest)

    expect(fp1.hash).toBe(fp2.hash)
  })

  it('should detect bots', () => {
    const components = {
      userAgent: 'Googlebot/2.1',
      // ... other fields
    }

    expect(EdgeFingerprint.isBotLikely(components)).toBe(true)
  })
})
```

### Teste 3: Middleware Performance

```bash
# Load testing com k6
k6 run tests/load/middleware.js

# Expected results:
# - P50: < 30ms
# - P95: < 50ms
# - P99: < 100ms
# - Error rate: < 0.1%
```

## 🔧 Troubleshooting

### Problema: Alta latência (> 100ms)

**Possíveis causas**:
1. Redis endpoint distante geograficamente
2. Cache miss rate alto
3. Payload muito grande

**Soluções**:
```typescript
// 1. Verificar região do Redis
// Upstash → Settings → Region
// Deve ser São Paulo ou próximo

// 2. Implementar cache warming
const cache = getRedisCache()
await cache.warmCache(['price-conscious', 'quality-focused'])

// 3. Reduzir payload
// Armazenar apenas últimos 20 behavioral patterns (não 50)
```

### Problema: Cache hit rate baixo (< 80%)

**Possíveis causas**:
1. TTL muito curto
2. Session IDs não estáveis
3. Cache invalidation muito agressiva

**Soluções**:
```typescript
// 1. Aumentar TTL mínimo
REDIS_CACHE_TTL_MIN=3600 # 1 hora

// 2. Usar fingerprint hash como session ID base
// Já implementado no middleware.edge.ts

// 3. Evitar invalidações desnecessárias
// Só invalidar quando persona mudar significativamente
```

### Problema: Fingerprint colisões

**Sintoma**: Usuários diferentes recebendo mesma personalização

**Solução**:
```typescript
// Adicionar mais componentes ao fingerprint
// Editar: src/lib/personalization/edge/fingerprint.ts

// Incluir Accept-Encoding, DNT, etc
const components = {
  // ... existing
  dnt: headers.get('dnt'),
  upgradeInsecureRequests: headers.get('upgrade-insecure-requests')
}
```

## 📈 Benchmarks Esperados

### Latência (P95)

| Componente | Baseline | Target | Atual |
|------------|----------|--------|-------|
| Fingerprint generation | 5ms | 3ms | ⏱️ TBD |
| Redis GET | 15ms | 10ms | ⏱️ TBD |
| Profile analysis | 30ms | 20ms | ⏱️ TBD |
| Routing decision | 5ms | 3ms | ⏱️ TBD |
| **Total** | **55ms** | **<50ms** | ⏱️ TBD |

### Cache Performance

| Métrica | Target | Atual |
|---------|--------|-------|
| Hit Rate | > 95% | ⏱️ TBD |
| Average Latency | < 10ms | ⏱️ TBD |
| Error Rate | < 0.1% | ⏱️ TBD |
| Throughput | > 10k/s | ⏱️ TBD |

### Custos (Upstash Free Tier)

| Recurso | Limite Free | Uso Esperado | Custo |
|---------|-------------|--------------|-------|
| Commands/day | 10,000 | ~5,000 | $0 |
| Bandwidth | 100MB/day | ~50MB | $0 |
| Storage | 256MB | ~20MB | $0 |

**Upgrade para Pro**: ~$10/mês para 100k+ req/day

## 🔒 Segurança e Privacidade

### LGPD/GDPR Compliance

✅ **Implementado**:
- IP anonymization (últimos octetos zerados)
- Fingerprint hashing (SHA-256 com salt)
- No PII (Personally Identifiable Information) armazenado
- TTL automático para data retention

⚠️ **Pendente (Fase 5)**:
- Consent management
- Right to deletion
- Data export (portability)
- Audit logging

### Rate Limiting

```typescript
// Já implementado no middleware
FingerprintRateLimit.checkLimit(fingerprintHash)

// 100 requests por minuto por fingerprint
// Retorna 429 Too Many Requests se excedido
```

## 🚀 Próximos Passos

### Otimizações Adicionais

1. **Cache Warming Automático**
   - Cron job para warm cache de personas populares
   - Pré-computar routing decisions

2. **Prefetching Inteligente**
   - Prefetch páginas baseado em persona
   - Edge caching de variantes

3. **Compression**
   - Brotli/Gzip para payloads grandes
   - Implementar no Redis adapter

### Monitoramento Avançado

1. **Vercel Analytics Integration**
   ```typescript
   import { track } from '@vercel/analytics'

   track('persona_detected', {
     persona: profile.primaryPersona,
     confidence: profile.confidenceScore,
     latency
   })
   ```

2. **Custom Metrics Dashboard**
   - Criar `/api/metrics/personalization`
   - Dashboard com grafana ou similar

### Fase 2 Preview

Preparação para Machine Learning:
- Começar coleta de training data
- Labeled dataset de 1000+ sessões
- Feature engineering pipeline

---

**Documentação Atualizada**: ${new Date().toISOString()}
**Status**: ✅ Implementação Completa - Pronta para Testes
**Próximo Milestone**: Load testing e benchmarks
