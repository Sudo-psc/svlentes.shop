# Arquitetura Next.js 14 - Serviço de Lentes com Assinatura (Asaas)

## Stack Tecnológico Next.js 14+

### Core Stack
```
Next.js 14 (App Router)
├── TypeScript
├── React 18 (Server Components)
├── Tailwind CSS + shadcn/ui
├── Prisma ORM
├── NextAuth.js v5
├── Vercel AI SDK
└── PWA capabilities
```

### Full Stack Next.js
```
Frontend (Client Components)
├── React Query/TanStack Query
├── Zustand (client state)
├── React Hook Form + Zod
├── Framer Motion
├── Recharts (analytics)
└── React Webcam (telemedicina)

Backend (API Routes + Server Actions)
├── API Routes (/api)
├── Server Actions
├── Middleware
├── Edge Functions
├── Webhooks
└── Cron Jobs (Vercel Cron)

Database & Storage
├── PostgreSQL (Neon/Supabase)
├── Redis (Upstash)
├── File Storage (Vercel Blob/S3)
└── Vector DB (Pinecone - para IA)

Payment Integration
├── Asaas API v3
├── PIX
├── Boleto Bancário
├── Cartão de Crédito
└── Webhooks para eventos de pagamento
```

## Integração Asaas API v3

### Características da API Asaas

**Base URLs**:
- Production: `https://api.asaas.com/v3`
- Sandbox: `https://sandbox.asaas.com/api/v3`

**Autenticação**:
- Header: `access_token: $aact_prod_xxxxx` (produção)
- Header: `access_token: $aact_hmlg_xxxxx` (sandbox)
- Obrigatório: `User-Agent` header (contas criadas após 06/11/2024)
- Content-Type: `application/json`

**Recursos Principais**:
- Clientes (Customers)
- Assinaturas (Subscriptions)
- Cobranças (Payments)
- Webhooks
- Métodos de pagamento: PIX, Boleto, Cartão

### Estrutura de Projeto Next.js

```
src/
├── app/                          # App Router
│   ├── (auth)/                   # Route Groups
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── subscription/
│   │   │   ├── page.tsx
│   │   │   ├── plans/page.tsx
│   │   │   └── billing/page.tsx
│   │   ├── medical/
│   │   │   ├── page.tsx
│   │   │   ├── consultations/page.tsx
│   │   │   ├── history/page.tsx
│   │   │   └── telemedicine/
│   │   │       └── [roomId]/page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── admin/
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx
│   │   ├── subscriptions/page.tsx
│   │   └── analytics/page.tsx
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts
│   │   ├── users/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── subscriptions/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── payments/
│   │   │   ├── route.ts
│   │   │   ├── webhook/route.ts      # Webhook Asaas
│   │   │   └── methods/route.ts
│   │   ├── asaas/
│   │   │   ├── customers/route.ts
│   │   │   ├── subscriptions/route.ts
│   │   │   └── charges/route.ts
│   │   ├── medical/
│   │   │   ├── consultations/route.ts
│   │   │   ├── doctors/route.ts
│   │   │   └── prescriptions/route.ts
│   │   ├── inventory/
│   │   │   └── lenses/route.ts
│   │   └── cron/
│   │       ├── billing/route.ts
│   │       └── notifications/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/                   # Componentes reutilizáveis
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   └── ...
│   ├── forms/
│   │   ├── subscription-form.tsx
│   │   ├── payment-form.tsx
│   │   └── medical-form.tsx
│   ├── charts/
│   │   ├── subscription-chart.tsx
│   │   └── revenue-chart.tsx
│   ├── medical/
│   │   ├── video-call.tsx
│   │   ├── prescription-viewer.tsx
│   │   └── consultation-chat.tsx
│   └── layout/
│       ├── header.tsx
│       ├── sidebar.tsx
│       └── footer.tsx
├── lib/                         # Utilitários e configurações
│   ├── auth.ts                  # NextAuth config
│   ├── db.ts                    # Prisma client
│   ├── redis.ts                 # Redis client
│   ├── payments/
│   │   ├── asaas.ts            # Cliente Asaas
│   │   ├── asaas-webhook.ts    # Validação de webhooks
│   │   └── asaas-types.ts      # Types para Asaas
│   ├── email.ts                 # Resend/SendGrid
│   ├── websocket.ts             # Socket.io config
│   ├── ai.ts                    # Vercel AI SDK
│   ├── validations.ts           # Zod schemas
│   └── utils.ts
├── hooks/                       # Custom hooks
│   ├── use-subscription.ts
│   ├── use-payments.ts
│   └── use-medical.ts
├── stores/                      # Zustand stores
│   ├── auth-store.ts
│   ├── subscription-store.ts
│   └── medical-store.ts
├── types/                       # TypeScript types
│   ├── auth.ts
│   ├── subscription.ts
│   ├── payment.ts
│   ├── asaas.ts
│   └── medical.ts
└── middleware.ts                # Next.js middleware
```

