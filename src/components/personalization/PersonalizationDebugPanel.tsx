/**
 * PersonalizationDebugPanel - Painel de debug para sistema de personalização
 *
 * Visualiza eventos rastreados, scores de persona e permite debug interativo.
 * APENAS PARA DESENVOLVIMENTO - não expor em produção.
 *
 * Features:
 * - Lista de eventos rastreados em tempo real
 * - Gráfico de scores por persona
 * - Botão "Force Persona" para testes
 * - Toggle de habilitação do tracking
 * - Limpeza de localStorage
 * - Visualização de headers do middleware
 *
 * @module PersonalizationDebugPanel
 */

'use client'

import React, { useState, useEffect } from 'react'
import { EventTracker } from '@/lib/tracking/eventTracker'
import { usePersona } from '@/lib/persona/usePersona'
import { calculatePersona } from '@/lib/persona/calculatePersona'
import type { TrackingEvent, TrackingEventName } from '@/lib/tracking/types'
import type { Persona, PersonaScores } from '@/lib/persona/types'

/**
 * Configuração do Debug Panel
 */
interface DebugPanelConfig {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  defaultExpanded: boolean
  showEventDetails: boolean
}

const DEFAULT_CONFIG: DebugPanelConfig = {
  position: 'bottom-right',
  defaultExpanded: false,
  showEventDetails: true,
}

/**
 * Componente principal do Debug Panel
 */
