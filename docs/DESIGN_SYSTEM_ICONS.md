# 🎨 Design System - Ícones SV Lentes

Guia completo de padrões visuais e uso de ícones no projeto SV Lentes.

## 📐 Princípios de Design

### 1. Consistência Visual

**Objetivo**: Manter harmonia visual em toda a aplicação

✅ **Fazer**:
- Usar tamanhos predefinidos (sm, md, lg, xl)
- Manter proporções consistentes
- Aplicar mesmo estilo de sombras e bordas
- Usar backgrounds neutros uniformes

❌ **Evitar**:
- Tamanhos arbitrários fora do sistema
- Misturar estilos visuais diferentes
- Sobrepor cores conflitantes
- Distorcer proporções originais

### 2. Hierarquia Visual

**Tamanhos por Contexto**:

```tsx
// Hero Section - Destaque máximo
<Icon name="atendimento24x7" size="xl" priority />

// Feature Cards - Destaque médio
<Icon name="shieldSecurity" size="lg" />

// Lista de Benefícios - Padrão
<Icon name="delivery" size="md" />

// Inline Text - Mínimo
<Icon name="amorSaude" size="sm" />
```

### 3. Acessibilidade

**Requisitos Mínimos**:
- Contraste mínimo 4.5:1 (WCAG AA)
- Alt text descritivo e contextual
- Suporte a navegação por teclado
- Indicadores visuais de foco

## 🎯 Padrões de Uso por Seção

### Hero Section

**Contexto**: Primeira impressão, máximo impacto visual

```tsx
<section className="hero">
  <div className="hero-badge">
    <Icon
      name="atendimento24x7"
      size="xl"
      priority // Carregamento prioritário
      className="animate-pulse-subtle"
    />
  </div>
  <h1>Nunca mais fique sem lentes</h1>
</section>
```

**Ícones Recomendados**:
- `atendimento24x7` - Destaque de disponibilidade
- `premiumQuality` - Diferencial de qualidade
- `eyeCheckAward` - Certificação médica

### Cards de Benefícios

**Contexto**: Comunicação clara de vantagens

```tsx
<div className="benefits-grid">
  {benefits.map(benefit => (
    <div className="benefit-card">
      <div className="icon-container">
        <Icon
          name={benefit.icon}
          size="lg"
          className="group-hover:scale-110 transition-transform"
        />
      </div>
      <h3>{benefit.title}</h3>
      <p>{benefit.description}</p>
    </div>
  ))}
</div>
```

**Padrão de Container**:
```css
.icon-container {
  width: 80px;
  height: 80px;
  background: var(--primary-50);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
```

**Ícones Recomendados**:
- `shieldSecurity` - Segurança e garantia
- `piggyBank` - Economia financeira
- `delivery` - Entrega domiciliar
- `customerService` - Atendimento

### Seção de Economia/Calculadora

**Contexto**: Foco em benefícios financeiros

```tsx
<section className="economy">
  <div className="section-header">
    <Icon
      name="calculator"
      size="lg"
      priority
      className="mb-6"
    />
    <h2>Calcule sua Economia</h2>
  </div>

  {/* Stats Cards */}
  <div className="stats-grid">
    <div className="stat-card">
      <Icon name="piggyBank" size="md" />
      <div className="stat-value">R$ 800</div>
      <div className="stat-label">Economia média anual</div>
    </div>
  </div>
</section>
```

**Ícones Recomendados**:
- `calculator` - Ícone principal da seção
- `piggyBank` - Economia monetária
- `premiumQuality` - Valor agregado

### Cards de Planos (Pricing)

**Contexto**: Destaque de opções e popularidade

```tsx
<div className="pricing-card popular">
  <IconBadge
    name="popularBadge"
    position="top-right"
    offset={-8}
  />

  <div className="plan-header">
    <Icon name="premiumQuality" size="md" />
    <h3>Plano Anual</h3>
  </div>

  <div className="plan-features">
    {/* Lista de features */}
  </div>
</div>
```

**Badges Disponíveis**:
- `popularBadge` - Plano mais escolhido
- `anniversaryBadge` - Destaque de experiência

### Seção de Confiança/Garantias

**Contexto**: Reforço de credibilidade

```tsx
<div className="trust-section">
  <IconGroup
    icons={[
      'shieldSecurity',
      'amorSaude',
      'delivery',
      'eyeCheckAward'
    ]}
    size="md"
    spacing="lg"
    layout="horizontal"
  />

  <div className="trust-statements">
    {/* Declarações de confiança */}
  </div>
</div>
```

**Ícones Recomendados**:
- `shieldSecurity` - Segurança de dados
- `amorSaude` - Cuidado médico
- `eyeCheckAward` - Qualidade certificada
- `anniversaryBadge` - Experiência comprovada

### Footer

**Contexto**: Informações complementares e perfil

```tsx
<footer>
  <div className="footer-section about">
    <Icon
      name="drPhilipe"
      customSize={{ width: 96, height: 96 }}
      className="rounded-full border-4 border-white shadow-lg"
    />
    <h4>Dr. Philipe Saraiva Cruz</h4>
    <p>CRM-MG 69.870</p>
  </div>

  <div className="footer-section contact">
    <Icon name="customerService" size="sm" />
    <p>Atendimento via WhatsApp</p>
  </div>
</footer>
```

