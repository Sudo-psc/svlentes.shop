import {
    determineFallbackStrategy,
    calculateCircuitBreakerMetrics,
    shouldPerformHealthCheck,
    shouldUpdateCircuitBreakerState,
    generateHealthReport,
    formatMetricsForLogging,
    exportMetricsForMonitoring
} from '@/lib/middleware-fallback'

describe('Middleware Fallback System', () => {
    describe('determineFallbackStrategy', () => {
        it('should return simplified strategy for timeout errors', () => {
            const error = new Error('Personalization timeout after 100ms')
            const strategy = determineFallbackStrategy(error, 1, Date.now())

            expect(strategy.level).toBe('simplified')
            expect(strategy.reason).toBe('timeout')
            expect(strategy.shouldRetry).toBe(true)
        })

        it('should return cached strategy for network errors', () => {
            const error = new Error('Network request failed')
            const strategy = determineFallbackStrategy(error, 1, Date.now())

            expect(strategy.level).toBe('cached')
            expect(strategy.reason).toBe('network')
            expect(strategy.shouldRetry).toBe(true)
        })

        it('should return default strategy for data errors', () => {
            const error = new Error('Failed to parse user profile')
            const strategy = determineFallbackStrategy(error, 1, Date.now())

            expect(strategy.level).toBe('default')
            expect(strategy.reason).toBe('data')
            expect(strategy.shouldRetry).toBe(false)
        })

        it('should return default strategy with no retry for many consecutive errors', () => {
            const error = new Error('Some error')
            const strategy = determineFallbackStrategy(error, 5, Date.now() - 30000)

            expect(strategy.level).toBe('default')
            expect(strategy.reason).toBe('circuit-breaker-open')
            expect(strategy.shouldRetry).toBe(false)
        })

        it('should allow retry after cooldown period', () => {
            const error = new Error('Some error')
            const strategy = determineFallbackStrategy(error, 5, Date.now() - 70000) // 70s ago

            expect(strategy.shouldRetry).toBe(true)
        })
    })

    describe('calculateCircuitBreakerMetrics', () => {
        it('should calculate metrics correctly', () => {
            const state = {
                status: 'closed' as const,
                consecutiveErrors: 0,
                consecutiveSuccesses: 5,
                totalRequests: 100,
                totalErrors: 5,
                totalFallbacks: 3,
                lastErrorTime: Date.now() - 10000,
                lastSuccessTime: Date.now()
            }

            const performanceMetrics = [
                { timestamp: Date.now() - 5000, latency: 50, success: true },
                { timestamp: Date.now() - 4000, latency: 75, success: true },
                { timestamp: Date.now() - 3000, latency: 100, success: false },
                { timestamp: Date.now() - 2000, latency: 60, success: true },
                { timestamp: Date.now() - 1000, latency: 80, success: true }
            ]

            const metrics = calculateCircuitBreakerMetrics(state, performanceMetrics)

            expect(metrics.status).toBe('closed')
            expect(metrics.errorRate).toBe(5)
            expect(metrics.avgLatency).toBe(73)
            expect(metrics.uptime).toBe(95)
            expect(metrics.totalRequests).toBe(100)
            expect(metrics.totalErrors).toBe(5)
        })

        it('should handle empty performance metrics', () => {
            const state = {
                status: 'closed' as const,
                consecutiveErrors: 0,
                consecutiveSuccesses: 0,
                totalRequests: 0,
                totalErrors: 0,
                totalFallbacks: 0,
                lastErrorTime: 0,
                lastSuccessTime: Date.now()
            }

            const metrics = calculateCircuitBreakerMetrics(state, [])

            expect(metrics.errorRate).toBe(0)
            expect(metrics.avgLatency).toBe(0)
            expect(metrics.uptime).toBe(100)
        })
    })

    describe('shouldPerformHealthCheck', () => {
        it('should return true if interval has passed', () => {
            const lastCheck = Date.now() - 15000 // 15s ago
            const interval = 10000 // 10s

            expect(shouldPerformHealthCheck(lastCheck, interval)).toBe(true)
        })

        it('should return false if interval has not passed', () => {
            const lastCheck = Date.now() - 5000 // 5s ago
            const interval = 10000 // 10s

            expect(shouldPerformHealthCheck(lastCheck, interval)).toBe(false)
        })
    })

    describe('shouldUpdateCircuitBreakerState', () => {
        it('should open circuit breaker on max errors', () => {
            const newState = shouldUpdateCircuitBreakerState(
                'closed',
                5, // consecutiveErrors
                0, // consecutiveSuccesses
                5, // maxErrors
                3  // recoveryThreshold
            )

            expect(newState).toBe('open')
        })

        it('should close circuit breaker on recovery', () => {
            const newState = shouldUpdateCircuitBreakerState(
                'half-open',
                0, // consecutiveErrors
                3, // consecutiveSuccesses
                5, // maxErrors
                3  // recoveryThreshold
            )

            expect(newState).toBe('closed')
        })

        it('should reopen circuit breaker on error during recovery', () => {
            const newState = shouldUpdateCircuitBreakerState(
                'half-open',
                1, // consecutiveErrors
                2, // consecutiveSuccesses
                5, // maxErrors
                3  // recoveryThreshold
            )

            expect(newState).toBe('open')
        })

        it('should stay closed when healthy', () => {
            const newState = shouldUpdateCircuitBreakerState(
                'closed',
                2, // consecutiveErrors
                5, // consecutiveSuccesses
                5, // maxErrors
                3  // recoveryThreshold
            )

            expect(newState).toBe('closed')
        })
    })

    describe('generateHealthReport', () => {
        it('should report healthy status', () => {
            const metrics = {
                status: 'closed' as const,
                consecutiveErrors: 0,
                consecutiveSuccesses: 10,
                totalRequests: 100,
                totalErrors: 2,
                totalFallbacks: 1,
                errorRate: 2,
                avgLatency: 50,
                lastErrorTime: Date.now() - 60000,
                lastSuccessTime: Date.now(),
                uptime: 98
            }

            const report = generateHealthReport(metrics)

            expect(report.status).toBe('healthy')
            expect(report.issues).toHaveLength(0)
            expect(report.recommendations).toHaveLength(0)
        })

        it('should report degraded status for elevated error rate', () => {
            const metrics = {
                status: 'closed' as const,
                consecutiveErrors: 0,
                consecutiveSuccesses: 5,
                totalRequests: 100,
                totalErrors: 15,
                totalFallbacks: 10,
                errorRate: 15,
                avgLatency: 80,
                lastErrorTime: Date.now() - 10000,
                lastSuccessTime: Date.now(),
                uptime: 85
            }

            const report = generateHealthReport(metrics)

            expect(report.status).toBe('degraded')
            expect(report.issues.length).toBeGreaterThan(0)
            expect(report.recommendations.length).toBeGreaterThan(0)
        })

        it('should report unhealthy status for open circuit breaker', () => {
            const metrics = {
                status: 'open' as const,
                consecutiveErrors: 5,
                consecutiveSuccesses: 0,
                totalRequests: 100,
                totalErrors: 25,
                totalFallbacks: 20,
                errorRate: 25,
                avgLatency: 150,
                lastErrorTime: Date.now(),
                lastSuccessTime: Date.now() - 60000,
                uptime: 75
            }

            const report = generateHealthReport(metrics)

            expect(report.status).toBe('unhealthy')
            expect(report.issues).toContain('Circuit breaker is open')
            expect(report.recommendations.length).toBeGreaterThan(0)
        })

        it('should report high latency issues', () => {
            const metrics = {
                status: 'closed' as const,
                consecutiveErrors: 0,
                consecutiveSuccesses: 10,
                totalRequests: 100,
                totalErrors: 5,
                totalFallbacks: 3,
                errorRate: 5,
                avgLatency: 250,
                lastErrorTime: Date.now() - 60000,
                lastSuccessTime: Date.now(),
                uptime: 95
            }

            const report = generateHealthReport(metrics)

            expect(report.status).toBe('degraded')
            expect(report.issues.some(issue => issue.includes('latency'))).toBe(true)
        })
    })

    describe('formatMetricsForLogging', () => {
        it('should format metrics as readable string', () => {
            const metrics = {
                status: 'closed' as const,
                consecutiveErrors: 0,
                consecutiveSuccesses: 5,
                totalRequests: 100,
                totalErrors: 5,
                totalFallbacks: 3,
                errorRate: 5,
                avgLatency: 75,
                lastErrorTime: Date.now() - 10000,
                lastSuccessTime: Date.now(),
                uptime: 95
            }

            const formatted = formatMetricsForLogging(metrics)

            expect(formatted).toContain('Status: closed')
            expect(formatted).toContain('Error Rate: 5%')
            expect(formatted).toContain('Avg Latency: 75ms')
            expect(formatted).toContain('Uptime: 95%')
            expect(formatted).toContain('Requests: 100')
            expect(formatted).toContain('Errors: 5')
            expect(formatted).toContain('Fallbacks: 3')
        })
    })

    describe('exportMetricsForMonitoring', () => {
        it('should export metrics in monitoring format', () => {
            const metrics = {
                status: 'closed' as const,
                consecutiveErrors: 0,
                consecutiveSuccesses: 5,
                totalRequests: 100,
                totalErrors: 5,
                totalFallbacks: 3,
                errorRate: 5,
                avgLatency: 75,
                lastErrorTime: Date.now() - 10000,
                lastSuccessTime: Date.now(),
                uptime: 95
            }

            const exported = exportMetricsForMonitoring(metrics)

            expect(exported['middleware.circuit_breaker.status']).toBe(0) // closed
            expect(exported['middleware.error_rate']).toBe(5)
            expect(exported['middleware.avg_latency']).toBe(75)
            expect(exported['middleware.uptime']).toBe(95)
            expect(exported['middleware.total_requests']).toBe(100)
            expect(exported['middleware.total_errors']).toBe(5)
        })

        it('should map circuit breaker states correctly', () => {
            const closedMetrics = { ...baseMetrics, status: 'closed' as const }
            const halfOpenMetrics = { ...baseMetrics, status: 'half-open' as const }
            const openMetrics = { ...baseMetrics, status: 'open' as const }

            expect(exportMetricsForMonitoring(closedMetrics)['middleware.circuit_breaker.status']).toBe(0)
            expect(exportMetricsForMonitoring(halfOpenMetrics)['middleware.circuit_breaker.status']).toBe(1)
            expect(exportMetricsForMonitoring(openMetrics)['middleware.circuit_breaker.status']).toBe(2)
        })
    })
})

// Helper para testes
const baseMetrics = {
    consecutiveErrors: 0,
    consecutiveSuccesses: 5,
    totalRequests: 100,
    totalErrors: 5,
    totalFallbacks: 3,
    errorRate: 5,
    avgLatency: 75,
    lastErrorTime: Date.now() - 10000,
    lastSuccessTime: Date.now(),
    uptime: 95
}
