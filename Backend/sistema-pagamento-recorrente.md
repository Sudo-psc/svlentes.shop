# Sistema de Pagamento Recorrente - Lentes por Assinatura

## Visão Geral do Sistema

### Objetivos
- Automatizar cobranças recorrentes
- Minimizar falhas de pagamento
- Flexibilidade para mudanças de plano
- Compliance com regulamentações brasileiras
- Experiência fluida para o usuário

### Fluxo Principal
1. **Cadastro**: Usuário escolhe plano e método de pagamento
2. **Primeira Cobrança**: Processamento imediato ou trial
3. **Cobrança Recorrente**: Automática conforme ciclo
4. **Gestão de Falhas**: Retry automático e notificações
5. **Modificações**: Upgrade/downgrade pro-rata

## Estrutura de Dados

### Modelos Principais
```typescript
// Planos disponíveis
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'BRL';
  interval: 'month' | 'quarter' | 'semester';
  intervalCount: number;
  features: {
    lensesPerDelivery: number;
    deliveryFrequency: number; // dias
    medicalConsultations: number;
    emergencySupport: boolean;
    premiumBrands: boolean;
  };
  trialPeriodDays?: number;
  active: boolean;
}

// Assinatura do usuário
interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  
  // Cobrança
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  nextBillingDate: Date;
  billingCycleAnchor: Date;
  
  // Valores
  amount: number;
  currency: 'BRL';
  taxRate?: number;
  discountId?: string;
  
  // Pagamento
  defaultPaymentMethodId: string;
  collectionMethod: 'charge_automatically' | 'send_invoice';
  
  // Trial
  trialStart?: Date;
  trialEnd?: Date;
  
  // Cancelamento
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  cancellationReason?: string;
  
  // Metadata
  metadata: {
    lensType: string;
    prescription: string;
    deliveryAddress: string;
    medicalHistory: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

enum SubscriptionStatus {
  TRIALING = 'trialing',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  PAUSED = 'paused'
}

// Métodos de pagamento
interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'pix' | 'bank_account';
  
  // Cartão
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    fingerprint: string;
  };
  
  // PIX
  pix?: {
    pixKey: string;
    pixKeyType: 'cpf' | 'email' | 'phone' | 'random';
  };
  
  // Conta bancária
  bankAccount?: {
    bank: string;
    agency: string;
    account: string;
    accountType: 'checking' | 'savings';
  };
  
  isDefault: boolean;
  active: boolean;
  createdAt: Date;
}

// Transações
interface Payment {
  id: string;
  subscriptionId: string;
  invoiceId: string;
  amount: number;
  currency: 'BRL';
  
  status: PaymentStatus;
  paymentMethodId: string;
  
  // Processamento
  processorId: string; // Stripe, PagSeguro, etc.
  processorPaymentId: string;
  
  // Datas
  createdAt: Date;
  paidAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;
  
  // Falhas
  failureCode?: string;
  failureMessage?: string;
  retryCount: number;
  nextRetryAt?: Date;
  
  // Metadata
  metadata: {
    billingReason: 'subscription_cycle' | 'subscription_create' | 'subscription_update';
    description: string;
  };
}

enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELED = 'canceled',
  REFUNDED = 'refunded'
}
```

## Implementação do Core

