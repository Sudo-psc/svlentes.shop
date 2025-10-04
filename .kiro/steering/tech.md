# Technology Stack

## Framework & Runtime
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Node.js 18+** required

## Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless component primitives
- **Framer Motion** - Animation library
- **Heroicons & Lucide React** - Icon libraries

## Form Handling & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

## Payment & Integration
- **Stripe** - Payment processing
- **Asaas** - Brazilian payment gateway (alternative)
- **WhatsApp Business API** - Customer communication

## Development Tools
- **TypeScript** - Static typing
- **ESLint** - Code linting
- **Jest** - Unit testing
- **Playwright** - E2E testing
- **Testing Library** - Component testing

## Build & Deployment
- **Vercel** - Hosting platform
- **GitHub Actions** - CI/CD pipeline
- **Lighthouse CI** - Performance monitoring

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
```

### Deployment
```bash
npm run deploy:staging    # Deploy to staging
npm run deploy:production # Deploy to production
npm run deploy:rollback   # Rollback deployment
npm run health-check      # Check application health
```

### Performance
```bash
npm run lighthouse   # Run Lighthouse audit
```

## Environment Setup
1. Copy `.env.example` to `.env.local`
2. Configure Stripe keys for payment processing
3. Set up Asaas credentials for Brazilian payments
4. Configure WhatsApp Business API tokens
5. Add analytics and monitoring credentials