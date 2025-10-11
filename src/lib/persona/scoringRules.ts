/**
 * Scoring Rules - Regras de pontuação para inferência de persona
 *
 * Define como cada evento rastreado contribui para a pontuação
 * de cada persona.
 *
 * @module scoringRules
 */

import type { ScoringRulesMap, EventScoringRules } from './types'

/**
 * Thresholds de preço para categorização
 */
const PRICE_THRESHOLDS = {
  LOW: 150,      // < R$ 150
  MEDIUM: 300,   // R$ 150-300
  HIGH: 300,     // > R$ 300
}

/**
 * Keywords para análise de busca
 */
const SEARCH_KEYWORDS = {
  HEALTH: /saúde|oftalmológico|visão|exame|médico|consulta|acompanhamento/i,
  PRICE: /barato|desconto|promoção|econômico|custo|preço|oferta/i,
  PREMIUM: /premium|luxo|qualidade|melhor|top|superior/i,
  CONVENIENCE: /entrega|automático|assinatura|facilidade|prático|recorrente/i,
  TECH: /tecnologia|inovação|moderno|app|digital|smart/i,
}

/**
 * Regras de pontuação por tipo de evento
 */
export const SCORING_RULES: ScoringRulesMap = {
  // ─────────────────────────────────────────────────────────────────
  // PAGE VIEW
  // ─────────────────────────────────────────────────────────────────
  page_view: {
    rules: [
      {
        // Visualização de página de planos → Pesquisador
        condition: (data) => /\/planos|\/assinatura|\/pricing/.test(data.path),
        points: { researcher: 3 },
      },
      {
        // Tempo longo na página (> 2 min) → Pesquisador
        condition: (data) => data.duration && data.duration > 120,
        points: { researcher: 5 },
      },
      {
        // Tempo curto na página (< 30s) → Urgente
        condition: (data) => data.duration && data.duration < 30,
        points: { urgent_buyer: 2 },
      },
    ],
    weight: 1,
  },

  // ─────────────────────────────────────────────────────────────────
  // CATEGORY VISIT
  // ─────────────────────────────────────────────────────────────────
  category_visit: {
    rules: [
      {
        // Visita a lentes de contato → Health conscious
        condition: (data) => /lentes-contato|contact-lens/.test(data.categoryId),
        points: { health_conscious: 5 },
      },
      {
        // Visita a categoria "Econômicas" → Price sensitive
        condition: (data) => /economicas|budget|baixo-custo/.test(data.categoryId),
        points: { price_sensitive: 8 },
      },
      {
        // Visita a categoria "Premium" → Premium seeker
        condition: (data) => /premium|luxo|top/.test(data.categoryId),
        points: { premium_seeker: 8 },
      },
    ],
    weight: 2, // Categorias são bons indicadores
  },

  // ─────────────────────────────────────────────────────────────────
  // PRODUCT VIEW
  // ─────────────────────────────────────────────────────────────────
  product_view: {
    rules: [
      {
        // Produto barato (< R$ 150) → Price sensitive
        condition: (data) => data.price && data.price < PRICE_THRESHOLDS.LOW,
        points: { price_sensitive: 5 },
      },
      {
        // Produto caro (> R$ 300) → Premium seeker
        condition: (data) => data.price && data.price > PRICE_THRESHOLDS.HIGH,
        points: { premium_seeker: 5 },
      },
      {
        // Tempo longo visualizando (> 1 min) → Pesquisador
        condition: (data) => data.duration && data.duration > 60,
        points: { researcher: 4 },
      },
      {
        // Produto relacionado a saúde ocular → Health conscious
        condition: (data) =>
          /oftalmológico|médico|consulta|exam|topografia/.test(data.productName || ''),
        points: { health_conscious: 6 },
      },
    ],
    weight: 2, // Visualizar produto é importante
  },

  // ─────────────────────────────────────────────────────────────────
  // SEARCH QUERY
  // ─────────────────────────────────────────────────────────────────
  search_query: {
    rules: [
      {
        // Busca por termos de saúde
        condition: (data) => SEARCH_KEYWORDS.HEALTH.test(data.query),
        points: { health_conscious: 8 },
      },
      {
        // Busca por preço/desconto
        condition: (data) => SEARCH_KEYWORDS.PRICE.test(data.query),
        points: { price_sensitive: 8 },
      },
      {
        // Busca por qualidade/premium
        condition: (data) => SEARCH_KEYWORDS.PREMIUM.test(data.query),
        points: { premium_seeker: 8 },
      },
      {
        // Busca por conveniência
        condition: (data) => SEARCH_KEYWORDS.CONVENIENCE.test(data.query),
        points: { convenience_seeker: 8 },
      },
      {
        // Busca por tecnologia
        condition: (data) => SEARCH_KEYWORDS.TECH.test(data.query),
        points: { tech_savvy: 8 },
      },
    ],
    weight: 3, // Busca revela intenção forte
  },

  // ─────────────────────────────────────────────────────────────────
  // ADD TO CART
  // ─────────────────────────────────────────────────────────────────
  add_to_cart: {
    rules: [
      {
        // Produto barato → Price sensitive
        condition: (data) => data.price && data.price < PRICE_THRESHOLDS.LOW,
        points: { price_sensitive: 6 },
      },
      {
        // Produto caro → Premium seeker
        condition: (data) => data.price && data.price > PRICE_THRESHOLDS.HIGH,
        points: { premium_seeker: 6 },
      },
      {
        // Múltiplas unidades → Convenience seeker (estoque)
        condition: (data) => data.quantity && data.quantity > 3,
        points: { convenience_seeker: 5 },
      },
      {
        // Adicionar rápido ao carrinho → Urgente
        condition: () => true, // Qualquer add to cart indica urgência
        points: { urgent_buyer: 3 },
      },
    ],
    weight: 3, // Add to cart é forte indicador de intenção
  },

  // ─────────────────────────────────────────────────────────────────
  // FORM INTERACTION
  // ─────────────────────────────────────────────────────────────────
  form_interaction: {
    rules: [
      {
        // Formulário de prescrição → Health conscious
        condition: (data) => data.formType === 'prescription',
        points: { health_conscious: 10 },
      },
      {
        // Formulário de consulta → Health conscious
        condition: (data) => data.formType === 'consultation',
        points: { health_conscious: 12 },
      },
      {
        // Formulário de assinatura → Convenience seeker
        condition: (data) => data.formType === 'subscription',
        points: { convenience_seeker: 8 },
      },
      {
        // Completou formulário → Urgente (ação decisiva)
        condition: (data) => data.completed === true,
        points: { urgent_buyer: 5 },
      },
    ],
    weight: 4, // Interação com form é forte sinal
  },

  // ─────────────────────────────────────────────────────────────────
  // CONSULTATION INTEREST
  // ─────────────────────────────────────────────────────────────────
  consultation_interest: {
    rules: [
      {
        // Qualquer interesse em consulta → Health conscious
        condition: () => true,
        points: { health_conscious: 15 },
      },
      {
        // Consulta oftalmológica → Health conscious (extra)
        condition: (data) => data.consultationType === 'ophthalmologic',
        points: { health_conscious: 5 },
      },
      {
        // Via WhatsApp → Urgente
        condition: (data) => data.source === 'whatsapp',
        points: { urgent_buyer: 4 },
      },
    ],
    weight: 5, // Interesse em consulta é o indicador mais forte
  },

  // ─────────────────────────────────────────────────────────────────
  // SCROLL DEPTH
  // ─────────────────────────────────────────────────────────────────
  scroll_depth: {
    rules: [
      {
        // Scroll profundo (75%+) → Pesquisador
        condition: (data) => data.depth >= 75,
        points: { researcher: 2 },
      },
      {
        // Scroll completo (100%) → Pesquisador
        condition: (data) => data.depth === 100,
        points: { researcher: 3 },
      },
    ],
    weight: 1,
  },

  // ─────────────────────────────────────────────────────────────────
  // VIDEO PLAY
  // ─────────────────────────────────────────────────────────────────
  video_play: {
    rules: [
      {
        // Assistiu vídeo completo → Pesquisador
        condition: (data) => data.completed === true,
        points: { researcher: 6 },
      },
      {
        // Assistiu > 30s → Tech savvy (interesse em conteúdo)
        condition: (data) => data.duration && data.duration > 30,
        points: { tech_savvy: 3 },
      },
    ],
    weight: 2,
  },

  // ─────────────────────────────────────────────────────────────────
  // PLAN COMPARISON
  // ─────────────────────────────────────────────────────────────────
  plan_comparison: {
    rules: [
      {
        // Comparar planos → Pesquisador
        condition: () => true,
        points: { researcher: 8 },
      },
      {
        // Comparar muitos planos (> 3) → Pesquisador intenso
        condition: (data) => {
          const planIds = data.planIds?.split(',') || []
          return planIds.length > 3
        },
        points: { researcher: 5 },
      },
      {
        // Usar calculadora → Tech savvy
        condition: (data) => data.comparisonType === 'calculator',
        points: { tech_savvy: 4 },
      },
    ],
    weight: 3,
  },

  // ─────────────────────────────────────────────────────────────────
  // CHECKOUT START
  // ─────────────────────────────────────────────────────────────────
  checkout_start: {
    rules: [
      {
        // Iniciar checkout → Urgente
        condition: () => true,
        points: { urgent_buyer: 10 },
      },
      {
        // Carrinho alto valor → Premium seeker
        condition: (data) => data.cartTotal && data.cartTotal > 500,
        points: { premium_seeker: 6 },
      },
      {
        // Carrinho baixo valor → Price sensitive
        condition: (data) => data.cartTotal && data.cartTotal < 200,
        points: { price_sensitive: 6 },
      },
      {
        // Assinatura → Convenience seeker
        condition: (data) => data.planId !== undefined,
        points: { convenience_seeker: 8 },
      },
    ],
    weight: 4,
  },

  // ─────────────────────────────────────────────────────────────────
  // PAYMENT METHOD SELECT
  // ─────────────────────────────────────────────────────────────────
  payment_method_select: {
    rules: [
      {
        // PIX → Urgente (pagamento instantâneo)
        condition: (data) => data.method === 'pix',
        points: { urgent_buyer: 5 },
      },
      {
        // Boleto → Price sensitive (evita juros)
        condition: (data) => data.method === 'boleto',
        points: { price_sensitive: 4 },
      },
      {
        // Cartão parcelado → Convenience seeker
        condition: (data) => data.method === 'credit_card' && data.installments && data.installments > 1,
        points: { convenience_seeker: 4 },
      },
    ],
    weight: 2,
  },

  // ─────────────────────────────────────────────────────────────────
  // PRESCRIPTION UPLOAD
  // ─────────────────────────────────────────────────────────────────
  prescription_upload: {
    rules: [
      {
        // Upload de prescrição → Health conscious
        condition: () => true,
        points: { health_conscious: 12 },
      },
    ],
    weight: 5, // Forte indicador de health conscious
  },

  // ─────────────────────────────────────────────────────────────────
  // WHATSAPP CLICK
  // ─────────────────────────────────────────────────────────────────
  whatsapp_click: {
    rules: [
      {
        // Click no WhatsApp → Urgente (quer contato rápido)
        condition: () => true,
        points: { urgent_buyer: 6 },
      },
    ],
    weight: 2,
  },

  // ─────────────────────────────────────────────────────────────────
  // CHAT OPEN
  // ─────────────────────────────────────────────────────────────────
  chat_open: {
    rules: [
      {
        // Abrir chat → Pesquisador (quer tirar dúvidas)
        condition: () => true,
        points: { researcher: 4, urgent_buyer: 3 },
      },
    ],
    weight: 2,
  },
}

/**
 * Configuração padrão de inferência
 */
export const DEFAULT_INFERENCE_CONFIG = {
  minEvents: 5,              // Mínimo 5 eventos para inferência
  scoreThreshold: 20,        // Mínimo 20 pontos para definir persona
  decayOlderEvents: true,    // Eventos mais recentes pesam mais
  recalculationInterval: 5000, // Recalcular a cada 5 segundos
  debug: process.env.NODE_ENV === 'development',
}