**Ícones Recomendados**:
- `drPhilipe` - Foto do médico responsável
- `customerService` - Canais de atendimento
- `amorSaude` - Valores da empresa
- `location` - Localização física

## 🎨 Padrões Visuais

### Containers de Ícones

#### Estilo 1: Container Circular

```tsx
<div className="icon-circle">
  <Icon name="shieldSecurity" size="md" />
</div>
```

```css
.icon-circle {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #e0f2fe, #bfdbfe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

#### Estilo 2: Container Rounded

```tsx
<div className="icon-rounded">
  <Icon name="calculator" size="lg" />
</div>
```

```css
.icon-rounded {
  width: 80px;
  height: 80px;
  background: var(--primary-50);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--primary-100);
}
```

#### Estilo 3: Container com Gradient

```tsx
<div className="icon-gradient">
  <Icon name="premiumQuality" size="md" />
</div>
```

```css
.icon-gradient {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(251, 191, 36, 0.3);
}
```

### Estados de Interação

```tsx
// Hover Effect
<Icon
  name="delivery"
  size="lg"
  className="transition-transform hover:scale-110 cursor-pointer"
  onClick={handleClick}
/>

// Loading State
<div className="icon-loading">
  <Icon
    name="customerService"
    size="md"
    className="animate-pulse opacity-50"
  />
</div>

// Active/Selected State
<Icon
  name="calculator"
  size="lg"
  className={isActive ? 'ring-4 ring-primary-500' : ''}
/>
```

### Animações

```css
/* Pulse Sutil */
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}

/* Bounce no Hover */
.icon-bounce:hover {
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* Rotate no Load */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.icon-loading {
  animation: rotate 2s linear infinite;
}
```

## 📱 Responsividade

### Breakpoints de Tamanho

```tsx
// Mobile (sm)
<Icon name="delivery" size="sm" />

// Tablet (md)
<Icon name="delivery" size="md" className="hidden sm:block" />

// Desktop (lg)
<Icon name="delivery" size="lg" className="hidden lg:block" />
```

### Sistema de Escala Responsiva

```tsx
// Usando Tailwind classes
<Icon
  name="atendimento24x7"
  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
/>
```

## 🎯 Casos de Uso Especiais

### Ícone com Notificação/Badge

```tsx
<div className="relative inline-block">
  <Icon name="customerService" size="lg" />
  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
</div>
```

### Ícone com Tooltip

```tsx
<div className="group relative">
  <Icon name="shieldSecurity" size="md" />
  <div className="tooltip">
    Dados protegidos com criptografia AES-256
  </div>
</div>
```

### Ícone Decorativo (Background)

```tsx
<div className="section-with-icon-bg">
  <Icon
    name="eyeCheckAward"
    customSize={{ width: 200, height: 200 }}
    decorative
    className="absolute opacity-5 -top-10 -right-10"
  />
  <div className="content">
    {/* Conteúdo principal */}
  </div>
</div>
```

## 🔧 Checklist de Implementação

Ao adicionar ícone em nova seção:

- [ ] Escolher ícone semanticamente correto da categoria apropriada
- [ ] Usar tamanho predefinido (sm, md, lg, xl) ou justificar custom
- [ ] Fornecer alt text descritivo e contextual
- [ ] Aplicar container com estilo consistente
- [ ] Verificar contraste mínimo 4.5:1
- [ ] Testar em mobile, tablet e desktop
- [ ] Adicionar estados de hover/focus se clicável
- [ ] Validar acessibilidade com screen reader
- [ ] Considerar lazy loading para ícones abaixo da dobra
- [ ] Documentar uso no código (comentários)

## 📊 Métricas de Qualidade

### Performance

- **LCP (Largest Contentful Paint)**: Ícones não devem atrasar
- **Bundle Size**: Manter ícones fora do bundle JavaScript
- **Cache**: Aproveitar long-term caching de assets

### Acessibilidade

- **Contraste**: Mínimo 4.5:1 (WCAG AA)
- **Screen Readers**: Alt text claro e contextual
- **Keyboard Navigation**: Foco visível em ícones interativos
- **ARIA**: Uso correto de aria-hidden para decorativos

### Manutenibilidade

- **Catalogação**: Todos os ícones documentados em ICONES.md
- **Naming**: Nomes semânticos e consistentes
- **Versionamento**: Controle de mudanças em ícones
- **Testes**: Validação de acessibilidade automatizada

## 🚀 Próximos Passos

1. **Otimização WebP**: Converter todos os ícones para WebP
2. **Responsive Images**: Implementar srcset para diferentes densidades
3. **CDN**: Hospedar ícones em CDN para melhor performance
4. **Sprite System**: Considerar sprite sheets para ícones pequenos
5. **Icon Library**: Expandir biblioteca com novos ícones conforme necessário

---

**Última atualização**: 04/10/2025
**Versão do Design System**: 1.0.0
