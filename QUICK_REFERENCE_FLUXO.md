# ⚡ Referência Rápida - Fluxo de Assinatura

## 🎯 TL;DR

**O que mudou:** Fluxo agora trabalha apenas com lentes mensais e redireciona usuários sem receita para agendamento.

**Arquivos modificados:** 3  
**Novos arquivos de documentação:** 5  
**Status:** ✅ Pronto para testes

---

## 📁 Arquivos

### Código
```
src/components/subscription/LensSelector.tsx       ✏️ MODIFICADO
src/components/subscription/SubscriptionFlow.tsx   ✏️ MODIFICADO
src/data/pricing-plans.ts                          ✏️ MODIFICADO
```

### Documentação
```
SUBSCRIPTION_FLOW_MONTHLY_ONLY.md    📘 Documentação completa
TESTE_FLUXO_MENSAL.md               🧪 Guia de testes
RESUMO_MUDANCAS_FLUXO.md            📊 Resumo visual
EXEMPLOS_CODIGO_FLUXO.md            💻 Exemplos de código
QUICK_REFERENCE_FLUXO.md            ⚡ Este arquivo
```

---

## 🚀 Comandos Rápidos

```bash
# Iniciar servidor
npm run dev

# Testar fluxo
# Abrir: http://localhost:3000/assinar

# Verificar tipos
npm run type-check

# Build de produção
npm run build
```

---

## 🎨 3 Opções de Status

| # | Opção | Ação | Destino |
|---|-------|------|---------|
| 1 | Já uso lentes e sei meu grau | Continuar | Próxima etapa |
| 2 | Não uso lentes de contato | Redirecionar | `/agendar-consulta` |
| 3 | Uso lentes mas não sei grau | Redirecionar | `/agendar-consulta` |

---

## 🔄 Fluxo Simplificado

```
Plano → Status → [Receita OU Agendamento] → Finalizar
```

**Com receita:**
```
Plano → "Já uso lentes" → Preencher dados → Add-ons → Pagamento
```

**Sem receita:**
```
Plano → "Não uso/Não sei" → Agendamento → [Retorna após consulta]
```

---

## 💡 Pontos-Chave

### ✅ Fazer
- Trabalhar apenas com lentes mensais
- Redirecionar usuários sem receita
- Mostrar formulário apenas para quem tem receita
- Validar campos obrigatórios

### ❌ Não Fazer
- Oferecer lentes diárias ou semanais
- Mostrar formulário sem seleção de status
- Permitir continuar sem dados válidos
- Bloquear redirecionamento

---

## 🧪 Teste Rápido (5 min)

### Cenário 1: Com Receita
1. Acessar `/assinar`
2. Escolher plano
3. Selecionar "Já uso lentes e sei meu grau"
4. Preencher dados
5. Clicar "Continuar"
✅ Deve avançar para próxima etapa

### Cenário 2: Sem Receita
1. Acessar `/assinar`
2. Escolher plano
3. Selecionar "Não uso lentes"
✅ Deve redirecionar para `/agendar-consulta`

---

## 🐛 Troubleshooting

### Problema: Redirecionamento não funciona
```bash
# Verificar se página existe
curl http://localhost:3000/agendar-consulta
# Deve retornar 200
```

### Problema: Formulário não aparece
```typescript
// Verificar estado
console.log(lensData.userStatus)
// Deve ser 'has-prescription'
```

### Problema: Validação não funciona
```typescript
// Verificar campos obrigatórios
console.log({
    brand: lensData.brand,
    rightSphere: lensData.rightEye.sphere,
    leftSphere: lensData.leftEye.sphere
})
// Todos devem ter valor
```

---

## 📊 Estrutura de Dados

```typescript
{
    type: 'monthly',  // Fixo
    brand: 'Acuvue',
    userStatus: 'has-prescription',
    rightEye: {
        sphere: '-2.00',
        cylinder: '-0.75',
        axis: '180'
    },
    leftEye: {
        sphere: '-2.25',
        cylinder: '-0.50',
        axis: '90'
    }
}
```

---

## 🎯 Props do LensSelector

```typescript
interface LensSelectorProps {
    onContinue: (data: LensData) => void
    onBack: () => void
    onScheduleConsultation: () => void  // ✨ NOVO
}
```

---

## 📱 Responsividade

### Desktop (≥768px)
- Cards lado a lado
- Formulário em grid 3 colunas

### Mobile (<768px)
- Cards empilhados
- Formulário em coluna única

---

## 🔍 Validações

### Obrigatórios
- ✅ Status do usuário
- ✅ Esférico (ambos os olhos)

### Opcionais
- Marca
- Cilíndrico
- Eixo

---

## 📈 Métricas

### Eventos para Trackear
```typescript
// Seleção de status
'user_status_selected'

// Redirecionamento
'consultation_redirect'

// Preenchimento de formulário
'prescription_form_completed'

// Continuação do fluxo
'lens_selection_completed'
```