export function PersonalizationDebugPanel({ config = DEFAULT_CONFIG }: { config?: Partial<DebugPanelConfig> }) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  // Estado do painel
  const [isExpanded, setIsExpanded] = useState(finalConfig.defaultExpanded)
  const [activeTab, setActiveTab] = useState<'events' | 'persona' | 'headers' | 'settings'>('persona')

  // Dados do tracking
  const [events, setEvents] = useState<TrackingEvent[]>([])
  const [eventCount, setEventCount] = useState(0)
  const { persona, confidence, recalculate, reset } = usePersona()

  // Dados de inferência
  const [personaScores, setPersonaScores] = useState<PersonaScores | null>(null)
  const [eventsAnalyzed, setEventsAnalyzed] = useState(0)

  // Configurações
  const [trackingEnabled, setTrackingEnabled] = useState(EventTracker.isEnabled())

  // Headers do middleware (simulado - em produção viria de fetch)
  const [middlewareHeaders, setMiddlewareHeaders] = useState<Record<string, string>>({})

  /**
   * Atualizar dados do painel
   */
  useEffect(() => {
    const updateData = () => {
      try {
        const currentEvents = EventTracker.getEvents()
        setEvents(currentEvents)
        setEventCount(currentEvents.length)

        // Recalcular persona e obter scores
        const inference = calculatePersona()
        setPersonaScores(inference.scores)
        setEventsAnalyzed(inference.eventsAnalyzed)
      } catch (error) {
        console.error('[DebugPanel] Error updating data:', error)
      }
    }

    // Atualizar imediatamente
    updateData()

    // Polling a cada 2 segundos
    const interval = setInterval(updateData, 2000)

    return () => clearInterval(interval)
  }, [])

  /**
   * Buscar headers do middleware
   */
  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const response = await fetch('/api/personalization/sync')
        const headers: Record<string, string> = {}

        // Capturar headers personalizados
        response.headers.forEach((value, key) => {
          if (key.startsWith('x-')) {
            headers[key] = value
          }
        })

        setMiddlewareHeaders(headers)
      } catch (error) {
        console.error('[DebugPanel] Error fetching headers:', error)
      }
    }

    if (isExpanded && activeTab === 'headers') {
      fetchHeaders()
    }
  }, [isExpanded, activeTab])

  /**
   * Toggle tracking on/off
   */
  const handleToggleTracking = () => {
    const newState = !trackingEnabled
    EventTracker.configure({ enabled: newState })
    setTrackingEnabled(newState)
  }

  /**
   * Limpar todos os eventos
   */
  const handleClearEvents = () => {
    if (confirm('Limpar todos os eventos rastreados?')) {
      EventTracker.clearEvents()
      setEvents([])
      setEventCount(0)
    }
  }

  /**
   * Forçar persona específica (para testes)
   */
  const handleForcePersona = (forcedPersona: Persona) => {
    if (confirm(`Forçar persona para "${forcedPersona}"?`)) {
      document.cookie = `user_persona=${forcedPersona}; path=/; max-age=604800`
      window.location.reload()
    }
  }

  /**
   * Adicionar evento de teste
   */
  const handleAddTestEvent = (eventName: TrackingEventName) => {
    EventTracker.track(eventName, { source: 'debug-panel', timestamp: Date.now() })
    recalculate()
  }

  /**
   * Posicionamento CSS
   */
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  }

  if (process.env.NODE_ENV === 'production') {
    return null // Não renderizar em produção
  }

  return (
    <div className={`fixed ${positionClasses[finalConfig.position]} z-50`}>
      {/* Toggle Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-purple-700 transition-colors"
          title="Abrir Debug Panel"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Debug
          {eventCount > 0 && (
            <span className="rounded-full bg-purple-400 px-2 py-0.5 text-xs font-bold">
              {eventCount}
            </span>
          )}
        </button>
      )}

      {/* Painel Expandido */}
      {isExpanded && (
        <div className="w-[600px] max-h-[80vh] rounded-lg bg-white shadow-2xl border-2 border-purple-600 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between bg-purple-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="font-semibold">Personalization Debug Panel</h3>
              <span className="text-xs bg-purple-500 px-2 py-0.5 rounded-full">DEV</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="rounded hover:bg-purple-700 p-1 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {(['persona', 'events', 'headers', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-purple-600 text-purple-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab === 'persona' && '🎯 Persona'}
                {tab === 'events' && `📊 Eventos (${eventCount})`}
                {tab === 'headers' && '🔧 Headers'}
                {tab === 'settings' && '⚙️ Config'}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Tab: Persona */}
            {activeTab === 'persona' && (
              <PersonaTab
                persona={persona}
                confidence={confidence}
                scores={personaScores}
                eventsAnalyzed={eventsAnalyzed}
                onForcePersona={handleForcePersona}
                onRecalculate={recalculate}
                onReset={reset}
              />
            )}

            {/* Tab: Events */}
            {activeTab === 'events' && (
              <EventsTab
                events={events}
                showDetails={finalConfig.showEventDetails}
                onAddTestEvent={handleAddTestEvent}
                onClearEvents={handleClearEvents}
              />
            )}

            {/* Tab: Headers */}
            {activeTab === 'headers' && (
              <HeadersTab headers={middlewareHeaders} />
            )}

            {/* Tab: Settings */}
            {activeTab === 'settings' && (
              <SettingsTab
                trackingEnabled={trackingEnabled}
                onToggleTracking={handleToggleTracking}
                eventCount={eventCount}
                onClearEvents={handleClearEvents}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Tab: Persona - Visualização de scores e persona atual
 */
function PersonaTab({
  persona,
  confidence,
  scores,
  eventsAnalyzed,
  onForcePersona,
  onRecalculate,
  onReset,
}: {
  persona: Persona
  confidence: number
  scores: PersonaScores | null
  eventsAnalyzed: number
  onForcePersona: (persona: Persona) => void
  onRecalculate: () => void
  onReset: () => void
}) {
  const allPersonas: Persona[] = [
    'health_conscious',
    'price_sensitive',
    'premium_seeker',
    'convenience_seeker',
    'tech_savvy',
    'researcher',
    'urgent_buyer',
    'new_visitor',
  ]

  const personaLabels: Record<Persona, string> = {
    health_conscious: '🏥 Health Conscious',
    price_sensitive: '💰 Price Sensitive',
    premium_seeker: '⭐ Premium Seeker',
    convenience_seeker: '⚡ Convenience Seeker',
    tech_savvy: '🤖 Tech Savvy',
    researcher: '🔍 Researcher',
    urgent_buyer: '🚨 Urgent Buyer',
    new_visitor: '👤 New Visitor',
  }

  // Normalizar scores para 0-100
  const maxScore = scores ? Math.max(...Object.values(scores)) : 1
  const normalizedScores = scores
    ? Object.fromEntries(
        Object.entries(scores).map(([key, value]) => [key, (value / maxScore) * 100])
      )
    : {}

  return (
    <div className="space-y-4">
      {/* Persona Atual */}
      <div className="rounded-lg bg-purple-50 border-2 border-purple-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-purple-900">Persona Atual</h4>
          <span className="text-xs text-purple-600">{eventsAnalyzed} eventos analisados</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-3xl">{personaLabels[persona].split(' ')[0]}</div>
          <div>
            <div className="text-xl font-bold text-purple-900">
              {personaLabels[persona].substring(2)}
            </div>
            <div className="text-sm text-purple-600">
              Confiança: {(confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Scores Visuais */}
      {scores && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Scores por Persona</h4>
          {allPersonas.map((p) => {
            const score = scores[p === 'new_visitor' ? 'health_conscious' : (p as keyof PersonaScores)] || 0
            const normalizedScore = normalizedScores[p === 'new_visitor' ? 'health_conscious' : p] || 0
            const isActive = p === persona

            return (
              <div key={p} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className={isActive ? 'font-semibold text-purple-900' : 'text-gray-600'}>
                    {personaLabels[p]}
                  </span>
                  <span className="text-xs text-gray-500">{score.toFixed(1)} pts</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      isActive ? 'bg-purple-600' : 'bg-gray-400'
                    }`}
                    style={{ width: `${Math.min(normalizedScore, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-2">
        <button
          onClick={onRecalculate}
          className="flex-1 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
        >
          🔄 Recalcular
        </button>
        <button
          onClick={onReset}
          className="flex-1 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
        >
          ♻️ Reset
        </button>
      </div>

      {/* Force Persona */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 text-sm">Forçar Persona (teste)</h4>
        <div className="grid grid-cols-2 gap-2">
          {allPersonas.map((p) => (
            <button
              key={p}
              onClick={() => onForcePersona(p)}
              className="rounded-md border-2 border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:border-purple-600 hover:text-purple-600 transition-colors"
            >
              {personaLabels[p]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Tab: Events - Lista de eventos rastreados
 */
function EventsTab({
  events,
  showDetails,
  onAddTestEvent,
  onClearEvents,
}: {
  events: TrackingEvent[]
  showDetails: boolean
  onAddTestEvent: (eventName: TrackingEventName) => void
  onClearEvents: () => void
}) {
  const testEvents: TrackingEventName[] = [
    'page_view',
    'search_query',
    'add_to_cart',
    'consultation_interest',
  ]

  return (
    <div className="space-y-4">
      {/* Ações */}
      <div className="flex gap-2">
        <button
          onClick={onClearEvents}
          className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
        >
          🗑️ Limpar Todos
        </button>
      </div>

      {/* Adicionar Evento de Teste */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 text-sm">Adicionar Evento de Teste</h4>
        <div className="grid grid-cols-2 gap-2">
          {testEvents.map((eventName) => (
            <button
              key={eventName}
              onClick={() => onAddTestEvent(eventName)}
              className="rounded-md border-2 border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:border-purple-600 hover:text-purple-600 transition-colors"
            >
              {eventName.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 text-sm">
          Eventos Rastreados ({events.length}/100)
        </h4>
        {events.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-8">
            Nenhum evento rastreado ainda
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {events.slice().reverse().map((event, index) => (
              <div
                key={`${event.timestamp}-${index}`}
                className="rounded-md border border-gray-200 bg-white p-3 text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-purple-900">
                    {event.eventName.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {showDetails && Object.keys(event.eventData).length > 0 && (
                  <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
                    {JSON.stringify(event.eventData, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Tab: Headers - Visualização de headers do middleware
 */
function HeadersTab({ headers }: { headers: Record<string, string> }) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Middleware Headers</h4>
      {Object.keys(headers).length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-8">
          Nenhum header personalizado detectado
        </div>
      ) : (
        <div className="space-y-2">
          {Object.entries(headers).map(([key, value]) => (
            <div key={key} className="rounded-md border border-gray-200 bg-gray-50 p-3">
              <div className="text-xs font-mono text-purple-600 mb-1">{key}</div>
              <div className="text-sm font-semibold text-gray-900">{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Tab: Settings - Configurações do tracking
 */
function SettingsTab({
  trackingEnabled,
  onToggleTracking,
  eventCount,
  onClearEvents,
}: {
  trackingEnabled: boolean
  onToggleTracking: () => void
  eventCount: number
  onClearEvents: () => void
}) {
  return (
    <div className="space-y-4">
      {/* Toggle Tracking */}
      <div className="rounded-lg border-2 border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Tracking Habilitado</h4>
            <p className="text-sm text-gray-600">
              {trackingEnabled ? 'Eventos sendo rastreados' : 'Tracking desabilitado'}
            </p>
          </div>
          <button
            onClick={onToggleTracking}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              trackingEnabled ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                trackingEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Storage Info */}
      <div className="rounded-lg border-2 border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-2">localStorage</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Eventos armazenados:</span>
            <span className="font-semibold">{eventCount}/100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Uso de espaço:</span>
            <span className="font-semibold">{((eventCount / 100) * 100).toFixed(0)}%</span>
          </div>
        </div>
        <button
          onClick={onClearEvents}
          className="mt-3 w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
        >
          Limpar localStorage
        </button>
      </div>

      {/* Debug Info */}
      <div className="rounded-lg border-2 border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Informações do Sistema</h4>
        <div className="space-y-1 text-xs font-mono text-gray-600">
          <div>Environment: {process.env.NODE_ENV}</div>
          <div>Next.js: {process.env.NEXT_PUBLIC_VERCEL ? 'Vercel' : 'Local'}</div>
          <div>Timestamp: {new Date().toISOString()}</div>
        </div>
      </div>
    </div>
  )
}
