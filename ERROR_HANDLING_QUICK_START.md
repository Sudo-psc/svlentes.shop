# 🚀 Quick Start - Sistema de Tratamento de Erros

Guia rápido para começar a usar o sistema de error handling.

## ⚡ Setup Rápido (5 minutos)

### 1. Adicione o ToastProvider no Root Layout

```tsx
// src/app/layout.tsx ou src/pages/_app.tsx
import { ToastProvider } from '@/components/error'
import { RootErrorBoundary } from '@/components/error'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <RootErrorBoundary>
          <ToastProvider>
            {children}
          </ToastProvider>
        </RootErrorBoundary>
      </body>
    </html>
  )
}
```

### 2. Inicialize o Error Monitoring

```tsx
// src/app/layout.tsx
import { useEffect } from 'react'
import { setupGlobalErrorHandlers } from '@/lib/error-handler'

export default function RootLayout({ children }) {
  useEffect(() => {
    setupGlobalErrorHandlers()
  }, [])

  return (
    <RootErrorBoundary>
      <ToastProvider>
        {children}
      </ToastProvider>
    </RootErrorBoundary>
  )
}
```

## 📦 Uso Básico

### Proteger Componentes com Error Boundary

```tsx
import { ErrorBoundary } from '@/components/error'

function MyPage() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  )
}
```

### Fazer Requisições com Retry Automático

```tsx
import { useAsyncError } from '@/hooks/error-hooks'

function MyComponent() {
  const { data, isLoading, error, execute } = useAsyncError(
    async () => {
      const response = await fetch('/api/data')
      return response.json()
    },
    { retryable: true }
  )

  useEffect(() => {
    execute()
  }, [])

  if (isLoading) return <LoadingFallback />
  if (error) return <ErrorFallback error={error} />
  
  return <div>{JSON.stringify(data)}</div>
}
```

### Mostrar Notificações de Erro

```tsx
import { useToast } from '@/components/error'

function MyForm() {
  const { showError, showSuccess } = useToast()

  const handleSubmit = async (data) => {
    try {
      await submitForm(data)
      showSuccess('Formulário enviado!')
    } catch (error) {
      showError('Erro ao enviar formulário')
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

## 🎯 Casos de Uso Comuns

### 1. Página com Dados da API

```tsx
import { ErrorBoundary, LoadingFallback } from '@/components/error'
import { useAsyncError } from '@/hooks/error-hooks'

function ProductsPage() {
  const { data, isLoading } = useAsyncError(
    () => fetch('/api/products').then(r => r.json()),
    { retryable: true }
  )

  if (isLoading) return <LoadingFallback />

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-3 gap-4">
        {data?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </ErrorBoundary>
  )
}
```

### 2. Formulário com Validação

```tsx
import { useToast } from '@/components/error'
import { useErrorHandler } from '@/hooks/error-hooks'

function ContactForm() {
  const { showSuccess, showError } = useToast()
  const { handleError } = useErrorHandler()

  const onSubmit = async (data) => {
    try {
      await api.sendContact(data)
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

### 3. Componente com Network Status

```tsx
import { useNetworkStatus } from '@/hooks/error-hooks'
import { NetworkErrorFallback } from '@/components/error'

function DataComponent() {
  const { isOffline } = useNetworkStatus()

  if (isOffline) {
    return <NetworkErrorFallback />
  }

  return <div>Content</div>
}
```

## 🎨 Componentes Disponíveis

| Componente | Uso |
|------------|-----|
| `ErrorBoundary` | Captura erros em componentes React |
| `RootErrorBoundary` | Captura erros críticos da aplicação |
| `ErrorFallback` | UI de fallback customizável |
| `NetworkErrorFallback` | Fallback específico para erros de rede |
| `LoadingFallback` | Estado de loading |
| `NotFoundFallback` | Página 404 |
| `ToastProvider` | Provider para sistema de toast |

## 🪝 Hooks Disponíveis

| Hook | Uso |
|------|-----|
| `useErrorHandler` | Gerenciar estado de erro |
| `useRetry` | Implementar retry com backoff |
| `useAsyncError` | Combina error handling + retry |
| `useNetworkStatus` | Monitorar conexão |
| `useToast` | Mostrar notificações |

## 📝 Checklist de Implementação

- [ ] Adicionar `RootErrorBoundary` no root layout
- [ ] Adicionar `ToastProvider` no root layout
- [ ] Inicializar `setupGlobalErrorHandlers()`
- [ ] Adicionar `ErrorBoundary` em páginas principais
- [ ] Usar `useAsyncError` para requisições API
- [ ] Usar `useToast` para feedback de usuário
- [ ] Testar cenários de erro
- [ ] Configurar monitoramento em produção

## 🔗 Links Úteis

- [Guia Completo](./ERROR_HANDLING_GUIDE.md)
- [Exemplos de Código](./src/components/error/ErrorHandlingDemo.tsx)
- [Documentação dos Hooks](./src/hooks/error-hooks.ts)

## 💡 Dicas

1. **Sempre use ErrorBoundary** em páginas e seções importantes
2. **Use retry para operações de rede** - melhora a experiência do usuário
3. **Forneça feedback imediato** com toasts
4. **Monitore erros em produção** para identificar problemas rapidamente
5. **Teste cenários de erro** durante o desenvolvimento

## 🆘 Problemas Comuns

### Toast não aparece
- Verifique se `ToastProvider` está no root
- Verifique se está usando `useToast` dentro do provider

### Retry não funciona
- Verifique se `retryable: true` está configurado
- Verifique se o erro é retryable (não é erro de validação)

### ErrorBoundary não captura erro
- Error boundaries só capturam erros em componentes filhos
- Não capturam erros em event handlers (use try/catch)

---

**Pronto para usar!** 🎉

Para mais detalhes, veja o [Guia Completo](./ERROR_HANDLING_GUIDE.md).
