# Arquitetura Full Stack - Serviço de Lentes com Assinatura

> **Nota**: Esta arquitetura foi atualizada para Next.js 14. Veja o arquivo `arquitetura-nextjs.md` para a implementação completa com Next.js.

## Migração para Next.js 14

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

### Estrutura de Projeto Next.js
```
src/
├── app/                          # App Router
│   ├── (auth)/                   # Route Groups
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── subscription/
│   │   ├── medical/
│   │   └── profile/
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   ├── subscriptions/
│   │   ├── payments/
│   │   ├── medical/
│   │   └── webhooks/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Componentes reutilizáveis
│   ├── ui/                      # shadcn/ui components
│   ├── forms/
│   ├── charts/
│   └── medical/
├── lib/                         # Utilitários e configurações
│   ├── auth.ts                  # NextAuth config
│   ├── db.ts                    # Prisma client
│   ├── redis.ts                 # Redis client
│   ├── payments.ts              # Stripe/PagSeguro
│   ├── email.ts                 # Resend/SendGrid
│   └── utils.ts
├── hooks/                       # Custom hooks
├── stores/                      # Zustand stores
├── types/                       # TypeScript types
└── middleware.ts                # Next.js middleware
```

## Arquitetura Next.js Detalhada

### 1. User Service
```javascript
// Endpoints principais
POST /api/users/register
POST /api/users/login
GET /api/users/profile
PUT /api/users/profile
POST /api/users/upload-prescription

// Funcionalidades
- Autenticação JWT
- Perfil médico
- Preferências
- Histórico de pedidos
```

### 2. Subscription Service
```javascript
// Endpoints principais
POST /api/subscriptions/create
GET /api/subscriptions/user/:id
PUT /api/subscriptions/modify
POST /api/subscriptions/pause
POST /api/subscriptions/cancel

// Funcionalidades
- Gestão de planos
- Cobrança recorrente
- Upgrade/downgrade
- Pausar/reativar
```

### 3. Payment Service
```javascript
// Endpoints principais
POST /api/payments/process
GET /api/payments/history
POST /api/payments/webhook
PUT /api/payments/method

// Integrações
- Stripe/PagSeguro
- PIX
- Boleto bancário
- Cartão recorrente
```

### 4. Medical Service
```javascript
// Endpoints principais
POST /api/medical/consultation
GET /api/medical/history
POST /api/medical/prescription
GET /api/medical/doctors

// Funcionalidades
- Telemedicina
- Histórico médico
- Prescrições digitais
- Agendamento
```

### 5. Inventory Service
```javascript
// Endpoints principais
GET /api/inventory/lenses
POST /api/inventory/reserve
PUT /api/inventory/update
GET /api/inventory/availability

// Funcionalidades
- Controle de estoque
- Reserva automática
- Previsão de demanda
- Integração fornecedores
```

## Implementação do Sistema de Pagamento Recorrente

### Estrutura de Dados
```typescript
interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'paused' | 'cancelled' | 'past_due';
  billingCycle: 'monthly' | 'quarterly' | 'semi_annual';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  nextBillingDate: Date;
  amount: number;
  currency: string;
  paymentMethodId: string;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
  metadata: {
    lensType: string;
    deliveryFrequency: number;
    medicalPlan: string;
  };
}

interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: Date;
  paidAt?: Date;
  failureReason?: string;
  invoiceId: string;
}
```

### Processamento de Cobrança
```typescript
// Serviço de cobrança recorrente
class BillingService {
  async processRecurringPayments() {
    const dueSubscriptions = await this.getDueSubscriptions();
    
    for (const subscription of dueSubscriptions) {
      try {
        await this.processPayment(subscription);
        await this.scheduleNextDelivery(subscription);
        await this.updateSubscription(subscription);
      } catch (error) {
        await this.handlePaymentFailure(subscription, error);
      }
    }
  }

  async handlePaymentFailure(subscription: Subscription, error: Error) {
    // Retry logic
    const retryCount = await this.getRetryCount(subscription.id);
    
    if (retryCount < 3) {
      await this.scheduleRetry(subscription, retryCount + 1);
    } else {
      await this.pauseSubscription(subscription);
      await this.notifyUser(subscription.userId, 'payment_failed');
    }
  }
}
```

## Sistema de Telemedicina

### WebRTC para Videochamadas
```typescript
// Implementação básica de videochamada
class TelemedicineService {
  async createConsultation(doctorId: string, patientId: string) {
    const room = await this.createRoom();
    
    // Notificar participantes
    await this.notifyDoctor(doctorId, room.id);
    await this.notifyPatient(patientId, room.id);
    
    return room;
  }

  async joinRoom(roomId: string, userId: string, userType: 'doctor' | 'patient') {
    const peer = new RTCPeerConnection(this.iceServers);
    
    // Configurar streams
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    
    peer.addStream(stream);
    
    return { peer, stream };
  }
}
```

