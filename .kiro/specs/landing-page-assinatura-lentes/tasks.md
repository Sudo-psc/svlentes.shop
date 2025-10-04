# Plano de Implementação

- [x] 1. Configurar estrutura base do projeto Next.js
  - Inicializar projeto Next.js 14 com App Router
  - Configurar Tailwind CSS para design responsivo
  - Instalar dependências: Stripe, Zod, React Hook Form
  - Configurar estrutura de diretórios conforme wireframe
  - _Requisitos: 1.4, 5.1, 5.2, 5.3_

- [x] 2. Implementar dados estáticos e configurações
  - [x] 2.1 Criar arquivo de dados do Dr. Philipe Saraiva Cruz
    - Definir informações do médico (nome, CRM, foto, credenciais)
    - Implementar dados de confiança (ANVISA, certificações)
    - _Requisitos: 6.1, 6.2_

  - [x] 2.2 Configurar planos de preços e dados estáticos
    - Implementar estrutura de planos mensais e anuais
    - Definir dados de FAQ, benefícios e add-ons
    - Criar dados de indicadores de confiança
    - _Requisitos: 2.1, 2.2, 2.3_

  - [x] 2.3 Configurar integração Stripe
    - Configurar chaves de API do Stripe (test/prod)
    - Implementar produtos e preços no Stripe
    - Configurar webhooks básicos
    - _Requisitos: 4.1, 4.2, 4.3_

- [x] 3. Desenvolver componentes de layout base
  - [x] 3.1 Implementar Header/Cabeçalho
    - Criar componente Header com logo LAAS
    - Implementar menu de navegação (Planos, Como Funciona, FAQ, Contato)
    - Adicionar CTA "Agendar Consulta" destacado
    - Implementar versão responsiva para mobile
    - _Requisitos: 1.1, 5.1, 5.2_

  - [x] 3.2 Implementar Footer
    - Criar footer com informações legais e CRM do médico
    - Adicionar links de políticas e termos
    - Implementar selo de "atendimento Brasil"
    - _Requisitos: 8.1, 8.2_

  - [x] 3.3 Criar componente WhatsApp flutuante
    - Implementar botão flutuante para mobile
    - Configurar redirecionamento contextual para WhatsApp
    - Adicionar lógica de mensagens pré-preenchidas
    - _Requisitos: 3.1, 6.3_

- [x] 4. Desenvolver Hero Section
  - [x] 4.1 Implementar layout principal do Hero
    - Criar layout em Z (desktop) com herói à esquerda
    - Adicionar selo "Pioneiro no Brasil"
    - Implementar headline "Nunca mais fique sem lentes"
    - Adicionar CTAs duplos (Agendar + WhatsApp)
    - _Requisitos: 1.1, 1.2, 3.1_

  - [x] 4.2 Criar card do médico
    - Implementar card com foto do Dr. Philipe
    - Adicionar informações de credenciais e CRM
    - Integrar indicadores de confiança
    - _Requisitos: 6.1, 6.2_

  - [x] 4.3 Desenvolver formulário de captação de leads
    - Criar formulário com campos: nome, WhatsApp, email
    - Implementar validação com Zod
    - Adicionar checkbox de consentimento LGPD
    - Integrar botão "Calcule sua economia"
    - _Requisitos: 3.2, 3.3, 8.3_

  - [x] 4.4 Implementar testes do Hero Section
    - Criar testes unitários para componentes do Hero
    - Testar validação do formulário de leads
    - _Requisitos: 1.1, 3.2_

- [x] 5. Implementar calculadora de economia
  - [x] 5.1 Desenvolver lógica de cálculo
    - Criar função para calcular economia baseada em uso
    - Implementar comparação entre compra avulsa vs assinatura
    - Adicionar diferentes cenários (diário, semanal, mensal)
    - _Requisitos: 2.2, 2.3_

  - [x] 5.2 Criar interface da calculadora
    - Implementar formulário de entrada de dados
    - Adicionar visualização de resultados
    - Integrar com dados de leads capturados
    - _Requisitos: 3.2, 3.3_

- [x] 6. Desenvolver seção Problema-Solução
  - [x] 6.1 Implementar layout de colunas
    - Criar layout lado a lado para dores vs soluções
    - Adicionar bullet points com ícones
    - Implementar CTA contextual "Fale com um especialista"
    - _Requisitos: 1.2, 6.3_

  - [x] 6.2 Criar testes da seção Problema-Solução
    - Testar renderização de problemas e soluções
    - Validar funcionamento do CTA contextual
    - _Requisitos: 1.2_

- [x] 7. Implementar seção Como Funciona
  - [x] 7.1 Criar sistema de abas Mensal/Anual
    - Implementar componente de abas interativo
    - Adicionar transições suaves entre conteúdos
    - _Requisitos: 1.2, 2.1_

  - [x] 7.2 Desenvolver cards de etapas
    - Criar cards com numeração, título e descrição
    - Adicionar informações de custo e economia
    - Implementar timeline visual do processo
    - _Requisitos: 1.2, 6.1_

