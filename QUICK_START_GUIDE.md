# 🚀 Guia Rápido - Novo Fluxo de Assinatura

## Como Testar

### 1. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

### 2. Acessar as Novas Páginas

#### Página Principal (com nova seção)
```
http://localhost:3000
```
- Role até a seção "Dois caminhos para começar"
- Veja os 2 cards: "Calcular Economia" e "Assinar Direto"

#### Calculadora Standalone
```
http://localhost:3000/calculadora
```
**Teste:**
1. Selecione o tipo de lente (Diárias, Semanais, Mensais)
2. Mova o slider de gastos
3. Veja o cálculo em tempo real
4. Clique em "Salvar Resultado e Continuar"

#### Fluxo de Assinatura Completo
```
http://localhost:3000/assinar
```

**Teste o fluxo completo:**

##### Etapa 1: Seleção de Plano
- Toggle entre Mensal/Anual
- Clique em um dos 3 planos
- Observe o destaque visual

##### Etapa 2: Configuração de Lentes
- Escolha o tipo (Diárias/Semanais/Mensais)
- Selecione uma marca (opcional)
- Preencha o grau do olho direito
- Use o toggle "Mesmo grau para ambos" ou preencha o esquerdo
- Clique em "Continuar"

##### Etapa 3: Add-ons
- Clique nos cards para selecionar/desselecionar
- Observe o total dinâmico no rodapé
- Veja os badges "Recomendado"
- Clique em "Continuar para Resumo"

##### Etapa 4: Resumo e Finalização
- Revise todos os detalhes
- Preencha nome, WhatsApp e email
- Aceite os termos
- Clique em "Finalizar e Agendar Consulta"

## 🎨 Componentes Disponíveis

### Uso Individual dos Componentes

```tsx
// Calculadora
import { ImprovedCalculator } from '@/components/subscription'

<ImprovedCalculator 
  onSaveResult={(result) => {
    console.log('Economia:', result)
  }}
/>
```

```tsx
// Fluxo Completo
import { SubscriptionFlow } from '@/components/subscription'

<SubscriptionFlow />
```

```tsx
// Componentes Individuais
import { 
  PlanSelector,
  LensSelector,
  AddOnsSelector,
  OrderSummary 
} from '@/components/subscription'

// Use conforme necessário
```

## 📱 Teste de Responsividade

### Desktop (> 1024px)
- Layouts em grid de 2-3 colunas
- Hover states ricos
- Espaçamento generoso

### Tablet (768px - 1024px)
- Layouts em 2 colunas
- Cards adaptados
- Touch-friendly

### Mobile (< 768px)
- Layout em coluna única
- Cards full-width
- CTAs fixos na parte inferior
- Slider otimizado para touch

## 🧪 Cenários de Teste

### Teste 1: Fluxo Completo Feliz
1. Acesse `/assinar`
2. Selecione "Plano Premium" (Mensal)
3. Configure lentes mensais, marca Acuvue
4. Preencha graus: OD -2.00, OE -2.50
5. Adicione "Solução de Limpeza" e "Lágrimas"
6. Preencha dados de contato
7. Finalize

**Resultado esperado:** Redirecionamento para `/agendar-consulta`

### Teste 2: Calculadora → Assinatura
1. Acesse `/calculadora`
2. Selecione "Mensais"
3. Ajuste slider para R$ 150
4. Clique em "Salvar Resultado"
5. Continue no fluxo de assinatura

**Resultado esperado:** Dados salvos no localStorage e redirecionamento

### Teste 3: Navegação com Voltar
1. Acesse `/assinar`
2. Selecione um plano
3. Configure lentes
4. Clique em "Voltar"
5. Mude o plano
6. Continue novamente

**Resultado esperado:** Dados preservados, navegação suave

### Teste 4: Validações
1. Tente avançar sem selecionar plano
2. Tente continuar sem preencher grau
3. Tente finalizar sem aceitar termos

**Resultado esperado:** Botões desabilitados, validação visual

## 🎯 Pontos de Atenção

### Estados dos Botões
- ✅ Habilitado: Azul vibrante
- ❌ Desabilitado: Cinza, cursor not-allowed
- 🔄 Loading: Spinner (a implementar)

### Feedback Visual
- Seleção: Borda azul + background azul claro
- Hover: Elevação + sombra
- Focus: Ring azul para acessibilidade

### Transições
- Todas as transições: 200-300ms
- Easing: ease-out para naturalidade
- Scale em hover: 1.05 (sutil)

## 🐛 Troubleshooting

### Slider não aparece corretamente
**Solução:** Verifique se os estilos CSS foram adicionados em `globals.css`

### Componentes não encontrados
**Solução:** Verifique os imports em `src/components/subscription/index.ts`

### Dados não persistem entre etapas
**Solução:** Verifique o estado em `SubscriptionFlow.tsx`

### Redirecionamento não funciona
**Solução:** Verifique se as rotas `/agendar-consulta` existem

## 🔧 Customização Rápida

### Alterar Cores do Tema
```css
/* src/app/globals.css */
--primary: 214 88% 27%;  /* Azul médico */
```

### Adicionar Novo Add-on
```tsx
// src/components/subscription/AddOnsSelector.tsx
const availableAddOns: AddOn[] = [
  // ... existentes
  {
    id: 'novo-addon',
    name: 'Novo Serviço',
    description: 'Descrição do serviço',
    price: 50,
    icon: '🎁',
    recommended: false
  }
]
```

### Alterar Preços dos Planos
```tsx
// src/data/pricing-plans.ts
export const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    priceMonthly: 99.00,  // Altere aqui
    // ...
  }
]
```

## 📊 Monitoramento

### Console Logs Úteis
O fluxo loga eventos importantes:
- Seleção de plano
- Configuração de lentes
- Seleção de add-ons
- Confirmação final

### LocalStorage
Verifique no DevTools:
```javascript
localStorage.getItem('calculatorResult')
```

## 🎓 Próximos Passos

1. **Integração Backend**
   - Criar endpoint `/api/subscriptions`
   - Salvar dados no banco
   - Enviar emails de confirmação

2. **Pagamento**
   - Integrar Stripe Checkout
   - Configurar webhooks
   - Gerenciar assinaturas

3. **Analytics**
   - Google Analytics events
   - Hotjar para heatmaps
   - Mixpanel para funil

4. **Otimizações**
   - A/B testing
   - Performance monitoring
   - Error tracking (Sentry)

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador
2. Revise os logs do servidor
3. Consulte `SUBSCRIPTION_FLOW_IMPLEMENTATION.md`
4. Verifique os diagnósticos TypeScript

## ✨ Features Implementadas

- ✅ Fluxo de 4 etapas
- ✅ Calculadora com slider
- ✅ Add-ons dinâmicos
- ✅ Resumo completo
- ✅ Validações
- ✅ Responsividade
- ✅ Acessibilidade
- ✅ Progress indicators
- ✅ Navegação bidirecional
- ✅ Feedback visual rico

## 🎉 Pronto para Usar!

O fluxo está completo e pronto para testes. Comece acessando:
- `/calculadora` para a calculadora standalone
- `/assinar` para o fluxo completo
- `/` para ver a nova seção na home
