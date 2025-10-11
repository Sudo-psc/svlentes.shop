/**
 * Redis Cache Adapter for Edge Runtime
 *
 * High-performance distributed caching with Upstash Redis
 * Optimized for edge computing with compression and TTL management
 */

import { Redis } from '@upstash/redis'
import type { UserProfile } from '@/types/personalization'

interface CacheConfig {
    ttl: number // Time to live in seconds
    compress: boolean
    prefix: string
    maxRetries: number
}

interface CacheMetrics {
    hits: number
    misses: number
    errors: number
    totalRequests: number
    averageLatency: number
}

const DEFAULT_CONFIG: CacheConfig = {
    ttl: 3600, // 1 hour
    compress: true,
    prefix: 'persona:',
    maxRetries: 3
}

export class RedisPersonaCache {
    private redis: Redis
    private config: CacheConfig
    private metrics: CacheMetrics = {
        hits: 0,
        misses: 0,
        errors: 0,
        totalRequests: 0,
        averageLatency: 0
    }

    constructor(config: Partial<CacheConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config }

        // Initialize Upstash Redis
        this.redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        })
    }

    /**
     * Get user profile from cache
     * Returns null if not found or expired
     */
    async getUserProfile(sessionId: string): Promise<UserProfile | null> {
        const startTime = Date.now()
        this.metrics.totalRequests++

        try {
            const key = this.buildKey('profile', sessionId)
            const cached = await this.redis.get<string>(key)

            if (!cached) {
                this.metrics.misses++
                this.updateLatency(Date.now() - startTime)
                return null
            }

            this.metrics.hits++
            this.updateLatency(Date.now() - startTime)

            // Parse and return
            const profile = this.deserialize<UserProfile>(cached)
            return profile
        } catch (error) {
            this.metrics.errors++
            this.updateLatency(Date.now() - startTime)
            console.error('[RedisCache] Error getting user profile:', error)
            return null
        }
    }

    /**
     * Set user profile in cache with TTL
     * TTL varies based on confidence score (higher confidence = longer TTL)
     */
    async setUserProfile(sessionId: string, profile: UserProfile): Promise<void> {
        try {
            const key = this.buildKey('profile', sessionId)
            const value = this.serialize(profile)

            // Dynamic TTL based on confidence
            const ttl = this.calculateDynamicTTL(profile.confidenceScore)

            await this.redis.set(key, value, { ex: ttl })
        } catch (error) {
            this.metrics.errors++
            console.error('[RedisCache] Error setting user profile:', error)
            throw error
        }
    }

    /**
     * Get persona scores from cache
     */
    async getPersonaScores(sessionId: string): Promise<Record<string, number> | null> {
        try {
            const key = this.buildKey('scores', sessionId)
            const cached = await this.redis.get<string>(key)

            if (!cached) {
                this.metrics.misses++
                return null
            }

            this.metrics.hits++
            return this.deserialize<Record<string, number>>(cached)
        } catch (error) {
            this.metrics.errors++
            console.error('[RedisCache] Error getting persona scores:', error)
            return null
        }
    }

    /**
     * Set persona scores in cache
     */
    async setPersonaScores(sessionId: string, scores: Record<string, number>): Promise<void> {
        try {
            const key = this.buildKey('scores', sessionId)
            const value = this.serialize(scores)

            await this.redis.set(key, value, { ex: this.config.ttl })
        } catch (error) {
            this.metrics.errors++
            console.error('[RedisCache] Error setting persona scores:', error)
            throw error
        }
    }

    /**
     * Get behavioral data from cache
     */
    async getBehavioralData(sessionId: string): Promise<any[] | null> {
        try {
            const key = this.buildKey('behavior', sessionId)
            const cached = await this.redis.get<string>(key)

            if (!cached) {
                this.metrics.misses++
                return null
            }

            this.metrics.hits++
            return this.deserialize<any[]>(cached)
        } catch (error) {
            this.metrics.errors++
            console.error('[RedisCache] Error getting behavioral data:', error)
            return null
        }
    }

    /**
     * Generic get method for simple key-value operations
     * Used by middleware for direct persona cache access
     */
    async get<T>(key: string): Promise<T | null> {
        const startTime = Date.now()
        this.metrics.totalRequests++

        try {
            const fullKey = `${this.config.prefix}${key}`
            const cached = await this.redis.get<string>(fullKey)

            if (!cached) {
                this.metrics.misses++
                this.updateLatency(Date.now() - startTime)
                return null
            }

            this.metrics.hits++
            this.updateLatency(Date.now() - startTime)

            // Handle primitive types (string, number, boolean)
            if (typeof cached === 'string' && !cached.startsWith('{') && !cached.startsWith('[')) {
                return cached as T
            }

            return this.deserialize<T>(cached)
        } catch (error) {
            this.metrics.errors++
            this.updateLatency(Date.now() - startTime)
            console.error('[RedisCache] Error getting value:', error)
            return null
        }
    }

    /**
     * Generic set method for simple key-value operations
     * Used by middleware for direct persona cache writes
     */
    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        try {
            const fullKey = `${this.config.prefix}${key}`

            // Handle primitive types vs objects
            const serialized = typeof value === 'object'
                ? this.serialize(value)
                : String(value)

            const expiryTime = ttl || this.config.ttl

            await this.redis.set(fullKey, serialized, { ex: expiryTime })
        } catch (error) {
            this.metrics.errors++
            console.error('[RedisCache] Error setting value:', error)
            throw error
        }
    }

    /**
     * Append behavioral data to cache
     */
    async appendBehavioralData(sessionId: string, data: any): Promise<void> {
        try {
            const key = this.buildKey('behavior', sessionId)
            const existing = await this.getBehavioralData(sessionId) || []

            // Keep only last 50 entries
            const updated = [...existing, data].slice(-50)
            const value = this.serialize(updated)

            await this.redis.set(key, value, { ex: this.config.ttl * 2 }) // Longer TTL for behavior data
        } catch (error) {
            this.metrics.errors++
            console.error('[RedisCache] Error appending behavioral data:', error)
            throw error
        }
    }

    /**
     * Invalidate user data
     */
    async invalidateUser(sessionId: string): Promise<void> {
        try {
            const keys = [
                this.buildKey('profile', sessionId),
                this.buildKey('scores', sessionId),
                this.buildKey('behavior', sessionId)
            ]

            await Promise.all(keys.map(key => this.redis.del(key)))
        } catch (error) {
            console.error('[RedisCache] Error invalidating user:', error)
            throw error
        }
    }

    /**
     * Warm cache with popular personas
     * Pre-populate cache with common persona profiles
     */
    async warmCache(personas: string[]): Promise<void> {
        try {
            const warmupProfiles = personas.map(persona => ({
                primaryPersona: persona,
                confidenceScore: 0.5,
                behavioralPatterns: [],
                demographicIndicators: {
                    likelyAge: 'unknown',
                    likelyIncome: 'medium',
                    likelyLocation: 'brazil',
                    devicePreference: 'mobile',
                    browsingTime: 'afternoon',
                    language: 'pt-BR',
                    timezone: 'America/Sao_Paulo'
                },
                engagementLevel: 'medium' as const,
                conversionProbability: 0.3,
                shouldUpdateProfile: false,
                sessionId: `warmup-${persona}`,
                lastUpdated: new Date()
            }))

            await Promise.all(
                warmupProfiles.map(profile =>
                    this.setUserProfile(profile.sessionId, profile)
                )
            )

            console.log(`[RedisCache] Warmed cache with ${personas.length} personas`)
        } catch (error) {
            console.error('[RedisCache] Error warming cache:', error)
        }
    }

    /**
     * Get cache metrics
     */
    getMetrics(): CacheMetrics & { hitRate: number } {
        const hitRate = this.metrics.totalRequests > 0
            ? (this.metrics.hits / this.metrics.totalRequests) * 100
            : 0

        return {
            ...this.metrics,
            hitRate: Math.round(hitRate * 100) / 100
        }
    }

    /**
     * Reset metrics
     */
    resetMetrics(): void {
        this.metrics = {
            hits: 0,
            misses: 0,
            errors: 0,
            totalRequests: 0,
            averageLatency: 0
        }
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<{ healthy: boolean; latency: number; error?: string }> {
        const startTime = Date.now()

        try {
            await this.redis.ping()
            const latency = Date.now() - startTime

            return {
                healthy: true,
                latency
            }
        } catch (error) {
            return {
                healthy: false,
                latency: Date.now() - startTime,
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    }

    // Private helper methods

    private buildKey(type: string, id: string): string {
        return `${this.config.prefix}${type}:${id}`
    }

    private serialize<T>(data: T): string {
        return JSON.stringify(data)
    }

    private deserialize<T>(data: string): T {
        return JSON.parse(data) as T
    }

    private calculateDynamicTTL(confidenceScore: number): number {
        // Higher confidence = longer TTL
        // Confidence 0.0-0.3: 30 minutes
        // Confidence 0.3-0.6: 1 hour
        // Confidence 0.6-0.8: 2 hours
        // Confidence 0.8-1.0: 4 hours

        if (confidenceScore >= 0.8) return 4 * 60 * 60
        if (confidenceScore >= 0.6) return 2 * 60 * 60
        if (confidenceScore >= 0.3) return 1 * 60 * 60
        return 30 * 60
    }

    private updateLatency(latency: number): void {
        const totalLatency = this.metrics.averageLatency * (this.metrics.totalRequests - 1)
        this.metrics.averageLatency = (totalLatency + latency) / this.metrics.totalRequests
    }
}

// Singleton instance
let cacheInstance: RedisPersonaCache | null = null

export function getRedisCache(): RedisPersonaCache {
    if (!cacheInstance) {
        cacheInstance = new RedisPersonaCache()
    }
    return cacheInstance
}

export function resetCacheInstance(): void {
    cacheInstance = null
}