## Implementação Asaas

### 1. Cliente Asaas

```typescript
// lib/payments/asaas.ts
import { AsaasCustomer, AsaasSubscription, AsaasPayment } from '@/types/asaas'

class AsaasClient {
  private baseURL: string
  private apiKey: string
  private headers: HeadersInit

  constructor() {
    this.baseURL = process.env.ASAAS_ENV === 'production'
      ? 'https://api.asaas.com/v3'
      : 'https://sandbox.asaas.com/api/v3'

    this.apiKey = process.env.ASAAS_ENV === 'production'
      ? process.env.ASAAS_API_KEY_PROD!
      : process.env.ASAAS_API_KEY_SANDBOX!

    this.headers = {
      'Content-Type': 'application/json',
      'access_token': this.apiKey,
      'User-Agent': 'SV-Lentes/1.0.0'
    }
  }

  // ========== CLIENTES ==========

  async createCustomer(data: {
    name: string
    cpfCnpj: string
    email: string
    phone?: string
    mobilePhone: string
    address?: string
    addressNumber?: string
    complement?: string
    province?: string
    postalCode?: string
  }): Promise<AsaasCustomer> {
    const response = await fetch(`${this.baseURL}/customers`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Asaas Error: ${error.errors?.[0]?.description || 'Unknown error'}`)
    }

    return response.json()
  }

  async getCustomer(customerId: string): Promise<AsaasCustomer> {
    const response = await fetch(`${this.baseURL}/customers/${customerId}`, {
      method: 'GET',
      headers: this.headers
    })

    if (!response.ok) {
      throw new Error('Failed to get customer')
    }

    return response.json()
  }

  async updateCustomer(customerId: string, data: Partial<AsaasCustomer>): Promise<AsaasCustomer> {
    const response = await fetch(`${this.baseURL}/customers/${customerId}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to update customer')
    }

    return response.json()
  }

  async listCustomers(params?: {
    email?: string
    cpfCnpj?: string
    offset?: number
    limit?: number
  }): Promise<{ data: AsaasCustomer[], hasMore: boolean }> {
    const queryParams = new URLSearchParams()
    if (params?.email) queryParams.append('email', params.email)
    if (params?.cpfCnpj) queryParams.append('cpfCnpj', params.cpfCnpj)
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const response = await fetch(
      `${this.baseURL}/customers?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: this.headers
      }
    )

    if (!response.ok) {
      throw new Error('Failed to list customers')
    }

    return response.json()
  }

  // ========== ASSINATURAS ==========

  async createSubscription(data: {
    customer: string
    billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX'
    value: number
    nextDueDate: string // YYYY-MM-DD
    cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY'
    description?: string
    endDate?: string
    maxPayments?: number
    externalReference?: string
    split?: Array<{
      walletId: string
      percentualValue?: number
      fixedValue?: number
    }>
  }): Promise<AsaasSubscription> {
    const response = await fetch(`${this.baseURL}/subscriptions`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Asaas Error: ${error.errors?.[0]?.description || 'Unknown error'}`)
    }

    return response.json()
  }

  async getSubscription(subscriptionId: string): Promise<AsaasSubscription> {
    const response = await fetch(`${this.baseURL}/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: this.headers
    })

    if (!response.ok) {
      throw new Error('Failed to get subscription')
    }

    return response.json()
  }

  async updateSubscription(
    subscriptionId: string,
    data: {
      value?: number
      nextDueDate?: string
      cycle?: string
      description?: string
      updatePendingPayments?: boolean
    }
  ): Promise<AsaasSubscription> {
    const response = await fetch(`${this.baseURL}/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to update subscription')
    }

    return response.json()
  }

  async deleteSubscription(subscriptionId: string): Promise<{ deleted: boolean }> {
    const response = await fetch(`${this.baseURL}/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: this.headers
    })

    if (!response.ok) {
      throw new Error('Failed to delete subscription')
    }

    return response.json()
  }

  async listSubscriptions(params?: {
    customer?: string
    status?: string
    offset?: number
    limit?: number
  }): Promise<{ data: AsaasSubscription[], hasMore: boolean }> {
    const queryParams = new URLSearchParams()
    if (params?.customer) queryParams.append('customer', params.customer)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const response = await fetch(
      `${this.baseURL}/subscriptions?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: this.headers
      }
    )

    if (!response.ok) {
      throw new Error('Failed to list subscriptions')
    }

    return response.json()
  }

  // ========== COBRANÇAS ==========

  async createPayment(data: {
    customer: string
    billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX'
    value: number
    dueDate: string // YYYY-MM-DD
    description?: string
    externalReference?: string
    installmentCount?: number
    installmentValue?: number
    discount?: {
      value: number
      dueDateLimitDays?: number
      type?: 'FIXED' | 'PERCENTAGE'
    }
    interest?: {
      value: number
    }
    fine?: {
      value: number
    }
    postalService?: boolean
    split?: Array<{
      walletId: string
      percentualValue?: number
      fixedValue?: number
    }>
  }): Promise<AsaasPayment> {
    const response = await fetch(`${this.baseURL}/payments`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Asaas Error: ${error.errors?.[0]?.description || 'Unknown error'}`)
    }

    return response.json()
  }

  async getPayment(paymentId: string): Promise<AsaasPayment> {
    const response = await fetch(`${this.baseURL}/payments/${paymentId}`, {
      method: 'GET',
      headers: this.headers
    })

    if (!response.ok) {
      throw new Error('Failed to get payment')
    }

    return response.json()
  }

  async getPaymentByExternalReference(externalReference: string): Promise<AsaasPayment> {
    const response = await fetch(
      `${this.baseURL}/payments?externalReference=${externalReference}`,
      {
        method: 'GET',
        headers: this.headers
      }
    )

    if (!response.ok) {
      throw new Error('Failed to get payment')
    }

    const data = await response.json()
    return data.data[0]
  }

  async listPayments(params?: {
    customer?: string
    subscription?: string
    status?: string
    offset?: number
    limit?: number
  }): Promise<{ data: AsaasPayment[], hasMore: boolean }> {
    const queryParams = new URLSearchParams()
    if (params?.customer) queryParams.append('customer', params.customer)
    if (params?.subscription) queryParams.append('subscription', params.subscription)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const response = await fetch(
      `${this.baseURL}/payments?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: this.headers
      }
    )

    if (!response.ok) {
      throw new Error('Failed to list payments')
    }

    return response.json()
  }

  async refundPayment(paymentId: string, value?: number): Promise<AsaasPayment> {
    const response = await fetch(`${this.baseURL}/payments/${paymentId}/refund`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ value })
    })

    if (!response.ok) {
      throw new Error('Failed to refund payment')
    }

    return response.json()
  }
}

export const asaas = new AsaasClient()
```

### 2. Types Asaas

```typescript
// types/asaas.ts

export interface AsaasCustomer {
  id: string
  name: string
  cpfCnpj: string
  email: string
  phone?: string
  mobilePhone: string
  address?: string
  addressNumber?: string
  complement?: string
  province?: string
  postalCode?: string
  externalReference?: string
  notificationDisabled?: boolean
  observations?: string
  deleted?: boolean
}

export interface AsaasSubscription {
  id: string
  customer: string
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX'
  value: number
  nextDueDate: string
  cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY'
  description?: string
  status: 'ACTIVE' | 'EXPIRED' | 'INACTIVE'
  deleted: boolean
  endDate?: string
  maxPayments?: number
  externalReference?: string
}

export interface AsaasPayment {
  id: string
  customer: string
  subscription?: string
  installment?: string
  dateCreated: string
  dueDate: string
  value: number
  netValue: number
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX'
  status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'REFUND_REQUESTED' | 'CHARGEBACK_REQUESTED' | 'CHARGEBACK_DISPUTE' | 'AWAITING_CHARGEBACK_REVERSAL' | 'DUNNING_REQUESTED' | 'DUNNING_RECEIVED' | 'AWAITING_RISK_ANALYSIS'
  description?: string
  externalReference?: string
  confirmedDate?: string
  paymentDate?: string
  clientPaymentDate?: string
  installmentNumber?: number
  transactionReceiptUrl?: string
  nossoNumero?: string
  invoiceUrl?: string
  bankSlipUrl?: string
  invoiceNumber?: string
  discount?: {
    value: number
    dueDateLimitDays?: number
    type?: 'FIXED' | 'PERCENTAGE'
  }
  interest?: {
    value: number
  }
  fine?: {
    value: number
  }
  deleted: boolean
  postalService: boolean
  anticipated: boolean
  refunds?: AsaasRefund[]
}

export interface AsaasRefund {
  id: string
  status: string
  value: number
  description?: string
  transactionReceiptUrl?: string
}

export type AsaasWebhookEvent =
  | 'PAYMENT_CREATED'
  | 'PAYMENT_AWAITING_RISK_ANALYSIS'
  | 'PAYMENT_APPROVED_BY_RISK_ANALYSIS'
  | 'PAYMENT_REPROVED_BY_RISK_ANALYSIS'
  | 'PAYMENT_UPDATED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_CREDIT_CARD_CAPTURE_REFUSED'
  | 'PAYMENT_ANTICIPATED'
  | 'PAYMENT_OVERDUE'
  | 'PAYMENT_DELETED'
  | 'PAYMENT_RESTORED'
  | 'PAYMENT_REFUNDED'
  | 'PAYMENT_RECEIVED_IN_CASH_UNDONE'
  | 'PAYMENT_CHARGEBACK_REQUESTED'
  | 'PAYMENT_CHARGEBACK_DISPUTE'
  | 'PAYMENT_AWAITING_CHARGEBACK_REVERSAL'
  | 'PAYMENT_DUNNING_RECEIVED'
  | 'PAYMENT_DUNNING_REQUESTED'
  | 'PAYMENT_BANK_SLIP_VIEWED'
  | 'PAYMENT_CHECKOUT_VIEWED'

export interface AsaasWebhookPayload {
  event: AsaasWebhookEvent
  payment: AsaasPayment
}
```

### 3. Server Actions para Assinaturas

```typescript
// lib/actions/subscription.ts
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { asaas } from '@/lib/payments/asaas'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const createSubscriptionSchema = z.object({
  planId: z.string(),
  billingType: z.enum(['BOLETO', 'CREDIT_CARD', 'PIX']),
  billingAddress: z.object({
    street: z.string(),
    number: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    complement: z.string().optional()
  })
})

export async function createSubscription(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const validatedFields = createSubscriptionSchema.safeParse({
    planId: formData.get('planId'),
    billingType: formData.get('billingType'),
    billingAddress: {
      street: formData.get('street'),
      number: formData.get('number'),
      city: formData.get('city'),
      state: formData.get('state'),
      zipCode: formData.get('zipCode'),
      complement: formData.get('complement')
    }
  })

  if (!validatedFields.success) {
    return { error: 'Dados inválidos' }
  }

  try {
    // Buscar usuário com dados completos
    const user = await db.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return { error: 'Usuário não encontrado' }
    }

    // Buscar plano
    const plan = await db.plan.findUnique({
      where: { id: validatedFields.data.planId }
    })

    if (!plan) {
      return { error: 'Plano não encontrado' }
    }

    // Criar ou atualizar cliente no Asaas
    let asaasCustomerId = user.asaasCustomerId

    if (!asaasCustomerId) {
      const asaasCustomer = await asaas.createCustomer({
        name: user.name!,
        cpfCnpj: user.cpf!,
        email: user.email!,
        mobilePhone: user.phone!,
        address: validatedFields.data.billingAddress.street,
        addressNumber: validatedFields.data.billingAddress.number,
        complement: validatedFields.data.billingAddress.complement,
        province: validatedFields.data.billingAddress.state,
        postalCode: validatedFields.data.billingAddress.zipCode.replace(/\D/g, '')
      })

      asaasCustomerId = asaasCustomer.id

      // Atualizar usuário com ID do Asaas
      await db.user.update({
        where: { id: user.id },
        data: { asaasCustomerId }
      })
    }

    // Calcular próxima data de vencimento (7 dias a partir de hoje)
    const nextDueDate = new Date()
    nextDueDate.setDate(nextDueDate.getDate() + 7)
    const nextDueDateStr = nextDueDate.toISOString().split('T')[0]

    // Criar assinatura no Asaas
    const asaasSubscription = await asaas.createSubscription({
      customer: asaasCustomerId,
      billingType: validatedFields.data.billingType,
      value: Number(plan.price),
      nextDueDate: nextDueDateStr,
      cycle: plan.interval === 'MONTHLY' ? 'MONTHLY' :
             plan.interval === 'QUARTERLY' ? 'QUARTERLY' : 'SEMIANNUALLY',
      description: `Assinatura ${plan.name} - SV Lentes`,
      externalReference: `plan_${plan.id}_user_${user.id}`
    })

    // Salvar no banco
    const subscription = await db.subscription.create({
      data: {
        userId: session.user.id,
        planId: validatedFields.data.planId,
        asaasSubscriptionId: asaasSubscription.id,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: nextDueDate,
        nextBillingDate: nextDueDate,
        amount: plan.price,
        billingType: validatedFields.data.billingType,
        billingAddress: validatedFields.data.billingAddress
      }
    })

    revalidatePath('/dashboard/subscription')
    return { success: true, subscriptionId: subscription.id }

  } catch (error) {
    console.error('Erro ao criar assinatura:', error)
    return { error: error instanceof Error ? error.message : 'Erro interno do servidor' }
  }
}

export async function cancelSubscription(subscriptionId: string, reason?: string) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  try {
    const subscription = await db.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: session.user.id
      }
    })

    if (!subscription) {
      return { error: 'Assinatura não encontrada' }
    }

    // Cancelar no Asaas
    await asaas.deleteSubscription(subscription.asaasSubscriptionId)

    // Atualizar no banco
    await db.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
        cancellationReason: reason
      }
    })

    revalidatePath('/dashboard/subscription')
    return { success: true }

  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error)
    return { error: error instanceof Error ? error.message : 'Erro interno do servidor' }
  }
}
```

### 4. Webhook Handler

```typescript
// app/api/payments/webhook/route.ts
import { asaas } from '@/lib/payments/asaas'
import { db } from '@/lib/db'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { AsaasWebhookPayload } from '@/types/asaas'

export async function POST(request: NextRequest) {
  const body: AsaasWebhookPayload = await request.json()

  try {
    switch (body.event) {
      case 'PAYMENT_CREATED':
        await handlePaymentCreated(body.payment)
        break

      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED':
        await handlePaymentReceived(body.payment)
        break

      case 'PAYMENT_OVERDUE':
        await handlePaymentOverdue(body.payment)
        break

      case 'PAYMENT_REFUNDED':
        await handlePaymentRefunded(body.payment)
        break

      default:
        console.log(`Unhandled event type: ${body.event}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook handler failed:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handlePaymentCreated(payment: any) {
  // Buscar assinatura associada
  const subscription = await db.subscription.findFirst({
    where: { asaasSubscriptionId: payment.subscription }
  })

  if (subscription) {
    await db.payment.create({
      data: {
        subscriptionId: subscription.id,
        asaasPaymentId: payment.id,
        amount: payment.value,
        status: 'PENDING',
        dueDate: new Date(payment.dueDate),
        billingType: payment.billingType,
        invoiceUrl: payment.invoiceUrl,
        bankSlipUrl: payment.bankSlipUrl
      }
    })
  }
}

async function handlePaymentReceived(payment: any) {
  const dbPayment = await db.payment.findFirst({
    where: { asaasPaymentId: payment.id },
    include: { subscription: true }
  })

  if (dbPayment) {
    await db.payment.update({
      where: { id: dbPayment.id },
      data: {
        status: 'RECEIVED',
        paidAt: new Date(payment.paymentDate || payment.clientPaymentDate),
        confirmedAt: payment.confirmedDate ? new Date(payment.confirmedDate) : null
      }
    })

    // Agendar próxima entrega
    await scheduleNextDelivery(dbPayment.subscription.id)

    // Atualizar período da assinatura
    const currentPeriodEnd = new Date(dbPayment.subscription.currentPeriodEnd)
    const nextPeriodEnd = new Date(currentPeriodEnd)

    // Adicionar período baseado no ciclo
    const cycle = dbPayment.subscription.billingCycle
    if (cycle === 'MONTHLY') nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1)
    else if (cycle === 'QUARTERLY') nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 3)
    else if (cycle === 'SEMIANNUALLY') nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 6)

    await db.subscription.update({
      where: { id: dbPayment.subscription.id },
      data: {
        currentPeriodStart: currentPeriodEnd,
        currentPeriodEnd: nextPeriodEnd,
        nextBillingDate: nextPeriodEnd
      }
    })
  }
}

