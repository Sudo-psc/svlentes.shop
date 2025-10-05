# Project Structure

## Directory Organization

### `/src/app/` - Next.js App Router
Application routes and pages using Next.js 15 App Router pattern:
- `page.tsx` - Homepage with hero and main sections
- `layout.tsx` - Root layout with global providers
- `globals.css` - Global styles and Tailwind directives
- `/api/` - API routes for webhooks, health checks, payments
- `/assinar/` - Subscription checkout flow
- `/agendar-consulta/` - Medical appointment scheduling
- `/calculadora/` - Savings calculator tool
- `/success/`, `/cancel/` - Payment result pages
- `/politica-privacidade/`, `/termos-uso/` - Legal pages

### `/src/components/` - React Components
Organized by function and domain:
- `/ui/` - Base UI components (buttons, inputs, cards, dialogs)
- `/layout/` - Header, Footer, navigation components
- `/sections/` - Landing page sections (Hero, Pricing, FAQ, etc.)
- `/forms/` - Form components with validation
- `/trust/` - Trust indicators, badges, testimonials
- `/personalization/` - Dynamic personalization components
- `/analytics/` - Tracking and analytics components
- `/subscription/` - Subscription-specific components
- `/how-it-works/` - Process explanation components

### `/src/lib/` - Utilities and Business Logic
Core functionality and helpers:
- `stripe.ts` - Stripe payment integration
- `analytics.ts` - Analytics and tracking utilities
- `calculator.ts` - Economy calculator logic
- `validations.ts` - Zod schemas for form validation
- `utils.ts` - General utility functions
- `seo.ts` - SEO metadata generation
- `whatsapp.ts` - WhatsApp integration
- `performance.ts` - Performance monitoring
- `cache.ts` - Caching strategies
- `/payments/` - Payment processing logic
- `/personalization/` - Personalization engine

### `/src/data/` - Static Data
Configuration and content data:
- `pricing-plans.ts` - Subscription plan definitions
- `faq-data.ts` - FAQ questions and answers
- `doctor-info.ts` - Medical professional information
- `trust-indicators.ts` - Trust badges and social proof
- `add-ons.ts` - Additional products/services
- `calculator-data.ts` - Calculator configuration
- `how-it-works.ts` - Process steps data

### `/src/types/` - TypeScript Definitions
Type definitions for the application:
- `index.ts` - Main type exports
- `forms.ts` - Form data types
- `stripe.ts` - Stripe-related types
- `personalization.ts` - Personalization types
- `calculator.ts` - Calculator types
- `asaas.ts` - Payment provider types

### `/src/hooks/` - Custom React Hooks
Reusable React hooks:
- `usePersonalization.ts` - Personalization state management
- `use-toast.ts` - Toast notification hook

### `/public/` - Static Assets
Public files served directly:
- `/icones/` - Icon assets
- `/images/` - Image files
- `/Personas/` - User persona images
- Favicon files and web manifest
- `robots.txt`, `sitemap.xml`

### `/e2e/` - End-to-End Tests
Playwright test suites:
- `checkout-flow.spec.ts` - Payment flow tests
- `user-journey.spec.ts` - Complete user journey tests
- `mobile-specific.spec.ts` - Mobile-specific tests

### `/scripts/` - Build and Utility Scripts
Automation and tooling:
- `optimize-icons.js` - Icon optimization
- `optimize-logo.js` - Logo optimization
- `deploy.sh` - Deployment automation
- `performance-check.js` - Performance monitoring
- Icon management and analysis scripts

### `/docs/` - Documentation
Project documentation:
- Icon system documentation
- Design system guides
- Implementation notes

## Architectural Patterns

### Component Architecture
- Atomic design principles (ui → sections → pages)
- Server and client components separation
- Composition over inheritance
- Props drilling avoided with context where needed

### Data Flow
- Server-side data fetching in page components
- Client-side state with React hooks
- Form state managed by React Hook Form
- Personalization state in custom hook

### API Structure
- RESTful API routes in `/app/api/`
- Webhook handlers for Stripe events
- Health check endpoints for monitoring
- Type-safe request/response handling

### Styling Strategy
- Tailwind CSS utility-first approach
- Component variants with class-variance-authority
- Responsive design mobile-first
- Design tokens in Tailwind config

### Performance Optimization
- Image optimization with Next.js Image
- Code splitting by route
- Static generation where possible
- Caching strategies for API responses
- Lazy loading for heavy components
