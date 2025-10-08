# 🚀 Guia de Deployment - Fase 1: Edge Personalization

**Objetivo**: Deploy do sistema de personalização com Edge Runtime e Redis cache na Vercel.

---

## 📋 Pré-requisitos

### 1. Contas Necessárias

- ✅ Conta Vercel (https://vercel.com)
- ⚠️ Conta Upstash (https://upstash.com) - **CRIAR**

### 2. Ferramentas Instaladas

```bash
# Vercel CLI
npm install -g vercel

# Verificar instalação
vercel --version
```

---

## 🔧 Setup Upstash Redis

### Passo 1: Criar Conta

1. Acesse https://upstash.com
2. Clique em "Sign Up" ou "Get Started"
3. Escolha método de autenticação:
   - GitHub (recomendado)
   - Google
   - Email

### Passo 2: Criar Database Redis

1. No dashboard, clique em **"Create Database"**
2. Configure:
   - **Name**: `svlentes-personalization`
   - **Type**: `Regional`
   - **Region**: `us-east-1` (ou região mais próxima de São Paulo disponível)
   - **Eviction**: `allkeys-lru` (recomendado)
   - **TLS**: `Enabled` (obrigatório)

3. Clique em **"Create"**

### Passo 3: Copiar Credenciais

No dashboard do database criado:

1. Navegue até a aba **"REST API"**
2. Copie as credenciais:
   ```bash
   UPSTASH_REDIS_REST_URL=https://your-instance-xxxxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AYasdfQN...
   ```

**⚠️ IMPORTANTE**: Nunca commit estas credenciais no Git!

### Passo 4: Testar Conexão Localmente

```bash
# Criar arquivo .env.local
cp .env.example .env.local

# Adicionar credenciais
echo "UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io" >> .env.local
echo "UPSTASH_REDIS_REST_TOKEN=AYasdfQN..." >> .env.local
echo "FINGERPRINT_SALT=$(openssl rand -base64 32)" >> .env.local
```

Testar:

```bash
npm run dev

# Em outro terminal
curl -v http://localhost:3000 -H "User-Agent: Mozilla/5.0"

# Verificar headers de resposta
# ✓ x-user-persona
# ✓ x-persona-confidence
# ✓ x-personalization-latency
```

---

## 🔄 Ativar Edge Middleware

### Passo 1: Backup Middleware Antigo

```bash
# Fazer backup do middleware atual
mv middleware.ts middleware.old.ts

# Ativar novo middleware edge
mv middleware.edge.ts middleware.ts
```

### Passo 2: Verificar Configuração

Abra `middleware.ts` e confirme:

```typescript
export const config = {
  runtime: 'edge',
  regions: ['gru1', 'gig1'], // São Paulo + Rio
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images).*)',
  ],
}
```

### Passo 3: Testar Localmente

```bash
npm run dev

# Testar diferentes User-Agents
curl http://localhost:3000 \
  -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" \
  -H "Accept-Language: pt-BR"

curl http://localhost:3000 \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  -H "Accept-Language: pt-BR"
```

**Resultado Esperado**:
```
< x-user-persona: price-conscious
< x-persona-confidence: 0.72
< x-session-id: 1a2b3c4d-1234567890
< x-personalization-latency: 45
```

---

## 🌐 Deploy para Vercel

### Opção 1: Deploy via CLI (Recomendado)

#### Staging Deploy

```bash
# Login na Vercel
vercel login

# Deploy para staging
vercel

# Seguir prompts:
# ? Set up and deploy "~/svlentes-page-short"? Y
# ? Which scope? <your-account>
# ? Link to existing project? N
# ? What's your project's name? svlentes-staging
# ? In which directory is your code located? ./
```

#### Configurar Variáveis de Ambiente

```bash
# Adicionar variáveis via CLI
vercel env add UPSTASH_REDIS_REST_URL
# Cole o valor quando solicitado
# Escolha: Production, Preview, Development

vercel env add UPSTASH_REDIS_REST_TOKEN
# Cole o valor quando solicitado

vercel env add FINGERPRINT_SALT
# Cole salt gerado: $(openssl rand -base64 32)

vercel env add PERSONALIZATION_ENABLED
# Digite: true

vercel env add EDGE_RUNTIME_ENABLED
# Digite: true
```

#### Production Deploy

```bash
# Deploy para produção
vercel --prod

# URL de produção será exibida
# https://svlentes.vercel.app
```

### Opção 2: Deploy via Dashboard

1. Acesse https://vercel.com/dashboard
2. Clique em **"Add New..."** → **"Project"**
3. Importe repositório GitHub
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Adicione **Environment Variables**:
   ```
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=AYasdfQN...
   FINGERPRINT_SALT=<random-base64-string>
   PERSONALIZATION_ENABLED=true
   EDGE_RUNTIME_ENABLED=true
   EDGE_REGIONS=gru1,gig1
   RATE_LIMIT_MAX_REQUESTS=100
   RATE_LIMIT_WINDOW_MS=60000
   ```

6. Clique em **"Deploy"**

---

## ✅ Validação do Deploy

### 1. Smoke Tests

```bash
# Obter URL de produção
PROD_URL=$(vercel inspect --prod | grep "URL:" | awk '{print $2}')

# Testar endpoint raiz
curl -I $PROD_URL

# Testar com User-Agent
curl -v $PROD_URL \
  -H "User-Agent: Mozilla/5.0 (iPhone...)" \
  -H "Accept-Language: pt-BR"

# Verificar headers
# ✓ x-user-persona
# ✓ x-persona-confidence
# ✓ x-personalization-latency (< 50ms esperado)
```

### 2. Verificar Logs

```bash
# Logs em tempo real
vercel logs --prod --follow

# Ou via dashboard
# https://vercel.com/<your-account>/svlentes/deployments
```

### 3. Validar Redis Connection

No dashboard Upstash:
- Acesse **"Data Browser"**
- Aguardar primeiras requisições
- Verificar chaves criadas:
  - `persona:profile:*`
  - `persona:behavior:*`
  - `persona:routing:*`

### 4. Performance Check

```bash
# Testar latência
for i in {1..10}; do
  curl -w "@curl-format.txt" -o /dev/null -s $PROD_URL
done

# curl-format.txt:
# time_total: %{time_total}s\n
```

**Target**: Maioria das respostas < 100ms

---

## 📊 Monitoramento

### 1. Vercel Analytics

1. Acesse https://vercel.com/<your-account>/svlentes/analytics
2. Verificar:
   - **Performance**: Core Web Vitals
   - **Errors**: Error rate < 0.1%
   - **Functions**: Edge function latency

### 2. Upstash Monitoring

1. Acesse dashboard Upstash
2. Verificar:
   - **Request Rate**: Deve aumentar após deploy
   - **Latency**: P95 < 10ms esperado
   - **Memory Usage**: Monitorar consumo

### 3. Custom Metrics Endpoint

Adicione endpoint de health check:

```bash
# Verificar métricas de cache
curl $PROD_URL/api/personalization/metrics

# Resposta esperada:
# {
#   "cache": {
#     "hitRate": 95.2,
#     "averageLatency": 8,
#     "totalRequests": 12450,
#     "errors": 0
#   },
#   "fingerprint": {
#     "uniqueUsers": 3421,
#     "botRequests": 145,
#     "rateLimitViolations": 3
#   }
# }
```

---

## 🚨 Troubleshooting

### Problema 1: Headers não aparecem

**Sintomas**: Headers `x-user-persona`, `x-persona-confidence` ausentes

**Diagnóstico**:
```bash
# Verificar se middleware está ativo
curl -I $PROD_URL | grep "x-middleware"

# Verificar logs
vercel logs --prod | grep "Edge Middleware"
```

**Soluções**:
1. Confirmar que `middleware.ts` está na raiz do projeto
2. Verificar `matcher` no `config`
3. Verificar se runtime é `'edge'`

### Problema 2: Redis timeout

**Sintomas**: `x-personalization-error: true` no header

**Diagnóstico**:
```bash
# Verificar logs
vercel logs --prod | grep "Redis"
```

**Soluções**:
1. Verificar credenciais no Vercel Dashboard → Settings → Environment Variables
2. Testar conexão Upstash:
   ```bash
   curl -X GET "https://your-instance.upstash.io/ping" \
     -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"
   ```
3. Verificar região do Redis (deve estar próxima do Edge Region)

### Problema 3: Alta latência (> 100ms)

**Diagnóstico**:
```bash
# Verificar header de latência
curl -I $PROD_URL | grep "x-personalization-latency"
```

**Soluções**:
1. Verificar região do Redis (migrar para região mais próxima)
2. Verificar cold start (primeiras requisições são mais lentas)
3. Habilitar cache warming:
   ```typescript
   // Em cron job ou API route
   await cache.warmUpCache()
   ```

### Problema 4: Rate limiting muito agressivo

**Sintomas**: 429 Too Many Requests frequente

**Solução**:
```bash
# Ajustar limites via env vars
vercel env add RATE_LIMIT_MAX_REQUESTS
# Digite: 200 (ao invés de 100)

vercel env add RATE_LIMIT_WINDOW_MS
# Digite: 60000 (manter 1 minuto)

# Redeploy
vercel --prod
```

---

## 🔐 Segurança

### 1. Variáveis de Ambiente

**✅ Fazer**:
- Usar variáveis de ambiente para secrets
- Rotacionar FINGERPRINT_SALT periodicamente
- Separar chaves de staging e produção

**❌ Nunca**:
- Commitar `.env.local` no Git
- Usar `NEXT_PUBLIC_` para secrets
- Compartilhar tokens Upstash

### 2. CORS e Headers

Verificar headers de segurança:

```bash
curl -I $PROD_URL | grep -E "(X-Frame|X-Content|Strict-Transport)"
```

### 3. Rate Limiting

Monitorar violações:

```bash
# API para verificar rate limit violations
curl $PROD_URL/api/personalization/rate-limit-status
```

---

## 📈 Próximos Passos Pós-Deploy

### Semana 1

- [ ] Coletar métricas de baseline (7 dias)
- [ ] Monitorar cache hit rate
- [ ] Validar latência P95 < 50ms
- [ ] Verificar error rate < 0.1%

### Semana 2

- [ ] Executar load tests com k6
- [ ] Otimizar TTL baseado em dados reais
- [ ] Ajustar rate limiting se necessário
- [ ] Implementar alertas de performance

### Semana 3-4

- [ ] Setup cache warming automático
- [ ] Implementar dashboard de métricas
- [ ] Preparar coleta de dados para Fase 2 (ML)
- [ ] Documentar lições aprendidas

---

## 📞 Suporte e Recursos

### Documentação
- [Guia de Implementação Fase 1](docs/PHASE_1_IMPLEMENTATION.md)
- [Status da Fase 1](PHASE_1_STATUS.md)
- [Plano de P&D Completo](RESEARCH_DEVELOPMENT_PLAN.md)

### External Resources
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Upstash Redis Docs](https://upstash.com/docs/redis)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

### Comandos Úteis

```bash
# Verificar deployment atual
vercel inspect --prod

# Rollback para deployment anterior
vercel rollback <deployment-url>

# Logs em tempo real
vercel logs --prod --follow

# Environment variables
vercel env ls
vercel env pull .env.local

# Remover deployment
vercel remove svlentes --yes
```

---

**Data de Criação**: ${new Date().toLocaleString('pt-BR')}
**Responsável**: Claude Code + Philipe Cruz
**Versão**: 1.0
