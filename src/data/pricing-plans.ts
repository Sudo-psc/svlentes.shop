import { PricingPlan } from '@/types'

// Planos de assinatura de lentes de contato
export const pricingPlans: PricingPlan[] = [
    {
        id: 'basic',
        name: 'Plano Básico',
        priceMonthly: 99.00,
        priceAnnual: 990.00, // 2 meses grátis
        features: [
            'Lentes de contato mensais',
            'Entrega a cada 3 meses',
            'Acompanhamento médico básico',
            'Suporte via WhatsApp',
            'Frete grátis',
            'Troca em caso de problema'
        ],
        recommended: false,
        stripeProductId: 'prod_basic_laas',
        stripePriceId: 'price_basic_monthly',
        ctaText: 'Assinar Plano Básico'
    },
    {
        id: 'premium',
        name: 'Plano Premium',
        priceMonthly: 149.90,
        priceAnnual: 1499.90, // 2 meses grátis
        features: [
            'Lentes de contato diárias ou mensais',
            'Entrega mensal automática',
            'Consulta médica semestral incluída',
            'Teleorientação ilimitada',
            'Suporte prioritário 24/7',
            'Frete grátis express',
            'Seguro contra perda/dano',
            'App exclusivo para acompanhamento'
        ],
        recommended: true,
        stripeProductId: 'prod_premium_laas',
        stripePriceId: 'price_premium_monthly',
        ctaText: 'Assinar Premium'
    },
    {
        id: 'vip',
        name: 'Plano VIP',
        priceMonthly: 249.90,
        priceAnnual: 2499.90, // 2 meses grátis
        features: [
            'Lentes premium de última geração',
            'Entrega quinzenal se necessário',
            'Consultas médicas trimestrais',
            'Exames oftalmológicos incluídos',
            'Atendimento médico domiciliar',
            'Concierge de saúde ocular',
            'Seguro premium completo',
            'Acesso a lentes especiais',
            'Desconto em cirurgias'
        ],
        recommended: false,
        stripeProductId: 'prod_vip_laas',
        stripePriceId: 'price_vip_monthly',
        ctaText: 'Assinar VIP'
    }
]

// Comparação de features entre planos
export const featureComparison = {
    features: [
        'Lentes de contato',
        'Frequência de entrega',
        'Consultas médicas',
        'Teleorientação',
        'Suporte',
        'Frete',
        'Seguro',
        'App móvel',
        'Exames incluídos',
        'Atendimento domiciliar'
    ],
    planComparison: [
        {
            feature: 'Lentes de contato',
            basic: 'Mensais',
            premium: 'Diárias ou mensais',
            vip: 'Premium última geração'
        },
        {
            feature: 'Frequência de entrega',
            basic: 'A cada 3 meses',
            premium: 'Mensal',
            vip: 'Quinzenal se necessário'
        },
        {
            feature: 'Consultas médicas',
            basic: 'Básico',
            premium: 'Semestral incluída',
            vip: 'Trimestral incluída'
        },
        {
            feature: 'Teleorientação',
            basic: false,
            premium: 'Ilimitada',
            vip: 'Ilimitada + prioritária'
        },
        {
            feature: 'Suporte',
            basic: 'WhatsApp',
            premium: '24/7 prioritário',
            vip: 'Concierge dedicado'
        },
        {
            feature: 'Frete',
            basic: 'Grátis',
            premium: 'Grátis express',
            vip: 'Grátis express + emergencial'
        },
        {
            feature: 'Seguro',
            basic: 'Básico',
            premium: 'Contra perda/dano',
            vip: 'Premium completo'
        },
        {
            feature: 'App móvel',
            basic: false,
            premium: true,
            vip: true
        },
        {
            feature: 'Exames incluídos',
            basic: false,
            premium: false,
            vip: true
        },
        {
            feature: 'Atendimento domiciliar',
            basic: false,
            premium: false,
            vip: true
        }
    ]
}

// Benefícios gerais do serviço
export const serviceBenefits = [
    {
        id: 'convenience',
        title: 'Conveniência Total',
        description: 'Receba suas lentes em casa, sem precisar sair',
        icon: '🏠',
        highlight: true
    },
    {
        id: 'medical-care',
        title: 'Acompanhamento Médico',
        description: 'Dr. Philipe Saraiva Cruz acompanha sua saúde ocular',
        icon: '👨‍⚕️',
        highlight: true
    },
    {
        id: 'economy',
        title: 'Economia Garantida',
        description: 'Até 40% mais barato que comprar avulso',
        icon: '💰',
        highlight: true
    },
    {
        id: 'quality',
        title: 'Qualidade Premium',
        description: 'Apenas lentes de marcas reconhecidas mundialmente',
        icon: '⭐',
        highlight: false
    },
    {
        id: 'flexibility',
        title: 'Flexibilidade',
        description: 'Pause, altere ou cancele quando quiser',
        icon: '🔄',
        highlight: false
    },
    {
        id: 'support',
        title: 'Suporte Especializado',
        description: 'Atendimento por profissionais da área',
        icon: '📞',
        highlight: false
    }
]

// Dados para calculadora de economia
export const economyCalculatorData = {
    averagePrices: {
        daily: {
            avulso: 4.50, // por lente
            subscription: 2.70 // por lente na assinatura
        },
        weekly: {
            avulso: 12.00,
            subscription: 7.20
        },
        monthly: {
            avulso: 25.00,
            subscription: 15.00
        }
    },
    usagePatterns: {
        occasional: { daysPerMonth: 10, multiplier: 0.33 },
        regular: { daysPerMonth: 20, multiplier: 0.67 },
        daily: { daysPerMonth: 30, multiplier: 1.0 }
    }
}