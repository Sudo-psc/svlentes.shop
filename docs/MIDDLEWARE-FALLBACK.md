# Sistema de Fallback Robusto - Middleware

## Visão Geral

O sistema de fallback do middleware implementa o **Circuit Breaker Pattern** com recuperação gradual e fallback em cascata para garantir alta disponibilidade mesmo quando a personalização falha.

## Arquitetura

### Níveis de Fallback

```
┌─────────────────────────────────────────────────────────────┐
│                    NÍVEL 1: Verificações Rápidas            │
│  • Personalização desabilitada?                             │
│  • Circuit breaker aberto?                                  │
│  • Health check necessário?                                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              NÍVEL 2: Personalização Completa               │
│  • Timeout adaptativo baseado no estado                     │
│  • Processamento completo de persona                        │
│  • Cache e análise comportamental                           │
└─────────────────────────────────────────────────────────────┘
                              ↓ (em caso de erro)
┌─────────────────────────────────────────────────────────────┐
│              NÍVEL 3: Fallback Inteligente                  │
│  • Timeout → Personalização simplificada                    │
│  • Erro de dados → Cache ou padrão                          │
│  • Erro de rede → Fallback imediato                         │
│  • Erro desconhecido → Fallback genérico                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                NÍVEL 4: Experiência Padrão                  │
│  • Sem personalização                                        │
│  • Persona padrão                                            │
│  • Headers informativos                                      │
└─────────────────────────────────────────────────────────────┘
```

## Circuit Breaker

### Estados

1. **Closed (Fechado)** - Sistema saudável
   - Personalização funcionando normalmente
   - Erros ocasionais são tolerados
   - Timeout: 100ms (normal)

2. **Open (Aberto)** - Sistema com problemas
   - Personalização desabilitada temporariamente
   - Fallback imediato para todas as requisições
   - Duração: 60 segundos (cooldown)

3. **Half-Open (Semi-aberto)** - Recuperação
   - Tentando recuperar gradualmente
   - Timeout mais generoso: 200ms
   - Volta para Closed após 3 sucessos consecutivos
   - Volta para Open se houver erro

### Transições de Estado

```
     ┌─────────┐
     │ Closed  │ ←──────────────────┐
     └────┬────┘                    │
          │                         │
          │ 5 erros consecutivos    │ 3 sucessos
          ↓                         │
     ┌─────────┐                    │
     │  Open   │                    │
     └────┬────┘                    │
          │                         │
          │ 30s (partial recovery)  │
          ↓                         │
     ┌──────────┐                   │
     │Half-Open │ ──────────────────┘
     └──────────┘
          │
          │ erro
          ↓
     ┌─────────┐
     │  Open   │
     └─────────┘
```

## Configuração

### Constantes (middleware.ts)

```typescript
const FALLBACK_CONFIG = {
    // Timeouts em cascata
    TIMEOUT_LEVELS: {
        fast: 50,      // Circuit breaker open
        normal: 100,   // Circuit breaker closed
        slow: 200      // Circuit breaker half-open
    },
    
    // Circuit breaker
    MAX_CONSECUTIVE_ERRORS: 5,
    ERROR_COOLDOWN_MS: 60000,        // 1 minuto
    PARTIAL_RECOVERY_MS: 30000,      // 30 segundos
    
    // Health check
    HEALTH_CHECK_INTERVAL_MS: 10000, // 10 segundos
    HEALTH_CHECK_THRESHOLD: 3,       // 3 sucessos para reativar
    
    // Métricas
    METRICS_WINDOW_MS: 60000,        // Janela de 1 minuto
}
```

## Tipos de Fallback

### 1. Fallback por Timeout

**Quando:** Personalização demora mais que o timeout configurado

**Ação:** Tenta versão simplificada (apenas inferência básica)

```typescript
// Personalização simplificada
- Sem cache
- Sem análise comportamental complexa
- Apenas inferência de persona baseada na URL
- Latência: ~20-30ms
```

### 2. Fallback por Erro de Rede

**Quando:** Falha ao acessar recursos externos (Redis, APIs)

**Ação:** Usa cache local ou fallback completo

### 3. Fallback por Erro de Dados

**Quando:** Dados corrompidos ou inválidos

**Ação:** Fallback completo com persona padrão

### 4. Fallback por Circuit Breaker

**Quando:** Muitos erros consecutivos (5+)

**Ação:** Desabilita personalização por 60 segundos

## Monitoramento

### API de Health Check

```bash
GET /api/middleware-health
```

**Resposta:**

```json
{
  "status": "healthy" | "degraded" | "unhealthy",
  "timestamp": "2025-01-10T12:00:00Z",
  "circuitBreaker": {
    "status": "closed",
    "consecutiveErrors": 0,
    "consecutiveSuccesses": 10
  },
  "metrics": {
    "totalRequests": 1000,
    "totalErrors": 5,
    "totalFallbacks": 3,
    "errorRate": 0.5,
    "avgLatency": 75,
    "uptime": 99.5
  },
  "issues": [],
  "recommendations": []
}
```

