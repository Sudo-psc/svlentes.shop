# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SV Lentes (SVlentes)** is a contact lens subscription service platform for Saraiva Vision clinic, combining automated lens delivery with continuous medical care.

### Business Context
- **Service**: Subscription-based contact lens delivery with ophthalmological monitoring
- **Location**: Caratinga/MG, Brazil
- **Responsible Physician**: Dr. Philipe Saraiva Cruz (CRM-MG 69.870)
- **Company**: Saraiva Vision Care LTDA (CNPJ: 53.864.119/0001-79)
- **Website**: svlentes.shop

### Key Features
- Automated lens renewal (daily, bi-weekly, monthly, toric, multifocal)
- Medical follow-up with scheduled consultations
- Smart replacement reminders
- Teleorientation via WhatsApp and chatbot
- Priority scheduling for exams (corneal topography, pachymetry)
- LGPD-compliant data handling (Brazilian data protection law)

## Repository Structure

```
svlentes-page-short/
├── Backend/          # Backend services (empty - to be developed)
├── Frontend/         # Frontend application
│   ├── Docs/        # Project documentation
│   │   ├── About-us.md      # Business context and service details
│   │   ├── context.md       # Project context
│   │   └── prd.md           # Product requirements document
│   ├── Specs/       # Technical specifications
│   │   ├── specs.md         # Functional specifications
│   │   └── tasks.md         # Task breakdown
│   ├── AGENTS.md    # AI agent configurations
│   └── README.md    # Frontend documentation
└── Testes/          # Testing (empty - to be developed)
```

## Development Guidelines

### Language and Localization
- **Primary Language**: Portuguese (Brazil)
- **Tone**: Professional yet warm, reflecting family care approach
- **Regional Context**: Minas Gerais terminology and cultural context
- All user-facing content must be in Brazilian Portuguese

### Regulatory Compliance

#### LGPD (Lei Geral de Proteção de Dados - Lei 13.709/2018)
- Personal data collection requires explicit consent
- Data usage limited to: scheduling, prescriptions, delivery logistics, health reminders
- No third-party data sharing without authorization
- Implement proper data protection measures

#### Medical/Healthcare Requirements
- Valid prescription required (issued by ophthalmologist)
- Medical responsibility: Dr. Philipe Saraiva Cruz (CRM-MG 69.870)
- Nursing support: Ana Lúcia (COREN-MG 834184)
- Emergency contact protocols must be clearly accessible

### Contact Information
- **WhatsApp**: +55 33 99860-1427
- **Email**: saraivavision@gmail.com
- **Instagram**: @saraiva_vision
- **Chatbot**: https://chatgpt.com/g/g-quepJB90J-saraiva-vision-clinica-oftalmologica
- **Institutional Site**: saraivavision.com.br
- **Physical Address**: Rua Maria das Dores Cimini, CEP 35300-299, Caratinga/MG

### Clinical Safety Requirements

When implementing any user-facing features, ensure:

1. **Emergency Alert Signs** are prominently displayed:
   - Intense or persistent eye pain
   - Severe redness (hyperemia)
   - Sudden blurred vision or vision loss
   - Purulent discharge, intense photophobia, or foreign body sensation

2. **Prescription Validation**:
   - Verify prescription validity before processing orders
   - Track base curvature, diameter, Dk/t (oxygen permeability), usage regimen
   - Integrate with complementary exam results when available

3. **Medical Follow-up Tracking**:
   - Schedule periodic evaluations
   - Send renewal and replacement reminders
   - Flag overdue medical consultations

## Project Status

**Current Phase**: Planning & Specification
- No code implementation exists yet
- Architecture and specifications defined in [Frontend/Specs/](Frontend/Specs/)
- Business requirements documented in [Frontend/Docs/](Frontend/Docs/)

## Technology Stack

Based on specifications in `Frontend/Specs/arquitetura-asaas.md` (updated for Asaas integration):

### Core Framework
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **React 18** with Server Components
- **Tailwind CSS** + shadcn/ui for styling

### Backend & Data
- **Prisma ORM** with PostgreSQL (Neon/Supabase recommended)
- **NextAuth.js v5** for authentication
- **Redis** (Upstash) for caching
- **Vercel Blob/S3** for file storage

### Payment & Communication
- **Asaas API v3** for recurring payments (PIX, Boleto, Cartão de Crédito)
- **Vercel Cron** for scheduled tasks
- **Resend** for email notifications
- **WebRTC** for telemedicine video calls

