// Core types and interfaces
export type {
    UserProfile,
    BehavioralPattern,
    DemographicIndicators,
    ContentVariations,
    MicrocopyVariations,
    VisualVariations,
    ColorScheme,
    TypographyScheme,
    LayoutVariations,
    FeatureVariations,
    RoutingDecision,
    Experiment,
    ExperimentVariant,
    VariantChanges,
    ExperimentMetrics,
    VariantMetrics,
    ExperimentConfiguration,
    BehaviorData,
    PersonalizationConfig,
    PersonaDefinition,
    PersonaCharacteristics,
    PersonaTrigger,
    ScoringWeights,
    ContentPreferences,
    BehavioralIndicators,
    LocalizationConfig,
    CulturalAdaptations,
    PersonalizationAnalytics,
    PersonaAnalytics,
    PersonaPerformance,
    ExperimentAnalytics,
    ExperimentWinner,
    ContentAnalytics,
    VariantPerformance,
    ContentRecommendation,
    FunnelAnalytics,
    FunnelStage,
    DropoffPoint,
    PersonaType,
    EngagementLevel,
    ConversionType,
    PersonalizationStrategy,
    CacheStrategy
} from '@/types/personalization'

// Error classes
export {
    PersonalizationError,
    PersonaAnalysisError,
    ContentAdaptationError,
    RoutingError,
    ExperimentError,
    ConsentError
} from '@/types/personalization'

// Configuration and constants
export {
    DEFAULT_PERSONALIZATION_CONFIG,
    PERSONA_DEFINITIONS,
    CACHE_KEYS,
    API_ENDPOINTS,
    EVENT_NAMES,
    CONSENT_TYPES,
    RETENTION_POLICIES
} from './config'

// Storage and cache utilities
export {
    StorageAdapter,
    LocalStorageAdapter,
    SessionStorageAdapter,
    MemoryAdapter,
    PersonalizationStorage,
    personalizationStorage,
    createPersonalizationStorage,
    getUserProfile,
    saveUserProfile,
    trackBehavior,
    getBehaviorHistory
} from './storage'

// Re-export commonly used utilities
export type { DEFAULT_PERSONALIZATION_CONFIG as CONFIG } from './config'
export { personalizationStorage as storage } from './storage'
