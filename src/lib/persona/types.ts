/**
 * Types for Persona Inference System
 *
 * Sistema de tipos para inferência de persona baseada em eventos.
 */

/**
 * Personas do sistema SVlentes
 *
 * Adaptadas para o contexto de lentes de contato e assinatura médica.
 */
export type Persona =
  | 'health_conscious'   // Prioriza saúde ocular e acompanhamento médico
  | 'price_sensitive'    // Busca melhor custo-benefício
  | 'premium_seeker'     // Prioriza qualidade premium
  | 'convenience_seeker' // Prioriza conveniência e entrega automática
  | 'tech_savvy'         // Interessado em tecnologia e inovação
  | 'researcher'         // Pesquisa extensivamente antes de comprar
  | 'urgent_buyer'       // Necessidade urgente, decisão rápida
  | 'new_visitor'        // Visitante novo sem padrão definido

/**
 * Scores de persona (0-100)
 *
 * Cada persona acumula pontos baseado nos eventos rastreados.
 */
export interface PersonaScores {
  health_conscious: number
  price_sensitive: number
  premium_seeker: number
  convenience_seeker: number
  tech_savvy: number
  researcher: number
  urgent_buyer: number
}

/**
 * Resultado da inferência de persona
 */
export interface PersonaInference {
  /** Persona principal */
  primary: Persona

  /** Score da persona principal (0-1) */
  confidence: number

  /** Todos os scores calculados */
  scores: PersonaScores

  /** Número de eventos analisados */
  eventsAnalyzed: number

  /** Timestamp da inferência */
  timestamp: number
}

/**
 * Regra de pontuação para um evento
 */
export interface ScoringRule {
  /** Condição para aplicar a regra */
  condition: (eventData: any) => boolean

  /** Pontos a adicionar se condição verdadeira */
  points: Partial<PersonaScores>
}

/**
 * Configuração de regras por tipo de evento
 */
export interface EventScoringRules {
  /** Regras para este tipo de evento */
  rules: ScoringRule[]

  /** Peso multiplicador deste evento (default: 1) */
  weight?: number
}

/**
 * Mapeamento completo de regras
 */
export type ScoringRulesMap = {
  [K in import('../tracking/types').TrackingEventName]?: EventScoringRules
}

/**
 * Configuração do sistema de inferência
 */
export interface PersonaInferenceConfig {
  /** Número mínimo de eventos para inferência (default: 5) */
  minEvents: number

  /** Threshold de pontos para definir persona (default: 20) */
  scoreThreshold: number

  /** Dar mais peso a eventos recentes (default: true) */
  decayOlderEvents: boolean

  /** Intervalo de recalculo em ms (default: 5000 = 5s) */
  recalculationInterval: number

  /** Habilitar debug logs (default: false) */
  debug: boolean
}