async function handlePaymentOverdue(payment: any) {
  const dbPayment = await db.payment.findFirst({
    where: { asaasPaymentId: payment.id },
    include: { subscription: true }
  })

  if (dbPayment) {
    await db.payment.update({
      where: { id: dbPayment.id },
      data: { status: 'OVERDUE' }
    })

    // Atualizar status da assinatura
    await db.subscription.update({
      where: { id: dbPayment.subscription.id },
      data: { status: 'PAST_DUE' }
    })

    // TODO: Enviar notificação ao cliente
  }
}

async function handlePaymentRefunded(payment: any) {
  const dbPayment = await db.payment.findFirst({
    where: { asaasPaymentId: payment.id }
  })

  if (dbPayment) {
    await db.payment.update({
      where: { id: dbPayment.id },
      data: {
        status: 'REFUNDED',
        refundedAt: new Date()
      }
    })
  }
}

async function scheduleNextDelivery(subscriptionId: string) {
  // Implementar lógica de agendamento de entrega
  console.log(`Scheduling delivery for subscription ${subscriptionId}`)
}
```

### 5. Prisma Schema Atualizado

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String   @id @default(cuid())
  email             String   @unique
  name              String?
  password          String?
  role              Role     @default(USER)
  asaasCustomerId   String?  @unique // ID do cliente no Asaas

  // Dados médicos
  cpf               String?  @unique
  phone             String?
  birthDate         DateTime?

  // Endereço
  address           Json?

  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relacionamentos
  subscriptions     Subscription[]
  consultations     Consultation[]
  prescriptions     Prescription[]
  accounts          Account[]
  sessions          Session[]

  @@map("users")
}

model Plan {
  id              String   @id @default(cuid())
  name            String
  description     String?
  price           Decimal
  interval        Interval

  // Recursos
  lensesPerMonth  Int
  consultations   Int      // -1 para ilimitado
  emergencySupport Boolean @default(false)
  premiumBrands   Boolean @default(false)

  active          Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  subscriptions   Subscription[]

  @@map("plans")
}

model Subscription {
  id                    String            @id @default(cuid())
  userId                String
  planId                String
  asaasSubscriptionId   String            @unique // ID da assinatura no Asaas

  status                SubscriptionStatus
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  nextBillingDate       DateTime

  amount                Decimal
  billingType           BillingType       // BOLETO, CREDIT_CARD, PIX
  billingAddress        Json?

  // Cancelamento
  cancelAtPeriodEnd     Boolean           @default(false)
  canceledAt            DateTime?
  cancellationReason    String?

  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt

  // Relacionamentos
  user                  User              @relation(fields: [userId], references: [id])
  plan                  Plan              @relation(fields: [planId], references: [id])
  payments              Payment[]
  deliveries            Delivery[]

  @@map("subscriptions")
}

model Payment {
  id                String        @id @default(cuid())
  subscriptionId    String
  asaasPaymentId    String?       @unique // ID da cobrança no Asaas

  amount            Decimal
  status            PaymentStatus
  billingType       BillingType

  dueDate           DateTime
  paidAt            DateTime?
  confirmedAt       DateTime?
  refundedAt        DateTime?

  invoiceUrl        String?       // URL do invoice
  bankSlipUrl       String?       // URL do boleto
  pixQrCode         String?       // QR Code PIX

  failureReason     String?

  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  subscription      Subscription  @relation(fields: [subscriptionId], references: [id])

  @@map("payments")
}

model Consultation {
  id          String              @id @default(cuid())
  patientId   String
  doctorId    String?

  scheduledAt DateTime
  startedAt   DateTime?
  endedAt     DateTime?

  status      ConsultationStatus
  type        ConsultationType

  notes       String?
  prescription String?

  // WebRTC
  roomId      String?             @unique

  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  patient     User                @relation(fields: [patientId], references: [id])

  @@map("consultations")
}

model Prescription {
  id          String   @id @default(cuid())
  userId      String
  doctorName  String

  // Dados da prescrição
  rightEye    Json     // { sphere, cylinder, axis, add }
  leftEye     Json

  lensType    String   // daily, weekly, monthly
  brand       String?

  validUntil  DateTime
  isActive    Boolean  @default(true)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id])

  @@map("prescriptions")
}

model Delivery {
  id             String       @id @default(cuid())
  subscriptionId String

  scheduledDate  DateTime
  deliveredAt    DateTime?

  status         DeliveryStatus
  trackingCode   String?

  items          Json         // Array de lentes
  address        Json

  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  subscription   Subscription @relation(fields: [subscriptionId], references: [id])

  @@map("deliveries")
}

// Enums
enum Role {
  USER
  DOCTOR
  ADMIN
}

enum Interval {
  MONTHLY
  QUARTERLY
  SEMI_ANNUAL
}

enum BillingType {
  BOLETO
  CREDIT_CARD
  PIX
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  PAUSED
  TRIALING
}

enum PaymentStatus {
  PENDING
  RECEIVED
  CONFIRMED
  OVERDUE
  REFUNDED
  FAILED
}

enum ConsultationStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELED
}

enum ConsultationType {
  ROUTINE
  EMERGENCY
  FOLLOW_UP
}

enum DeliveryStatus {
  SCHEDULED
  SHIPPED
  DELIVERED
  FAILED
}

// NextAuth.js models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verificationtokens")
}
```

