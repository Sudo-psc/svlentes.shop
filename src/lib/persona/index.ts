/**
 * Persona Module - Sistema de inferência de persona
 *
 * Exporta todas as funcionalidades do sistema de persona.
 *
 * @module persona
 */

// Core functions
export { calculatePersona, getScoreBreakdown, isValidPersona, configureInference } from './calculatePersona'

// React hooks
export { usePersona, usePersonaFromCookie, useForcePersona } from './usePersona'

// Configuration
export { SCORING_RULES, DEFAULT_INFERENCE_CONFIG } from './scoringRules'

// Types
export type {
  Persona,
  PersonaScores,
  PersonaInference,
  ScoringRule,
  EventScoringRules,
  ScoringRulesMap,
  PersonaInferenceConfig,
} from './types'