---

## 🔗 Links Úteis

### Documentação
- [Completa](./SUBSCRIPTION_FLOW_MONTHLY_ONLY.md)
- [Testes](./TESTE_FLUXO_MENSAL.md)
- [Exemplos](./EXEMPLOS_CODIGO_FLUXO.md)

### Páginas
- Fluxo: `/assinar`
- Agendamento: `/agendar-consulta`
- Confirmação: `/agendamento-confirmado`

---

## ⚙️ Configuração

### Delay de Redirecionamento
```typescript
setTimeout(() => {
    onScheduleConsultation()
}, 500)  // 500ms para feedback visual
```

### Validação de Formulário
```typescript
const isValid = () => {
    return (
        lensData.brand &&
        lensData.rightEye.sphere &&
        lensData.leftEye.sphere
    )
}
```

---

## 🎨 Classes CSS Principais

```css
/* Card selecionado */
.border-primary-600.bg-primary-50

/* Card normal */
.border-gray-200.hover:border-gray-300

/* Caixa informativa */
.bg-primary-50.border-primary-200

/* Botão primário */
.bg-primary-600.text-white

/* Botão secundário */
.border-gray-300.text-gray-700
```

---

## 🔐 Segurança

### Validação Client-Side
```typescript
// Validar formato de grau
const isValidSphere = (value: string) => {
    const num = parseFloat(value)
    return !isNaN(num) && num >= -20 && num <= 20
}
```

### Validação Server-Side
```typescript
// API deve revalidar todos os dados
// Nunca confiar apenas no client
```

---

## 🌐 Internacionalização

### Textos em Português
```typescript
const texts = {
    title: 'Qual é a sua situação?',
    subtitle: 'Selecione a opção que melhor descreve você',
    options: {
        hasPrescription: 'Já uso lentes e sei meu grau',
        noLenses: 'Não uso lentes de contato',
        noPrescription: 'Uso lentes mas não sei meu grau'
    },
    buttons: {
        back: 'Voltar',
        continue: 'Continuar',
        schedule: 'Agendar Consulta'
    }
}
```

---

## 📞 Suporte

### Dúvidas Técnicas
- Consultar documentação completa
- Verificar exemplos de código
- Revisar testes

### Bugs
- Reportar com prints
- Incluir passos para reproduzir
- Informar navegador e SO

### Melhorias
- Sugerir via issue
- Documentar caso de uso
- Propor solução

---

## ✅ Checklist Rápido

Antes de fazer commit:
- [ ] Código compila sem erros
- [ ] Testes passam
- [ ] Tipos TypeScript corretos
- [ ] Responsivo funciona
- [ ] Redirecionamento funciona
- [ ] Validação funciona
- [ ] Sem erros no console

Antes de deploy:
- [ ] Testado em dev
- [ ] Testado em staging
- [ ] Analytics configurado
- [ ] Documentação atualizada
- [ ] Equipe informada

---

## 🎓 Conceitos-Chave

### Renderização Condicional
```typescript
{showPrescriptionForm && <PrescriptionForm />}
```

### Estado Derivado
```typescript
const showPrescriptionForm = lensData.userStatus === 'has-prescription'
```

### Callbacks
```typescript
const handleStatusSelect = useCallback((status) => {
    // ...
}, [dependencies])
```

---

## 🚦 Status do Projeto

| Item | Status |
|------|--------|
| Código | ✅ Implementado |
| Testes | ⏳ Pendente |
| Documentação | ✅ Completa |
| Deploy | ⏳ Pendente |

---

## 📅 Histórico

| Data | Versão | Mudança |
|------|--------|---------|
| 10/06/2025 | 2.0.0 | Lentes mensais apenas + redirecionamento |
| 01/01/2025 | 1.0.0 | Versão inicial |

---

## 🎯 Próximos Passos

1. ✅ Implementação → **CONCLUÍDO**
2. ⏳ Testes → **PRÓXIMO**
3. ⏳ Analytics
4. ⏳ Deploy staging
5. ⏳ Deploy produção

---

**Versão:** 2.0.0  
**Data:** 10/06/2025  
**Status:** ✅ Pronto para testes

---

## 💬 FAQ Rápido

**P: Por que apenas lentes mensais?**  
R: Melhor custo-benefício, mais sustentável, simplifica estoque.

**P: O que acontece com usuários sem receita?**  
R: São redirecionados para `/agendar-consulta` automaticamente.

**P: Posso adicionar outros tipos de lente depois?**  
R: Sim, mas requer mudanças na interface e lógica de negócio.

**P: Como testar o redirecionamento?**  
R: Selecione "Não uso lentes" ou "Não sei meu grau" no fluxo.

**P: Onde está a validação?**  
R: Client-side no componente + server-side na API.

---

**Fim da Referência Rápida** 🎉
