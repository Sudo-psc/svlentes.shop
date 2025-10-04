# Sistema de Ícones - SV Lentes

Sistema completo de gerenciamento e otimização de ícones para o projeto SV Lentes.

## 📚 Documentação

- **[Catálogo de Ícones](../ICONES.md)** - Lista completa de todos os ícones disponíveis, categorias e uso
- **[Design System](../DESIGN_SYSTEM_ICONS.md)** - Padrões visuais e diretrizes de implementação
- **[Guia de Implementação](#guia-rápido)** - Como usar ícones no código

## 🚀 Início Rápido

### Instalação

O sistema de ícones já está instalado e configurado. Para usar:

```tsx
import { Icon } from '@/components/ui/Icon'

function MyComponent() {
  return <Icon name="customerService" size="md" />
}
```

### Componentes Disponíveis

1. **Icon** - Componente base para renderizar ícones
2. **IconGroup** - Grupo de ícones com espaçamento consistente
3. **IconBadge** - Ícone como badge com posicionamento absoluto

## 📖 Guia Rápido

### 1. Importar e Usar

```tsx
import { Icon } from '@/components/ui/Icon'

// Uso básico
<Icon name="delivery" />

// Com tamanho
<Icon name="calculator" size="lg" />

// Com prioridade (hero section)
<Icon name="atendimento24x7" size="xl" priority />

// Totalmente customizado
<Icon
  name="drPhilipe"
  customSize={{ width: 120, height: 120 }}
  alt="Dr. Philipe Saraiva Cruz"
  className="rounded-full"
/>
```

### 2. Grupo de Ícones

```tsx
import { IconGroup } from '@/components/ui/Icon'

<IconGroup
  icons={['shieldSecurity', 'delivery', 'eyeCheckAward']}
  size="lg"
  spacing="md"
  layout="horizontal"
/>
```

### 3. Badge de Destaque

```tsx
import { IconBadge } from '@/components/ui/Icon'

<div className="relative">
  <PricingCard />
  <IconBadge name="popularBadge" position="top-right" />
</div>
```

## 🎯 Ícones por Categoria

### Atendimento (3 ícones)
- `customerService` - Atendimento ao cliente
- `atendimento24x7` - Disponibilidade 24/7
- `amorSaude` - Cuidado com a saúde

### Benefícios (4 ícones)
- `shieldSecurity` - Segurança e garantia
- `premiumQuality` - Qualidade premium
- `piggyBank` - Economia financeira
- `calculator` - Calculadora de economia

### Processos (2 ícones)
- `delivery` - Entrega de lentes
- `location` - Localização

### Médico (2 ícones)
- `eyeCalendar` - Agendamento de consultas
- `eyeCheckAward` - Exames certificados

### Badges (2 ícones)
- `popularBadge` - Plano mais popular
- `anniversaryBadge` - Experiência de 10 anos

### Perfil (2 ícones)
- `drPhilipe` - Foto do Dr. Philipe
- `userPin` - Avatar de usuário

## ⚙️ Otimização

### Converter Ícones para WebP

```bash
# Instalar dependência (se necessário)
npm install sharp --save-dev

# Executar otimização
npm run optimize:icons
```

Isso irá:
1. Converter PNG/JPEG para WebP
2. Gerar versões responsivas (1x, 2x, 3x)
3. Comprimir mantendo qualidade
4. Gerar relatório de economia

### Visualizar Catálogo

```bash
npm run icons:catalog
```

## 📊 Tamanhos Predefinidos

| Tamanho | Dimensões | Uso Recomendado |
|---------|-----------|-----------------|
| `sm`    | 32x32px   | Ícones inline, badges pequenos |
| `md`    | 48x48px   | Cards, listas, navegação (padrão) |
| `lg`    | 64x64px   | Destaque, features, benefícios |
| `xl`    | 80x80px   | Hero sections, grandes destaques |
| `custom`| Personalizado | Casos específicos (ex: perfil 120x120) |

## 🎨 Padrões de Container

### Container Circular

```tsx
<div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
  <Icon name="shieldSecurity" size="md" />
</div>
```

### Container com Gradient

```tsx
<div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-lg">
  <Icon name="calculator" size="lg" />
</div>
```

## ♿ Acessibilidade

### Alt Text

Todos os ícones têm alt text padrão:

```tsx
// Alt text padrão
<Icon name="delivery" />
// Alt: "Entrega de lentes em domicílio"

// Alt text customizado
<Icon
  name="delivery"
  alt="Entrega rápida e gratuita para todo Brasil"
/>
```

### Ícones Decorativos

```tsx
// Esconder de screen readers
<Icon name="location" decorative />
```

### Navegação por Teclado

```tsx
// Ícone clicável
<Icon
  name="customerService"
  onClick={() => openWhatsApp()}
  // Automaticamente adiciona:
  // - role="button"
  // - tabIndex={0}
  // - onKeyDown handler
/>
```

## 🔧 Helpers Disponíveis

```tsx
import {
  getIconsByCategory,
  getIconPath,
  getIconAlt,
  ICONS
} from '@/lib/icons'

// Obter todos os ícones de uma categoria
const atendimentoIcons = getIconsByCategory('atendimento')

// Obter caminho do ícone
const path = getIconPath('calculator') // '/icones/colorful_calculator_icon.png'

// Obter alt text padrão
const alt = getIconAlt('delivery') // 'Entrega de lentes em domicílio'

// Acessar metadata completa
const metadata = ICONS.customerService
console.log(metadata.suggestedUse) // ['seção de contato', 'botão de suporte', ...]
```

## 📝 Exemplos Completos

### Seção de Benefícios

```tsx
const benefits = [
  { icon: 'shieldSecurity', title: 'Seguro', description: '100% protegido' },
  { icon: 'delivery', title: 'Entrega', description: 'Grátis para todo Brasil' },
  { icon: 'piggyBank', title: 'Economia', description: 'Até 40% de desconto' }
]

function BenefitsSection() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {benefits.map(benefit => (
        <div key={benefit.icon} className="text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Icon name={benefit.icon} size="md" />
          </div>
          <h3>{benefit.title}</h3>
          <p>{benefit.description}</p>
        </div>
      ))}
    </div>
  )
}
```

### Card de Plano com Badge

```tsx
function PricingCard({ plan, isPopular }) {
  return (
    <div className="relative bg-white rounded-xl p-6">
      {isPopular && (
        <IconBadge name="popularBadge" position="top-right" />
      )}

      <div className="flex items-center gap-3 mb-4">
        <Icon name="premiumQuality" size="lg" />
        <h3>{plan.name}</h3>
      </div>

      {/* ... resto do card ... */}
    </div>
  )
}
```

### Header com Atendimento

```tsx
function Header() {
  return (
    <header>
      <div className="flex items-center gap-2">
        <Icon name="atendimento24x7" size="sm" />
        <span>Atendimento 24/7</span>
      </div>

      <button onClick={openWhatsApp}>
        <Icon
          name="customerService"
          size="md"
          className="hover:scale-110 transition-transform"
        />
      </button>
    </header>
  )
}
```

## 🚨 Troubleshooting

### Ícone não aparece

1. Verificar se o nome está correto (case-sensitive)
2. Verificar se o arquivo existe em `/public/icones/`
3. Verificar console do navegador para erros 404

### Ícone muito grande/pequeno

Use tamanhos predefinidos ou `customSize`:

```tsx
// Tamanho predefinido
<Icon name="delivery" size="lg" />

// Custom
<Icon name="delivery" customSize={{ width: 100, height: 100 }} />
```

### Baixa performance

1. Usar `priority` apenas em ícones above-the-fold
2. Executar `npm run optimize:icons` para gerar versões WebP
3. Verificar se lazy loading está ativo (padrão)

## 📞 Suporte

Para dúvidas ou sugestões sobre o sistema de ícones:

1. Consultar a [documentação completa](../ICONES.md)
2. Verificar o [design system](../DESIGN_SYSTEM_ICONS.md)
3. Abrir issue no repositório

---

**Última atualização**: 04/10/2025
**Versão**: 1.0.0