### Chat Médico em Tempo Real
```typescript
// WebSocket para chat
class MedicalChatService {
  constructor(private io: SocketIO.Server) {
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      socket.on('join_consultation', (consultationId) => {
        socket.join(`consultation_${consultationId}`);
      });

      socket.on('send_message', async (data) => {
        await this.saveMessage(data);
        socket.to(`consultation_${data.consultationId}`)
              .emit('new_message', data);
      });
    });
  }
}
```

## Sistema de Notificações

### Múltiplos Canais
```typescript
interface NotificationService {
  // Email
  sendEmail(to: string, template: string, data: any): Promise<void>;
  
  // SMS
  sendSMS(phone: string, message: string): Promise<void>;
  
  // Push notifications
  sendPush(userId: string, title: string, body: string): Promise<void>;
  
  // WhatsApp Business
  sendWhatsApp(phone: string, template: string, params: any): Promise<void>;
}

// Implementação de lembretes automáticos
class ReminderService {
  async scheduleDeliveryReminder(subscription: Subscription) {
    const reminderDate = new Date(subscription.nextBillingDate);
    reminderDate.setDate(reminderDate.getDate() - 3); // 3 dias antes
    
    await this.scheduleJob('delivery_reminder', reminderDate, {
      userId: subscription.userId,
      message: 'Suas lentes serão entregues em 3 dias!'
    });
  }

  async scheduleMedicalCheckup(userId: string, lastExam: Date) {
    const nextExam = new Date(lastExam);
    nextExam.setMonth(nextExam.getMonth() + 6); // 6 meses depois
    
    await this.scheduleJob('medical_reminder', nextExam, {
      userId,
      message: 'Hora do seu check-up oftalmológico!'
    });
  }
}
```

## Segurança e Compliance

### Criptografia de Dados Médicos
```typescript
class MedicalDataEncryption {
  private readonly algorithm = 'aes-256-gcm';
  
  encrypt(data: any): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, process.env.MEDICAL_KEY);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: cipher.getAuthTag().toString('hex')
    };
  }

  decrypt(encryptedData: EncryptedData): any {
    const decipher = crypto.createDecipher(this.algorithm, process.env.MEDICAL_KEY);
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }
}
```

### Auditoria e Logs
```typescript
class AuditService {
  async logMedicalAccess(userId: string, doctorId: string, action: string) {
    await this.createAuditLog({
      type: 'medical_access',
      userId,
      doctorId,
      action,
      timestamp: new Date(),
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent()
    });
  }

  async logPaymentEvent(subscriptionId: string, event: string, amount: number) {
    await this.createAuditLog({
      type: 'payment',
      subscriptionId,
      event,
      amount,
      timestamp: new Date()
    });
  }
}
```

## Deploy e DevOps

### Docker Configuration
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose para Desenvolvimento
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/lenses
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: lenses
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Deploy commands here
```

## Monitoramento e Analytics

### Métricas de Performance
```typescript
class MetricsService {
  async trackSubscriptionMetrics() {
    const metrics = {
      activeSubscriptions: await this.countActiveSubscriptions(),
      churnRate: await this.calculateChurnRate(),
      mrr: await this.calculateMRR(),
      ltv: await this.calculateLTV()
    };
    
    await this.sendToAnalytics(metrics);
  }

  async trackMedicalMetrics() {
    const metrics = {
      consultationsToday: await this.countTodayConsultations(),
      averageWaitTime: await this.calculateAverageWaitTime(),
      patientSatisfaction: await this.getAverageSatisfaction()
    };
    
    await this.sendToAnalytics(metrics);
  }
}
```

Este documento fornece uma base sólida para implementar o serviço de assinatura de lentes com acompanhamento médico usando uma arquitetura full stack moderna e escalável.
A arquitetu
ra foi completamente redesenhada para aproveitar as funcionalidades full-stack do Next.js 14:

### Principais Mudanças

1. **App Router**: Migração completa para o novo App Router
2. **Server Actions**: Substituição de APIs REST por Server Actions para operações de dados
3. **Server Components**: Renderização no servidor para melhor performance
4. **NextAuth.js v5**: Sistema de autenticação integrado
5. **Prisma ORM**: Banco de dados type-safe
6. **Vercel Cron**: Jobs agendados nativos
7. **Edge Functions**: Processamento distribuído

### Benefícios da Arquitetura Next.js

- **Performance**: Server Components e otimizações automáticas
- **SEO**: Renderização no servidor out-of-the-box
- **Developer Experience**: TypeScript end-to-end, hot reload
- **Deployment**: Deploy simplificado na Vercel
- **Escalabilidade**: Edge functions e caching automático
- **Segurança**: Validação de dados com Zod, autenticação robusta

### Estrutura Simplificada

Ao invés de microserviços separados, a arquitetura Next.js oferece:
- API Routes para endpoints externos (webhooks, integrações)
- Server Actions para operações internas
- Middleware para autenticação e rate limiting
- Cron jobs integrados para tarefas agendadas

Consulte `arquitetura-nextjs.md` para a implementação completa e detalhada.