### Serviço de Assinatura
```typescript
class SubscriptionService {
  constructor(
    private paymentProcessor: PaymentProcessor,
    private notificationService: NotificationService,
    private inventoryService: InventoryService
  ) {}

  async createSubscription(data: CreateSubscriptionData): Promise<Subscription> {
    // Validar plano e método de pagamento
    const plan = await this.validatePlan(data.planId);
    const paymentMethod = await this.validatePaymentMethod(data.paymentMethodId);
    
    // Calcular datas
    const now = new Date();
    const trialEnd = plan.trialPeriodDays 
      ? addDays(now, plan.trialPeriodDays)
      : null;
    
    const subscription = await this.repository.create({
      userId: data.userId,
      planId: data.planId,
      status: trialEnd ? SubscriptionStatus.TRIALING : SubscriptionStatus.ACTIVE,
      currentPeriodStart: trialEnd || now,
      currentPeriodEnd: this.calculatePeriodEnd(trialEnd || now, plan),
      nextBillingDate: trialEnd || now,
      amount: plan.price,
      defaultPaymentMethodId: data.paymentMethodId,
      trialEnd,
      metadata: data.metadata
    });

    // Processar primeira cobrança se não há trial
    if (!trialEnd) {
      await this.processPayment(subscription);
    }

    // Agendar primeira entrega
    await this.scheduleDelivery(subscription);
    
    return subscription;
  }

  async processRecurringBilling(): Promise<void> {
    const dueSubscriptions = await this.repository.findDueForBilling();
    
    for (const subscription of dueSubscriptions) {
      await this.processSubscriptionBilling(subscription);
    }
  }

  private async processSubscriptionBilling(subscription: Subscription): Promise<void> {
    try {
      // Verificar se ainda está ativa
      if (subscription.status !== SubscriptionStatus.ACTIVE) {
        return;
      }

      // Processar pagamento
      const payment = await this.processPayment(subscription);
      
      if (payment.status === PaymentStatus.SUCCEEDED) {
        // Atualizar período da assinatura
        await this.advanceSubscriptionPeriod(subscription);
        
        // Agendar próxima entrega
        await this.scheduleDelivery(subscription);
        
        // Notificar usuário
        await this.notificationService.sendPaymentSuccess(subscription.userId, payment);
        
      } else {
        // Lidar com falha de pagamento
        await this.handlePaymentFailure(subscription, payment);
      }
      
    } catch (error) {
      console.error(`Erro ao processar cobrança da assinatura ${subscription.id}:`, error);
      await this.handleBillingError(subscription, error);
    }
  }

  private async processPayment(subscription: Subscription): Promise<Payment> {
    const paymentMethod = await this.getPaymentMethod(subscription.defaultPaymentMethodId);
    
    const payment = await this.repository.createPayment({
      subscriptionId: subscription.id,
      amount: subscription.amount,
      paymentMethodId: paymentMethod.id,
      status: PaymentStatus.PENDING,
      metadata: {
        billingReason: 'subscription_cycle',
        description: `Assinatura de lentes - ${subscription.planId}`
      }
    });

    try {
      const result = await this.paymentProcessor.charge({
        amount: subscription.amount,
        currency: 'BRL',
        paymentMethod: paymentMethod,
        customerId: subscription.userId,
        description: payment.metadata.description
      });

      await this.repository.updatePayment(payment.id, {
        status: result.status,
        processorPaymentId: result.id,
        paidAt: result.paidAt,
        failureCode: result.failureCode,
        failureMessage: result.failureMessage
      });

      return await this.repository.findPayment(payment.id);
      
    } catch (error) {
      await this.repository.updatePayment(payment.id, {
        status: PaymentStatus.FAILED,
        failedAt: new Date(),
        failureMessage: error.message
      });
      
      throw error;
    }
  }

  private async handlePaymentFailure(subscription: Subscription, payment: Payment): Promise<void> {
    const retryCount = payment.retryCount + 1;
    const maxRetries = 3;
    
    if (retryCount <= maxRetries) {
      // Agendar retry
      const nextRetry = this.calculateNextRetry(retryCount);
      
      await this.repository.updatePayment(payment.id, {
        retryCount,
        nextRetryAt: nextRetry
      });
      
      await this.schedulePaymentRetry(payment.id, nextRetry);
      
      // Notificar usuário sobre falha
      await this.notificationService.sendPaymentFailed(subscription.userId, payment, retryCount);
      
    } else {
      // Esgotar tentativas - pausar assinatura
      await this.repository.updateSubscription(subscription.id, {
        status: SubscriptionStatus.PAST_DUE
      });
      
      // Notificar sobre suspensão
      await this.notificationService.sendSubscriptionSuspended(subscription.userId, subscription);
    }
  }

  async modifySubscription(subscriptionId: string, changes: SubscriptionChanges): Promise<Subscription> {
    const subscription = await this.repository.findById(subscriptionId);
    
    if (changes.planId && changes.planId !== subscription.planId) {
      return await this.changePlan(subscription, changes.planId, changes.prorationBehavior);
    }
    
    if (changes.paymentMethodId) {
      await this.repository.updateSubscription(subscriptionId, {
        defaultPaymentMethodId: changes.paymentMethodId
      });
    }
    
    return await this.repository.findById(subscriptionId);
  }

  private async changePlan(
    subscription: Subscription, 
    newPlanId: string, 
    prorationBehavior: 'create_prorations' | 'none' = 'create_prorations'
  ): Promise<Subscription> {
    const currentPlan = await this.getPlan(subscription.planId);
    const newPlan = await this.getPlan(newPlanId);
    
    let prorationAmount = 0;
    
    if (prorationBehavior === 'create_prorations') {
      prorationAmount = this.calculateProration(subscription, currentPlan, newPlan);
    }
    
    // Atualizar assinatura
    await this.repository.updateSubscription(subscription.id, {
      planId: newPlanId,
      amount: newPlan.price
    });
    
    // Processar cobrança pro-rata se necessário
    if (prorationAmount > 0) {
      await this.processProrationPayment(subscription, prorationAmount);
    } else if (prorationAmount < 0) {
      await this.processProrationCredit(subscription, Math.abs(prorationAmount));
    }
    
    return await this.repository.findById(subscription.id);
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<Subscription> {
    const updates: Partial<Subscription> = {
      cancelAtPeriodEnd,
      canceledAt: new Date()
    };
    
    if (!cancelAtPeriodEnd) {
      updates.status = SubscriptionStatus.CANCELED;
      updates.currentPeriodEnd = new Date();
    }
    
    await this.repository.updateSubscription(subscriptionId, updates);
    
    const subscription = await this.repository.findById(subscriptionId);
    
    // Notificar usuário
    await this.notificationService.sendSubscriptionCanceled(subscription.userId, subscription);
    
    return subscription;
  }
}
```

