/**
 * Performance metrics endpoint for monitoring
 * Collects and stores performance data
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const performanceMetric = await request.json()

        // Add server-side metadata
        const enrichedMetric = {
            ...performanceMetric,
            serverTimestamp: new Date().toISOString(),
            ip: request.ip || 'unknown',
            headers: {
                userAgent: request.headers.get('user-agent'),
                referer: request.headers.get('referer'),
                origin: request.headers.get('origin')
            }
        }

        // Log performance metrics (in production, this would go to analytics service)
        console.log('Performance Metric:', JSON.stringify(enrichedMetric, null, 2))

        // In production, you would:
        // 1. Store in time-series database (InfluxDB, TimescaleDB)
        // 2. Send to analytics service (Google Analytics, Mixpanel)
        // 3. Create dashboards and alerts

        // Example: Store in time-series database
        // await influxDB.writePoint(
        //   Point.measurement('performance')
        //     .tag('metric_name', performanceMetric.name)
        //     .tag('url', performanceMetric.url)
        //     .floatField('value', performanceMetric.value)
        //     .timestamp(new Date(performanceMetric.timestamp))
        // )

        // Example: Send to Google Analytics
        // if (performanceMetric.name === 'LCP' || performanceMetric.name === 'FID' || performanceMetric.name === 'CLS') {
        //   // Send Core Web Vitals to GA4
        //   gtag('event', 'web_vitals', {
        //     metric_name: performanceMetric.name,
        //     metric_value: performanceMetric.value,
        //     metric_id: generateUniqueId()
        //   })
        // }

        return NextResponse.json({
            success: true,
            id: `metric_${Date.now()}`
        })

    } catch (error) {
        console.error('Failed to process performance metric:', error)

        return NextResponse.json(
            { error: 'Failed to process performance metric' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        // Return aggregated performance metrics
        // In production, this would query your analytics database

        const mockMetrics = {
            timestamp: new Date().toISOString(),
            metrics: {
                averageLCP: 1800,
                averageFID: 45,
                averageCLS: 0.05,
                averagePageLoadTime: 2100,
                errorRate: 0.02,
                conversionRate: 0.15
            },
            trends: {
                lcp: { trend: 'improving', change: -200 },
                fid: { trend: 'stable', change: 2 },
                cls: { trend: 'improving', change: -0.01 },
                pageLoadTime: { trend: 'improving', change: -300 }
            }
        }

        return NextResponse.json(mockMetrics)

    } catch (error) {
        console.error('Failed to fetch performance metrics:', error)

        return NextResponse.json(
            { error: 'Failed to fetch performance metrics' },
            { status: 500 }
        )
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    })
}