### Headers de Resposta

Todas as respostas incluem headers informativos:

```
x-personalization-status: active | fallback | simplified
x-personalization-fallback-reason: timeout | error | cooldown | disabled
x-circuit-breaker-status: closed | open | half-open
x-circuit-breaker-errors: 0
x-personalization-latency: 75
x-user-persona: price-conscious
x-persona-confidence: 0.85
x-persona-source: full | simplified | fallback
```

### Componente de Debug

Em desenvolvimento, use o componente `MiddlewareStatusDebug`:

```tsx
import { MiddlewareStatusDebug } from '@/lib/middleware-monitor'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <MiddlewareStatusDebug />
      </body>
    </html>
  )
}
```

## Métricas e Alertas

### Métricas Coletadas

- **Taxa de erro** - Porcentagem de requisições com erro
- **Latência média** - Tempo médio de processamento
- **Uptime** - Porcentagem de requisições bem-sucedidas
- **Erros consecutivos** - Contador para circuit breaker
- **Total de fallbacks** - Quantas vezes o fallback foi acionado

### Alertas Recomendados

1. **Taxa de erro > 10%** → Investigar causa raiz
2. **Latência média > 100ms** → Otimizar processamento
3. **Circuit breaker aberto** → Alerta crítico
4. **Uptime < 95%** → Revisar estabilidade

## Recuperação

### Recuperação Automática

O sistema se recupera automaticamente:

1. **Após 30 segundos** → Entra em modo half-open
2. **Após 3 sucessos** → Volta ao modo normal (closed)
3. **Se houver erro** → Volta para open por mais 60s

### Recuperação Manual (Desenvolvimento)

```bash
# Reset do circuit breaker
curl -X POST http://localhost:3000/api/middleware-health \
  -H "Content-Type: application/json" \
  -d '{"action": "reset"}'
```

Ou via componente de debug:

```typescript
import { resetMiddlewareState } from '@/lib/middleware-monitor'

// Limpa cookies e cache
await resetMiddlewareState()
```

## Testes

Execute os testes do sistema de fallback:

```bash
npm test src/__tests__/middleware-fallback.test.ts
```

### Cenários Testados

- ✅ Fallback por timeout
- ✅ Fallback por erro de rede
- ✅ Fallback por erro de dados
- ✅ Transições de estado do circuit breaker
- ✅ Cálculo de métricas
- ✅ Geração de relatórios de saúde
- ✅ Recuperação gradual

## Boas Práticas

### 1. Monitoramento Contínuo

```typescript
// Adicione logging para produção
if (process.env.NODE_ENV === 'production') {
    // Enviar métricas para DataDog, Sentry, etc.
    sendMetrics(exportMetricsForMonitoring(metrics))
}
```

### 2. Ajuste de Timeouts

Ajuste os timeouts baseado na sua infraestrutura:

```typescript
// Para infraestrutura mais lenta
TIMEOUT_LEVELS: {
    fast: 100,
    normal: 200,
    slow: 300
}
```

### 3. Persistência de Estado

Em produção, use Redis para compartilhar estado:

```typescript
// Salvar estado do circuit breaker
await redis.set('circuit-breaker-state', JSON.stringify(circuitBreaker))

// Recuperar estado
const state = await redis.get('circuit-breaker-state')
```

### 4. Alertas Proativos

Configure alertas antes que o circuit breaker abra:

```typescript
if (errorRate > 5 && errorRate < 10) {
    sendAlert('warning', 'Error rate elevated')
}
```

## Troubleshooting

### Circuit Breaker Abrindo Frequentemente

**Causa:** Taxa de erro alta ou timeouts frequentes

**Solução:**
1. Verificar logs de erro
2. Aumentar timeout se necessário
3. Otimizar lógica de personalização
4. Verificar dependências externas (Redis, APIs)

### Latência Alta

**Causa:** Processamento pesado ou dependências lentas

**Solução:**
1. Usar versão simplificada mais frequentemente
2. Otimizar queries de cache
3. Reduzir complexidade da análise comportamental

### Fallback Constante

**Causa:** Personalização sempre falhando

**Solução:**
1. Verificar configuração
2. Testar dependências
3. Revisar logs de erro
4. Considerar desabilitar temporariamente

## Roadmap

- [ ] Integração com Redis para estado distribuído
- [ ] Métricas em tempo real com WebSocket
- [ ] Dashboard de monitoramento
- [ ] Alertas automáticos via Slack/Email
- [ ] A/B testing de estratégias de fallback
- [ ] Machine learning para predição de falhas
