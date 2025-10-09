/**
 * usePersona - Hook React para inferência automática de persona
 *
 * Calcula persona baseada em eventos rastreados, sincroniza com cookie,
 * e atualiza automaticamente quando novos eventos são registrados.
 *
 * FALLBACK GRACIOSO: Se cookies bloqueados ou cálculo falhar,
 * retorna 'new_visitor' sem quebrar a aplicação.
 *
 * @module usePersona
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Cookies from 'js-cookie'
import { EventTracker } from '../tracking/eventTracker'
import { calculatePersona, isValidPersona } from './calculatePersona'
import type { Persona, PersonaInference } from './types'

/**
 * Nome do cookie de persona
 */
const PERSONA_COOKIE = 'user_persona'

/**
 * Intervalo de recalculo (5 eventos novos)
 */
const RECALC_EVENT_THRESHOLD = 5

/**
 * Hook principal para gerenciamento de persona
 *
 * @example
 * ```tsx
 * function App() {
 *   const { persona, confidence, isCalculating } = usePersona()
 *
 *   return (
 *     <div>
 *       <p>Persona: {persona}</p>
 *       <p>Confidence: {(confidence * 100).toFixed(0)}%</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePersona() {
  const [persona, setPersona] = useState<Persona>('new_visitor')
  const [confidence, setConfidence] = useState<number>(0)
  const [isCalculating, setIsCalculating] = useState<boolean>(false)
  const lastEventCountRef = useRef<number>(0)
  const isMountedRef = useRef<boolean>(true)

  /**
   * Inicialização: Ler persona do cookie
   */
  useEffect(() => {
    isMountedRef.current = true

    try {
      // Tentar ler cookie existente
      const cookiePersona = Cookies.get(PERSONA_COOKIE)

      if (cookiePersona && isValidPersona(cookiePersona)) {
        setPersona(cookiePersona as Persona)
        setConfidence(0.8) // Assumir alta confidence se cookie existe

        if (process.env.NODE_ENV === 'development') {
          console.log('[usePersona] Initialized from cookie:', cookiePersona)
        }
      } else {
        // Sem cookie ou inválido → Calcular imediatamente
        updatePersona()
      }
    } catch (error) {
      // FALLBACK: Erro ao ler cookie → usar new_visitor
      console.error('[usePersona] Error reading cookie:', error)
      setPersona('new_visitor')
    }

    return () => {
      isMountedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Função para atualizar persona baseada em eventos
   */
  const updatePersona = useCallback(() => {
    if (!isMountedRef.current) return

    try {
      setIsCalculating(true)

      const events = EventTracker.getEvents()
      const eventCount = events.length

      // Só recalcular se houver eventos novos suficientes
      if (
        eventCount >= lastEventCountRef.current + RECALC_EVENT_THRESHOLD ||
        eventCount >= 5 // Ou se chegou ao mínimo para primeira inferência
      ) {
        const inference: PersonaInference = calculatePersona()

        if (isMountedRef.current) {
          // Só atualizar se persona mudou
          if (inference.primary !== persona) {
            setPersona(inference.primary)
            setConfidence(inference.confidence)

            // Salvar no cookie (FALLBACK: Se falhar, apenas loga)
            saveCookie(inference.primary)

            // Sincronizar com servidor (opcional)
            syncWithServer(inference.primary)

            if (process.env.NODE_ENV === 'development') {
              console.log('[usePersona] Updated:', {
                persona: inference.primary,
                confidence: inference.confidence.toFixed(2),
                scores: inference.scores,
              })
            }
          }

          lastEventCountRef.current = eventCount
        }
      }
    } catch (error) {
      // FALLBACK: Erro ao calcular → manter persona atual
      console.error('[usePersona] Error updating persona:', error)
    } finally {
      if (isMountedRef.current) {
        setIsCalculating(false)
      }
    }
  }, [persona])

  /**
   * Monitoramento contínuo: Recalcular periodicamente
   */
  useEffect(() => {
    // Verificar a cada 5 segundos se há eventos novos
    const interval = setInterval(() => {
      updatePersona()
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [updatePersona])

  /**
   * Função manual para forçar recalculo
   */
  const recalculate = useCallback(() => {
    lastEventCountRef.current = 0 // Reset threshold
    updatePersona()
  }, [updatePersona])

  /**
   * Função para resetar persona
   */
  const reset = useCallback(() => {
    try {
      Cookies.remove(PERSONA_COOKIE)
      EventTracker.clearEvents()
      setPersona('new_visitor')
      setConfidence(0)
      lastEventCountRef.current = 0

      if (process.env.NODE_ENV === 'development') {
        console.log('[usePersona] Reset to new_visitor')
      }
    } catch (error) {
      console.error('[usePersona] Error resetting:', error)
    }
  }, [])

  return {
    /** Persona principal */
    persona,

    /** Confidence score (0-1) */
    confidence,

    /** Se está recalculando */
    isCalculating,

    /** Forçar recalculo imediato */
    recalculate,

    /** Resetar persona e eventos */
    reset,
  }
}

/**
 * Salva persona no cookie
 *
 * FALLBACK GRACIOSO: Se falhar (cookies bloqueados), apenas loga erro.
 */
function saveCookie(persona: Persona): void {
  try {
    Cookies.set(PERSONA_COOKIE, persona, {
      expires: 365, // 1 ano
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
    })
  } catch (error) {
    // FALLBACK: Cookies bloqueados → sistema continua funcionando
    console.warn('[usePersona] Failed to save cookie (may be blocked):', error)
  }
}

/**
 * Sincroniza persona com servidor via API
 *
 * FALLBACK GRACIOSO: Falha na sincronização não afeta funcionamento local.
 */
async function syncWithServer(persona: Persona): Promise<void> {
  try {
    const response = await fetch('/api/personalization/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ persona }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    if (process.env.NODE_ENV === 'development') {
      const data = await response.json()
      console.log('[usePersona] Synced with server:', data)
    }
  } catch (error) {
    // FALLBACK: Falha na sincronização → apenas loga
    // Sistema continua funcionando apenas com cookie local
    console.warn('[usePersona] Failed to sync with server:', error)
  }
}

/**
 * Hook para ler persona do cookie (SSR-safe)
 *
 * Útil para componentes que só precisam ler, sem recalcular.
 *
 * @example
 * ```tsx
 * function Banner() {
 *   const persona = usePersonaFromCookie()
 *
 *   if (persona === 'health_conscious') {
 *     return <HealthBanner />
 *   }
 *
 *   return <DefaultBanner />
 * }
 * ```
 */
export function usePersonaFromCookie(): Persona {
  const [persona, setPersona] = useState<Persona>('new_visitor')

  useEffect(() => {
    try {
      const cookiePersona = Cookies.get(PERSONA_COOKIE)

      if (cookiePersona && isValidPersona(cookiePersona)) {
        setPersona(cookiePersona as Persona)
      }
    } catch (error) {
      // FALLBACK: Erro ao ler cookie → new_visitor
      console.error('[usePersonaFromCookie] Error:', error)
    }
  }, [])

  return persona
}

/**
 * Hook para forçar uma persona específica (útil para testes)
 *
 * DEVELOPMENT ONLY - Não usar em produção
 *
 * @example
 * ```tsx
 * function DevTools() {
 *   const setPersona = useForcePersona()
 *
 *   return (
 *     <button onClick={() => setPersona('health_conscious')}>
 *       Force Health Conscious
 *     </button>
 *   )
 * }
 * ```
 */
export function useForcePersona() {
  const setPersona = useCallback((persona: Persona) => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('[useForcePersona] Only available in development')
      return
    }

    try {
      Cookies.set(PERSONA_COOKIE, persona, {
        expires: 1, // 1 dia apenas (forçar é temporário)
        path: '/',
        sameSite: 'lax',
      })

      // Recarregar página para aplicar mudança
      window.location.reload()
    } catch (error) {
      console.error('[useForcePersona] Error:', error)
    }
  }, [])

  return setPersona
}
