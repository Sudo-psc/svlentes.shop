# Development Guidelines

## Code Quality Standards

### TypeScript Usage
- Strict typing enforced throughout codebase
- Explicit interface definitions for all data structures
- Type exports centralized in `/src/types/` directory
- No `any` types except in controlled error handling scenarios
- Union types for enums and state values (e.g., `'low' | 'medium' | 'high'`)

### File Organization
- Client components marked with `'use client'` directive at top
- Server components default (no directive needed)
- One primary export per file
- Related types defined in same file or imported from `/src/types/`
- Utility functions extracted to `/src/lib/` when reusable

### Naming Conventions
- **Files**: kebab-case for utilities, PascalCase for components
- **Components**: PascalCase (e.g., `PricingSection`, `PricingCard`)
- **Functions**: camelCase (e.g., `handleSubscription`, `trackBehavior`)
- **Interfaces**: PascalCase with descriptive names (e.g., `UserProfile`, `BehavioralData`)
- **Constants**: UPPER_SNAKE_CASE for config (e.g., `DEFAULT_PERSONALIZATION_CONFIG`)
- **Props interfaces**: ComponentNameProps pattern (e.g., `PricingCardProps`)

### Code Structure
- Interfaces defined at top of file before implementation
- Helper functions defined before main component/export
- Async functions explicitly typed with Promise return types
- Error handling with try-catch blocks and structured logging
- Early returns for guard clauses and validation

## Architectural Patterns

### Component Architecture
```typescript
// Pattern: Separate presentation and logic components
function PricingCard({ plan, isAnnual }: PricingCardProps) {
  // Local state and computed values
  const price = isAnnual ? plan.priceAnnual : plan.priceMonthly
  
  // Event handlers with error handling
  const handleClick = async () => {
    try {
      await handleSubscription({ planId: plan.id })
    } catch (error) {
      console.error('Error:', error)
      alert('Error message')
    }
  }
  
  return (/* JSX */)
}
```

### State Management
- React hooks for local state (`useState`, `useEffect`, `useCallback`)
- Custom hooks for complex logic (e.g., `usePersonalization`)
- Refs for preventing re-initialization (`useRef`)
- Memoization with `useMemo` and `useCallback` for performance
- State updates immutably with spread operators

### API Route Patterns
```typescript
// Pattern: Structured webhook handlers
export async function POST(request: NextRequest) {
  try {
    // 1. Validate request
    const signature = request.headers.get('stripe-signature')
    if (!signature) return NextResponse.json({ error }, { status: 400 })
    
    // 2. Process event
    const event = validateWebhook(body, signature)
    
    // 3. Route to handler
    switch (event.type) {
      case 'checkout.session.completed':
        result = await handleCheckoutCompleted(event.data.object)
        break
    }
    
    // 4. Return response
    return NextResponse.json({ received: true })
  } catch (error) {
    // 5. Error handling
    return NextResponse.json({ error }, { status: 500 })
  }
}
```

### Middleware Pattern
```typescript
// Pattern: Edge middleware for personalization
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // 1. Collect data
  const behavioralData = collectBehavioralData(request)
  
  // 2. Analyze and update
  const userProfile = await getOrCreateUserProfile(request)
  
  // 3. Apply personalization
  response.headers.set('x-user-persona', userProfile.primaryPersona)
  
  // 4. Optional rewrite
  if (shouldRewrite) {
    return NextResponse.rewrite(targetUrl)
  }
  
  return response
}
```

## Common Implementation Patterns

### Error Handling and Logging
```typescript
// Pattern: Structured logging with context
interface WebhookLog {
  eventType: string
  eventId: string
  timestamp: string
  status: 'success' | 'error'
  details?: any
  error?: string
}

function logWebhookEvent(log: WebhookLog) {
  console.log('WEBHOOK_EVENT:', JSON.stringify({
    ...log,
    timestamp: new Date().toISOString(),
    source: 'stripe_webhook'
  }))
}

// Usage in try-catch
try {
  // Business logic
  logWebhookEvent({ eventType, eventId, status: 'success' })
} catch (error) {
  logWebhookEvent({
    eventType,
    eventId,
    status: 'error',
    error: error instanceof Error ? error.message : 'Unknown error'
  })
  throw error
}
```

### Async Operations
```typescript
// Pattern: Async handlers with proper typing
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<{ success: boolean; customerData?: any }> {
  try {
    const customerData = {
      stripeCustomerId: session.customer as string,
      email: session.customer_email,
      // ... more fields
    }
    
    return { success: true, customerData }
  } catch (error) {
    logError(error)
    throw error
  }
}
```

