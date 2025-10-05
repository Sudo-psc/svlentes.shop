# Technology Stack

## Core Technologies

### Framework & Runtime
- **Next.js 15.5.4** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.9.3** - Static typing
- **Node.js 18+** - Runtime environment

### Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **PostCSS 8.4.49** - CSS processing
- **Autoprefixer 10.4.20** - CSS vendor prefixing
- **Framer Motion 12.23.22** - Animation library
- **class-variance-authority 0.7.1** - Component variants
- **tailwind-merge 2.6.0** - Tailwind class merging
- **tailwindcss-animate 1.0.7** - Animation utilities

### UI Components
- **Radix UI** - Headless component primitives
  - react-accordion 1.2.12
  - react-checkbox 1.3.3
  - react-dialog 1.1.15
  - react-label 2.1.7
  - react-select 2.2.6
  - react-slot 1.2.3
  - react-tabs 1.1.13
  - react-toast 1.2.15
- **Lucide React 0.303.0** - Icon library
- **Heroicons 2.2.0** - Additional icons

### Forms & Validation
- **React Hook Form 7.48.2** - Form state management
- **Zod 3.22.4** - Schema validation
- **@hookform/resolvers 3.3.2** - Form validation integration

### Payments
- **Stripe 14.9.0** - Payment processing and subscriptions

### Testing
- **Jest 29.7.0** - Unit testing framework
- **@testing-library/react 16.3.0** - React testing utilities
- **@testing-library/jest-dom 6.9.1** - DOM matchers
- **@testing-library/user-event 14.6.1** - User interaction simulation
- **Playwright 1.55.1** - E2E testing
- **jest-environment-jsdom 29.7.0** - DOM environment for Jest

### Development Tools
- **ESLint 8** - Code linting
- **eslint-config-next 15.1.6** - Next.js ESLint config
- **Sharp 0.34.4** - Image optimization
- **Chokidar 4.0.3** - File watching

## Build System

### Package Manager
- npm (primary)
- yarn (alternative)

### Build Configuration
- **next.config.js** - Next.js configuration
  - Image optimization settings
  - Security headers
  - Caching strategies
  - Webpack customization
- **tsconfig.json** - TypeScript configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **postcss.config.js** - PostCSS configuration

## Development Commands

### Core Commands
```bash
npm run dev              # Start development server (localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Testing Commands
```bash
npm run test             # Run Jest unit tests
npm run test:watch       # Jest in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run Playwright E2E tests
npm run test:e2e:ui      # Playwright with UI
npm run test:e2e:headed  # Playwright in headed mode
npm run test:e2e:debug   # Debug Playwright tests
```

### Deployment Commands
```bash
npm run deploy:staging      # Deploy to staging
npm run deploy:production   # Deploy to production
npm run deploy:rollback     # Rollback deployment
npm run health-check        # Check API health
npm run lighthouse          # Run Lighthouse CI
```

### Asset Optimization Commands
```bash
npm run optimize:icons      # Optimize icon files
npm run optimize:logo       # Optimize logo files
npm run generate:favicons   # Generate favicon variants
npm run icons:catalog       # Open icon catalog
npm run icons:watch         # Watch for icon changes
npm run icons:update        # Update components with icons
npm run icons:analyze       # Analyze icon usage
```

## Environment Variables

### Required Variables
```
STRIPE_PUBLISHABLE_KEY    # Stripe public key
STRIPE_SECRET_KEY         # Stripe secret key
STRIPE_WEBHOOK_SECRET     # Stripe webhook signing secret
```

### Configuration Files
- `.env.local` - Local environment variables (gitignored)
- `.env.local.example` - Example environment template
- `.env.example` - Alternative example template

## Performance Features

### Next.js Optimizations
- Automatic code splitting
- Image optimization with next/image
- Font optimization
- Static generation where possible
- Incremental Static Regeneration (ISR)

### Caching Strategy
- Static assets: 1 year cache
- API responses: 5 minutes cache with stale-while-revalidate
- Images: 7 days minimum cache TTL
- WebP and AVIF format support

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()
- Content Security Policy for SVG images

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement approach