- [x] 8. Desenvolver seção de Planos e Preços
  - [x] 8.1 Implementar tabela comparativa
    - Criar tabela responsiva com comparação de planos
    - Adicionar sistema de abas Mensal/Anual
    - Destacar plano recomendado visualmente
    - _Requisitos: 2.1, 2.2, 2.3_

  - [x] 8.2 Integrar botões de ação
    - Conectar botões "Assinar" com Stripe Checkout
    - Implementar botões "Agendar" para consulta
    - Adicionar tracking de seleção de planos
    - _Requisitos: 4.1, 4.4, 7.1_

  - [x] 8.3 Criar testes da seção de preços
    - Testar alternância entre abas
    - Validar cálculos de preços
    - _Requisitos: 2.1, 2.2_

- [x] 9. Implementar Programa de Indicação
  - [x] 9.1 Criar cards do programa
    - Implementar card principal com benefícios
    - Adicionar card secundário com regras
    - Definir sistema de referral claro
    - _Requisitos: 1.2_

- [x] 10. Desenvolver seção de Add-ons
  - [x] 10.1 Implementar serviços adicionais
    - Criar chips/cards para consulta, teleorientação, seguro, VIP
    - Adicionar descrições e preços dos add-ons
    - Implementar seleção múltipla de serviços
    - _Requisitos: 2.1, 3.2_

- [x] 11. Implementar seção FAQ
  - [x] 11.1 Criar acordeões numerados
    - Implementar componente de accordion responsivo
    - Adicionar 4-6 perguntas principais
    - Configurar structured data para SEO
    - _Requisitos: 6.4, 8.2_

- [x] 12. Desenvolver CTA Final
  - [x] 12.1 Implementar seção de conversão final
    - Criar reforço de valor com bullets de benefícios
    - Adicionar CTAs duplos (Agendar + WhatsApp)
    - Implementar formulário curto para mobile
    - _Requisitos: 3.1, 1.2_

- [x] 13. Implementar APIs e integrações
  - [x] 13.1 Criar API de checkout Stripe
    - Implementar endpoint para criar sessão de checkout
    - Configurar produtos e preços dinâmicos
    - Adicionar validação de dados do formulário
    - _Requisitos: 4.1, 4.2, 4.3_

  - [x] 13.2 Implementar webhooks do Stripe
    - Criar endpoint para receber eventos do Stripe
    - Processar eventos de pagamento e assinatura
    - Implementar logging de transações
    - _Requisitos: 4.4, 4.5_

  - [x] 13.3 Criar API de redirecionamento WhatsApp
    - Implementar endpoint para gerar links contextuais
    - Adicionar dados do usuário às mensagens
    - Configurar diferentes contextos de redirecionamento
    - _Requisitos: 3.1, 6.3_

- [x] 14. Implementar páginas de fluxo de conversão
  - [x] 14.1 Criar página de agendamento
    - Implementar formulário completo de agendamento
    - Adicionar validação de dados pessoais e prescrição
    - Integrar com sistema de agendamento
    - _Requisitos: 3.2, 3.3, 6.1_

  - [x] 14.2 Desenvolver páginas de checkout
    - Criar página de sucesso pós-pagamento
    - Implementar página de cancelamento
    - Adicionar confirmações e próximos passos
    - _Requisitos: 4.4, 4.5_

- [x] 15. Implementar analytics e tracking
  - [x] 15.1 Configurar Google Analytics 4
    - Instalar GA4 com eventos customizados
    - Implementar tracking de funil de conversão
    - Adicionar eventos para cada CTA e seção
    - _Requisitos: 7.1, 7.2_

  - [x] 15.2 Integrar tracking de conversão
    - Implementar eventos de lead capture
    - Adicionar tracking de seleção de planos
    - Configurar métricas de abandono por etapa
    - _Requisitos: 7.1, 7.3_

- [x] 16. Otimizar SEO e performance
  - [x] 16.1 Implementar SEO técnico
    - Configurar metadata dinâmica para todas as páginas
    - Adicionar structured data para negócio médico
    - Implementar sitemap e robots.txt
    - _Requisitos: 1.4_

  - [x] 16.2 Otimizar performance
    - Implementar lazy loading para seções abaixo do fold
    - Otimizar imagens com Next.js Image component
    - Configurar caching adequado
    - _Requisitos: 1.4, 5.4_

- [x] 17. Implementar conformidade LGPD
  - [x] 17.1 Criar sistema de consentimento
    - Implementar banner de cookies
    - Adicionar política de privacidade
    - Criar sistema de opt-in para marketing
    - _Requisitos: 8.1, 8.2, 8.3_

  - [x] 17.2 Implementar controle de dados
    - Criar processo para exclusão de dados
    - Adicionar transparência no uso de dados
    - Implementar logs de consentimento
    - _Requisitos: 8.4_

- [x] 18. Testes finais e deploy
  - [x] 18.1 Realizar testes de integração
    - Testar fluxo completo de conversão
    - Validar integração Stripe em ambiente de teste
    - Testar responsividade em diferentes dispositivos
    - _Requisitos: 5.1, 5.2, 5.3_

  - [x] 18.2 Implementar testes E2E
    - Criar testes automatizados com Playwright
    - Testar jornada completa do usuário
    - Validar formulários e integrações
    - _Requisitos: 3.3, 4.3_

  - [x] 18.3 Configurar deploy e monitoramento
    - Configurar deploy na Vercel
    - Implementar monitoramento de erros
    - Configurar alertas de performance
    - _Requisitos: 1.4, 7.4_