### 6. Variáveis de Ambiente

```env
# .env.local

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/svlentes"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Asaas
ASAAS_ENV="sandbox" # ou "production"
ASAAS_API_KEY_SANDBOX="$aact_hmlg_your_sandbox_key"
ASAAS_API_KEY_PROD="$aact_prod_your_production_key"

# Redis
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# Email
RESEND_API_KEY="your-resend-key"

# Others
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CRON_SECRET="your-cron-secret"
```

## Eventos de Webhook Asaas

### Principais Eventos de Cobrança

1. **PAYMENT_CREATED**: Nova cobrança criada
2. **PAYMENT_AWAITING_RISK_ANALYSIS**: Aguardando análise de risco
3. **PAYMENT_APPROVED_BY_RISK_ANALYSIS**: Aprovado pela análise de risco
4. **PAYMENT_RECEIVED**: Pagamento recebido
5. **PAYMENT_CONFIRMED**: Pagamento confirmado
6. **PAYMENT_OVERDUE**: Cobrança vencida
7. **PAYMENT_REFUNDED**: Pagamento estornado
8. **PAYMENT_DELETED**: Cobrança deletada
9. **PAYMENT_RESTORED**: Cobrança restaurada

### Fluxos de Pagamento

**Boleto**:
1. PAYMENT_CREATED
2. PAYMENT_RECEIVED (quando pago)
3. PAYMENT_CONFIRMED (após compensação)

