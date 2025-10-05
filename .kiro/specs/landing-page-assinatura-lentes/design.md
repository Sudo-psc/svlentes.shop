# Documento de Design

## Visão Geral

A landing page será uma aplicação Next.js 14 com App Router, otimizada para conversão de visitantes em assinantes do serviço de lentes de contato com acompanhamento médico. A arquitetura seguirá padrões modernos de desenvolvimento web com foco em performance, SEO e experiência do usuário.

## Arquitetura

### Stack Tecnológico
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS para design responsivo
- **Pagamentos**: Stripe Checkout para assinaturas recorrentes
- **Analytics**: Google Analytics 4 + Stripe Analytics
- **Hospedagem**: Vercel (recomendado para Next.js)
- **Validação**: Zod para validação de formulários
- **Estado**: React Hook Form para gerenciamento de formulários

### Estrutura de Diretórios (Baseada no Wireframe)
```
src/
├── app/
│   ├── layout.tsx                 # Layout raiz com header/footer
│   ├── page.tsx                   # Landing page principal (wireframe)
│   ├── agendar-consulta/
│   │   └── page.tsx               # Página de agendamento
│   ├── checkout/
│   │   └── page.tsx               # Página de checkout Stripe
│   ├── success/
│   │   └── page.tsx               # Confirmação de pagamento
│   ├── cancel/
│   │   └── page.tsx               # Cancelamento de pagamento
│   └── api/
│       ├── create-checkout/
│       │   └── route.ts           # API para criar sessão Stripe
│       ├── calculate-economy/
│       │   └── route.ts           # Calculadora de economia
│       ├── whatsapp-redirect/
│       │   └── route.ts           # Redirecionamento WhatsApp
│       └── webhooks/
│           └── stripe/
│               └── route.ts       # Webhooks do Stripe
├── components/
│   ├── ui/                        # Componentes base (Button, Input, etc.)
│   ├── layout/
│   │   ├── Header.tsx             # Cabeçalho com menu SVlentes
│   │   ├── Footer.tsx             # Rodapé com info legal/CRM
│   │   └── WhatsAppFloat.tsx      # Botão flutuante WhatsApp
│   ├── sections/
│   │   ├── HeroSection.tsx        # Hero com formulário lateral
│   │   ├── ProblemSolution.tsx    # Dores vs Soluções
│   │   ├── HowItWorks.tsx         # Como funciona (abas)
│   │   ├── PricingPlans.tsx       # Planos e preços (tabela)
│   │   ├── ReferralProgram.tsx    # Programa de indicação
│   │   ├── AddOns.tsx             # Serviços adicionais
│   │   ├── FAQ.tsx                # Perguntas frequentes
│   │   └── FinalCTA.tsx           # CTA final
│   ├── forms/
│   │   ├── LeadCaptureForm.tsx    # Formulário hero (nome/whatsapp/email)
│   │   ├── EconomyCalculator.tsx  # Calculadora de economia
│   │   └── SubscriptionForm.tsx   # Formulário completo assinatura
│   └── trust/
│       ├── TrustBadges.tsx        # Selos ANVISA, CRM, etc.
│       ├── DoctorCard.tsx         # Card do Dr. Philipe
│       └── TestimonialCard.tsx    # Depoimentos
├── lib/
│   ├── stripe.ts                  # Configuração do Stripe
│   ├── analytics.ts               # GA4 + eventos conversão
│   ├── whatsapp.ts                # Integração WhatsApp Business
│   ├── economy-calculator.ts      # Lógica calculadora economia
│   └── validations.ts             # Schemas Zod
├── data/
│   ├── doctor-info.ts             # Dados Dr. Philipe Saraiva Cruz
│   ├── pricing-plans.ts           # Planos e preços
│   ├── faq-data.ts                # Perguntas e respostas
│   └── trust-indicators.ts        # Selos e certificações
└── types/
    ├── wireframe.ts               # Tipos baseados no wireframe
    ├── stripe.ts                  # Tipos Stripe
    └── forms.ts                   # Tipos de formulários
```

## Componentes e Interfaces

### Layout Baseado no Wireframe

