# Arquitetura Next.js 14 - Serviço de Lentes com Assinatura

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
```

## Estrutura de Projeto Next.js

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
│   │   │   ├── webhook/route.ts
│   │   │   └── methods/route.ts
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
│   │   ├── stripe.ts
│   │   └── pagseguro.ts
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
│   └── medical.ts
└── middleware.ts                # Next.js middleware
```

## API Routes Implementation

### 1. Autenticação com NextAuth.js v5
```typescript
// lib/auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await db.user.findUnique({
          where: { email: credentials.email as string }
        })
        
        if (!user || !await bcrypt.compare(credentials.password as string, user.password)) {
          return null
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
        session.user.role = token.role as string
      }
      return session
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    }
  },
  pages: {
    signIn: "/login",
    signUp: "/register"
  }
})

// app/api/auth/[...nextauth]/route.ts
export { GET, POST } from "@/lib/auth"
```

### 2. Server Actions para Assinaturas
```typescript
// lib/actions/subscription.ts
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { stripe } from '@/lib/payments/stripe'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const createSubscriptionSchema = z.object({
  planId: z.string(),
  paymentMethodId: z.string(),
  billingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string()
  })
})

export async function createSubscription(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }
  
  const validatedFields = createSubscriptionSchema.safeParse({
    planId: formData.get('planId'),
    paymentMethodId: formData.get('paymentMethodId'),
    billingAddress: {
      street: formData.get('street'),
      city: formData.get('city'),
      state: formData.get('state'),
      zipCode: formData.get('zipCode')
    }
  })
  
  if (!validatedFields.success) {
    return { error: 'Dados inválidos' }
  }
  
  try {
    // Buscar plano
    const plan = await db.plan.findUnique({
      where: { id: validatedFields.data.planId }
    })
    
    if (!plan) {
      return { error: 'Plano não encontrado' }
    }
    
    // Criar assinatura no Stripe
    const stripeSubscription = await stripe.subscriptions.create({
      customer: session.user.stripeCustomerId,
      items: [{ price: plan.stripePriceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    })
    
    // Salvar no banco
    const subscription = await db.subscription.create({
      data: {
        userId: session.user.id,
        planId: validatedFields.data.planId,
        stripeSubscriptionId: stripeSubscription.id,
        status: 'active',
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        amount: plan.price,
        billingAddress: validatedFields.data.billingAddress
      }
    })
    
    revalidatePath('/dashboard/subscription')
    return { success: true, subscriptionId: subscription.id }
    
  } catch (error) {
    console.error('Erro ao criar assinatura:', error)
    return { error: 'Erro interno do servidor' }
  }
}

export async function pauseSubscription(subscriptionId: string) {
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
    
    // Pausar no Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      pause_collection: {
        behavior: 'keep_as_draft'
      }
    })
    
    // Atualizar no banco
    await db.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'paused' }
    })
    
    revalidatePath('/dashboard/subscription')
    return { success: true }
    
  } catch (error) {
    console.error('Erro ao pausar assinatura:', error)
    return { error: 'Erro interno do servidor' }
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
    
    // Cancelar no Stripe
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)
    
    // Atualizar no banco
    await db.subscription.update({
      where: { id: subscriptionId },
      data: { 
        status: 'canceled',
        canceledAt: new Date(),
        cancellationReason: reason
      }
    })
    
    revalidatePath('/dashboard/subscription')
    return { success: true }
    
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error)
    return { error: 'Erro interno do servidor' }
  }
}
```

### 3. API Routes para Pagamentos
```typescript
// app/api/payments/webhook/route.ts
import { stripe } from '@/lib/payments/stripe'
import { db } from '@/lib/db'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!
  
  let event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  try {
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook handler failed:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handlePaymentSucceeded(invoice: any) {
  const subscription = await db.subscription.findFirst({
    where: { stripeSubscriptionId: invoice.subscription }
  })
  
  if (subscription) {
    await db.payment.create({
      data: {
        subscriptionId: subscription.id,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_paid / 100,
        status: 'succeeded',
        paidAt: new Date(invoice.status_transitions.paid_at * 1000)
      }
    })
    
    // Agendar próxima entrega
    await scheduleNextDelivery(subscription.id)
  }
}

async function handlePaymentFailed(invoice: any) {
  const subscription = await db.subscription.findFirst({
    where: { stripeSubscriptionId: invoice.subscription }
  })
  
  if (subscription) {
    await db.payment.create({
      data: {
        subscriptionId: subscription.id,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_due / 100,
        status: 'failed',
        failureReason: invoice.last_finalization_error?.message
      }
    })
    
    // Atualizar status da assinatura
    await db.subscription.update({
      where: { id: subscription.id },
      data: { status: 'past_due' }
    })
  }
}
```

