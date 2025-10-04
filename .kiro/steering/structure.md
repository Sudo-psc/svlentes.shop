# Project Structure & Organization

## Root Directory Structure
```
├── src/                    # Source code
├── public/                 # Static assets
├── e2e/                   # End-to-end tests
├── scripts/               # Deployment and utility scripts
├── .kiro/                 # Kiro configuration and steering
├── .github/               # GitHub Actions workflows
└── [config files]         # Next.js, Tailwind, TypeScript configs
```

## Source Code Organization (`src/`)

### App Router (`src/app/`)
- **Next.js 14 App Router** structure
- Route-based organization with `page.tsx`, `layout.tsx`, `metadata.ts`
- API routes in `src/app/api/`
- Special pages: `success/`, `cancel/`, `agendar-consulta/`, etc.

### Components (`src/components/`)
```
├── ui/                    # Base UI components (Button, Input, etc.)
├── layout/                # Layout components (Header, Footer, WhatsApp)
├── sections/              # Landing page sections
├── forms/                 # Form components
├── trust/                 # Trust elements (DoctorCard, TrustBadges)
├── analytics/             # Analytics and tracking components
├── privacy/               # Privacy and consent components
├── performance/           # Performance optimization components
├── admin/                 # Admin dashboard components
└── seo/                   # SEO components
```

### Library Code (`src/lib/`)
- **Utilities**: `utils.ts` (cn function, helpers)
- **Business Logic**: `calculator.ts`, `economy-calculator.ts`
- **Integrations**: `stripe.ts`, `whatsapp.ts`, `analytics.ts`
- **Validation**: `validations.ts` (Zod schemas)
- **Performance**: `cache.ts`, `performance.ts`, `monitoring.ts`
- **Privacy**: `privacy.ts` (LGPD compliance)

### Data Layer (`src/data/`)
- Static data files (`.ts` exports)
- `pricing-plans.ts`, `faq-data.ts`, `doctor-info.ts`
- `problems-solutions.ts`, `trust-indicators.ts`

### Types (`src/types/`)
- TypeScript type definitions
- Modular exports through `index.ts`
- Domain-specific types: `calculator.ts`, `forms.ts`, `stripe.ts`

## Naming Conventions

### Files & Directories
- **kebab-case** for directories and route files
- **PascalCase** for React components
- **camelCase** for utility functions and data files
- **UPPERCASE** for constants and environment files

### Components
- **Functional components** with TypeScript
- **Props interfaces** named `ComponentNameProps`
- **Default exports** for page components
- **Named exports** for utility components

## Import Patterns
```typescript
// Path aliases configured in tsconfig.json
import { Button } from '@/components/ui/Button'
import { calculateEconomy } from '@/lib/calculator'
import { PricingPlan } from '@/types/forms'
import { pricingPlans } from '@/data/pricing-plans'
```

## Testing Structure
- **Unit tests**: `__tests__/` directories alongside source files
- **Integration tests**: `src/__tests__/integration/`
- **E2E tests**: `e2e/` directory at project root
- **Test naming**: `ComponentName.test.tsx` or `function-name.test.ts`

## API Routes Organization
```
src/app/api/
├── health-check/          # Application health monitoring
├── webhooks/stripe/       # Stripe webhook handlers
├── schedule-consultation/ # Consultation booking
├── whatsapp-redirect/     # WhatsApp integration
├── monitoring/            # Performance and error monitoring
└── privacy/               # LGPD compliance endpoints
```

## Configuration Files
- **Next.js**: `next.config.js` (security headers, image optimization)
- **Tailwind**: `tailwind.config.js` (custom colors, animations)
- **TypeScript**: `tsconfig.json` (path aliases, strict mode)
- **Testing**: `jest.config.js`, `playwright.config.ts`
- **Deployment**: `vercel.json`, `.github/workflows/`

## Asset Management
- **Images**: `public/` directory
- **Optimized loading** via Next.js Image component
- **WebP/AVIF** format support configured
- **CDN caching** headers for static assets