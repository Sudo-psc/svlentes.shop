/**
 * useTracking - Hook React para rastreamento de eventos
 *
 * Fornece interface React-friendly para o EventTracker com
 * fallback gracioso e tratamento de erros robusto.
 *
 * @module useTracking
 */

'use client'

import { useCallback, useEffect, useRef } from 'react'
import { EventTracker } from './eventTracker'
import type { TrackingEventName, TrackingEventData } from './types'

/**
 * Hook para rastreamento de eventos em componentes React
 *
 * @example
 * ```tsx
 * function ProductPage({ product }) {
 *   const { track, isEnabled } = useTracking()
 *
 *   useEffect(() => {
 *     track('product_view', {
 *       productId: product.id,
 *       price: product.price
 *     })
 *   }, [product.id, track])
 *
 *   return <div>...</div>
 * }
 * ```
 */
export function useTracking() {
  /**
   * Rastreia um evento de forma segura
   *
   * FALLBACK GRACIOSO: Se o EventTracker falhar (localStorage indisponível,
   * quota excedida, etc), o erro é capturado e logado, mas não quebra a aplicação.
   */
  const track = useCallback((eventName: TrackingEventName, eventData: TrackingEventData = {}) => {
    try {
      // Verificação preventiva: não rastrear se desabilitado
      if (!EventTracker.isEnabled()) {
        return
      }

      EventTracker.track(eventName, eventData)
    } catch (error) {
      // FALLBACK: Erro é apenas logado, não propaga para o componente
      console.error('[useTracking] Failed to track event:', eventName, error)
    }
  }, [])

  /**
   * Verifica se o tracking está habilitado
   *
   * FALLBACK GRACIOSO: Se a verificação falhar, assume desabilitado
   */
  const isEnabled = useCallback(() => {
    try {
      return EventTracker.isEnabled()
    } catch (error) {
      console.error('[useTracking] Failed to check if enabled:', error)
      return false
    }
  }, [])

  /**
   * Limpa todos os eventos
   *
   * FALLBACK GRACIOSO: Se falhar, apenas loga erro
   */
  const clearEvents = useCallback(() => {
    try {
      EventTracker.clearEvents()
    } catch (error) {
      console.error('[useTracking] Failed to clear events:', error)
    }
  }, [])

  /**
   * Sincroniza eventos com o servidor
   *
   * FALLBACK GRACIOSO: Retorna resultado de erro em caso de falha
   */
  const syncEvents = useCallback(async () => {
    try {
      return await EventTracker.syncWithServer()
    } catch (error) {
      console.error('[useTracking] Failed to sync events:', error)
      return {
        success: false,
        syncedEvents: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }, [])

  return {
    track,
    isEnabled,
    clearEvents,
    syncEvents,
  }
}

/**
 * Hook para auto-tracking de page views
 *
 * Rastreia automaticamente visualizações de página e tempo de permanência.
 *
 * @example
 * ```tsx
 * function ProductPage() {
 *   usePageViewTracking('/produtos/lentes-diarias')
 *
 *   return <div>...</div>
 * }
 * ```
 */
export function usePageViewTracking(pagePath?: string, pageTitle?: string) {
  const { track } = useTracking()
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    // FALLBACK GRACIOSO: Se não houver window, não rastreia (SSR)
    if (typeof window === 'undefined') {
      return
    }

    const path = pagePath || window.location.pathname
    const title = pageTitle || document.title

    // Registrar timestamp de entrada
    startTimeRef.current = Date.now()

    // Rastrear page view
    track('page_view', { path, title })

    // Cleanup: rastrear tempo de permanência ao sair
    return () => {
      if (startTimeRef.current > 0) {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000) // em segundos
        track('page_view', { path, title, duration })
      }
    }
  }, [pagePath, pageTitle, track])
}