### 4. Telemedicina com WebRTC
```typescript
// components/medical/video-call.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react'

interface VideoCallProps {
  roomId: string
  userId: string
  userType: 'doctor' | 'patient'
}

export function VideoCall({ roomId, userId, userType }: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const socketRef = useRef<WebSocket | null>(null)
  
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  
  useEffect(() => {
    initializeCall()
    return () => {
      cleanup()
    }
  }, [])
  
  const initializeCall = async () => {
    try {
      // Configurar WebSocket
      socketRef.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/medical/${roomId}`)
      
      socketRef.current.onopen = () => {
        socketRef.current?.send(JSON.stringify({
          type: 'join',
          userId,
          userType
        }))
      }
      
      socketRef.current.onmessage = handleSocketMessage
      
      // Obter mídia local
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      // Configurar WebRTC
      setupPeerConnection(stream)
      
    } catch (error) {
      console.error('Erro ao inicializar chamada:', error)
    }
  }
  
  const setupPeerConnection = (stream: MediaStream) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    })
    
    peerConnectionRef.current = peerConnection
    
    // Adicionar stream local
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream)
    })
    
    // Lidar com stream remoto
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
      setIsConnected(true)
    }
    
    // Lidar com ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate
        }))
      }
    }
  }
  
  const handleSocketMessage = async (event: MessageEvent) => {
    const message = JSON.parse(event.data)
    const peerConnection = peerConnectionRef.current
    
    if (!peerConnection) return
    
    switch (message.type) {
      case 'offer':
        await peerConnection.setRemoteDescription(message.offer)
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)
        
        socketRef.current?.send(JSON.stringify({
          type: 'answer',
          answer
        }))
        break
        
      case 'answer':
        await peerConnection.setRemoteDescription(message.answer)
        break
        
      case 'ice-candidate':
        await peerConnection.addIceCandidate(message.candidate)
        break
        
      case 'user-joined':
        if (userType === 'doctor') {
          // Médico inicia a chamada
          const offer = await peerConnection.createOffer()
          await peerConnection.setLocalDescription(offer)
          
          socketRef.current?.send(JSON.stringify({
            type: 'offer',
            offer
          }))
        }
        break
    }
  }
  
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }
  
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }
  
  const endCall = () => {
    cleanup()
    // Redirecionar ou fechar modal
  }
  
  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }
    
    if (socketRef.current) {
      socketRef.current.close()
    }
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 relative">
        {/* Vídeo remoto */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Vídeo local */}
        <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Status de conexão */}
        {!isConnected && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded">
            Conectando...
          </div>
        )}
      </div>
      
      {/* Controles */}
      <div className="flex justify-center items-center p-4 bg-gray-800 space-x-4">
        <Button
          variant={isAudioEnabled ? "default" : "destructive"}
          size="lg"
          onClick={toggleAudio}
        >
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </Button>
        
        <Button
          variant={isVideoEnabled ? "default" : "destructive"}
          size="lg"
          onClick={toggleVideo}
        >
          {isVideoEnabled ? <Video /> : <VideoOff />}
        </Button>
        
        <Button
          variant="destructive"
          size="lg"
          onClick={endCall}
        >
          <Phone />
        </Button>
      </div>
    </div>
  )
}
```

### 5. Cron Jobs com Vercel Cron
```typescript
// app/api/cron/billing/route.ts
import { db } from '@/lib/db'
import { stripe } from '@/lib/payments/stripe'
import { NextResponse } from 'next/server'

export async function GET() {
  // Verificar se é uma requisição autorizada do Vercel Cron
  if (process.env.NODE_ENV === 'production') {
    const authHeader = headers().get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  
  try {
    // Processar cobranças pendentes
    const pendingSubscriptions = await db.subscription.findMany({
      where: {
        status: 'active',
        nextBillingDate: {
          lte: new Date()
        }
      },
      include: {
        user: true,
        plan: true
      }
    })
    
    const results = []
    
    for (const subscription of pendingSubscriptions) {
      try {
        // Criar invoice no Stripe
        const invoice = await stripe.invoices.create({
          customer: subscription.user.stripeCustomerId,
          subscription: subscription.stripeSubscriptionId,
          auto_advance: true
        })
        
        await stripe.invoices.finalizeInvoice(invoice.id)
        
        results.push({
          subscriptionId: subscription.id,
          status: 'success',
          invoiceId: invoice.id
        })
        
      } catch (error) {
        console.error(`Erro ao processar cobrança ${subscription.id}:`, error)
        results.push({
          subscriptionId: subscription.id,
          status: 'error',
          error: error.message
        })
      }
    }
    
    return NextResponse.json({
      processed: results.length,
      results
    })
    
  } catch (error) {
    console.error('Erro no cron de cobrança:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

### 6. Prisma Schema
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
  stripeCustomerId  String?  @unique
  
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
  stripePriceId   String   @unique
  
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
  stripeSubscriptionId  String            @unique
  
  status                SubscriptionStatus
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  nextBillingDate       DateTime
  
  amount                Decimal
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
  stripeInvoiceId   String?       @unique
  
  amount            Decimal
  status            PaymentStatus
  
  paidAt            DateTime?
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

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  PAUSED
  TRIALING
}

enum PaymentStatus {
  PENDING
  SUCCEEDED
  FAILED
  REFUNDED
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

### 7. Deployment Configuration
```json
// package.json
{
  "name": "lentes-subscription",
  "version": "0.1.0",
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
    "@next/bundle-analyzer": "^14.0.0",
    "next-auth": "5.0.0-beta.4",
    "@auth/prisma-adapter": "^1.0.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "stripe": "^14.0.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.47.0",
    "@hookform/resolvers": "^3.3.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.290.0",
    "recharts": "^2.8.0",
    "socket.io-client": "^4.7.0",
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

Esta arquitetura Next.js 14 oferece uma solução completa e moderna para o serviço de assinatura de lentes, aproveitando ao máximo as funcionalidades full-stack do framework.