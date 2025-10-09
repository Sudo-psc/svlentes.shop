# Sistema de Fallback do Middleware

## Visão Geral

O middleware de personalização agora possui um sistema robusto de fallback que garante que o site sempre funcione, mesmo quando a personalização falha.

## Características Principais

### 1. Timeout Automático
- **Timeout**: 100ms para operações de personalização
- Se a personalização demorar mais que isso, retorna versão padrão
- Garante performance mesmo com problemas

### 2. Circuit Breaker
- **Máximo de erros consecutivos**: 5
- **Cooldown**: 60 segundos após atingir o limite
- Desabilita temporariamente a personalização após muitos erros
- Reativa automaticamente após o período de cooldown

### 3. Fallback Gracioso
- Sempre retorna uma resposta válida
- Nunca quebra o site
- Headers informativos sobre o estado do fallback

## Modos de Fallback

### 1. Disabled
```
x-personalization-status: fallback
x-personalization-fallback-reason: disabled
```
Personalização desabilitada via configuração.

### 2. Cooldown
```
x-personalization-status: fallback
x-personalization-fallback-reason: cooldown
x-personalization-cooldown-remaining: 45
```
Em cooldown após muitos erros. Header indica segundos restantes.

### 3. Error
```
x-personalization-status: fallback
x-personalization-fallback-reason: error
x-personalization-error: Error message...
```
Erro específico ocorreu. Header contém mensagem do erro.

### 4. Timeout
```
x-personalization-status: fallback
x-personalization-fallback-reason: timeout
```
Personalização demorou mais que 100ms.

## Headers de Resposta

### Quando Personalização Está Ativa
```
x-personalization-status: active
x-user-persona: price-conscious
x-persona-confidence: 0.85
x-session-id: session_1234567890_abc123
x-routing-strategy: personalized
x-cache-key: price-conscious-home-0.85
```

### Quando em Fallback
```
x-personalization-status: fallback
x-personalization-fallback-reason: error
x-routing-strategy: default
x-personalization-error: Timeout after 100ms
```

## Monitoramento

### Logs de Erro
Todos os erros são logados com contexto completo:
```javascript
{
  timestamp: "2025-01-09T10:30:00.000Z",
  message: "Error message",
  stack: "Error stack trace",
  context: {
    consecutiveErrors: 3,
    url: "https://example.com/",
    userAgent: "Mozilla/5.0...",
    timestamp: "2025-01-09T10:30:00.000Z"
  }
}
```

### Métricas Importantes
- **consecutiveErrors**: Contador de erros consecutivos
- **lastErrorTime**: Timestamp do último erro
- **isPersonalizationDisabled**: Estado do circuit breaker

## Configuração

### Constantes Ajustáveis
```typescript
const FALLBACK_TIMEOUT_MS = 100        // Timeout para personalização
const MAX_CONSECUTIVE_ERRORS = 5       // Erros antes de desabilitar
const ERROR_COOLDOWN_MS = 60000        // Cooldown em ms (1 minuto)
```

### Desabilitar Personalização
```typescript
// Em src/lib/personalization/config.ts
export const DEFAULT_PERSONALIZATION_CONFIG = {
  enabled: false,  // Desabilita completamente
  // ...
}
```

## Fluxo de Decisão

```
┌─────────────────────────────────────┐
│   Request chega no middleware       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Personalização habilitada?          │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
       Não           Sim
        │             │
        ▼             ▼
   ┌────────┐   ┌──────────────────┐
   │Fallback│   │ Em cooldown?     │
   │disabled│   └────┬─────────────┘
   └────────┘        │
              ┌──────┴──────┐
              │             │
             Sim           Não
              │             │
              ▼             ▼
         ┌────────┐   ┌──────────────────┐
         │Fallback│   │ Executar com     │
         │cooldown│   │ timeout (100ms)  │
         └────────┘   └────┬─────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
                 Sucesso       Erro/Timeout
                    │             │
                    ▼             ▼
              ┌──────────┐   ┌────────────┐
              │ Response │   │  Fallback  │
              │ Personali│   │  + Log     │
              │  zada    │   │  + Counter │
              └──────────┘   └────────────┘
```

## Tratamento de Erros Específicos

