/**
 * API Route: /api/personalization/sync
 *
 * Sincroniza persona calculada no client-side com o servidor (Redis).
 *
 * FALLBACK GRACIOSO: Falha na sincronização retorna erro, mas não
 * quebra a aplicação (cliente continua funcionando apenas com cookie local).
 */

import { NextRequest, NextResponse } from 'next/server'
import { getRedisCache } from '@/lib/personalization/cache/redis-cache'
import { EdgeFingerprint } from '@/lib/personalization/edge/fingerprint'

/**
 * Valid persona values
 */
const VALID_PERSONAS = [
  'health_conscious',
  'price_sensitive',
  'premium_seeker',
  'convenience_seeker',
  'tech_savvy',
  'researcher',
  'urgent_buyer',
  'new_visitor',
]

/**
 * POST /api/personalization/sync
 *
 * Body: { persona: string }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json()
    const { persona } = body

    // 2. Validate persona
    if (!persona || typeof persona !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid persona field' },
        { status: 400 }
      )
    }

    if (!VALID_PERSONAS.includes(persona)) {
      return NextResponse.json(
        {
          error: 'Invalid persona',
          validPersonas: VALID_PERSONAS,
        },
        { status: 400 }
      )
    }

    // 3. Generate fingerprint for cache key
    const fingerprint = await EdgeFingerprint.generate(request)

    // 4. Store in Redis with 7 day TTL
    const cache = getRedisCache()
    const ttl = 7 * 24 * 60 * 60 // 7 days

    await cache.set(`persona:${fingerprint.hash}`, persona, ttl)

    // 5. Return success response
    return NextResponse.json({
      success: true,
      persona,
      fingerprint: fingerprint.hash.substring(0, 16), // Partial hash for reference
      ttl,
      syncedAt: new Date().toISOString(),
    })
  } catch (error) {
    // FALLBACK: Log error and return 500
    console.error('[Sync API] Error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/personalization/sync
 *
 * Retorna persona armazenada no Redis para o fingerprint atual
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Generate fingerprint
    const fingerprint = await EdgeFingerprint.generate(request)

    // 2. Get from Redis
    const cache = getRedisCache()
    const persona = await cache.get<string>(`persona:${fingerprint.hash}`)

    if (!persona) {
      return NextResponse.json(
        {
          persona: null,
          message: 'No persona found in cache',
        },
        { status: 404 }
      )
    }

    // 3. Return cached persona
    return NextResponse.json({
      persona,
      fingerprint: fingerprint.hash.substring(0, 16),
      source: 'redis-cache',
    })
  } catch (error) {
    console.error('[Sync API GET] Error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
