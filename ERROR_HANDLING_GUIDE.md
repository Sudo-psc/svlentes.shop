# 🛡️ Sistema de Tratamento de Erros - SVlentes

Sistema completo e robusto de tratamento de erros, fallbacks e recuperação para o frontend.

## 📋 Índice

- [Componentes](#componentes)
- [Hooks](#hooks)
- [Sistema de Toast](#sistema-de-toast)
- [Monitoramento](#monitoramento)
- [Exemplos de Uso](#exemplos-de-uso)
- [Boas Práticas](#boas-práticas)

---

## 🎯 Componentes

### ErrorBoundary

Boundary padrão para capturar erros em componentes React.

```tsx
import { ErrorBoundary } from '@/components/error'

<ErrorBoundary
  showHomeButton={true}
  showBackButton={false}
  onError={(error, errorInfo) => {
    // Custom error handling
    console.log('Error captured:', error)
  }}
>
  <YourComponent />
</ErrorBoundary>
```

**Props:**
- `fallback?: ReactNode` - Componente customizado de fallback
- `onError?: (error, errorInfo) => void` - Callback quando erro ocorre
- `showHomeButton?: boolean` - Mostrar botão "Ir para Início"
- `showBackButton?: boolean` - Mostrar botão "Voltar"

**Recursos:**
- Detecta automaticamente erros de rede
- Mostra fallback apropriado (NetworkErrorFallback ou ErrorFallback)
- Permite retry da operação
- Log automático de erros

### RootErrorBoundary

Boundary de nível raiz para erros críticos da aplicação.

```tsx
import { RootErrorBoundary } from '@/components/error'

export default function RootLayout({ children }) {
  return (
    <RootErrorBoundary>
      {children}
    </RootErrorBoundary>
  )
}
```

**Características:**
- Captura erros críticos que não foram tratados
- Força reload da página em caso de erro
- Envia erros para serviço de monitoramento em produção
- UI full-screen para erros críticos

### ErrorFallback

Componente de fallback customizável para exibir erros.

```tsx
import { ErrorFallback } from '@/components/error'

<ErrorFallback
  error={error}
  resetError={() => retry()}
  variant="full" // 'default' | 'minimal' | 'full'
  title="Ops! Algo deu errado"
  message="Não conseguimos carregar os dados."
  showHomeButton={true}
  showBackButton={true}
/>
```

**Variantes:**
- `minimal` - Compacto, ideal para cards/seções
- `default` - Padrão, bom para a maioria dos casos
- `full` - Full-screen, para erros críticos

### NetworkErrorFallback

Fallback específico para erros de rede.

```tsx
import { NetworkErrorFallback } from '@/components/error'

<NetworkErrorFallback
  onRetry={() => refetch()}
  message="Sem conexão com a internet"
/>
```

**Recursos:**
- Detecta status online/offline automaticamente
- Indicador visual de conexão
- Desabilita retry quando offline
- Monitora mudanças de conectividade

### LoadingFallback

Componente de loading state.

```tsx
import { LoadingFallback } from '@/components/error'

<LoadingFallback
  message="Carregando dados..."
  variant="default" // 'default' | 'minimal' | 'full'
/>
```

### NotFoundFallback

Fallback para páginas 404.

```tsx
import { NotFoundFallback } from '@/components/error'

<NotFoundFallback
  title="Página não encontrada"
  message="A página que você procura não existe."
  showHomeButton={true}
  showBackButton={true}
/>
```

---

## 🪝 Hooks

### useErrorHandler

Hook para gerenciar estado de erro.

```tsx
import { useErrorHandler } from '@/hooks/error-hooks'

function MyComponent() {
  const { error, isError, handleError, clearError } = useErrorHandler({
    onError: (error) => console.log('Error:', error),
    logErrors: true
  })

  const fetchData = async () => {
    try {
      const data = await api.getData()
    } catch (err) {
      handleError(err)
    }
  }

  if (isError) {
    return <ErrorFallback error={error} resetError={clearError} />
  }

  return <div>Content</div>
}
```

### useRetry

Hook para implementar lógica de retry com backoff exponencial.

```tsx
import { useRetry } from '@/hooks/error-hooks'

function MyComponent() {
  const { retry, retryCount, isRetrying, canRetry } = useRetry({
    maxRetries: 3,
    retryDelay: 1000,
    onRetry: (attempt) => console.log(`Retry attempt ${attempt}`),
    onMaxRetriesReached: () => console.log('Max retries reached')
  })

  const fetchWithRetry = async () => {
    await retry(async () => {
      const response = await fetch('/api/data')
      if (!response.ok) throw new Error('Failed')
      return response.json()
    })
  }

  return (
    <div>
      <button onClick={fetchWithRetry} disabled={isRetrying}>
        {isRetrying ? `Tentando... (${retryCount}/3)` : 'Carregar'}
      </button>
    </div>
  )
}
```

**Recursos:**
- Backoff exponencial automático
- Contador de tentativas
- Callback em cada retry
- Limite configurável de tentativas

### useAsyncError

Hook completo que combina error handling e retry.

```tsx
import { useAsyncError } from '@/hooks/error-hooks'

function MyComponent() {
  const {
    data,
    isLoading,
    error,
    isError,
    execute,
    retry,
    retryCount,
    canRetry,
    reset
  } = useAsyncError(
    async () => {
      const response = await fetch('/api/data')
      return response.json()
    },
    {
      retryable: true,
      maxRetries: 3,
      onError: (error) => console.error(error)
    }
  )

  useEffect(() => {
    execute()
  }, [])

  if (isLoading) return <LoadingFallback />
  if (isError) {
    return (
      <ErrorFallback
        error={error}
        resetError={canRetry ? retry : reset}
      />
    )
  }

  return <div>{JSON.stringify(data)}</div>
}
```

### useNetworkStatus

Hook para monitorar status da conexão.

```tsx
import { useNetworkStatus } from '@/hooks/error-hooks'

function MyComponent() {
  const { isOnline, isOffline, wasOffline } = useNetworkStatus()

  useEffect(() => {
    if (isOnline && wasOffline) {
      // User came back online, refetch data
      refetchData()
    }
  }, [isOnline, wasOffline])

  return (
    <div>
      {isOffline && (
        <div className="bg-warning text-warning-foreground p-2">
          Você está offline
        </div>
      )}
    </div>
  )
}
```

---

## 🔔 Sistema de Toast

Sistema de notificações para feedback de erros e sucesso.

### Setup

Adicione o ToastProvider no root da aplicação:

```tsx
import { ToastProvider } from '@/components/error'

export default function RootLayout({ children }) {
  return (
    <ToastProvider maxToasts={3}>
      {children}
    </ToastProvider>
  )
}
```

### Uso

```tsx
import { useToast } from '@/components/error'

function MyComponent() {
  const { showError, showSuccess, showInfo, showWarning } = useToast()

  const handleSubmit = async () => {
    try {
      await submitForm()
      showSuccess('Formulário enviado com sucesso!')
    } catch (error) {
      showError('Erro ao enviar formulário', {
        label: 'Tentar novamente',
        onClick: () => handleSubmit()
      })
    }
  }

  return <button onClick={handleSubmit}>Enviar</button>
}
```

**Métodos disponíveis:**
- `showError(message, action?)` - Toast de erro
- `showSuccess(message)` - Toast de sucesso
- `showInfo(message)` - Toast informativo
- `showWarning(message)` - Toast de aviso
- `showToast(config)` - Toast customizado
- `clearToasts()` - Limpar todos os toasts

---

## 📊 Monitoramento

Sistema de monitoramento e captura de erros.

```tsx
import { errorMonitoring, captureError } from '@/lib/error-monitoring'

// Capturar erro manualmente
try {
  riskyOperation()
} catch (error) {
  captureError(error, {
    component: 'MyComponent',
    action: 'riskyOperation',
    userId: user.id
  })
}

// Ver estatísticas de erros
const stats = errorMonitoring.getErrorStats()
console.log('Total errors:', stats.total)
console.log('By type:', stats.byType)
console.log('Recent:', stats.recent)

// Limpar erros
errorMonitoring.clearErrors()
```

**Recursos:**
- Captura automática de erros não tratados
- Captura de promise rejections
- Monitoramento de console.error
- Estatísticas de erros
- Integração pronta para Sentry/LogRocket

---

## 💡 Exemplos de Uso

### Exemplo 1: Componente com Error Boundary

```tsx
import { ErrorBoundary, LoadingFallback } from '@/components/error'
import { useAsyncError } from '@/hooks/error-hooks'

function UserProfile({ userId }) {
  const { data, isLoading, error, isError, retry } = useAsyncError(
    async () => {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch user')
      return response.json()
    },
    { retryable: true, maxRetries: 3 }
  )

  if (isLoading) return <LoadingFallback message="Carregando perfil..." />

  return (
    <ErrorBoundary>
      <div>
        <h1>{data.name}</h1>
        <p>{data.email}</p>
      </div>
    </ErrorBoundary>
  )
}
```

### Exemplo 2: Formulário com Toast

```tsx
import { useToast } from '@/components/error'
import { useErrorHandler } from '@/hooks/error-hooks'

function ContactForm() {
  const { showSuccess, showError } = useToast()
  const { handleError } = useErrorHandler()

  const onSubmit = async (data) => {
    try {
      await submitContact(data)
      showSuccess('Mensagem enviada com sucesso!')
    } catch (error) {
      handleError(error)
      showError('Erro ao enviar mensagem', {
        label: 'Tentar novamente',
        onClick: () => onSubmit(data)
      })
    }
  }

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}
```

### Exemplo 3: Lista com Retry

```tsx
import { ErrorBoundary, ErrorFallback } from '@/components/error'
import { useAsyncError } from '@/hooks/error-hooks'

function ProductList() {
  const {
    data: products,
    isLoading,
    error,
    isError,
    retry,
    canRetry
  } = useAsyncError(
    async () => {
      const response = await fetch('/api/products')
      return response.json()
    },
    { retryable: true }
  )

  if (isLoading) return <LoadingFallback />
  
  if (isError) {
    return (
      <ErrorFallback
        error={error}
        resetError={retry}
        title="Erro ao carregar produtos"
        message={canRetry ? 'Tentando reconectar...' : 'Tente novamente mais tarde'}
      />
    )
  }

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </ErrorBoundary>
  )
}
```

### Exemplo 4: Página com Network Status

```tsx
import { useNetworkStatus } from '@/hooks/error-hooks'
import { NetworkErrorFallback } from '@/components/error'

function DataPage() {
  const { isOffline } = useNetworkStatus()
  const { data, refetch } = useQuery('data', fetchData)

  if (isOffline) {
    return <NetworkErrorFallback onRetry={refetch} />
  }

  return <div>{/* content */}</div>
}
```

---

## ✅ Boas Práticas

### 1. Hierarquia de Error Boundaries

```tsx
// Root level - erros críticos
<RootErrorBoundary>
  <App>
    {/* Page level - erros de página */}
    <ErrorBoundary showHomeButton>
      <Page>
        {/* Section level - erros de seção */}
        <ErrorBoundary variant="minimal">
          <Section />
        </ErrorBoundary>
      </Page>
    </ErrorBoundary>
  </App>
</RootErrorBoundary>
```

### 2. Sempre use Retry para Operações de Rede

```tsx
// ✅ Bom
const { execute } = useAsyncError(fetchData, { retryable: true })

// ❌ Evite
const fetchData = async () => {
  const response = await fetch('/api/data')
  return response.json()
}
```

### 3. Forneça Contexto nos Erros

```tsx
// ✅ Bom
captureError(error, {
  component: 'CheckoutForm',
  action: 'submitPayment',
  userId: user.id,
  amount: total
})

// ❌ Evite
captureError(error)
```

### 4. Use Toast para Feedback Imediato

```tsx
// ✅ Bom - feedback imediato
showError('Erro ao salvar', {
  label: 'Tentar novamente',
  onClick: retry
})

// ❌ Evite - sem feedback
console.error('Error saving')
```

### 5. Diferencie Erros de Rede

```tsx
// ✅ Bom
if (error.message.includes('network')) {
  return <NetworkErrorFallback />
}

// Ou use o ErrorBoundary que detecta automaticamente
<ErrorBoundary>
  <Component />
</ErrorBoundary>
```

### 6. Monitore Erros em Produção

```tsx
// Setup no root
useEffect(() => {
  if (process.env.NODE_ENV === 'production') {
    errorMonitoring.getInstance()
  }
}, [])
```

---

## 🎨 Customização

### Customizar Cores dos Toasts

Edite `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        destructive: '#DC2626',
        success: '#10B981',
        warning: '#F59E0B',
      }
    }
  }
}
```

### Customizar Fallback UI

```tsx
<ErrorBoundary
  fallback={
    <div className="custom-error">
      <h1>Oops!</h1>
      <p>Something went wrong</p>
    </div>
  }
>
  <Component />
</ErrorBoundary>
```

---

## 🚀 Próximos Passos

1. **Integrar com Sentry/LogRocket**
   - Adicionar SDK no projeto
   - Configurar `sendToMonitoring` em `error-monitoring.ts`

2. **Adicionar Testes**
   - Testar error boundaries
   - Testar hooks de retry
   - Testar sistema de toast

3. **Melhorar UX**
   - Adicionar animações
   - Melhorar mensagens de erro
   - Adicionar ilustrações

4. **Analytics**
   - Rastrear taxa de erro
   - Monitorar retry success rate
   - Analisar padrões de erro

---

## 📚 Referências

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Error Handling Best Practices](https://kentcdodds.com/blog/use-react-error-boundary-to-handle-errors-in-react)
- [Network Error Handling](https://web.dev/offline-cookbook/)

---

**Desenvolvido para SVlentes** 🔵
