# 💻 Exemplos de Código - Fluxo de Assinatura

## 📚 Índice
1. [Estrutura de Dados](#estrutura-de-dados)
2. [Componentes](#componentes)
3. [Handlers](#handlers)
4. [Validações](#validações)
5. [Integrações](#integrações)

---

## 🗂️ Estrutura de Dados

### Interface LensData

```typescript
interface LensData {
    type: 'monthly'  // Fixo em mensal
    brand: string
    userStatus: 'has-prescription' | 'no-lenses' | 'no-prescription'
    rightEye: {
        sphere: string
        cylinder: string
        axis: string
    }
    leftEye: {
        sphere: string
        cylinder: string
        axis: string
    }
}
```

### Opções de Status do Usuário

```typescript
const userStatusOptions = [
    { 
        id: 'has-prescription', 
        name: 'Já uso lentes e sei meu grau', 
        description: 'Tenho minha receita em mãos',
        needsConsultation: false
    },
    { 
        id: 'no-lenses', 
        name: 'Não uso lentes de contato', 
        description: 'Preciso de avaliação médica',
        needsConsultation: true
    },
    { 
        id: 'no-prescription', 
        name: 'Uso lentes mas não sei meu grau', 
        description: 'Preciso atualizar minha receita',
        needsConsultation: true
    }
]
```

---

## 🧩 Componentes

### LensSelector - Estrutura Básica

```typescript
export function LensSelector({ 
    onContinue, 
    onBack, 
    onScheduleConsultation 
}: LensSelectorProps) {
    const [lensData, setLensData] = useState<LensData>({
        type: 'monthly',
        brand: '',
        userStatus: 'has-prescription',
        rightEye: { sphere: '', cylinder: '', axis: '' },
        leftEye: { sphere: '', cylinder: '', axis: '' }
    })

    const showPrescriptionForm = lensData.userStatus === 'has-prescription'

    return (
        <div className="space-y-8">
            {/* Seleção de Status */}
            <UserStatusSelector 
                selected={lensData.userStatus}
                onSelect={handleStatusSelect}
            />

            {/* Formulário Condicional */}
            {showPrescriptionForm && (
                <>
                    <MonthlyLensInfo />
                    <BrandSelector />
                    <PrescriptionForm />
                </>
            )}

            {/* Ações */}
            <ActionButtons />
        </div>
    )
}
```

### Seleção de Status do Usuário

```typescript
function UserStatusSelector({ selected, onSelect }) {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Qual é a sua situação?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
                Selecione a opção que melhor descreve você
            </p>
            <div className="space-y-3">
                {userStatusOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onSelect(option.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            selected === option.id
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="font-semibold text-gray-900 mb-1">
                            {option.name}
                        </div>
                        <div className="text-sm text-gray-600">
                            {option.description}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
```

### Informação sobre Lentes Mensais

```typescript
function MonthlyLensInfo() {
    return (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-primary-900">
                    <p className="font-medium mb-1">Lentes de Troca Mensal</p>
                    <p className="text-primary-700">
                        Nosso serviço trabalha exclusivamente com lentes de troca mensal, 
                        que oferecem o melhor custo-benefício e são mais sustentáveis.
                    </p>
                </div>
            </div>
        </div>
    )
}
```

### Botões de Ação Dinâmicos

```typescript
function ActionButtons({ 
    showPrescriptionForm, 
    isValid, 
    onBack, 
    onContinue, 
    onScheduleConsultation 
}) {
    return (
        <div className="flex space-x-4">
            <Button
                variant="outline"
                onClick={onBack}
                className="flex-1"
            >
                Voltar
            </Button>
            
            {showPrescriptionForm ? (
                <Button
                    onClick={onContinue}
                    disabled={!isValid}
                    className="flex-1"
                >
                    Continuar
                </Button>
            ) : (
                <Button
                    onClick={onScheduleConsultation}
                    className="flex-1"
                >
                    Agendar Consulta
                </Button>
            )}
        </div>
    )
}
```

---

## 🎯 Handlers

### Handler de Seleção de Status

```typescript
const handleStatusSelect = (status: 'has-prescription' | 'no-lenses' | 'no-prescription') => {
    // Atualizar estado
    setLensData(prev => ({ ...prev, userStatus: status }))
    
    // Verificar se precisa de consulta
    const selectedOption = userStatusOptions.find(opt => opt.id === status)
    
    if (selectedOption?.needsConsultation) {
        // Delay para feedback visual
        setTimeout(() => {
            onScheduleConsultation()
        }, 500)
    }
}
```

### Handler de Mudança de Olho Direito

```typescript
const handleRightEyeChange = (
    field: keyof LensData['rightEye'], 
    value: string
) => {
    setLensData(prev => ({
        ...prev,
        rightEye: { ...prev.rightEye, [field]: value },
        // Se "mesmo grau para ambos" estiver ativo
        ...(sameForBothEyes && { 
            leftEye: { ...prev.rightEye, [field]: value } 
        })
    }))
}
```

### Handler de Mudança de Olho Esquerdo

```typescript
const handleLeftEyeChange = (
    field: keyof LensData['leftEye'], 
    value: string
) => {
    setLensData(prev => ({
        ...prev,
        leftEye: { ...prev.leftEye, [field]: value }
    }))
}
```

### Handler de Redirecionamento

```typescript
// No SubscriptionFlow.tsx
const handleScheduleConsultation = () => {
    // Opção 1: Redirecionamento simples
    window.location.href = '/agendar-consulta'
    
    // Opção 2: Com dados pré-preenchidos
    const params = new URLSearchParams({
        plan: flowData.planId || '',
        source: 'subscription-flow'
    })
    window.location.href = `/agendar-consulta?${params.toString()}`
    
    // Opção 3: Com Next.js Router (client-side)
    router.push('/agendar-consulta')
}
```

---

## ✅ Validações

### Validação de Formulário

```typescript
const isValid = () => {
    // Validar apenas se usuário tem receita
    if (lensData.userStatus !== 'has-prescription') {
        return true  // Não precisa validar
    }
    
    // Validar campos obrigatórios
    return (
        lensData.brand &&
        lensData.rightEye.sphere &&
        lensData.leftEye.sphere
    )
}
```

### Validação de Grau

```typescript
const validatePrescription = (eye: { sphere: string; cylinder: string; axis: string }) => {
    const errors: string[] = []
    
    // Esférico é obrigatório
    if (!eye.sphere) {
        errors.push('Esférico é obrigatório')
    }
    
    // Validar range de valores
    const sphere = parseFloat(eye.sphere)
    if (sphere < -20 || sphere > 20) {
        errors.push('Esférico deve estar entre -20 e +20')
    }
    
    // Se tem cilíndrico, deve ter eixo
    if (eye.cylinder && !eye.axis) {
        errors.push('Eixo é obrigatório quando há cilíndrico')
    }
    
    return errors
}
```

### Validação de Marca

```typescript
const validateBrand = (brand: string) => {
    const validBrands = [
        'Acuvue',
        'Biofinity',
        'Air Optix',
        'Bausch + Lomb',
        'CooperVision',
        'Outra marca'
    ]
    
    return validBrands.includes(brand) || brand === ''
}
```

---

## 🔗 Integrações

### Integração com SubscriptionFlow

```typescript
// SubscriptionFlow.tsx
export function SubscriptionFlow() {
    const [flowData, setFlowData] = useState<FlowData>({
        planId: null,
        billingCycle: 'monthly',
        lensData: null,
        addOns: []
    })

    const handleLensSelect = (lensData: any) => {
        setFlowData(prev => ({ ...prev, lensData }))
        setCurrentStep('addons')
    }

    return (
        <LensSelector
            onContinue={handleLensSelect}
            onBack={() => setCurrentStep('plan')}
            onScheduleConsultation={() => {
                window.location.href = '/agendar-consulta'
            }}
        />
    )
}
```

### Integração com API de Agendamento

```typescript
const scheduleConsultation = async (data: LensData) => {
    try {
        const response = await fetch('/api/schedule-consultation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userStatus: data.userStatus,
                planId: flowData.planId,
                source: 'subscription-flow',
                timestamp: new Date().toISOString()
            })
        })

        if (!response.ok) {
            throw new Error('Erro ao agendar consulta')
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error('Erro:', error)
        throw error
    }
}
```

### Integração com Analytics

```typescript
// Tracking de eventos
const trackUserStatusSelection = (status: string) => {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'user_status_selected', {
            event_category: 'subscription_flow',
            event_label: status,
            value: status === 'has-prescription' ? 1 : 0
        })
    }
    
    // Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', 'UserStatusSelected', {
            status: status,
            needsConsultation: status !== 'has-prescription'
        })
    }
}

// Tracking de redirecionamento
const trackConsultationRedirect = (status: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'consultation_redirect', {
            event_category: 'subscription_flow',
            event_label: status,
            value: 1
        })
    }
}
```

---

## 🎨 Estilos e Classes

### Classes Tailwind Utilizadas

```typescript
// Card de opção
const optionCardClasses = (isSelected: boolean) => `
    w-full p-4 rounded-lg border-2 text-left transition-all
    ${isSelected 
        ? 'border-primary-600 bg-primary-50' 
        : 'border-gray-200 hover:border-gray-300'
    }
`

// Caixa informativa
const infoBoxClasses = `
    bg-primary-50 border border-primary-200 rounded-lg p-4
    flex items-start space-x-3
`

// Botão primário
const primaryButtonClasses = `
    flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg
    hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors
`

// Botão secundário
const secondaryButtonClasses = `
    flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg
    hover:border-gray-400 hover:bg-gray-50
    transition-colors
`
```

### Animações

```typescript
// Fade in ao selecionar opção
const fadeInAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
}

// Uso com Framer Motion
import { motion } from 'framer-motion'

<motion.div {...fadeInAnimation}>
    <PrescriptionForm />
</motion.div>
```

---

## 🧪 Testes

### Teste Unitário - Validação

```typescript
describe('LensSelector Validation', () => {
    it('should validate prescription data correctly', () => {
        const validData = {
            type: 'monthly',
            brand: 'Acuvue',
            userStatus: 'has-prescription',
            rightEye: { sphere: '-2.00', cylinder: '-0.75', axis: '180' },
            leftEye: { sphere: '-2.25', cylinder: '-0.50', axis: '90' }
        }
        
        expect(isValid(validData)).toBe(true)
    })
    
    it('should require sphere for both eyes', () => {
        const invalidData = {
            type: 'monthly',
            brand: 'Acuvue',
            userStatus: 'has-prescription',
            rightEye: { sphere: '', cylinder: '', axis: '' },
            leftEye: { sphere: '', cylinder: '', axis: '' }
        }
        
        expect(isValid(invalidData)).toBe(false)
    })
})
```

### Teste de Integração - Redirecionamento

```typescript
describe('LensSelector Redirection', () => {
    it('should redirect when user needs consultation', async () => {
        const mockRouter = { push: jest.fn() }
        const { getByText } = render(
            <LensSelector 
                onScheduleConsultation={() => mockRouter.push('/agendar-consulta')}
            />
        )
        
        fireEvent.click(getByText('Não uso lentes de contato'))
        
        await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith('/agendar-consulta')
        })
    })
})
```

---

## 📝 Notas de Implementação

### Performance

```typescript
// Usar useMemo para opções
const userStatusOptions = useMemo(() => [
    { id: 'has-prescription', /* ... */ },
    { id: 'no-lenses', /* ... */ },
    { id: 'no-prescription', /* ... */ }
], [])

// Usar useCallback para handlers
const handleStatusSelect = useCallback((status) => {
    setLensData(prev => ({ ...prev, userStatus: status }))
    // ...
}, [onScheduleConsultation])
```

### Acessibilidade

```typescript
// ARIA labels
<button
    aria-label={`Selecionar opção: ${option.name}`}
    aria-pressed={selected === option.id}
    role="radio"
>
    {option.name}
</button>

// Focus management
useEffect(() => {
    if (showPrescriptionForm) {
        // Focar no primeiro campo
        document.getElementById('brand-selector')?.focus()
    }
}, [showPrescriptionForm])
```

### Error Handling

```typescript
const handleError = (error: Error) => {
    console.error('Erro no fluxo de assinatura:', error)
    
    // Mostrar toast de erro
    toast.error('Ocorreu um erro. Por favor, tente novamente.')
    
    // Enviar para serviço de monitoramento
    if (typeof window !== 'undefined' && window.Sentry) {
        window.Sentry.captureException(error)
    }
}
```

---

## 🔄 Versionamento

```typescript
// Versão do componente
export const LENS_SELECTOR_VERSION = '2.0.0'

// Changelog
export const CHANGELOG = {
    '2.0.0': {
        date: '2025-06-10',
        changes: [
            'Removido suporte para lentes diárias e semanais',
            'Adicionado seletor de status do usuário',
            'Implementado redirecionamento para agendamento',
            'Formulário de prescrição agora é condicional'
        ]
    },
    '1.0.0': {
        date: '2025-01-01',
        changes: [
            'Versão inicial com suporte a 3 tipos de lentes'
        ]
    }
}
```

---

**Última atualização:** 10/06/2025  
**Versão:** 2.0.0  
**Autor:** Sistema de Desenvolvimento
