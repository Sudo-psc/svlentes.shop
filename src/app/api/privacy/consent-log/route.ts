import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const consentLogSchema = z.object({
    action: z.string(),
    data: z.any(),
    timestamp: z.string(),
    userAgent: z.string(),
    url: z.string()
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = consentLogSchema.parse(body);

        // Enhanced log entry with additional metadata
        const logEntry = {
            ...validatedData,
            id: crypto.randomUUID(),
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
            sessionId: request.headers.get('x-session-id') || 'unknown',
            serverTimestamp: new Date().toISOString()
        };

        // In production, save to secure database
        console.log('Consent log entry:', logEntry);

        // Store in audit trail (in production, use secure database)
        // await saveConsentLog(logEntry);

        return NextResponse.json({
            success: true,
            logId: logEntry.id
        });

    } catch (error) {
        console.error('Error logging consent:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                message: 'Dados de log inválidos',
                errors: error.errors
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            message: 'Erro ao registrar consentimento'
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!email) {
        return NextResponse.json({
            success: false,
            message: 'Email é obrigatório para consultar logs'
        }, { status: 400 });
    }

    // In production, fetch from database with proper authentication
    // const logs = await getConsentLogs(email, startDate, endDate);

    // Mock response for now
    const mockLogs = [
        {
            id: '1',
            action: 'cookie_consent_updated',
            timestamp: new Date().toISOString(),
            data: {
                preferences: {
                    necessary: true,
                    analytics: true,
                    marketing: false
                }
            }
        },
        {
            id: '2',
            action: 'marketing_consent_updated',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            data: {
                granted: true,
                preferences: {
                    email: true,
                    whatsapp: true,
                    sms: false
                }
            }
        }
    ];

    return NextResponse.json({
        success: true,
        logs: mockLogs,
        total: mockLogs.length
    });
}