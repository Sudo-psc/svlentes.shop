/**
 * Types for Client-Side Event Tracking System
 *
 * Sistema de tipos para rastreamento de eventos do usuário
 * para inferência de persona no navegador.
 */

/**
 * Eventos rastreados no sistema de personalização
 */
export type TrackingEventName =
  | 'page_view'              // Visualização de página
  | 'category_visit'         // Visita a categoria de produto
  | 'product_view'           // Visualização de produto específico
  | 'search_query'           // Busca realizada
  | 'add_to_cart'            // Adicionar ao carrinho
  | 'remove_from_cart'       // Remover do carrinho
  | 'form_interaction'       // Interação com formulário
  | 'consultation_interest'  // Interesse em consulta
  | 'scroll_depth'           // Profundidade de scroll
  | 'video_play'             // Play em vídeo
  | 'link_click'             // Click em link externo
  | 'chat_open'              // Abertura do chat
  | 'whatsapp_click'         // Click no WhatsApp
  | 'prescription_upload'    // Upload de prescrição
  | 'plan_comparison'        // Comparação de planos
  | 'checkout_start'         // Início do checkout
  | 'payment_method_select'  // Seleção de método de pagamento

/**
 * Dados do evento genérico
 */
export interface TrackingEventData {
  [key: string]: string | number | boolean | string[] | undefined
}

/**
 * Estrutura de um evento rastreado
 */
export interface TrackingEvent {
  /** Timestamp do evento (Unix timestamp em ms) */
  timestamp: number

  /** Nome do evento */
  eventName: TrackingEventName

  /** Dados específicos do evento */
  eventData: TrackingEventData

  /** URL onde o evento ocorreu */
  url?: string

  /** Referrer da página */
  referrer?: string

  /** Session ID (opcional, gerado pelo fingerprint) */
  sessionId?: string
}

/**
 * Dados específicos para cada tipo de evento
 */
export interface PageViewEvent extends TrackingEventData {
  path: string
  title: string
  duration?: number // Tempo na página em segundos
}

export interface CategoryVisitEvent extends TrackingEventData {
  categoryId: string
  categoryName: string
  position?: number // Posição na navegação
}

export interface ProductViewEvent extends TrackingEventData {
  productId: string
  productName: string
  categoryId?: string
  price?: number
  duration?: number // Tempo visualizando produto
}

export interface SearchQueryEvent extends TrackingEventData {
  query: string
  resultsCount?: number
  selectedResultIndex?: number
}

export interface AddToCartEvent extends TrackingEventData {
  productId: string
  productName: string
  price: number
  quantity: number
  categoryId?: string
}

export interface FormInteractionEvent extends TrackingEventData {
  formId: string
  formType: 'prescription' | 'consultation' | 'contact' | 'subscription'
  fieldName?: string
  completed?: boolean
}

export interface ConsultationInterestEvent extends TrackingEventData {
  source: 'banner' | 'button' | 'chat' | 'whatsapp'
  consultationType?: 'ophthalmologic' | 'lens_fitting' | 'followup'
}

export interface ScrollDepthEvent extends TrackingEventData {
  depth: 25 | 50 | 75 | 100 // Percentual de scroll
  pageHeight: number
}

export interface VideoPlayEvent extends TrackingEventData {
  videoId: string
  videoTitle?: string
  duration?: number // Tempo assistido em segundos
  completed?: boolean
}

export interface PlanComparisonEvent extends TrackingEventData {
  planIds: string[] // IDs dos planos comparados
  comparisonType: 'side-by-side' | 'table' | 'calculator'
}

export interface CheckoutStartEvent extends TrackingEventData {
  cartTotal: number
  itemCount: number
  planId?: string
}

export interface PaymentMethodSelectEvent extends TrackingEventData {
  method: 'pix' | 'credit_card' | 'boleto'
  installments?: number
}

/**
 * Configuração do sistema de tracking
 */
export interface TrackingConfig {
  /** Habilitar tracking */
  enabled: boolean

  /** Máximo de eventos armazenados no localStorage */
  maxEvents: number

  /** Intervalo de sincronização com servidor (ms) */
  syncInterval: number

  /** Habilitar debug logs */
  debug: boolean

  /** Chave do localStorage */
  storageKey: string

  /** Enviar eventos para analytics (Google Analytics, etc) */
  sendToAnalytics: boolean
}

/**
 * Estatísticas do tracking
 */
export interface TrackingStats {
  /** Total de eventos rastreados */
  totalEvents: number

  /** Eventos por tipo */
  eventsByType: Record<TrackingEventName, number>

  /** Timestamp do primeiro evento */
  firstEventTimestamp: number

  /** Timestamp do último evento */
  lastEventTimestamp: number

  /** Duração da sessão em minutos */
  sessionDuration: number
}

/**
 * Resultado da sincronização com servidor
 */
export interface SyncResult {
  success: boolean
  syncedEvents: number
  error?: string
}