#### 1. Header/Cabeçalho
```typescript
interface HeaderProps {
  logo: string; // "SVlentes"
  navigation: {
    planos: string;
    comoFunciona: string;
    faq: string;
    contato: string;
  };
  ctaPrimary: string; // "Agendar Consulta"
  utilityIcons: string[]; // idioma/conta
}
```
- Logo SVlentes à esquerda
- Menu horizontal: Planos, Como Funciona, FAQ, Contato
- CTA destacado "Agendar Consulta" no canto direito
- Versão mobile com menu simplificado

#### 2. Hero Section
```typescript
interface HeroSectionProps {
  badge: string; // "Pioneiro no Brasil"
  headline: string; // "Nunca mais fique sem lentes"
  subheadline: string; // Assinatura integrada com logística e consulta
  ctaPrimary: string; // "Agendar Consulta"
  ctaSecondary: string; // "Falar no WhatsApp"
  trustIndicators: {
    anvisa: string;
    crm: string; // "CRM 65.870"
    outros: string[];
  };
  doctorCard: {
    photo: string;
    name: string; // Dr. Philipe Saraiva Cruz
    crm: string; // CRM real
    credentials: string;
  };
  leadForm: {
    fields: ['nome', 'whatsapp', 'email'];
    lgpdConsent: boolean;
    ctaCalculator: string; // "Calcule sua economia"
  };
}
```
- Layout em Z no desktop: herói à esquerda, formulário à direita
- Selo "Pioneiro no Brasil" em destaque
- CTAs duplos (primário e WhatsApp)
- Card do médico com foto e credenciais
- Mini-formulário de captação com LGPD

#### 3. Problema-Solução Section
```typescript
interface ProblemSolutionProps {
  problems: Array<{
    icon: string;
    text: string;
  }>;
  solutions: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  ctaContextual: string; // "Fale com um especialista"
}
```
- Colunas lado a lado: dores vs soluções
- Bullet points com ícones
- CTA contextual para especialista

#### 4. Como Funciona Section
```typescript
interface HowItWorksProps {
  tabs: ['Mensal', 'Anual'];
  steps: Array<{
    number: number;
    title: string;
    description: string;
    cost?: string;
    economy?: string;
  }>;
  timeline: {
    visual: string;
    steps: string[];
  };
}
```
- Abas Mensal/Anual
- Cards com etapas e resumo de economia
- Timeline visual do processo

#### 5. Planos e Preços Section
```typescript
interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  recommended?: boolean;
  stripeProductId: string;
  stripePriceId: string;
  ctaText: string; // "Assinar" ou "Agendar"
}

interface PricingSectionProps {
  tabs: ['Mensal', 'Anual'];
  plans: PricingPlan[];
  comparisonTable: {
    features: string[];
    planComparison: Record<string, boolean | string>[];
  };
}
```
- Abas Mensal/Anual
- Tabela comparativa com benefícios
- Botões de ação por plano

#### 6. Programa de Indicação
```typescript
interface ReferralProgramProps {
  mainCard: {
    title: string;
    description: string;
    benefitIndicator: string;
    benefitIndicated: string;
  };
  rulesCard: {
    title: string;
    rules: string[];
  };
}
```
- Card principal com benefícios
- Card secundário com regras
- Sistema de referral claro

#### 7. Add-ons Section
```typescript
interface AddOn {
  id: string;
  name: string;
  description: string;
  price?: number;
  type: 'consulta' | 'teleorientacao' | 'seguro' | 'vip';
}

interface AddOnsProps {
  services: AddOn[];
  layout: 'chips' | 'cards';
}
```
- Consulta médica
- Teleorientação/Tipografia
- Seguro
- Atendimento VIP
- Layout em chips/cards pequenos

#### 8. FAQ Section
```typescript
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQProps {
  items: FAQItem[];
  layout: 'accordion';
  numbering: boolean; // true para numeração
}
```
- Acordeões numerados
- 4-6 dúvidas principais
- Estruturação para rich snippets

#### 9. CTA Final Section
```typescript
interface FinalCTAProps {
  valueReinforcement: string;
  benefits: string[];
  ctaPrimary: string; // "Agendar Consulta"
  ctaWhatsApp: string; // "Falar no WhatsApp"
  quickForm?: {
    fields: string[];
    placement: 'mobile' | 'desktop';
  };
}
```
- Reforço de valor
- Bullets de benefícios
- CTAs duplos
- Formulário curto no mobile

