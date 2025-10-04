# LAAS - Lens as a Service

Sistema de assinatura de lentes de contato com acompanhamento oftalmológico integrado.

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

## 📦 Estrutura do Projeto

```
laas-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   └── globals.css      # Estilos globais
│   ├── components/
│   │   ├── ui/             # Componentes shadcn/ui
│   │   └── laas/           # Componentes customizados LAAS
│   └── lib/
│       └── utils.ts        # Utilitários
├── tailwind.config.ts      # Configuração Tailwind
├── package.json
└── DESIGN-SYSTEM.md        # Documentação completa do Design System
```

## 🎨 Design System

Este projeto utiliza um Design System completo baseado em:

- **shadcn/ui** - Componentes base
- **Tailwind CSS** - Estilização utilitária
- **Radix UI** - Primitivos acessíveis

### Consulte a Documentação

Para informações completas sobre componentes, cores, tipografia e padrões de uso:

👉 **[DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)**

## 🧩 Componentes Disponíveis

### Base (shadcn/ui)
- Button
- Card
- Input
- Label
- Checkbox
- Accordion
- Badge

### Customizados (LAAS)
- TrustBadge
- PricingCard
- LeadForm

## 🎯 Exemplo de Uso

```tsx
import { Button } from "@/components/ui/button"
import { TrustBadge } from "@/components/laas/trust-badge"
import { PricingCard } from "@/components/laas/pricing-card"

export default function Home() {
  return (
    <div className="laas-container laas-section">
      <h1 className="hero-title">
        Nunca mais fique sem lentes
      </h1>

      <Button variant="default" size="lg">
        Agendar Consulta
      </Button>

      <TrustBadge text="Remessa grátis" />

      <PricingCard
        title="Plano Mensal"
        price="34.90"
        features={[
          { text: "Lentes mensais", included: true },
          { text: "Consulta incluída", included: true },
        ]}
      />
    </div>
  )
}
```

## 🎨 Paleta de Cores

### Brand
- **Primary**: `#1e3a5f` (laas-blue)
- **Success**: `#10b981` (laas-success)
- **WhatsApp**: `#25d366` (laas-whatsapp)

### Grayscale
- Gray 50-900 (laas-gray-*)

## 📱 Responsividade

Design mobile-first com breakpoints:

```css
sm:  640px   /* Tablets pequenos */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Desktops grandes */
```

## ♿ Acessibilidade

- ✅ Contraste WCAG AA
- ✅ Navegação por teclado
- ✅ Screen reader friendly
- ✅ Focus visible
- ✅ ARIA labels

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

## 📚 Documentação Adicional

- [Frontend/Specs/wireframe-specs.md](../Frontend/Specs/wireframe-specs.md) - Especificações do wireframe
- [Frontend/Specs/arquitetura-nextjs.md](../Frontend/Specs/arquitetura-nextjs.md) - Arquitetura técnica
- [CLAUDE.md](../CLAUDE.md) - Guia para desenvolvimento

## 🤝 Contribuindo

Este é um projeto interno da Saraiva Vision. Para contribuir:

1. Siga os padrões do Design System
2. Mantenha acessibilidade WCAG AA
3. Documente novos componentes
4. Teste em múltiplos dispositivos

## 📄 Licença

Propriedade de Saraiva Vision Care LTDA (CNPJ: 53.864.119/0001-79)

## 👨‍⚕️ Responsável Técnico

Dr. Philipe Saraiva Cruz - CRM-MG 69.870
