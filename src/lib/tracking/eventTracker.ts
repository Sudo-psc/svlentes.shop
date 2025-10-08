/**
 * EventTracker - Sistema de rastreamento de eventos client-side
 *
 * Rastreia comportamento do usuário no navegador para inferência
 * de persona sem envio imediato ao servidor (LGPD compliant).
 *
 * @module EventTracker
 */

'use client'

import type {
  TrackingEvent,
  TrackingEventName,
  TrackingEventData,
  TrackingConfig,
  TrackingStats,
  SyncResult,
} from './types'

/**
 * Configuração padrão do sistema de tracking
 */
const DEFAULT_CONFIG: TrackingConfig = {
  enabled: true,
  maxEvents: 100, // Limitar para não sobrecarregar localStorage
  syncInterval: 60000, // 1 minuto
  debug: process.env.NODE_ENV === 'development',
  storageKey: 'svlentes_user_behavior',
  sendToAnalytics: false,
}

/**
 * Classe principal para rastreamento de eventos
 */
export class EventTracker {
  private static config: TrackingConfig = DEFAULT_CONFIG
  private static isBrowser = typeof window !== 'undefined'

  /**
   * Configura o sistema de tracking
   */
  static configure(config: Partial<TrackingConfig>): void {
    this.config = { ...this.config, ...config }
    if (this.config.debug) {
      console.log('[EventTracker] Configured:', this.config)
    }
  }

  /**
   * Rastreia um evento
   *
   * @param eventName - Nome do evento
   * @param eventData - Dados do evento
   */
  static track(eventName: TrackingEventName, eventData: TrackingEventData = {}): void {
    if (!this.isBrowser || !this.config.enabled) {
      return
    }

    try {
      const event: TrackingEvent = {
        timestamp: Date.now(),
        eventName,
        eventData,
        url: window.location.href,
        referrer: document.referrer || undefined,
        sessionId: this.getSessionId(),
      }

      // Adicionar evento ao log
      const events = this.getEvents()
      events.push(event)

      // Limitar tamanho do log (FIFO - First In First Out)
      if (events.length > this.config.maxEvents) {
        events.shift() // Remove o evento mais antigo
      }

      // Salvar no localStorage
      this.saveEvents(events)

      // Debug log
      if (this.config.debug) {
        console.log('[EventTracker] Event tracked:', eventName, eventData)
      }

      // Enviar para analytics (Google Analytics, etc)
      if (this.config.sendToAnalytics && typeof window.gtag !== 'undefined') {
        window.gtag('event', eventName, eventData)
      }
    } catch (error) {
      console.error('[EventTracker] Error tracking event:', error)
    }
  }

  /**
   * Obtém todos os eventos armazenados
   */
  static getEvents(): TrackingEvent[] {
    if (!this.isBrowser) {
      return []
    }

    try {
      const data = localStorage.getItem(this.config.storageKey)
      if (!data) {
        return []
      }

      const parsed = JSON.parse(data)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error('[EventTracker] Error reading events:', error)
      return []
    }
  }

