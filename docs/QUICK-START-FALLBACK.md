# Guia Rápido - Sistema de Fallback

## 🚀 Início Rápido (5 minutos)

### 1. Verificar se está funcionando

```bash
# Iniciar servidor
npm run dev

# Em outro terminal, verificar saúde
npm run middleware:health
```

**Resposta esperada:**
```json
{
  "status": "healthy",
  "circuitBreaker": {
    "status": "closed"
  },
  "metrics": {
    "errorRate": 0,
    "uptime": 100
  }
}
```

### 2. Abrir Dashboard

```bash
open http://localhost:3000/admin/middleware-dashboard
```

Você verá:
- ✅ Status geral: **Healthy**
- ✅ Circuit breaker: **Closed**
- ✅ Personalização: **Ativa**

### 3. Testar Fallback

```bash
# Executar testes automatizados
npm run test:middleware-fallback
```

**Resultado esperado:**
```
✅ Requisição Normal
✅ Health Endpoint
✅ Página de Pricing
✅ Página de Calculadora
✅ Load Test (50 requisições)
✅ Burst Test (20 requisições simultâneas)

Testes passados: 6/6 (100%)
```

## 📊 Monitoramento Básico

### Ver Status em Tempo Real

Adicione ao seu layout:

```tsx
// src/app/layout.tsx
import { MiddlewareStatusDebug } from '@/lib/middleware-monitor'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <MiddlewareStatusDebug />
        )}
      </body>
    </html>
  )
}
```

Você verá um widget no canto inferior direito com:
- Status atual (Active/Fallback)
- Persona detectada
- Confiança da detecção
- Estratégia de roteamento

### Usar Hook de Status

```tsx
'use client'
import { useMiddlewareStatus } from '@/lib/middleware-monitor'

export function MyComponent() {
  const status = useMiddlewareStatus()
  
  return (
    <div>
      {status.isActive ? (
        <p>Personalização ativa: {status.persona}</p>
      ) : (
        <p>Modo fallback: {status.fallbackReason}</p>
      )}
    </div>
  )
}
```

## 🔧 Comandos Essenciais

```bash
# Verificar saúde
npm run middleware:health

# Resetar circuit breaker (dev)
npm run middleware:reset

# Executar testes
npm run test:middleware-fallback

# Ver logs do middleware
npm run dev | grep "Fallback"
```

## ⚠️ Troubleshooting Rápido

### Circuit Breaker Aberto?

```bash
# 1. Verificar motivo
npm run middleware:health

# 2. Ver logs
npm run dev | grep "Circuit breaker"

# 3. Resetar (dev only)
npm run middleware:reset
```

### Taxa de Erro Alta?

```bash
# 1. Abrir dashboard
open http://localhost:3000/admin/middleware-dashboard

# 2. Ver seção "Problemas Detectados"
# 3. Seguir recomendações
```

### Latência Alta?

```bash
# 1. Verificar métricas
npm run middleware:health | jq '.metrics.avgLatency'

# 2. Se > 100ms, considerar:
#    - Aumentar timeout
#    - Otimizar lógica
#    - Usar versão simplificada
```

## 📈 Próximos Passos

1. **Ler documentação completa**: `docs/MIDDLEWARE-FALLBACK.md`
2. **Explorar dashboard**: `/admin/middleware-dashboard`
3. **Configurar alertas**: Integrar com seu sistema de monitoramento
4. **Ajustar timeouts**: Baseado na sua infraestrutura

## 🎯 Checklist de Produção

Antes de ir para produção:

- [ ] Testes passando (100%)
- [ ] Dashboard funcionando
- [ ] Health check respondendo
- [ ] Métricas sendo coletadas
- [ ] Alertas configurados
- [ ] Documentação revisada
- [ ] Estado persistido (Redis)
- [ ] Logs integrados (Sentry/DataDog)

## 💡 Dicas

1. **Desenvolvimento**: Use `<MiddlewareStatusDebug />` para ver status em tempo real
2. **Testes**: Execute `npm run test:middleware-fallback` antes de cada deploy
3. **Monitoramento**: Verifique `/admin/middleware-dashboard` regularmente
4. **Alertas**: Configure alertas para taxa de erro > 10%
5. **Performance**: Mantenha latência média < 100ms

## 📞 Ajuda

- **Documentação**: `docs/MIDDLEWARE-FALLBACK.md`
- **Resumo**: `docs/MIDDLEWARE-FALLBACK-SUMMARY.md`
- **Dashboard**: `/admin/middleware-dashboard`
- **API**: `/api/middleware-health`

---

**Tempo estimado**: 5 minutos  
**Dificuldade**: Fácil  
**Pré-requisitos**: Node.js 18+, npm