#### 10. Footer
```typescript
interface FooterProps {
  legalInfo: {
    address: string;
    doctorCRM: string; // "CRM 106.888" / "CRM_EQP 155869.006"
    businessHours: string;
  };
  utilityLinks: {
    policies: string[];
    terms: string[];
  };
  contact: {
    whatsappFloat: boolean; // ícone flutuante mobile
    businessCoverage: string; // "atendimento Brasil"
  };
}
```
- Informações legais e CRM
- Links de políticas
- Selo de atendimento Brasil
- WhatsApp flutuante no mobile

### Formulários e Interações

#### Lead Capture Form (Hero)
```typescript
interface LeadFormData {
  nome: string;
  whatsapp: string;
  email: string;
  lgpdConsent: boolean;
}

interface CalculatorData extends LeadFormData {
  currentSpending: number;
  lensType: 'daily' | 'weekly' | 'monthly';
  usage: 'occasional' | 'regular' | 'daily';
}
```

#### Subscription Flow
```typescript
interface SubscriptionFormData {
  leadInfo: LeadFormData; // Dados já capturados
  personalInfo: {
    fullName: string;
    cpf: string;
    birthDate: string;
    address: {
      cep: string;
      street: string;
      number: string;
      complement?: string;
      city: string;
      state: string;
    };
  };
  prescription: {
    hasValidPrescription: boolean;
    prescriptionFile?: File;
    rightEye: {
      sphere: number;
      cylinder: number;
      axis: number;
    };
    leftEye: {
      sphere: number;
      cylinder: number;
      axis: number;
    };
    prescriptionDate: string;
    doctorName: string;
    needsConsultation: boolean;
  };
  preferences: {
    lensType: 'daily' | 'weekly' | 'monthly';
    deliveryFrequency: 'monthly' | 'quarterly' | 'semiannual';
    specialNeeds?: string;
    addOns: string[]; // IDs dos add-ons selecionados
  };
  selectedPlan: string;
}
```

#### WhatsApp Integration
```typescript
interface WhatsAppMessage {
  type: 'lead' | 'consultation' | 'support';
  userData: Partial<LeadFormData>;
  context: {
    page: string;
    planInterest?: string;
    calculatedEconomy?: number;
  };
  prefilledMessage: string;
}
```

## Modelos de Dados

### Stripe Integration
```typescript
interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  metadata: {
    prescription: string; // JSON serializado
    preferences: string; // JSON serializado
  };
}

interface StripeSubscription {
  id: string;
  customer: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_start: number;
  current_period_end: number;
  items: {
    data: Array<{
      price: {
        id: string;
        product: string;
        unit_amount: number;
        recurring: {
          interval: 'month' | 'year';
        };
      };
    }>;
  };
}
```

### Analytics Events
```typescript
interface AnalyticsEvent {
  event_name: string;
  parameters: {
    page_title?: string;
    page_location?: string;
    plan_selected?: string;
    conversion_value?: number;
    currency?: string;
  };
}
```

## Tratamento de Erros

### Estratégia de Error Handling
1. **Validação de Formulários**: Zod schemas com mensagens em português
2. **Erros de Pagamento**: Tratamento específico para cada tipo de erro do Stripe
3. **Fallbacks**: Páginas de erro personalizadas
4. **Logging**: Registro de erros para análise

