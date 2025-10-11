# ⚡ Quick Start - Começar Agora

## 🚀 Iniciar em 3 Passos

### 1. Configurar Ambiente

```bash
# Copiar variáveis de ambiente
cp .env.example .env.local

# Editar .env.local e adicionar sua API key
# NEXT_PUBLIC_ASAAS_API_KEY=sua_chave_aqui
```

### 2. Iniciar Servidor

```bash
npm run dev
```

### 3. Testar

```
Fluxo de Assinatura: http://localhost:3000/assinar
Agendamento: http://localhost:3000/agendar-consulta
```

---

## 📚 Documentação Rápida

### Fluxo de Assinatura

**Ler primeiro:**
- `QUICK_REFERENCE_FLUXO.md` - Referência rápida (5 min)

**Para entender melhor:**
- `SUBSCRIPTION_FLOW_MONTHLY_ONLY.md` - Documentação completa (15 min)

**Para testar:**
- `TESTE_FLUXO_MENSAL.md` - Guia de testes (10 min)

### Chamadas Diretas à API

**Ler primeiro:**
- `DIRECT_API_IMPLEMENTATION_SUMMARY.md` - Resumo (5 min)

**Para implementar:**
- `DIRECT_API_CALLS_GUIDE.md` - Guia completo (20 min)

**Para migrar:**
- `MIGRATION_EXAMPLE.md` - Exemplo prático (10 min)

---

## 💻 Código Rápido

### Usar Fluxo de Assinatura

```typescript
// Já está pronto!
// Apenas acesse: /assinar
```

### Usar Chamadas Diretas

```typescript
import { asaasClient } from '@/lib/asaas-client'

// Criar cliente
const customer = await asaasClient.createCustomer({
    name: 'João Silva',
    email: 'joao@example.com',
    cpfCnpj: '12345678900',
    mobilePhone: '11999999999'
})

// Criar assinatura
const subscription = await asaasClient.createSubscription({
    customer: customer.id,
    billingType: 'PIX',
    value: 149.90,
    nextDueDate: '2025-06-17',
    cycle: 'MONTHLY'
})
```

---

## 🧪 Testar Rapidamente

### Fluxo de Assinatura (2 min)

```
1. Abrir: http://localhost:3000/assinar
2. Escolher plano
3. Selecionar "Não uso lentes de contato"
✅ Deve redirecionar para /agendar-consulta
```

### Chamadas Diretas (2 min)

```javascript
// No console do navegador
import { asaasClient } from '@/lib/asaas-client'

console.log('Configurado:', asaasClient.isConfigured())
console.log('Ambiente:', asaasClient.getEnvironment())
```

---

## 🐛 Problemas Comuns

### Servidor não inicia
```bash
rm -rf .next
npm install
npm run dev
```

### API key não configurada
```bash
# Adicionar ao .env.local
NEXT_PUBLIC_ASAAS_API_KEY=sua_chave
```

### Redirecionamento não funciona
```bash
# Verificar se página existe
curl http://localhost:3000/agendar-consulta
```

---

## 📞 Ajuda Rápida

**Fluxo de Assinatura:**
- `QUICK_REFERENCE_FLUXO.md`

**Chamadas Diretas:**
- `DIRECT_API_CALLS_GUIDE.md`

**Tudo:**
- `COMPLETE_IMPLEMENTATION_SUMMARY.md`

---

## ✅ Checklist Rápido

- [ ] Configurar .env.local
- [ ] Iniciar servidor (npm run dev)
- [ ] Testar fluxo de assinatura
- [ ] Testar chamadas diretas
- [ ] Ler documentação relevante

---

**Tempo total:** ~15 minutos  
**Dificuldade:** Fácil  
**Status:** ✅ Pronto para usar