### Custom Hooks Pattern
```typescript
// Pattern: Comprehensive custom hook with multiple returns
export function usePersonalization(options: UsePersonalizationOptions = {}) {
  const [state, setState] = useState<PersonalizationState>(initialState)
  const engineRef = useRef<PersonalizationEngine | null>(null)
  
  // Initialization
  useEffect(() => {
    const initializeEngine = async () => {
      const newEngine = new PersonalizationEngine(sessionId, config)
      newEngine.subscribe((newState) => setState(newState))
      await newEngine.initialize()
      engineRef.current = newEngine
    }
    initializeEngine()
  }, [sessionId])
  
  // Cleanup
  useEffect(() => {
    return () => {
      engineRef.current?.destroy()
    }
  }, [])
  
  // Actions
  const trackBehavior = useCallback(async (data: BehaviorData) => {
    if (!engineRef.current) return
    await engineRef.current.trackBehavior(data)
  }, [])
  
  return {
    // State
    profile: state.profile,
    isLoading: state.isLoading,
    // Actions
    trackBehavior,
    // Computed
    isInitialized: engineRef.current !== null
  }
}
```

### Conditional Rendering
```typescript
// Pattern: Conditional styling with cn utility
<div className={cn(
  'base-classes',
  condition && 'conditional-classes',
  variant === 'primary' ? 'primary-classes' : 'secondary-classes'
)}>
```

### Event Tracking
```typescript
// Pattern: Track user actions with analytics
onClick={async () => {
  try {
    await handleSubscription({ planId, billingInterval })
    trackEvent('subscription_started', { planId, billingInterval })
  } catch (error) {
    console.error('Error:', error)
    trackEvent('subscription_error', { planId, error: error.message })
  }
}}
```

## Styling Conventions

### Tailwind CSS Usage
- Utility-first approach with Tailwind classes
- Responsive design with mobile-first breakpoints (`md:`, `lg:`)
- Custom colors via theme configuration
- Consistent spacing scale (4, 6, 8, 12, 16, 20, 24)
- Hover and focus states for interactive elements

### Component Variants
```typescript
// Pattern: Variant-based styling
<Button className={cn(
  'w-full py-3 text-lg font-semibold',
  plan.recommended
    ? 'bg-primary-600 hover:bg-primary-700 text-white'
    : 'bg-gray-900 hover:bg-gray-800 text-white'
)}>
```

### Responsive Design
```typescript
// Pattern: Mobile-first with progressive enhancement
<div className="block lg:hidden">
  {/* Mobile view */}
</div>
<div className="hidden lg:block">
  {/* Desktop view */}
</div>
```

## Data Flow Patterns

### Props Drilling Prevention
- Use composition over deep prop drilling
- Context for global state when needed
- Custom hooks for shared logic

### Form Handling
- React Hook Form for form state
- Zod schemas for validation
- Async submission with error handling
- User feedback via toast notifications

### API Integration
```typescript
// Pattern: Centralized API actions
export async function handleSubscription(data: SubscriptionData) {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    throw new Error('Failed to create checkout session')
  }
  
  const { url } = await response.json()
  window.location.href = url
}
```

## Performance Optimization

### Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting via Next.js App Router
- Lazy loading for below-fold content

### Memoization
```typescript
// Pattern: Memoize expensive computations
const recommendations = useMemo(() => {
  if (!profile) return []
  return generateRecommendations(profile)
}, [profile])
```

### Event Listener Optimization
```typescript
// Pattern: Passive listeners and cleanup
useEffect(() => {
  const handleScroll = () => { /* logic */ }
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

## Testing Patterns

### E2E Testing Structure
- Playwright for end-to-end tests
- Test files in `/e2e/` directory
- Descriptive test names (e.g., `checkout-flow.spec.ts`)
- Page object pattern for reusability

### Unit Testing
- Jest for unit tests
- Testing Library for React components
- Test files colocated with source (e.g., `__tests__/`)

## Security Practices

### Environment Variables
- Never commit `.env.local` files
- Use `.env.example` for documentation
- Access via `process.env.VARIABLE_NAME`
- Validate required variables at startup

### API Security
- Webhook signature validation
- CORS headers configuration
- Rate limiting considerations
- Input sanitization and validation

### Headers Configuration
```typescript
// Pattern: Security headers in next.config.js
headers: async () => [{
  source: '/(.*)',
  headers: [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
  ]
}]
```

## Documentation Standards

### Code Comments
- JSDoc for public APIs and complex functions
- Inline comments for non-obvious logic
- TODO comments with context and assignee
- Avoid obvious comments that restate code

### Interface Documentation
```typescript
// Pattern: Self-documenting interfaces
interface WebhookLog {
  eventType: string        // Stripe event type (e.g., 'checkout.session.completed')
  eventId: string          // Unique event identifier
  timestamp: string        // ISO 8601 timestamp
  status: 'success' | 'error'
  details?: any           // Additional context for debugging
}
```

## Git Workflow

### Commit Messages
- Descriptive commit messages
- Present tense ("Add feature" not "Added feature")
- Reference issue numbers when applicable

### Branch Strategy
- Feature branches for new work
- Main branch always deployable
- Pull requests for code review
