# 🧪 Guia de Teste - Site LAAS

## 🚀 Como Testar o Site

### 1. Iniciar o Servidor Local
```bash
npm run dev
```
Acesse: http://localhost:3000

### 2. ✅ Checklist de Testes

#### Navegação Principal
- [ ] Clique em "Planos" no menu → deve ir para seção de preços
- [ ] Clique em "Como Funciona" → deve ir para seção explicativa  
- [ ] Clique em "FAQ" → deve ir para perguntas frequentes
- [ ] Clique em "Contato" → deve ir para seção final
- [ ] Logo "SV Lentes" → deve voltar ao topo

#### Calculadora de Economia
- [ ] Preencha nome, WhatsApp e email
- [ ] Selecione tipo de lente (diária/semanal/mensal)
- [ ] Escolha frequência de uso
- [ ] Marque checkbox LGPD
- [ ] Clique "Calcular Minha Economia"
- [ ] Verifique se mostra resultado com economia anual
- [ ] Teste botões "Agendar Consulta" e "Conversar no WhatsApp"

#### FAQ (Perguntas Frequentes)
- [ ] Clique em cada pergunta para expandir
- [ ] Verifique se todas as respostas aparecem
- [ ] Teste botão "Falar no WhatsApp" no final da seção
- [ ] Confirme que usa número correto: +55 11 94703-8078

#### Serviços Adicionais
- [ ] Marque/desmarque checkboxes dos serviços
- [ ] Verifique se total é calculado automaticamente
- [ ] Teste "Adicionar aos Planos" 
- [ ] Teste "Falar no WhatsApp" com serviços selecionados

#### Links do WhatsApp
- [ ] Botão "Agendar Consulta" no header
- [ ] WhatsApp flutuante (canto inferior direito)
- [ ] Links em seções FAQ, Calculadora, etc.
- [ ] Confirme que todos usam: +55 11 94703-8078

#### Páginas Institucionais
- [ ] Acesse /termos-uso → deve carregar página completa
- [ ] Verifique dados: CRM 69.870, endereço Rua Joaquim Floriano, 466
- [ ] Teste links para política de privacidade

#### Banner de Cookies (LGPD)
- [ ] Deve aparecer na primeira visita
- [ ] Teste "Personalizar" → deve mostrar opções detalhadas
- [ ] Teste "Aceitar Todos" e "Rejeitar Opcionais"
- [ ] Verifique se banner desaparece após escolha

### 3. 📱 Teste Mobile

#### Responsividade
- [ ] Abra DevTools (F12) → modo mobile
- [ ] Teste menu hambúrguer no mobile
- [ ] Verifique se calculadora funciona em tela pequena
- [ ] Confirme que FAQ expande corretamente
- [ ] Teste WhatsApp flutuante no mobile

### 4. 🔍 Verificações Técnicas

#### Performance
```bash
npm run lighthouse
```
- [ ] Score > 90 em Performance
- [ ] Score > 95 em Acessibilidade  
- [ ] Score > 90 em SEO

#### Console do Navegador
- [ ] Abra DevTools → Console
- [ ] Não deve ter erros vermelhos críticos
- [ ] Warnings são aceitáveis

### 5. 🎯 Fluxo de Conversão Completo

#### Jornada do Usuário
1. [ ] Usuário chega na página inicial
2. [ ] Lê benefícios e informações do Dr. Philipe
3. [ ] Usa calculadora de economia
4. [ ] Vê resultado positivo de economia
5. [ ] Clica "Agendar Consulta" ou "WhatsApp"
6. [ ] É redirecionado para WhatsApp com mensagem contextual

#### Pontos de Conversão
- [ ] Header: "Agendar Consulta"
- [ ] Calculadora: "Agendar Consulta Gratuita"  
- [ ] FAQ: "Falar no WhatsApp"
- [ ] WhatsApp flutuante: sempre visível
- [ ] Seção final: CTA principal

### 6. 🐛 Problemas Conhecidos (Resolvidos)

#### ✅ Corrigidos
- ~~ChunkLoadError~~ → Resolvido
- ~~Links não funcionavam~~ → Navegação suave implementada
- ~~Calculadora inativa~~ → Totalmente funcional
- ~~FAQ não carregava~~ → Accordion funcional
- ~~Dados fictícios~~ → Dados reais implementados
- ~~WhatsApp número errado~~ → Número correto em todo site

### 7. 📞 Dados de Contato Corretos

Confirme que aparecem em todo o site:
- **CRM**: 69.870 (não 65.870)
- **WhatsApp**: +55 11 94703-8078
- **Endereço**: Rua Joaquim Floriano, 466 - Itaim Bibi, São Paulo, SP
- **Email**: contato@svlentes.shop

### 8. 🚨 O que Reportar

Se encontrar problemas, reporte com:
- **URL** onde ocorreu
- **Ação** que estava fazendo
- **Erro** exato (screenshot se possível)
- **Dispositivo** (desktop/mobile)
- **Navegador** (Chrome, Safari, etc.)

### 9. ✅ Critérios de Aprovação

O site está pronto quando:
- [ ] Todas as navegações funcionam
- [ ] Calculadora processa e mostra resultados
- [ ] FAQ expande/colapsa corretamente
- [ ] WhatsApp redireciona com número correto
- [ ] Dados do médico estão corretos (CRM 69.870)
- [ ] Site é responsivo em mobile
- [ ] Performance Lighthouse > 90

---

## 🎉 Site Aprovado!

Quando todos os testes passarem, o site está pronto para:
- Deploy em produção
- Campanhas de marketing
- Captura de leads reais
- Conversões efetivas

**Contato para suporte técnico**: Através do próprio WhatsApp do site! 😉