### Error Boundaries
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}
```

## Estratégia de Testes

### Tipos de Teste
1. **Testes Unitários**: Componentes individuais com Jest + Testing Library
2. **Testes de Integração**: Fluxo completo de checkout
3. **Testes E2E**: Playwright para jornada do usuário
4. **Testes de Performance**: Lighthouse CI

### Cenários Críticos
- Fluxo completo de assinatura
- Validação de formulários
- Integração com Stripe
- Responsividade em diferentes dispositivos
- Acessibilidade (WCAG 2.1)

## Performance e SEO

### Otimizações Específicas do Wireframe
- **Above the Fold**: Hero section otimizada para carregamento rápido
- **Image Optimization**: Foto do Dr. Philipe e elementos visuais
- **Code Splitting**: Lazy loading das seções abaixo do fold
- **Caching**: Static generation para dados do médico e planos
- **CDN**: Vercel Edge Network
- **Core Web Vitals**: Monitoramento contínuo com foco em conversão

### SEO Strategy Baseada no Conteúdo
```typescript
interface SEOMetadata {
  title: string; // "SVlentes - Assinatura de Lentes de Contato com Acompanhamento Médico"
  description: string; // Baseada na proposta "Nunca mais fique sem lentes"
  keywords: string[]; // lentes de contato, assinatura, Dr. Philipe Saraiva Cruz, CRM
  openGraph: {
    title: string;
    description: string;
    image: string; // Foto do Dr. Philipe ou hero visual
    type: 'website';
  };
  structuredData: {
    '@type': 'MedicalBusiness';
    name: 'SVlentes - Lens as a Service';
    description: string;
    physician: {
      '@type': 'Physician';
      name: 'Dr. Philipe Saraiva Cruz';
      medicalSpecialty: 'Oftalmologia';
      identifier: 'CRM 65.870'; // CRM real
    };
    offers: Array<{
      '@type': 'Offer';
      name: string; // Nome do plano
      price: string;
      priceCurrency: 'BRL';
      availability: 'InStock';
      category: 'MedicalService';
    }>;
    areaServed: 'BR';
    hasOfferCatalog: {
      '@type': 'OfferCatalog';
      name: 'Planos de Assinatura';
      itemListElement: Array<{
        '@type': 'Offer';
        itemOffered: {
          '@type': 'Service';
          name: string;
          description: string;
        };
      }>;
    };
  };
  faqStructuredData: {
    '@type': 'FAQPage';
    mainEntity: Array<{
      '@type': 'Question';
      name: string;
      acceptedAnswer: {
        '@type': 'Answer';
        text: string;
      };
    }>;
  };
}
```

### Anchor Links para Menu
- **Planos**: #planos-precos
- **Como Funciona**: #como-funciona  
- **FAQ**: #perguntas-frequentes
- **Contato**: #contato ou WhatsApp direto

## Segurança e Privacidade

### Medidas de Segurança
- **HTTPS**: Certificado SSL obrigatório
- **CSP**: Content Security Policy configurado
- **Rate Limiting**: Proteção contra spam
- **Sanitização**: Validação e sanitização de inputs

### Conformidade LGPD
- **Cookie Consent**: Banner de consentimento
- **Privacy Policy**: Política de privacidade clara
- **Data Minimization**: Coleta apenas de dados necessários
- **Right to Deletion**: Processo para exclusão de dados

## Monitoramento e Analytics

### Métricas de Conversão Específicas
- **Funil Principal**: Visualização → Lead Form → Agendamento → Conversão
- **CTAs Tracking**: 
  - "Agendar Consulta" (primário)
  - "Falar no WhatsApp" (secundário)
  - "Calcule sua economia" (calculadora)
- **Seções de Engajamento**: Tempo em cada seção do wireframe
- **Abandono por Etapa**: Identificação de drop-offs específicos
- **A/B Testing**: Variações de headline, CTAs e formulário

### Eventos Customizados
```typescript
interface CustomEvents {
  // Hero Section
  'lead_form_submit': { source: 'hero_form' };
  'calculator_used': { economy_calculated: number };
  'cta_agendar_clicked': { section: string };
  'cta_whatsapp_clicked': { section: string };
  
  // Seções Específicas
  'pricing_tab_switched': { tab: 'mensal' | 'anual' };
  'plan_selected': { plan_name: string; price: number };
  'how_it_works_tab': { tab: 'mensal' | 'anual' };
  'faq_opened': { question_id: string };
  'addon_selected': { addon_type: string };
  
  // Conversão
  'consultation_scheduled': { plan_interest: string };
  'subscription_started': { plan_id: string; value: number };
  'whatsapp_redirect': { context: string; user_data: boolean };
}
```

### Dashboards Integrados
- **Stripe Dashboard**: Métricas de pagamento e assinaturas
- **Google Analytics 4**: Funil de conversão e comportamento
- **WhatsApp Business**: Métricas de atendimento e conversão
- **Vercel Analytics**: Performance e Core Web Vitals
- **Hotjar/Microsoft Clarity**: Heatmaps e session recordings