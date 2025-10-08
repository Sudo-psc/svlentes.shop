/**
 * TrackingProvider - Provedor global de configuração de tracking
 *
 * Configura o EventTracker globalmente e inicializa listeners.
 *
 * FALLBACK GRACIOSO: Se a inicialização falhar, componentes filhos
 * continuam funcionando normalmente sem tracking.
 */

'use client'

import React, { useEffect, type ReactNode } from 'react'
import { EventTracker } from '../../lib/tracking/eventTracker'

interface TrackingProviderProps {
  children: ReactNode

  /** Habilitar tracking (default: true) */
  enabled?: boolean

  /** Habilitar debug logs (default: false) */
  debug?: boolean

  /** Enviar eventos para Google Analytics (default: false) */
  sendToAnalytics?: boolean

  /** Intervalo de sincronização automática em ms (default: 60000 = 1min) */
  syncInterval?: number
}

export function TrackingProvider({
  children,
  enabled = true,
  debug = false,
  sendToAnalytics = false,
  syncInterval = 60000,
}: TrackingProviderProps) {
  useEffect(() => {
    try {
      // Configurar EventTracker
      EventTracker.configure({
        enabled,
        debug,
        sendToAnalytics,
        maxEvents: 100,
        storageKey: 'svlentes_user_behavior',
      })

      if (debug) {
        console.log('[TrackingProvider] Initialized with config:', {
          enabled,
          debug,
          sendToAnalytics,
          syncInterval,
        })
      }

      // Setup auto-sync se habilitado
      let syncIntervalId: NodeJS.Timeout | undefined

      if (enabled && syncInterval > 0) {
        syncIntervalId = setInterval(async () => {
          try {
            const result = await EventTracker.syncWithServer()
            if (debug) {
              console.log('[TrackingProvider] Auto-sync result:', result)
            }
          } catch (error) {
            // FALLBACK: Falha na sincronização não quebra a aplicação
            console.error('[TrackingProvider] Auto-sync failed:', error)
          }
        }, syncInterval)
      }

      // Cleanup
      return () => {
        if (syncIntervalId) {
          clearInterval(syncIntervalId)
        }
      }
    } catch (error) {
      // FALLBACK CRÍTICO: Falha na inicialização não quebra a aplicação
      console.error('[TrackingProvider] Initialization failed:', error)
      console.warn('[TrackingProvider] Tracking disabled due to initialization error')
    }
  }, [enabled, debug, sendToAnalytics, syncInterval])

  // FALLBACK: Sempre renderiza children mesmo se tracking falhar
  return <>{children}</>
}
