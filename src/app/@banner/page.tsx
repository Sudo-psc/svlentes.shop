/**
 * @banner Slot - Banner personalizado por persona
 *
 * Este slot renderiza banners diferentes baseados na persona do usuário.
 * Utiliza headers do middleware para determinar qual banner exibir.
 *
 * FALLBACK: Se persona não detectada, exibe banner padrão (new_visitor)
 */

import { headers } from 'next/headers'
import { BannerHealthConscious } from '@/components/personalization/banners/BannerHealthConscious'
import { BannerPriceSensitive } from '@/components/personalization/banners/BannerPriceSensitive'
import { BannerPremiumSeeker } from '@/components/personalization/banners/BannerPremiumSeeker'
import { BannerConvenienceSeeker } from '@/components/personalization/banners/BannerConvenienceSeeker'
import { BannerTechSavvy } from '@/components/personalization/banners/BannerTechSavvy'
import { BannerResearcher } from '@/components/personalization/banners/BannerResearcher'
import { BannerUrgentBuyer } from '@/components/personalization/banners/BannerUrgentBuyer'
import { BannerDefault } from '@/components/personalization/banners/BannerDefault'
import type { Persona } from '@/lib/persona/types'

const BANNER_MAP: Record<Persona, React.ComponentType> = {
  health_conscious: BannerHealthConscious,
  price_sensitive: BannerPriceSensitive,
  premium_seeker: BannerPremiumSeeker,
  convenience_seeker: BannerConvenienceSeeker,
  tech_savvy: BannerTechSavvy,
  researcher: BannerResearcher,
  urgent_buyer: BannerUrgentBuyer,
  new_visitor: BannerDefault,
}

export default async function BannerSlot() {
  try {
    const headersList = await headers()
    const persona = (headersList.get('x-user-persona') || 'new_visitor') as Persona
    const source = headersList.get('x-persona-source') || 'unknown'
    const confidence = parseFloat(headersList.get('x-persona-confidence') || '0')

    // Select appropriate banner component
    const BannerComponent = BANNER_MAP[persona] || BannerDefault

    // DEBUG: Log persona detection (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('[BannerSlot] Persona:', persona, '| Source:', source, '| Confidence:', confidence)
    }

    return <BannerComponent />
  } catch (error) {
    // FALLBACK GRACIOSO: Em caso de erro, exibe banner padrão
    console.error('[BannerSlot] Error rendering banner:', error)
    return <BannerDefault />
  }
}