/**
 * Hook para auto-tracking de scroll depth
 *
 * Rastreia automaticamente quando usuário atinge 25%, 50%, 75% e 100% de scroll.
 *
 * @example
 * ```tsx
 * function ArticlePage() {
 *   useScrollTracking()
 *
 *   return <article>...</article>
 * }
 * ```
 */
export function useScrollTracking() {
  const { track } = useTracking()
  const depthsTrackedRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    // FALLBACK GRACIOSO: Se não houver window, não rastreia (SSR)
    if (typeof window === 'undefined') {
      return
    }

    const handleScroll = () => {
      try {
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const pageHeight = documentHeight - windowHeight

        if (pageHeight <= 0) {
          return // Página muito curta, não há scroll
        }

        const scrollPercent = Math.round((scrollTop / pageHeight) * 100)

        // Rastrear marcos de scroll (25%, 50%, 75%, 100%)
        const milestones = [25, 50, 75, 100]

        for (const milestone of milestones) {
          if (scrollPercent >= milestone && !depthsTrackedRef.current.has(milestone)) {
            depthsTrackedRef.current.add(milestone)
            track('scroll_depth', {
              depth: milestone as 25 | 50 | 75 | 100,
              pageHeight: documentHeight,
            })
          }
        }
      } catch (error) {
        console.error('[useScrollTracking] Failed to track scroll:', error)
      }
    }

    // Throttle scroll events (não mais que 1 por segundo)
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [track])
}

/**
 * Hook para auto-tracking de form interactions
 *
 * Rastreia interações com formulários (focus, blur, submit).
 *
 * @example
 * ```tsx
 * function ContactForm() {
 *   const formRef = useFormTracking('contact-form', 'contact')
 *
 *   return (
 *     <form ref={formRef}>
 *       <input name="email" />
 *       <button type="submit">Enviar</button>
 *     </form>
 *   )
 * }
 * ```
 */
export function useFormTracking(
  formId: string,
  formType: 'prescription' | 'consultation' | 'contact' | 'subscription'
) {
  const { track } = useTracking()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const form = formRef.current

    // FALLBACK GRACIOSO: Se não houver form, não rastreia
    if (!form) {
      return
    }

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement
      if (target.name) {
        track('form_interaction', {
          formId,
          formType,
          fieldName: target.name,
        })
      }
    }

    const handleSubmit = (e: SubmitEvent) => {
      track('form_interaction', {
        formId,
        formType,
        completed: true,
      })
    }

    // Listener com capture para pegar eventos de campos internos
    form.addEventListener('focus', handleFocus, true)
    form.addEventListener('submit', handleSubmit)

    return () => {
      form.removeEventListener('focus', handleFocus, true)
      form.removeEventListener('submit', handleSubmit)
    }
  }, [formId, formType, track])

  return formRef
}

/**
 * Hook para auto-tracking de video play
 *
 * Rastreia quando vídeos são reproduzidos e por quanto tempo.
 *
 * @example
 * ```tsx
 * function VideoPlayer({ videoId, videoTitle }) {
 *   const videoRef = useVideoTracking(videoId, videoTitle)
 *
 *   return <video ref={videoRef} src="..." />
 * }
 * ```
 */
export function useVideoTracking(videoId: string, videoTitle?: string) {
  const { track } = useTracking()
  const videoRef = useRef<HTMLVideoElement>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    const video = videoRef.current

    // FALLBACK GRACIOSO: Se não houver video, não rastreia
    if (!video) {
      return
    }

    const handlePlay = () => {
      startTimeRef.current = Date.now()
      track('video_play', { videoId, videoTitle })
    }

    const handlePause = () => {
      if (startTimeRef.current > 0) {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
        track('video_play', { videoId, videoTitle, duration })
        startTimeRef.current = 0
      }
    }

    const handleEnded = () => {
      if (startTimeRef.current > 0) {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
        track('video_play', { videoId, videoTitle, duration, completed: true })
        startTimeRef.current = 0
      }
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [videoId, videoTitle, track])

  return videoRef
}