### 1. Erro de Rewrite
Se o rewrite falhar (página personalizada não existe):
```typescript
try {
  return NextResponse.rewrite(rewriteUrl)
} catch (rewriteError) {
  console.warn('Rewrite failed, falling back to default')
  // Continua com response padrão
}
```

### 2. Erro de Cookie
Se falhar ao setar cookies:
```typescript
try {
  response.cookies.set('user_profile', data)
} catch (cookieError) {
  console.warn('Cookie setting failed')
  // Continua sem cookies
}
```

### 3. Erro de Parsing
Se falhar ao parsear dados:
```typescript
try {
  const profile = JSON.parse(profileCookie)
} catch (error) {
  console.error('Error parsing profile cookie')
  // Cria novo perfil
}
```

## Testes

### Testar Fallback Manual
```typescript
// Forçar erro para testar fallback
throw new Error('Test error')
```

### Testar Timeout
```typescript
// Adicionar delay artificial
await new Promise(resolve => setTimeout(resolve, 200))
```

### Testar Circuit Breaker
```typescript
// Simular 5 erros consecutivos
for (let i = 0; i < 5; i++) {
  // Fazer request que causa erro
}
// Próximo request deve estar em cooldown
```

## Verificar Estado do Fallback

### Via Headers (DevTools)
1. Abrir DevTools → Network
2. Fazer request
3. Ver Response Headers:
   - `x-personalization-status`
   - `x-personalization-fallback-reason`

### Via Console
```javascript
// No browser console
fetch('/', { method: 'HEAD' })
  .then(r => {
    console.log('Status:', r.headers.get('x-personalization-status'))
    console.log('Reason:', r.headers.get('x-personalization-fallback-reason'))
  })
```

## Integração com Monitoramento

### Sentry (Exemplo)
```typescript
if (process.env.NODE_ENV === 'production') {
  Sentry.captureException(error, {
    tags: {
      component: 'middleware',
      fallback_reason: reason
    },
    extra: context
  })
}
```

### DataDog (Exemplo)
```typescript
if (process.env.NODE_ENV === 'production') {
  datadogLogs.logger.error('Middleware error', {
    error: errorMessage,
    context,
    consecutiveErrors
  })
}
```

## Boas Práticas

### 1. Sempre Retornar Resposta
✅ **Correto**:
```typescript
try {
  return await executePersonalization()
} catch (error) {
  return createFallbackResponse(request, 'error', error)
}
```

❌ **Incorreto**:
```typescript
try {
  return await executePersonalization()
} catch (error) {
  console.error(error)
  // Não retorna nada!
}
```

### 2. Timeout Apropriado
- **100ms**: Bom para personalização leve
- **200ms**: Para operações mais complexas
- **500ms**: Máximo aceitável (impacta UX)

### 3. Cooldown Balanceado
- **Muito curto** (10s): Pode não resolver problema
- **Ideal** (60s): Tempo para sistema se recuperar
- **Muito longo** (5min): Usuários ficam sem personalização

### 4. Logs Informativos
```typescript
console.error('[Personalization] Error:', {
  message: error.message,
  consecutiveErrors,
  url: request.url,
  timestamp: new Date().toISOString()
})
```

## Troubleshooting

### Problema: Personalização sempre em fallback
**Causa**: Muitos erros consecutivos
**Solução**: 
1. Verificar logs de erro
2. Corrigir causa raiz
3. Aguardar cooldown (60s)
4. Ou reiniciar servidor

### Problema: Timeout frequente
**Causa**: Operações muito lentas
**Solução**:
1. Otimizar código de personalização
2. Adicionar cache
3. Aumentar timeout (com cuidado)

### Problema: Headers não aparecem
**Causa**: Middleware não está executando
**Solução**:
1. Verificar `matcher` no config
2. Verificar se rota está excluída
3. Verificar logs do servidor

## Próximos Passos

1. **Integrar com Redis**: Para estado compartilhado entre instâncias
2. **Adicionar Métricas**: Prometheus/Grafana para monitoramento
3. **A/B Testing**: Testar diferentes timeouts e thresholds
4. **Health Check**: Endpoint para verificar estado do middleware
5. **Auto-recovery**: Tentar reativar personalização gradualmente

## Referências

- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Graceful Degradation](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation)
