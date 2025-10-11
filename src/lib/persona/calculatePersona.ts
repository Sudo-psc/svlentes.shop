/**
 * Calculate Persona - Motor de inferência de persona
 *
 * Analisa eventos rastreados e aplica regras de pontuação
 * para determinar a persona principal do usuário.
 *
 * FALLBACK GRACIOSO: Retorna 'new_visitor' se houver qualquer erro.
 *
 * @module calculatePersona
 */

'use client'

import { EventTracker } from '../tracking/eventTracker'
import type { TrackingEvent } from '../tracking/types'
import { SCORING_RULES, DEFAULT_INFERENCE_CONFIG } from './scoringRules'
import type {
  Persona,
  PersonaScores,
  PersonaInference,
  PersonaInferenceConfig,
} from './types'

/**
 * Configuração global (pode ser sobrescrita)
 */
let config: PersonaInferenceConfig = DEFAULT_INFERENCE_CONFIG

/**
 * Configura o sistema de inferência
 */
export function configureInference(newConfig: Partial<PersonaInferenceConfig>): void {
  config = { ...config, ...newConfig }
}

/**
 * Calcula persona baseada nos eventos rastreados
 *
 * FALLBACK GRACIOSO: Qualquer erro retorna 'new_visitor'
 */
export function calculatePersona(): PersonaInference {
  try {
    // Obter eventos rastreados
    const events = EventTracker.getEvents()

    // FALLBACK: Sem eventos suficientes → new_visitor
    if (events.length < config.minEvents) {
      if (config.debug) {
        console.log(
          `[calculatePersona] Insufficient events (${events.length}/${config.minEvents}), returning new_visitor`
        )
      }

      return {
        primary: 'new_visitor',
        confidence: 0,
        scores: initializeScores(),
        eventsAnalyzed: events.length,
        timestamp: Date.now(),
      }
    }

    // Inicializar scores
    const scores = initializeScores()

    // Aplicar decay temporal se habilitado
    const now = Date.now()
    const weightedEvents = config.decayOlderEvents
      ? events.map((event) => ({
          ...event,
          temporalWeight: calculateTemporalWeight(event.timestamp, now),
        }))
      : events.map((event) => ({ ...event, temporalWeight: 1 }))

    // Processar cada evento
    for (const event of weightedEvents) {
      applyEventScoring(event, scores, event.temporalWeight)
    }

    // Determinar persona principal
    const { persona, confidence } = determinePrimaryPersona(scores)

    if (config.debug) {
      console.log('[calculatePersona] Inference result:', {
        persona,
        confidence,
        scores,
        eventsAnalyzed: events.length,
      })
    }

    return {
      primary: persona,
      confidence,
      scores,
      eventsAnalyzed: events.length,
      timestamp: Date.now(),
    }
  } catch (error) {
    // FALLBACK CRÍTICO: Qualquer erro → new_visitor
    console.error('[calculatePersona] Error during inference:', error)

    return {
      primary: 'new_visitor',
      confidence: 0,
      scores: initializeScores(),
      eventsAnalyzed: 0,
      timestamp: Date.now(),
    }
  }
}

/**
 * Inicializa scores zerados para todas as personas
 */
function initializeScores(): PersonaScores {
  return {
    health_conscious: 0,
    price_sensitive: 0,
    premium_seeker: 0,
    convenience_seeker: 0,
    tech_savvy: 0,
    researcher: 0,
    urgent_buyer: 0,
  }
}

/**
 * Calcula peso temporal do evento
 *
 * Eventos mais recentes têm peso maior (decay exponencial).
 *
 * @param eventTimestamp - Timestamp do evento
 * @param now - Timestamp atual
 * @returns Peso entre 0.5 e 1.0
 */
function calculateTemporalWeight(eventTimestamp: number, now: number): number {
  // Eventos das últimas 5 minutos: peso 1.0
  // Eventos de 5-30 minutos atrás: decay exponencial até 0.5
  const ageMinutes = (now - eventTimestamp) / (1000 * 60)

  if (ageMinutes <= 5) {
    return 1.0
  }

  if (ageMinutes >= 30) {
    return 0.5
  }

  // Decay exponencial entre 5 e 30 minutos
  const decayFactor = (ageMinutes - 5) / 25 // 0 a 1
  return 1.0 - decayFactor * 0.5 // 1.0 a 0.5
}

