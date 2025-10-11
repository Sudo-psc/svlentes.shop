# SVlentes - Landing Page

Landing page para assinatura de lentes de contato com acompanhamento médico especializado.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router ✅
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Stripe & Asaas** - Processamento de pagamentos recorrentes
- **Zod** - Validação de schemas
- **React Hook Form** - Gerenciamento de formulários
- **Sistema de Design** - Dark mode, paleta profissional, componentes reutilizáveis ✅

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Stripe (para pagamentos)

## 🛠️ Instalação

1. Clone o repositório
```bash
git clone <repository-url>
cd svlentes-landing-page
```

2. Instale as dependências
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente
```bash
cp .env.local.example .env.local
```

4. Edite o arquivo `.env.local` com suas chaves do Stripe e outras configurações

5. Execute o projeto em desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

6. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js 14
│   ├── page.tsx           # Landing page principal
│   ├── layout.tsx         # Layout raiz com ThemeProvider
│   ├── assinatura/        # Fluxo de assinatura
│   ├── agendar-consulta/  # Agendamento de consulta
│   ├── design-system/     # Demo do sistema de design
│   ├── landing-conversao/ # Landing de conversão
│   ├── sdd-framework/     # Framework SDD
│   ├── calculadora/       # Calculadora de economia
│   └── api/               # API Routes
│       ├── asaas/         # Integração Asaas
│       ├── lead-capture/  # Captura de leads
│       └── webhooks/      # Webhooks Stripe
├── components/
│   ├── ui/                # Componentes base (Button, etc.)
│   ├── theme/             # ThemeProvider, ThemeToggle
│   ├── layout/            # Header, Footer
│   ├── sections/          # Seções da landing page
│   ├── forms/             # Formulários
│   ├── conversion/        # Componentes de conversão
│   ├── sdd/               # Componentes SDD
│   └── trust/             # Elementos de confiança
├── lib/                   # Utilitários e configurações
│   ├── utils.ts           # Funções utilitárias
│   ├── asaas-client.ts    # Cliente Asaas
│   └── stripe.ts          # Cliente Stripe
├── data/                  # Dados estáticos
└── types/                 # Definições TypeScript
```

**Documentação Completa**: Ver [APP_ROUTER_GUIDE.md](./APP_ROUTER_GUIDE.md)

## 🎯 Funcionalidades

### Core
- [x] Estrutura base Next.js 14 com App Router
- [x] Configuração Tailwind CSS
- [x] Tipagem TypeScript completa
- [x] Sistema de Design completo com Dark Mode
- [x] Componentes reutilizáveis (Button, ThemeToggle)
- [x] Paleta de cores profissional (WCAG AAA)

### Landing Pages
- [x] Landing page principal
- [x] Landing de conversão otimizada
- [x] Framework SDD implementado
- [x] Hero Section com formulário de leads
- [x] Seção de planos e preços

### Integrações
- [x] Integração com Stripe
- [x] Integração com Asaas (pagamentos BR)
- [x] WhatsApp Business API
- [x] Webhooks de pagamento

### Features
- [x] Calculadora de economia
- [x] FAQ interativo
- [x] Formulário de agendamento
- [x] Fluxo de assinatura completo
- [x] Páginas de sucesso/cancelamento
- [x] Analytics e tracking
- [x] LGPD compliance
- [x] Performance optimization

## 🔧 Scripts Disponíveis

### Desenvolvimento
- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa linting

### Testes
- `npm run test` - Executa testes unitários
- `npm run test:watch` - Executa testes em watch mode
- `npm run test:e2e` - Executa testes E2E

### Deployment
- `npm run deploy:staging` - Deploy para staging
- `npm run deploy:production` - Deploy para produção

## 🎨 Sistema de Design

O projeto inclui um sistema de design completo com:
- ✅ Dark mode funcional
- ✅ Paleta de cores profissional (Azul Médico, Verde Saúde, Laranja Energia)
- ✅ Componentes reutilizáveis
- ✅ Contraste WCAG AAA
- ✅ Touch-friendly (44px+ targets)
- ✅ Totalmente responsivo

**Ver demo**: `http://localhost:3000/design-system`

**Documentação**:
- [Sistema de Design](./DESIGN_SYSTEM_README.md)
- [Guia Rápido](./DESIGN_SYSTEM_QUICK_GUIDE.md)
- [Exemplos de Código](./DESIGN_SYSTEM_EXAMPLES.md)
- [Guia do App Router](./APP_ROUTER_GUIDE.md)

## 📝 Documentação

**📚 [Índice Completo de Documentação](./DOCUMENTATION_INDEX.md)** - Encontre qualquer guia rapidamente

### Especificações
- `.kiro/specs/landing-page-assinatura-lentes/requirements.md`
- `.kiro/specs/landing-page-assinatura-lentes/design.md`
- `.kiro/specs/landing-page-assinatura-lentes/tasks.md`

### Steering (Regras de Desenvolvimento)
- `.kiro/steering/tech.md` - Stack tecnológico
- `.kiro/steering/structure.md` - Estrutura do projeto
- `.kiro/steering/product.md` - Visão do produto
- `.kiro/steering/design-system.md` - Sistema de design

### Guias
- [App Router Guide](./APP_ROUTER_GUIDE.md) - Como usar App Router
- [Design System](./DESIGN_SYSTEM_README.md) - Sistema de design
- [Quick Guide](./DESIGN_SYSTEM_QUICK_GUIDE.md) - Referência rápida
- [Examples](./DESIGN_SYSTEM_EXAMPLES.md) - Exemplos de código
- [Implementation](./DESIGN_SYSTEM_IMPLEMENTATION.md) - Detalhes técnicos

### Relatórios
- [Design Improvements](./DESIGN_IMPROVEMENTS_SUMMARY.md)
- [Implementation Checklist](./IMPLEMENTATION_CHECKLIST.md)
- [Test Guide](./TEST_DESIGN_SYSTEM.md)

## 👨‍⚕️ Médico Responsável

**Dr. Philipe Saraiva Cruz**  
CRM: 65.870  
Especialidade: Oftalmologia

## 📞 Contato

- WhatsApp: +55 11 99999-9999
- Email: contato@svlentes.com.br
- Site: https://svlentes.com.br

## 📄 Licença

Este projeto é propriedade privada da SVlentes.