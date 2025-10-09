# 🎨 Guia Visual - Sistema de Fallback

## 🔄 Fluxo de Fallback

```
┌─────────────────────────────────────────────────────────────────┐
│                         REQUISIÇÃO                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NÍVEL 1: Verificações                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Desabilitado?│  │Circuit Breaker│  │Health Check? │          │
│  │     ❌       │  │   Aberto? ❌  │  │     ✅       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │ Tudo OK
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              NÍVEL 2: Personalização Completa                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │  • Timeout adaptativo (50-200ms)                 │           │
│  │  • Análise comportamental                        │           │
│  │  • Inferência de persona                         │           │
│  │  • Cache e otimizações                           │           │
│  └──────────────────────────────────────────────────┘           │
└────────────────────────────┬────────────────────────────────────┘
                             │ ✅ Sucesso
                             ▼
                    ┌────────────────┐
                    │   RESPOSTA     │
                    │  Personalizada │
                    └────────────────┘
                             
                             │ ❌ Erro
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              NÍVEL 3: Fallback Inteligente                      │
│                                                                 │
│  Timeout? ──────────► Personalização Simplificada              │
│  Rede? ─────────────► Cache ou Fallback                        │
│  Dados? ────────────► Fallback Completo                        │
│  Muitos erros? ─────► Circuit Breaker Abre                     │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              NÍVEL 4: Experiência Padrão                        │
│  ┌──────────────────────────────────────────────────┐           │
│  │  • Sem personalização                            │           │
│  │  • Persona padrão                                │           │
│  │  • Headers informativos                          │           │
│  │  • Confiança = 0                                 │           │
│  └──────────────────────────────────────────────────┘           │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
                    ┌────────────────┐
                    │   RESPOSTA     │
                    │     Padrão     │
                    └────────────────┘
```

## 🔴 Estados do Circuit Breaker

### Estado: CLOSED (Fechado) ✅
```
┌─────────────────────────────────────┐
│         SISTEMA SAUDÁVEL            │
│                                     │
│  Status: CLOSED                     │
│  Timeout: 100ms (normal)            │
│  Personalização: ATIVA              │
│  Erros consecutivos: 0-4            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Requisição → Personalização│   │
│  │       ↓                      │   │
│  │   Resposta Personalizada    │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
         │
         │ 5 erros consecutivos
         ▼
```

### Estado: OPEN (Aberto) ❌
```
┌─────────────────────────────────────┐
│       SISTEMA COM PROBLEMAS         │
│                                     │
│  Status: OPEN                       │
│  Timeout: 50ms (rápido)             │
│  Personalização: DESABILITADA       │
│  Duração: 60 segundos               │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Requisição → Fallback      │   │
│  │       ↓                      │   │
│  │   Resposta Padrão           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
         │
         │ Após 30 segundos
         ▼
```

### Estado: HALF-OPEN (Semi-aberto) ⚠️
```
┌─────────────────────────────────────┐
│         RECUPERANDO                 │
│                                     │
│  Status: HALF-OPEN                  │
│  Timeout: 200ms (generoso)          │
│  Personalização: TESTANDO           │
│  Necessário: 3 sucessos             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Requisição → Tentativa     │   │
│  │       ↓                      │   │
│  │   Sucesso? → CLOSED         │   │
│  │   Erro? → OPEN              │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 📊 Dashboard Visual

```
┌────────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE DASHBOARD                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   ✅ HEALTHY │  │  ✅ CLOSED   │  │  ✅ ACTIVE   │        │
│  │    Status    │  │Circuit Breaker│  │Personalização│        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                      MÉTRICAS                                  │
│                                                                │
│  📊 Requisições: 1,234    ❌ Erros: 12    🔄 Fallbacks: 5    │
│  📈 Taxa de Erro: 0.97%   ⚡ Latência: 75ms   ✅ Uptime: 99%  │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                   CIRCUIT BREAKER                              │
│                                                                │
│  Status: CLOSED                                                │
│  Erros Consecutivos: 0                                         │
│  Sucessos Consecutivos: 15                                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 🎯 Indicadores de Status

### Status Saudável ✅
```
┌─────────────────────────────────────┐
│  ✅ Middleware: Active              │
│  📊 Error Rate: 2.5%                │
│  ⚡ Latency: 75ms                   │
│  🎯 Uptime: 99.5%                   │
│  🔄 Circuit: Closed                 │
└─────────────────────────────────────┘
```

### Status Degradado ⚠️
```
┌─────────────────────────────────────┐
│  ⚠️ Middleware: Fallback            │
│  📊 Error Rate: 12.5%               │
│  ⚡ Latency: 150ms                  │
│  🎯 Uptime: 87.5%                   │
│  🔄 Circuit: Half-Open              │
│                                     │
│  Issues:                            │
│  • Elevated error rate              │
│  • High latency                     │
└─────────────────────────────────────┘
```