**PIX**:
1. PAYMENT_CREATED
2. PAYMENT_RECEIVED (pagamento instantâneo)
3. PAYMENT_CONFIRMED

**Cartão de Crédito**:
1. PAYMENT_CREATED
2. PAYMENT_AWAITING_RISK_ANALYSIS
3. PAYMENT_APPROVED_BY_RISK_ANALYSIS
4. PAYMENT_CONFIRMED

## Deployment

```json
// package.json
{
  "name": "sv-lentes",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "typescript": "^5",
    "next-auth": "5.0.0-beta.4",
    "@auth/prisma-adapter": "^1.0.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.47.0",
    "@hookform/resolvers": "^3.3.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.290.0",
    "bcryptjs": "^2.4.3",
    "resend": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/bcryptjs": "^2.4.0",
    "eslint": "^8",
    "eslint-config-next": "14.0.0",
    "autoprefixer": "^10",
    "postcss": "^8"
  }
}
```

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/billing",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/notifications",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

## Próximos Passos

1. ✅ Configurar conta Asaas (sandbox e produção)
2. ✅ Obter API keys
3. ✅ Implementar cliente Asaas
4. ✅ Atualizar models do Prisma
5. ✅ Implementar webhooks
6. ✅ Testar fluxos de pagamento
7. ⏳ Implementar testes unitários
8. ⏳ Configurar monitoramento
9. ⏳ Deploy em produção

Esta arquitetura oferece integração completa com Asaas para pagamentos recorrentes via PIX, Boleto e Cartão de Crédito, adequada ao mercado brasileiro.