## Development Commands

When the project is initialized, these commands will be used:

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:push         # Push schema changes to database
npm run db:migrate      # Run database migrations
npm run db:generate     # Generate Prisma client
npm run db:studio       # Open Prisma Studio (database GUI)

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript compiler check
```

## Architecture Overview

### Full-Stack Next.js Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes (login, register)
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── subscription/  # Subscription management
│   │   ├── medical/       # Medical consultations & history
│   │   └── profile/       # User profile
│   ├── admin/             # Admin dashboard
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── subscriptions/ # Subscription CRUD
│   │   ├── payments/      # Payment processing & webhooks
│   │   ├── medical/       # Medical consultations
│   │   └── cron/          # Scheduled jobs
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── forms/             # Form components
│   ├── medical/           # Telemedicine components (video-call, chat)
│   └── layout/            # Layout components
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Prisma client instance
│   ├── payments/          # Payment provider integrations
│   ├── validations.ts     # Zod schemas
│   └── utils.ts           # Utility functions
├── hooks/                 # React custom hooks
├── stores/                # Zustand state management
└── types/                 # TypeScript type definitions
```

### Key Implementation Details

**Server Actions** (in `lib/actions/`) replace traditional REST APIs:
- `subscription.ts`: Create, pause, cancel subscriptions
- `payment.ts`: Process payments, handle failures
- `medical.ts`: Schedule consultations, manage prescriptions

**API Routes** (in `app/api/`) for external integrations:
- `/api/payments/webhook`: Stripe webhook handler
- `/api/cron/billing`: Daily billing job (runs at 9 AM)
- `/api/cron/notifications`: Notification job (runs every 6 hours)

**Database Schema** (Prisma):
- Core models: User, Subscription, Payment, Consultation, Prescription, Delivery
- Enums for status tracking (SubscriptionStatus, PaymentStatus, etc.)
- LGPD-compliant audit logging

## Architecture Considerations

### Frontend Features
- Mobile-first responsive design
- Progressive Web App (PWA) capabilities
- WhatsApp integration for notifications
- LGPD consent management UI
- Prescription upload with validation
- Real-time telemedicine (WebRTC video calls)

### Backend Features
- NextAuth.js authentication (credentials + Google OAuth)
- Stripe recurring payment integration
- Server Actions for data mutations
- Webhook handlers for payment events
- Automated delivery scheduling via cron jobs
- Redis caching for performance

### Data Protection (LGPD Compliance)
- Encrypted medical data storage (AES-256-GCM)
- Audit logging for all medical data access
- Explicit consent tracking
- Data retention policies
- Right to deletion implementation

## Documentation Files

When modifying the project, keep these documentation files updated:

- **Frontend/Docs/About-us.md**: Contains complete business context, clinical protocols, and service description
- **Frontend/Specs/specs.md**: Technical specifications
- **Frontend/Specs/tasks.md**: Development task breakdown
- **Frontend/Docs/prd.md**: Product requirements
- **Frontend/Docs/context.md**: Project context and scope

## Implementation Guidelines

### Starting Development

When beginning implementation:

1. **Initialize Next.js project**:
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app
   ```

2. **Set up Prisma**:
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   # Copy schema from Frontend/Specs/arquitetura-asaas.md
   npx prisma generate
   ```

3. **Install core dependencies**:
   ```bash
   npm install next-auth@beta zod react-hook-form @hookform/resolvers zustand @tanstack/react-query
   ```

4. **Configure environment variables** (`.env.local`):
   ```
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="..."

   # Asaas Payment Integration
   ASAAS_ENV="sandbox"  # ou "production"
   ASAAS_API_KEY_SANDBOX="$aact_hmlg_..."
   ASAAS_API_KEY_PROD="$aact_prod_..."
   ```

