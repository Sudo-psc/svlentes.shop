/**
 * Tracking Module - Sistema de rastreamento client-side
 *
 * Exporta todas as funcionalidades do sistema de tracking
 * para fácil importação em componentes.
 *
 * @module tracking
 */

// EventTracker core
export { EventTracker } from './eventTracker'

// Helper functions
export {
  trackPageView,
  trackCategoryVisit,
  trackProductView,
  trackSearchQuery,
  trackAddToCart,
  trackFormInteraction,
  trackConsultationInterest,
  trackScrollDepth,
  trackVideoPlay,
  trackPlanComparison,
  trackCheckoutStart,
  trackPaymentMethodSelect,
} from './eventTracker'

// React hooks
export {
  useTracking,
  usePageViewTracking,
  useScrollTracking,
  useFormTracking,
  useVideoTracking,
} from './useTracking'

// Types
export type {
  TrackingEventName,
  TrackingEvent,
  TrackingEventData,
  TrackingConfig,
  TrackingStats,
  SyncResult,
  PageViewEvent,
  CategoryVisitEvent,
  ProductViewEvent,
  SearchQueryEvent,
  AddToCartEvent,
  FormInteractionEvent,
  ConsultationInterestEvent,
  ScrollDepthEvent,
  VideoPlayEvent,
  PlanComparisonEvent,
  CheckoutStartEvent,
  PaymentMethodSelectEvent,
} from './types'