/**
 * Aplica scoring rules para um evento
 *
 * @param event - Evento rastreado (com temporalWeight)
 * @param scores - Scores acumulados (mutado in-place)
 * @param temporalWeight - Peso temporal do evento
 */
function applyEventScoring(
  event: TrackingEvent & { temporalWeight: number },
  scores: PersonaScores,
  temporalWeight: number
): void {
  const eventRules = SCORING_RULES[event.eventName]

  if (!eventRules) {
    // Evento sem regras definidas
    return
  }

  const { rules, weight = 1 } = eventRules

  // Aplicar cada regra
  for (const rule of rules) {
    try {
      // Verificar condição
      if (rule.condition(event.eventData)) {
        // Aplicar pontos com peso do evento e peso temporal
        for (const [persona, points] of Object.entries(rule.points)) {
          const finalPoints = points * weight * temporalWeight

          scores[persona as keyof PersonaScores] += finalPoints

          if (config.debug) {
            console.log(
              `[applyEventScoring] ${event.eventName} → ${persona}: +${finalPoints.toFixed(1)} (base: ${points}, weight: ${weight}, temporal: ${temporalWeight.toFixed(2)})`
            )
          }
        }
      }
    } catch (error) {
      // FALLBACK: Erro ao aplicar regra → skip silenciosamente
      console.error('[applyEventScoring] Error applying rule:', error)
    }
  }
}

/**
 * Determina persona principal baseado nos scores
 *
 * @param scores - Scores calculados
 * @returns Persona principal e confidence score
 */
function determinePrimaryPersona(scores: PersonaScores): {
  persona: Persona
  confidence: number
} {
  // Encontrar persona com maior score
  let maxScore = 0
  let maxPersona: Persona = 'new_visitor'

  for (const [persona, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      maxPersona = persona as Persona
    }
  }

  // FALLBACK: Score abaixo do threshold → new_visitor
  if (maxScore < config.scoreThreshold) {
    return {
      persona: 'new_visitor',
      confidence: 0,
    }
  }

  // Calcular confidence score (0-1)
  // Baseado na diferença entre top score e segundo lugar
  const sortedScores = Object.values(scores).sort((a, b) => b - a)
  const topScore = sortedScores[0]
  const secondScore = sortedScores[1] || 0

  // Quanto maior a diferença, maior a confidence
  const scoreDifference = topScore - secondScore
  const totalScore = topScore + secondScore

  let confidence = 0

  if (totalScore > 0) {
    // Confidence baseado na dominância do top score
    confidence = scoreDifference / totalScore

    // Normalizar para 0.5-1.0 range
    confidence = 0.5 + confidence * 0.5
  }

  // Cap confidence em 0.95 (nunca 100% certo)
  confidence = Math.min(confidence, 0.95)

  return {
    persona: maxPersona,
    confidence,
  }
}

/**
 * Obtém detalhamento dos scores para debugging
 */
export function getScoreBreakdown(): {
  scores: PersonaScores
  topPersonas: Array<{ persona: Persona; score: number }>
  eventsAnalyzed: number
} {
  try {
    const events = EventTracker.getEvents()
    const scores = initializeScores()

    const now = Date.now()
    const weightedEvents = events.map((event) => ({
      ...event,
      temporalWeight: config.decayOlderEvents
        ? calculateTemporalWeight(event.timestamp, now)
        : 1,
    }))

    for (const event of weightedEvents) {
      applyEventScoring(event, scores, event.temporalWeight)
    }

    // Ordenar personas por score
    const topPersonas = (Object.entries(scores) as Array<[Persona, number]>)
      .map(([persona, score]) => ({ persona, score }))
      .sort((a, b) => b.score - a.score)
      .filter(({ score }) => score > 0)

    return {
      scores,
      topPersonas,
      eventsAnalyzed: events.length,
    }
  } catch (error) {
    console.error('[getScoreBreakdown] Error:', error)

    return {
      scores: initializeScores(),
      topPersonas: [],
      eventsAnalyzed: 0,
    }
  }
}

/**
 * Valida se uma persona é válida
 */
export function isValidPersona(value: string): value is Persona {
  const validPersonas: Persona[] = [
    'health_conscious',
    'price_sensitive',
    'premium_seeker',
    'convenience_seeker',
    'tech_savvy',
    'researcher',
    'urgent_buyer',
    'new_visitor',
  ]

  return validPersonas.includes(value as Persona)
}