### Integração com Processadores de Pagamento

```typescript
// Interface comum para processadores
interface PaymentProcessor {
  charge(params: ChargeParams): Promise<ChargeResult>;
  createCustomer(params: CustomerParams): Promise<Customer>;
  createPaymentMethod(params: PaymentMethodParams): Promise<PaymentMethod>;
  refund(paymentId: string, amount?: number): Promise<RefundResult>;
}

// Implementação Stripe
class StripeProcessor implements PaymentProcessor {
  constructor(private stripe: Stripe) {}

  async charge(params: ChargeParams): Promise<ChargeResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: params.amount * 100, // Stripe usa centavos
        currency: params.currency.toLowerCase(),
        customer: params.customerId,
        payment_method: params.paymentMethod.processorId,
        confirm: true,
        description: params.description
      });

      return {
        id: paymentIntent.id,
        status: this.mapStripeStatus(paymentIntent.status),
        paidAt: paymentIntent.status === 'succeeded' ? new Date() : undefined
      };
      
    } catch (error) {
      return {
        id: '',
        status: PaymentStatus.FAILED,
        failureCode: error.code,
        failureMessage: error.message
      };
    }
  }

  private mapStripeStatus(stripeStatus: string): PaymentStatus {
    const statusMap = {
      'succeeded': PaymentStatus.SUCCEEDED,
      'processing': PaymentStatus.PROCESSING,
      'requires_payment_method': PaymentStatus.FAILED,
      'canceled': PaymentStatus.CANCELED
    };
    
    return statusMap[stripeStatus] || PaymentStatus.PENDING;
  }
}

// Implementação PagSeguro
class PagSeguroProcessor implements PaymentProcessor {
  constructor(private config: PagSeguroConfig) {}

  async charge(params: ChargeParams): Promise<ChargeResult> {
    // Implementação específica do PagSeguro
    const response = await this.makeRequest('/charges', {
      reference_id: `sub_${params.subscriptionId}`,
      amount: {
        value: params.amount * 100,
        currency: 'BRL'
      },
      payment_method: this.mapPaymentMethod(params.paymentMethod),
      description: params.description
    });

    return {
      id: response.id,
      status: this.mapPagSeguroStatus(response.status),
      paidAt: response.paid_at ? new Date(response.paid_at) : undefined
    };
  }
}
```

### Sistema de Retry e Recuperação

