/**
 * @recommendations Slot - Recomendações personalizadas por persona
 *
 * Este slot renderiza recomendações de produtos/planos diferentes
 * baseados na persona do usuário.
 *
 * FALLBACK: Se persona não detectada, exibe recomendações genéricas
 */

import { headers } from 'next/headers'
import { RecommendationsHealthConscious } from '@/components/personalization/recommendations/RecommendationsHealthConscious'
import { RecommendationsPriceSensitive } from '@/components/personalization/recommendations/RecommendationsPriceSensitive'
import { RecommendationsPremiumSeeker } from '@/components/personalization/recommendations/RecommendationsPremiumSeeker'
import { RecommendationsConvenienceSeeker } from '@/components/personalization/recommendations/RecommendationsConvenienceSeeker'
import { RecommendationsTechSavvy } from '@/components/personalization/recommendations/RecommendationsTechSavvy'
import { RecommendationsResearcher } from '@/components/personalization/recommendations/RecommendationsResearcher'
import { RecommendationsUrgentBuyer } from '@/components/personalization/recommendations/RecommendationsUrgentBuyer'
import { RecommendationsDefault } from '@/components/personalization/recommendations/RecommendationsDefault'
import type { Persona } from '@/lib/persona/types'

const RECOMMENDATIONS_MAP: Record<Persona, React.ComponentType> = {
  health_conscious: RecommendationsHealthConscious,
  price_sensitive: RecommendationsPriceSensitive,
  premium_seeker: RecommendationsPremiumSeeker,
  convenience_seeker: RecommendationsConvenienceSeeker,
  tech_savvy: RecommendationsTechSavvy,
  researcher: RecommendationsResearcher,
  urgent_buyer: RecommendationsUrgentBuyer,
  new_visitor: RecommendationsDefault,
}

export default async function RecommendationsSlot() {
  try {
    const headersList = await headers()
    const persona = (headersList.get('x-user-persona') || 'new_visitor') as Persona
    const source = headersList.get('x-persona-source') || 'unknown'

    // Select appropriate recommendations component
    const RecommendationsComponent = RECOMMENDATIONS_MAP[persona] || RecommendationsDefault

    // DEBUG: Log persona detection (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('[RecommendationsSlot] Persona:', persona, '| Source:', source)
    }

    return <RecommendationsComponent />
  } catch (error) {
    // FALLBACK GRACIOSO: Em caso de erro, exibe recomendações padrão
    console.error('[RecommendationsSlot] Error rendering recommendations:', error)
    return <RecommendationsDefault />
  }
}