  /**
   * Salva eventos no localStorage
   */
  private static saveEvents(events: TrackingEvent[]): void {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(events))
    } catch (error) {
      // Quota exceeded - limpar eventos antigos
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('[EventTracker] localStorage quota exceeded, clearing old events')
        const recentEvents = events.slice(-50) // Manter apenas últimos 50
        localStorage.setItem(this.config.storageKey, JSON.stringify(recentEvents))
      } else {
        console.error('[EventTracker] Error saving events:', error)
      }
    }
  }

  /**
   * Limpa todos os eventos armazenados
   */
  static clearEvents(): void {
    if (!this.isBrowser) {
      return
    }

    try {
      localStorage.removeItem(this.config.storageKey)
      if (this.config.debug) {
        console.log('[EventTracker] Events cleared')
      }
    } catch (error) {
      console.error('[EventTracker] Error clearing events:', error)
    }
  }

  /**
   * Obtém estatísticas de tracking
   */
  static getStats(): TrackingStats {
    const events = this.getEvents()

    if (events.length === 0) {
      return {
        totalEvents: 0,
        eventsByType: {} as Record<TrackingEventName, number>,
        firstEventTimestamp: 0,
        lastEventTimestamp: 0,
        sessionDuration: 0,
      }
    }

    // Contar eventos por tipo
    const eventsByType = events.reduce((acc, event) => {
      acc[event.eventName] = (acc[event.eventName] || 0) + 1
      return acc
    }, {} as Record<TrackingEventName, number>)

    const firstEventTimestamp = events[0].timestamp
    const lastEventTimestamp = events[events.length - 1].timestamp
    const sessionDuration = Math.round((lastEventTimestamp - firstEventTimestamp) / 1000 / 60) // em minutos

    return {
      totalEvents: events.length,
      eventsByType,
      firstEventTimestamp,
      lastEventTimestamp,
      sessionDuration,
    }
  }

  /**
   * Filtra eventos por tipo
   */
  static getEventsByType(eventName: TrackingEventName): TrackingEvent[] {
    return this.getEvents().filter(event => event.eventName === eventName)
  }

  /**
   * Filtra eventos por intervalo de tempo
   */
  static getEventsByTimeRange(startTime: number, endTime: number): TrackingEvent[] {
    return this.getEvents().filter(
      event => event.timestamp >= startTime && event.timestamp <= endTime
    )
  }

  /**
   * Obtém eventos recentes (últimos N minutos)
   */
  static getRecentEvents(minutes: number = 10): TrackingEvent[] {
    const cutoffTime = Date.now() - minutes * 60 * 1000
    return this.getEvents().filter(event => event.timestamp >= cutoffTime)
  }

  /**
   * Sincroniza eventos com o servidor
   *
   * Envia eventos para API de sincronização e limpa localStorage
   * após sucesso.
   */
  static async syncWithServer(): Promise<SyncResult> {
    if (!this.isBrowser) {
      return { success: false, syncedEvents: 0, error: 'Not in browser' }
    }

    const events = this.getEvents()

    if (events.length === 0) {
      return { success: true, syncedEvents: 0 }
    }

    try {
      const response = await fetch('/api/personalization/events/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Limpar eventos sincronizados
      this.clearEvents()

      if (this.config.debug) {
        console.log('[EventTracker] Synced events:', data)
      }

      return {
        success: true,
        syncedEvents: events.length,
      }
    } catch (error) {
      console.error('[EventTracker] Sync failed:', error)
      return {
        success: false,
        syncedEvents: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Obtém ou cria Session ID
   *
   * Session ID é gerado uma vez e persistido em sessionStorage
   * (expira quando o navegador fecha).
   */
  private static getSessionId(): string | undefined {
    if (!this.isBrowser) {
      return undefined
    }

    try {
      const SESSION_KEY = 'svlentes_session_id'
      let sessionId = sessionStorage.getItem(SESSION_KEY)

      if (!sessionId) {
        // Gerar novo session ID
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
        sessionStorage.setItem(SESSION_KEY, sessionId)
      }

      return sessionId
    } catch (error) {
      console.error('[EventTracker] Error managing session ID:', error)
      return undefined
    }
  }

  /**
   * Exporta eventos para JSON (útil para debug)
   */
  static exportToJSON(): string {
    const stats = this.getStats()
    const events = this.getEvents()

    return JSON.stringify(
      {
        stats,
        events,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    )
  }

  /**
   * Verifica se tracking está habilitado
   */
  static isEnabled(): boolean {
    return this.config.enabled && this.isBrowser
  }

  /**
   * Desabilita tracking (útil para respeitar opt-out do usuário)
   */
  static disable(): void {
    this.config.enabled = false
    if (this.config.debug) {
      console.log('[EventTracker] Tracking disabled')
    }
  }

  /**
   * Habilita tracking
   */
  static enable(): void {
    this.config.enabled = true
    if (this.config.debug) {
      console.log('[EventTracker] Tracking enabled')
    }
  }
}

/**
 * Helper functions para tracking de eventos comuns
 */
export const trackPageView = (path: string, title: string, duration?: number) => {
  EventTracker.track('page_view', { path, title, duration })
}

export const trackCategoryVisit = (categoryId: string, categoryName: string, position?: number) => {
  EventTracker.track('category_visit', { categoryId, categoryName, position })
}

export const trackProductView = (
  productId: string,
  productName: string,
  categoryId?: string,
  price?: number,
  duration?: number
) => {
  EventTracker.track('product_view', { productId, productName, categoryId, price, duration })
}

export const trackSearchQuery = (query: string, resultsCount?: number) => {
  EventTracker.track('search_query', { query, resultsCount })
}

export const trackAddToCart = (
  productId: string,
  productName: string,
  price: number,
  quantity: number = 1,
  categoryId?: string
) => {
  EventTracker.track('add_to_cart', { productId, productName, price, quantity, categoryId })
}

export const trackFormInteraction = (
  formId: string,
  formType: 'prescription' | 'consultation' | 'contact' | 'subscription',
  fieldName?: string,
  completed?: boolean
) => {
  EventTracker.track('form_interaction', { formId, formType, fieldName, completed })
}

export const trackConsultationInterest = (
  source: 'banner' | 'button' | 'chat' | 'whatsapp',
  consultationType?: 'ophthalmologic' | 'lens_fitting' | 'followup'
) => {
  EventTracker.track('consultation_interest', { source, consultationType })
}

export const trackScrollDepth = (depth: 25 | 50 | 75 | 100, pageHeight: number) => {
  EventTracker.track('scroll_depth', { depth, pageHeight })
}

export const trackVideoPlay = (videoId: string, videoTitle?: string, duration?: number, completed?: boolean) => {
  EventTracker.track('video_play', { videoId, videoTitle, duration, completed })
}

export const trackPlanComparison = (
  planIds: string[],
  comparisonType: 'side-by-side' | 'table' | 'calculator'
) => {
  EventTracker.track('plan_comparison', { planIds: planIds.join(','), comparisonType })
}

export const trackCheckoutStart = (cartTotal: number, itemCount: number, planId?: string) => {
  EventTracker.track('checkout_start', { cartTotal, itemCount, planId })
}

export const trackPaymentMethodSelect = (method: 'pix' | 'credit_card' | 'boleto', installments?: number) => {
  EventTracker.track('payment_method_select', { method, installments })
}

// Type augmentation for window.gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