```typescript
class PaymentRetryService {
  private readonly retrySchedule = [
    { days: 3, maxRetries: 1 },
    { days: 5, maxRetries: 2 },
    { days: 7, maxRetries: 3 }
  ];

  async scheduleRetry(paymentId: string, retryCount: number): Promise<void> {
    const schedule = this.retrySchedule.find(s => s.maxRetries >= retryCount);
    if (!schedule) return;

    const nextRetry = addDays(new Date(), schedule.days);
    
    await this.queueService.schedule('payment-retry', nextRetry, {
      paymentId,
      retryCount
    });
  }

  async processRetry(paymentId: string): Promise<void> {
    const payment = await this.repository.findPayment(paymentId);
    const subscription = await this.repository.findSubscription(payment.subscriptionId);
    
    try {
      const result = await this.paymentProcessor.charge({
        amount: payment.amount,
        paymentMethod: await this.getPaymentMethod(subscription.defaultPaymentMethodId),
        customerId: subscription.userId,
        description: payment.metadata.description
      });

      if (result.status === PaymentStatus.SUCCEEDED) {
        await this.handleSuccessfulRetry(payment, subscription, result);
      } else {
        await this.handleFailedRetry(payment, subscription, result);
      }
      
    } catch (error) {
      await this.handleFailedRetry(payment, subscription, { 
        status: PaymentStatus.FAILED, 
        failureMessage: error.message 
      });
    }
  }

  private async handleSuccessfulRetry(
    payment: Payment, 
    subscription: Subscription, 
    result: ChargeResult
  ): Promise<void> {
    // Atualizar pagamento
    await this.repository.updatePayment(payment.id, {
      status: PaymentStatus.SUCCEEDED,
      paidAt: result.paidAt,
      processorPaymentId: result.id
    });

    // Reativar assinatura se estava suspensa
    if (subscription.status === SubscriptionStatus.PAST_DUE) {
      await this.repository.updateSubscription(subscription.id, {
        status: SubscriptionStatus.ACTIVE
      });
    }

    // Notificar sucesso
    await this.notificationService.sendPaymentRecovered(subscription.userId, payment);
  }

  private async handleFailedRetry(
    payment: Payment, 
    subscription: Subscription, 
    result: Partial<ChargeResult>
  ): Promise<void> {
    const newRetryCount = payment.retryCount + 1;
    
    await this.repository.updatePayment(payment.id, {
      retryCount: newRetryCount,
      failureCode: result.failureCode,
      failureMessage: result.failureMessage
    });

    if (newRetryCount < 3) {
      await this.scheduleRetry(payment.id, newRetryCount);
    } else {
      // Suspender definitivamente
      await this.repository.updateSubscription(subscription.id, {
        status: SubscriptionStatus.UNPAID
      });
      
      await this.notificationService.sendSubscriptionSuspended(subscription.userId, subscription);
    }
  }
}
```

### Webhooks e Eventos

```typescript
class WebhookService {
  async handleStripeWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
        
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object);
        break;
    }
  }

  async handlePagSeguroWebhook(notification: PagSeguroNotification): Promise<void> {
    const charge = await this.pagSeguro.getCharge(notification.notificationCode);
    
    switch (charge.status) {
      case 'PAID':
        await this.handlePaymentSucceeded(charge);
        break;
        
      case 'DECLINED':
      case 'CANCELED':
        await this.handlePaymentFailed(charge);
        break;
    }
  }
}
```

### Dashboard e Analytics

```typescript
class BillingAnalytics {
  async getSubscriptionMetrics(period: DateRange): Promise<SubscriptionMetrics> {
    return {
      totalSubscriptions: await this.countSubscriptions(period),
      activeSubscriptions: await this.countActiveSubscriptions(period),
      newSubscriptions: await this.countNewSubscriptions(period),
      canceledSubscriptions: await this.countCanceledSubscriptions(period),
      churnRate: await this.calculateChurnRate(period),
      mrr: await this.calculateMRR(period),
      arr: await this.calculateARR(period),
      ltv: await this.calculateLTV(period),
      averageRevenuePerUser: await this.calculateARPU(period)
    };
  }

  async getPaymentMetrics(period: DateRange): Promise<PaymentMetrics> {
    return {
      totalRevenue: await this.calculateRevenue(period),
      successfulPayments: await this.countSuccessfulPayments(period),
      failedPayments: await this.countFailedPayments(period),
      paymentSuccessRate: await this.calculateSuccessRate(period),
      averagePaymentValue: await this.calculateAveragePaymentValue(period),
      refunds: await this.calculateRefunds(period)
    };
  }

  private async calculateChurnRate(period: DateRange): Promise<number> {
    const startSubscriptions = await this.countSubscriptionsAtDate(period.start);
    const canceledInPeriod = await this.countCanceledSubscriptions(period);
    
    return startSubscriptions > 0 ? (canceledInPeriod / startSubscriptions) * 100 : 0;
  }

  private async calculateMRR(period: DateRange): Promise<number> {
    const activeSubscriptions = await this.getActiveSubscriptions(period.end);
    
    return activeSubscriptions.reduce((mrr, sub) => {
      const monthlyAmount = this.normalizeToMonthly(sub.amount, sub.planId);
      return mrr + monthlyAmount;
    }, 0);
  }
}
```

Este sistema de pagamento recorrente oferece uma base robusta para o serviço de assinatura de lentes, com foco em confiabilidade, flexibilidade e experiência do usuário.