### Status Crítico ❌
```
┌─────────────────────────────────────┐
│  ❌ Middleware: Fallback            │
│  📊 Error Rate: 25%                 │
│  ⚡ Latency: 200ms                  │
│  🎯 Uptime: 75%                     │
│  🔄 Circuit: Open                   │
│                                     │
│  Issues:                            │
│  • Circuit breaker is open          │
│  • High error rate                  │
│  • System degraded                  │
│                                     │
│  Recommendations:                   │
│  • Wait for cooldown (45s)          │
│  • Check error logs                 │
│  • Review system health             │
└─────────────────────────────────────┘
```

## 📈 Gráfico de Recuperação

```
Taxa de Erro (%)
  30│                    ╭─╮
    │                    │ │
  25│                  ╭─╯ │
    │                  │   │
  20│                ╭─╯   │
    │              ╭─╯     │
  15│            ╭─╯       │
    │          ╭─╯         │
  10│        ╭─╯           ╰─╮
    │      ╭─╯                ╰─╮
   5│    ╭─╯                    ╰─╮
    │  ╭─╯                        ╰─╮
   0│──╯                            ╰──────
    └────────────────────────────────────►
     0s  30s  60s  90s 120s 150s 180s  Tempo

     │    │    │    │    │
     │    │    │    │    └─ Sistema recuperado
     │    │    │    └────── Half-open (testando)
     │    │    └─────────── Partial recovery
     │    └──────────────── Circuit breaker abre
     └───────────────────── Erros começam
```

## 🔔 Alertas Visuais

### Alerta de Degradação
```
┌────────────────────────────────────────┐
│  ⚠️  MIDDLEWARE DEGRADADO              │
├────────────────────────────────────────┤
│  O sistema está em modo fallback       │
│                                        │
│  Motivo: High error rate (12%)         │
│                                        │
│  Ações:                                │
│  • Monitorar recuperação               │
│  • Verificar logs                      │
│  • [Ver Dashboard →]                   │
└────────────────────────────────────────┘
```

### Alerta Crítico
```
┌────────────────────────────────────────┐
│  ❌  CIRCUIT BREAKER ABERTO            │
├────────────────────────────────────────┤
│  Personalização desabilitada           │
│                                        │
│  Motivo: 5 erros consecutivos          │
│  Cooldown: 45 segundos restantes       │
│                                        │
│  Ações:                                │
│  • Aguardar cooldown                   │
│  • Verificar causa raiz                │
│  • [Ver Dashboard →]                   │
└────────────────────────────────────────┘
```

## 🎨 Widget de Status (Dev)

```
┌─────────────────────────────────┐
│  ✓ Middleware: Active           │
│  Persona: price-conscious (85%) │
│  Strategy: personalized         │
│  Latency: 75ms                  │
│                                 │
│  Click to expand ▶              │
└─────────────────────────────────┘
```

### Expandido
```
┌─────────────────────────────────┐
│  ✓ Middleware: Active           │
│  Persona: price-conscious (85%) │
│  Strategy: personalized         │
│  Latency: 75ms                  │
│                                 │
│  ─────────────────────────────  │
│  Health: healthy                │
│  Circuit: closed                │
│  Requests: 1,234                │
│  Error Rate: 0.97%              │
│  Uptime: 99.5%                  │
│                                 │
│  Click to collapse ▼            │
└─────────────────────────────────┘
```

## 📱 Métricas em Tempo Real

```
┌─────────────────────────────────┐
│  Requests:        1,234         │
│  Errors:             12         │
│  Error Rate:      0.97%         │
│  Latency:          75ms         │
│  Uptime:         99.5%          │
└─────────────────────────────────┘
```

## 🎯 Legenda de Cores

```
✅ Verde   = Saudável / Ativo
⚠️ Amarelo = Degradado / Atenção
❌ Vermelho = Crítico / Erro
🔵 Azul    = Informação
⚪ Cinza   = Desabilitado
```

## 📊 Linha do Tempo de Recuperação

```
0s ──────► 30s ──────► 60s ──────► 90s
│           │           │           │
│           │           │           └─ Sistema normal
│           │           └───────────── Circuit fechado
│           └───────────────────────── Half-open
└───────────────────────────────────── Circuit abre

Eventos:
• 0s:  5 erros consecutivos → Circuit abre
• 30s: Partial recovery → Half-open
• 60s: 3 sucessos → Circuit fecha
• 90s: Sistema totalmente recuperado
```

---

**Dica**: Use o dashboard em `/admin/middleware-dashboard` para visualização em tempo real!