5. **Set up Asaas Integration**:
   - Create Asaas account at [asaas.com](https://www.asaas.com)
   - Generate API keys (sandbox and production)
   - Configure webhook URLs in Asaas dashboard
   - Implement customer and subscription management
   - Test payment flows (PIX, Boleto, Cartão de Crédito)

### Code Organization Patterns

- **Route Groups**: Use `(auth)` and `(dashboard)` for layout segregation
- **Server Components**: Default to Server Components, use `'use client'` only when needed
- **Server Actions**: Prefix with `'use server'` directive
- **Validation**: Use Zod schemas in `lib/validations.ts`
- **Error Handling**: Use `error.tsx` and `not-found.tsx` in route segments

### Testing Strategy

When implementing tests:
- **Unit**: Test utility functions and business logic
- **Integration**: Test API routes and Server Actions
- **E2E**: Test critical flows (subscription creation, payment processing)
- **LGPD Compliance**: Validate data encryption and audit logging

### Performance Targets

- **Landing page**: First Contentful Paint < 1.5s
- **Dashboard**: Time to Interactive < 2s
- **API responses**: P95 < 300ms
- **Telemedicine video**: < 150ms latency for Brazilian connections

## Asaas Payment Integration

### Overview
O projeto utiliza **Asaas** como gateway de pagamento para processar assinaturas recorrentes. Asaas é uma instituição de pagamento regulada pelo Banco Central do Brasil, certificada PCI-DSS, oferecendo:

- **PIX**: Pagamento instantâneo
- **Boleto Bancário**: Tradicional método brasileiro
- **Cartão de Crédito**: Pagamentos recorrentes automatizados

### Arquitetura da Integração

**Componentes Principais**:
1. **Cliente Asaas** (`src/lib/payments/asaas.ts`): Wrapper para API Asaas v3
2. **Types** (`src/types/asaas.ts`): TypeScript types para entidades Asaas
3. **Webhooks** (`src/app/api/payments/webhook/route.ts`): Eventos de cobrança
4. **Server Actions** (`src/lib/actions/subscription.ts`): Operações de assinatura

### Fluxo de Pagamento

**Criação de Assinatura**:
1. Usuário seleciona plano e método de pagamento
2. Sistema cria/atualiza cliente no Asaas
3. Cria assinatura no Asaas com ciclo definido
4. Asaas gera primeira cobrança automaticamente
5. Webhook notifica sobre criação da cobrança

**Processamento de Pagamento**:
1. Cliente efetua pagamento (PIX/Boleto/Cartão)
2. Asaas envia webhook `PAYMENT_RECEIVED`
3. Sistema atualiza status do pagamento
4. Agenda entrega das lentes
5. Atualiza período da assinatura

**Eventos de Webhook**:
- `PAYMENT_CREATED`: Cobrança gerada
- `PAYMENT_RECEIVED`: Pagamento recebido
- `PAYMENT_CONFIRMED`: Pagamento confirmado
- `PAYMENT_OVERDUE`: Cobrança vencida
- `PAYMENT_REFUNDED`: Pagamento estornado

### Dados Armazenados

**User**:
- `asaasCustomerId`: ID do cliente no Asaas

**Subscription**:
- `asaasSubscriptionId`: ID da assinatura no Asaas
- `billingType`: BOLETO, CREDIT_CARD, PIX
- `status`: ACTIVE, PAST_DUE, CANCELED, PAUSED

**Payment**:
- `asaasPaymentId`: ID da cobrança no Asaas
- `invoiceUrl`: URL do invoice
- `bankSlipUrl`: URL do boleto (se aplicável)
- `pixQrCode`: QR Code PIX (se aplicável)

### Segurança

- API Keys separadas para sandbox e produção
- Headers obrigatórios: `access_token`, `User-Agent`, `Content-Type`
- Validação de webhooks por IP permitido
- HTTPS obrigatório (TLS 1.2+)
- Não expor API keys no código ou logs

### Ambientes

**Sandbox**:
- URL: `https://sandbox.asaas.com/api/v3`
- API Key: `$aact_hmlg_...`
- Para testes e desenvolvimento

**Produção**:
- URL: `https://api.asaas.com/v3`
- API Key: `$aact_prod_...`
- Para clientes reais

### Documentação Completa
Consulte [Frontend/Specs/arquitetura-asaas.md](Frontend/Specs/arquitetura-asaas.md) para detalhes técnicos completos da integração.

## Important Notes

- **Healthcare Platform**: Prioritize user safety and data protection above all
- **Regulatory Compliance**: All features must comply with Brazilian healthcare regulations (CFM) and LGPD
- **Emergency Access**: Emergency contact information must be accessible at all times
- **Prescription Validation**: Mandatory - never bypass medical authorization checks
- **Medical Responsibility**: All medical features must be reviewed by Dr. Philipe Saraiva Cruz
- **Data Encryption**: Medical records must use AES-256-GCM encryption at rest
- **Audit Trail**: Log all access to sensitive medical data with user ID, timestamp, and action
- **Payment Security**: Never store sensitive payment data (card numbers, CVV). Use Asaas tokenization
