# 💼 Exemplos Práticos - Sistema de Tratamento de Erros

Exemplos reais de como integrar o sistema de error handling no SVlentes.

## 📋 Índice

1. [Formulário de Contato](#1-formulário-de-contato)
2. [Lista de Produtos](#2-lista-de-produtos)
3. [Checkout com Stripe](#3-checkout-com-stripe)
4. [Upload de Imagem](#4-upload-de-imagem)
5. [Agendamento de Consulta](#5-agendamento-de-consulta)
6. [Dashboard com Múltiplas APIs](#6-dashboard-com-múltiplas-apis)

---

## 1. Formulário de Contato

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ErrorBoundary, useToast } from '@/components/error'
import { useErrorHandler } from '@/hooks/error-hooks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

const contactSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  message: z.string().min(10, 'Mensagem muito curta')
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showSuccess, showError } = useToast()
  const { handleError } = useErrorHandler()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem')
      }

      showSuccess('Mensagem enviada com sucesso! Entraremos em contato em breve.')
      reset()
    } catch (error) {
      handleError(error)
      showError('Erro ao enviar mensagem', {
        label: 'Tentar novamente',
        onClick: () => handleSubmit(onSubmit)()
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ErrorBoundary>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            {...register('name')}
            placeholder="Seu nome"
            error={errors.name?.message}
          />
        </div>

        <div>
          <Input
            {...register('email')}
            type="email"
            placeholder="Seu email"
            error={errors.email?.message}
          />
        </div>

        <div>
          <Input
            {...register('phone')}
            placeholder="Seu telefone"
            error={errors.phone?.message}
          />
        </div>

        <div>
          <Textarea
            {...register('message')}
            placeholder="Sua mensagem"
            rows={5}
            error={errors.message?.message}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
        </Button>
      </form>
    </ErrorBoundary>
  )
}
```

---

## 2. Lista de Produtos

```tsx
'use client'

import { useEffect } from 'react'
import { ErrorBoundary, LoadingFallback, ErrorFallback } from '@/components/error'
import { useAsyncError } from '@/hooks/error-hooks'
import { ProductCard } from '@/components/ProductCard'

interface Product {
  id: string
  name: string
  price: number
  image: string
}

export function ProductList() {
  const {
    data: products,
    isLoading,
    error,
    isError,
    execute,
    retry,
    canRetry,
    retryCount
  } = useAsyncError<Product[]>(
    async () => {
      const response = await fetch('/api/products')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos')
      }
      
      return response.json()
    },
    {
      retryable: true,
      maxRetries: 3,
      onError: (error) => {
        console.error('Erro ao carregar produtos:', error)
      }
    }
  )

  useEffect(() => {
    execute()
  }, [execute])

  if (isLoading) {
    return <LoadingFallback message="Carregando produtos..." />
  }

  if (isError) {
    return (
      <ErrorFallback
        error={error}
        resetError={canRetry ? retry : execute}
        title="Erro ao carregar produtos"
        message={
          canRetry
            ? `Tentando reconectar... (${retryCount}/3)`
            : 'Não foi possível carregar os produtos. Tente novamente mais tarde.'
        }
        showHomeButton={true}
      />
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum produto encontrado</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </ErrorBoundary>
  )
}
```

---

## 3. Checkout com Stripe

```tsx
'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { ErrorBoundary, useToast } from '@/components/error'
import { useErrorHandler } from '@/hooks/error-hooks'
import { withRetry, NetworkError } from '@/lib/error-handler'
import { Button } from '@/components/ui/Button'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)

export function CheckoutButton({ planId, amount }: { planId: string; amount: number }) {
  const [isLoading, setIsLoading] = useState(false)
  const { showError, showInfo } = useToast()
  const { handleError } = useErrorHandler()

  const handleCheckout = async () => {
    setIsLoading(true)
    showInfo('Preparando checkout...')

    try {
      // Create checkout session with retry
      const session = await withRetry(
        async () => {
          const response = await fetch('/api/checkout/create-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ planId, amount })
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Erro ao criar sessão')
          }

          return response.json()
        },
        {
          maxRetries: 3,
          retryDelay: 1000,
          onRetry: (attempt) => {
            showInfo(`Tentando novamente... (${attempt}/3)`)
          }
        }
      )

      // Redirect to Stripe
      const stripe = await stripePromise
      
      if (!stripe) {
        throw new Error('Erro ao carregar Stripe')
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      })

      if (error) {
        throw error
      }
    } catch (error) {
      handleError(error)

      if (error instanceof NetworkError) {
        showError('Erro de conexão. Verifique sua internet e tente novamente.', {
          label: 'Tentar novamente',
          onClick: handleCheckout
        })
      } else {
        showError('Erro ao processar pagamento. Tente novamente.', {
          label: 'Tentar novamente',
          onClick: handleCheckout
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <Button
        onClick={handleCheckout}
        disabled={isLoading}
        size="lg"
        className="w-full"
      >
        {isLoading ? 'Processando...' : `Assinar por R$ ${amount}/mês`}
      </Button>
    </ErrorBoundary>
  )
}
```

---

## 4. Upload de Imagem

```tsx
'use client'

import { useState, useRef } from 'react'
import { ErrorBoundary, useToast } from '@/components/error'
import { useErrorHandler } from '@/hooks/error-hooks'
import { Button } from '@/components/ui/Button'
import { Upload, X } from 'lucide-react'

export function ImageUpload({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { showSuccess, showError } = useToast()
  const { handleError } = useErrorHandler()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      showError('Por favor, selecione uma imagem válida')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('Imagem muito grande. Máximo 5MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    // Upload
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Erro ao fazer upload')
      }

      const { url } = await response.json()
      
      showSuccess('Imagem enviada com sucesso!')
      onUploadComplete(url)
    } catch (error) {
      handleError(error)
      showError('Erro ao enviar imagem', {
        label: 'Tentar novamente',
        onClick: () => fileInputRef.current?.click()
      })
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-destructive text-white p-2 rounded-full"
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Clique para selecionar uma imagem
            </span>
          </button>
        )}

        {isUploading && (
          <div className="text-center text-sm text-muted-foreground">
            Enviando imagem...
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
```

---

## 5. Agendamento de Consulta

```tsx
'use client'

import { useState } from 'react'
import { ErrorBoundary, useToast } from '@/components/error'
import { useAsyncError, useNetworkStatus } from '@/hooks/error-hooks'
import { NetworkErrorFallback } from '@/components/error'
import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/Calendar'

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const { isOffline } = useNetworkStatus()
  const { showSuccess, showError } = useToast()

  // Fetch available time slots
  const {
    data: timeSlots,
    isLoading: loadingSlots,
    execute: fetchSlots
  } = useAsyncError<TimeSlot[]>(
    async () => {
      if (!selectedDate) return []
      
      const response = await fetch(
        `/api/appointments/slots?date=${selectedDate.toISOString()}`
      )
      
      if (!response.ok) throw new Error('Erro ao carregar horários')
      
      return response.json()
    },
    { retryable: true }
  )

  // Book appointment
  const {
    execute: bookAppointment,
    isLoading: isBooking
  } = useAsyncError(
    async () => {
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime
        })
      })

      if (!response.ok) throw new Error('Erro ao agendar')
      
      return response.json()
    },
    {
      retryable: true,
      onError: (error) => {
        showError('Erro ao agendar consulta', {
          label: 'Tentar novamente',
          onClick: () => bookAppointment()
        })
      }
    }
  )

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    fetchSlots()
  }

  const handleBooking = async () => {
    try {
      await bookAppointment()
      showSuccess('Consulta agendada com sucesso!')
      // Reset form
      setSelectedDate(null)
      setSelectedTime(null)
    } catch (error) {
      // Error already handled by useAsyncError
    }
  }

  if (isOffline) {
    return <NetworkErrorFallback />
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Selecione uma data</h3>
          <Calendar
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={{ before: new Date() }}
          />
        </div>

        {selectedDate && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Selecione um horário</h3>
            
            {loadingSlots ? (
              <div className="text-center py-4">Carregando horários...</div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {timeSlots?.map((slot) => (
                  <Button
                    key={slot.id}
                    onClick={() => setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    variant={selectedTime === slot.time ? 'primary' : 'outline'}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedDate && selectedTime && (
          <Button
            onClick={handleBooking}
            disabled={isBooking}
            size="lg"
            className="w-full"
          >
            {isBooking ? 'Agendando...' : 'Confirmar Agendamento'}
          </Button>
        )}
      </div>
    </ErrorBoundary>
  )
}
```

---

## 6. Dashboard com Múltiplas APIs

```tsx
'use client'

import { useEffect } from 'react'
import { ErrorBoundary, LoadingFallback } from '@/components/error'
import { useAsyncError } from '@/hooks/error-hooks'
import { Card } from '@/components/ui/Card'

interface DashboardData {
  stats: {
    totalUsers: number
    totalRevenue: number
    activeSubscriptions: number
  }
  recentOrders: Array<{
    id: string
    customer: string
    amount: number
  }>
  notifications: Array<{
    id: string
    message: string
    type: string
  }>
}

export function Dashboard() {
  // Fetch dashboard data with retry
  const {
    data,
    isLoading,
    error,
    execute,
    retry,
    canRetry
  } = useAsyncError<DashboardData>(
    async () => {
      const response = await fetch('/api/dashboard')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar dashboard')
      }
      
      return response.json()
    },
    {
      retryable: true,
      maxRetries: 3
    }
  )

  useEffect(() => {
    execute()
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      execute()
    }, 30000)

    return () => clearInterval(interval)
  }, [execute])

  if (isLoading && !data) {
    return <LoadingFallback variant="full" message="Carregando dashboard..." />
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error.message}</p>
          {canRetry && (
            <Button onClick={retry}>Tentar Novamente</Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-sm text-muted-foreground">Total de Usuários</h3>
            <p className="text-3xl font-bold">{data?.stats.totalUsers}</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm text-muted-foreground">Receita Total</h3>
            <p className="text-3xl font-bold">
              R$ {data?.stats.totalRevenue.toLocaleString()}
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm text-muted-foreground">Assinaturas Ativas</h3>
            <p className="text-3xl font-bold">{data?.stats.activeSubscriptions}</p>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Pedidos Recentes</h3>
          <div className="space-y-2">
            {data?.recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center">
                <span>{order.customer}</span>
                <span className="font-semibold">
                  R$ {order.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Notificações</h3>
          <div className="space-y-2">
            {data?.notifications.map((notification) => (
              <div key={notification.id} className="p-3 bg-muted rounded-lg">
                {notification.message}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
```

---

## 🎯 Padrões Comuns

### Pattern 1: Form com Toast
```tsx
const { showSuccess, showError } = useToast()

try {
  await submitForm(data)
  showSuccess('Sucesso!')
} catch (error) {
  showError('Erro!', { label: 'Retry', onClick: retry })
}
```

### Pattern 2: Lista com Retry
```tsx
const { data, isLoading, error, retry } = useAsyncError(
  fetchData,
  { retryable: true }
)

if (isLoading) return <LoadingFallback />
if (error) return <ErrorFallback error={error} resetError={retry} />
```

### Pattern 3: Network Aware
```tsx
const { isOffline } = useNetworkStatus()

if (isOffline) return <NetworkErrorFallback />
```

### Pattern 4: Protected Component
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

---

**Estes exemplos cobrem os casos de uso mais comuns no SVlentes!** 🎉
