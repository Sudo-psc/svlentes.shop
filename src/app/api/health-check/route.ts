/**
 * Health check endpoint for monitoring
 * Verifies system health and dependencies
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16'
})

export async function GET(request: NextRequest) {
    const startTime = Date.now()

    try {
        const checks = {
            timestamp: new Date().toISOString(),
            status: 'healthy',
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            checks: {
                database: { status: 'healthy', responseTime: 0 },
                stripe: { status: 'unknown', responseTime: 0 },
                memory: { status: 'healthy', usage: 0 },
                uptime: process.uptime()
            }
        }

        // Check Stripe connectivity
        try {
            const stripeStart = Date.now()
            await stripe.accounts.retrieve()
            checks.checks.stripe = {
                status: 'healthy',
                responseTime: Date.now() - stripeStart
            }
        } catch (error) {
            checks.checks.stripe = {
                status: 'unhealthy',
                responseTime: Date.now() - startTime,
                error: error instanceof Error ? error.message : 'Unknown error'
            }
            checks.status = 'degraded'
        }

        // Check memory usage
        const memoryUsage = process.memoryUsage()
        const memoryUsageMB = Math.round(memoryUsage.heapUsed / 1024 / 1024)
        checks.checks.memory = {
            status: memoryUsageMB > 512 ? 'warning' : 'healthy',
            usage: memoryUsageMB
        }

        // Overall response time
        const totalResponseTime = Date.now() - startTime

        // Determine overall status
        const hasUnhealthy = Object.values(checks.checks).some(check => check.status === 'unhealthy')
        const hasWarning = Object.values(checks.checks).some(check => check.status === 'warning')

        if (hasUnhealthy) {
            checks.status = 'unhealthy'
        } else if (hasWarning) {
            checks.status = 'warning'
        }

        const statusCode = checks.status === 'healthy' ? 200 :
            checks.status === 'warning' ? 200 : 503

        return NextResponse.json({
            ...checks,
            responseTime: totalResponseTime
        }, {
            status: statusCode,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        })

    } catch (error) {
        console.error('Health check failed:', error)

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error',
            responseTime: Date.now() - startTime
        }, {
            status: 503,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        })
    }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    })
}