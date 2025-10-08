# Guia de Teste - Fluxo de Assinatura (Lentes Mensais)

## 🚀 Como Testar

### 1. Iniciar o Servidor

```bash
npm run dev
```

Aguarde a mensagem: `Ready on http://localhost:3000`

### 2. Acessar o Fluxo de Assinatura

Abra no navegador: **http://localhost:3000/assinar**

---

## ✅ Cenários de Teste

### Cenário 1: Usuário com Receita (Fluxo Completo)

**Objetivo:** Testar o fluxo normal de assinatura

1. **Passo 1 - Seleção de Plano**
   - Escolha qualquer plano (Basic, Premium ou VIP)
   - Clique em "Continuar"

2. **Passo 2 - Status do Usuário**
   - Selecione: **"Já uso lentes e sei meu grau"**
   - ✅ Deve aparecer:
     - Caixa azul informando sobre lentes mensais
     - Seleção de marca (opcional)
     - Formulário de prescrição (OD e OE)

3. **Passo 3 - Preencher Dados**
   - Selecione uma marca (ex: Acuvue)
   - Preencha grau do olho direito:
     - Esférico: -2.00
     - Cilíndrico: -0.75
     - Eixo: 180
   - Preencha grau do olho esquerdo (ou use "Mesmo grau para ambos")

4. **Passo 4 - Continuar**
   - Clique em "Continuar"
   - ✅ Deve avançar para próxima etapa (Add-ons)

**Resultado Esperado:** ✅ Fluxo completo sem redirecionamento

---

### Cenário 2: Usuário Sem Lentes (Redirecionamento)

**Objetivo:** Testar redirecionamento para agendamento

1. **Passo 1 - Seleção de Plano**
   - Escolha qualquer plano
   - Clique em "Continuar"

2. **Passo 2 - Status do Usuário**
   - Selecione: **"Não uso lentes de contato"**
   - ✅ Deve acontecer:
     - Opção fica destacada em azul
     - Após 0.5 segundos, redirecionamento automático

3. **Passo 3 - Página de Agendamento**
   - ✅ URL deve ser: `/agendar-consulta`
   - ✅ Deve mostrar formulário de agendamento
   - ✅ Título: "Agendar Consulta"

**Resultado Esperado:** ✅ Redirecionamento automático para agendamento

---

### Cenário 3: Usuário Sem Receita (Redirecionamento)

**Objetivo:** Testar redirecionamento para atualização de receita

1. **Passo 1 - Seleção de Plano**
   - Escolha qualquer plano
   - Clique em "Continuar"

2. **Passo 2 - Status do Usuário**
   - Selecione: **"Uso lentes mas não sei meu grau"**
   - ✅ Deve acontecer:
     - Opção fica destacada em azul
     - Após 0.5 segundos, redirecionamento automático

3. **Passo 3 - Página de Agendamento**
   - ✅ URL deve ser: `/agendar-consulta`
   - ✅ Deve mostrar formulário de agendamento

**Resultado Esperado:** ✅ Redirecionamento automático para agendamento

---

## 🎨 Validações Visuais

### Informação sobre Lentes Mensais
Quando selecionar "Já uso lentes e sei meu grau", deve aparecer:

```
┌─────────────────────────────────────────────────┐
│ ℹ️ Lentes de Troca Mensal                       │
│                                                  │
│ Nosso serviço trabalha exclusivamente com       │
│ lentes de troca mensal, que oferecem o melhor   │
│ custo-benefício e são mais sustentáveis.        │
└─────────────────────────────────────────────────┘
```

### Opções de Status
Devem aparecer 3 cards clicáveis:

```
┌─────────────────────────────────────────────────┐
│ ✓ Já uso lentes e sei meu grau                 │
│   Tenho minha receita em mãos                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│   Não uso lentes de contato                     │
│   Preciso de avaliação médica                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│   Uso lentes mas não sei meu grau               │
│   Preciso atualizar minha receita               │
└─────────────────────────────────────────────────┘
```

### Botões de Ação
- **Com receita:** Botão "Continuar" (azul)
- **Sem receita:** Botão "Agendar Consulta" (azul)

---

## 🐛 Checklist de Bugs

Verifique se NÃO acontece:

- [ ] Opções de lentes diárias ou semanais aparecem
- [ ] Formulário de prescrição aparece sem selecionar status
- [ ] Redirecionamento não funciona
- [ ] Botão "Continuar" fica habilitado sem preencher dados
- [ ] Erro de TypeScript no console
- [ ] Layout quebrado no mobile

---

## 📱 Teste Mobile

1. Abra as DevTools (F12)
2. Ative o modo responsivo (Ctrl+Shift+M)
3. Teste em diferentes tamanhos:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)

**Validar:**
- ✅ Cards de opção empilham verticalmente
- ✅ Formulário de prescrição fica legível
- ✅ Botões ficam acessíveis
- ✅ Texto não ultrapassa os limites

---

## 🔍 Console do Navegador

Abra o Console (F12) e verifique:

**Não deve ter:**
- ❌ Erros em vermelho
- ❌ Warnings de TypeScript
- ❌ Erros de componente não encontrado

**Pode ter:**
- ✅ Logs de desenvolvimento do Next.js
- ✅ Mensagens de hot reload

---

## 📊 Dados de Teste

Use estes dados para preencher o formulário:

### Prescrição de Exemplo
**Olho Direito (OD):**
- Esférico: -2.00
- Cilíndrico: -0.75
- Eixo: 180

**Olho Esquerdo (OE):**
- Esférico: -2.25
- Cilíndrico: -0.50
- Eixo: 90

### Marcas para Testar
- Acuvue
- Biofinity
- Air Optix
- Bausch + Lomb
- CooperVision
- Outra marca

---

## ✅ Critérios de Sucesso

O teste está OK se:

1. ✅ Apenas lentes mensais são mencionadas
2. ✅ 3 opções de status aparecem claramente
3. ✅ Redirecionamento funciona para opções 2 e 3
4. ✅ Formulário aparece apenas para opção 1
5. ✅ Validação impede continuar sem dados
6. ✅ Layout responsivo funciona
7. ✅ Sem erros no console

---

## 🆘 Problemas Comuns

### Problema: Página não carrega
**Solução:**
```bash
# Limpar cache e reiniciar
rm -rf .next
npm run dev
```

### Problema: Redirecionamento não funciona
**Solução:**
- Verifique se a página `/agendar-consulta` existe
- Abra: http://localhost:3000/agendar-consulta
- Deve carregar sem erro 404

### Problema: Formulário não valida
**Solução:**
- Preencha todos os campos obrigatórios
- Esférico é obrigatório para ambos os olhos
- Marca pode ser opcional

### Problema: Erro de TypeScript
**Solução:**
```bash
# Verificar tipos
npm run type-check

# Se houver erro, executar
npm run build
```

---

## 📝 Relatório de Teste

Após testar, preencha:

```
Data: ___/___/2025
Testador: _______________

Cenário 1 (Com receita):     [ ] OK  [ ] Falhou
Cenário 2 (Sem lentes):      [ ] OK  [ ] Falhou
Cenário 3 (Sem receita):     [ ] OK  [ ] Falhou

Mobile (iPhone):             [ ] OK  [ ] Falhou
Mobile (iPad):               [ ] OK  [ ] Falhou

Console sem erros:           [ ] OK  [ ] Falhou

Observações:
_________________________________________________
_________________________________________________
_________________________________________________
```

---

## 🎯 Próximos Passos

Após validar os testes:

1. ✅ Testar integração com backend
2. ✅ Adicionar analytics para tracking
3. ✅ Testar fluxo completo até pagamento
4. ✅ Validar emails de confirmação
5. ✅ Testar em produção (staging)

---

**Dúvidas?** Consulte: `SUBSCRIPTION_FLOW_MONTHLY_ONLY.md`
