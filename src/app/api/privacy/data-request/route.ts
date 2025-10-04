import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const dataRequestSchema = z.object({
    email: z.string().email('Email inválido'),
    requestType: z.enum(['access', 'deletion', 'portability', 'correction']),
    details: z.string().optional(),
    userConsent: z.boolean().refine(val => val === true, {
        message: 'Consentimento é obrigatório'
    })
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = dataRequestSchema.parse(body);

        // Log the data request for audit trail
        const requestLog = {
            id: crypto.randomUUID(),
            email: validatedData.email,
            requestType: validatedData.requestType,
            details: validatedData.details,
            timestamp: new Date().toISOString(),
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            status: 'pending'
        };

        // In production, save to database
        console.log('Data request received:', requestLog);

        // Send confirmation email (in production)
        // await sendDataRequestConfirmation(validatedData.email, validatedData.requestType);

        // Create response based on request type
        let responseMessage = '';
        let estimatedTime = '';

        switch (validatedData.requestType) {
            case 'access':
                responseMessage = 'Solicitação de acesso aos dados recebida. Você receberá um relatório completo dos seus dados em até 15 dias úteis.';
                estimatedTime = '15 dias úteis';
                break;
            case 'deletion':
                responseMessage = 'Solicitação de exclusão de dados recebida. Seus dados serão removidos em até 30 dias úteis, exceto aqueles que devemos manter por obrigação legal.';
                estimatedTime = '30 dias úteis';
                break;
            case 'portability':
                responseMessage = 'Solicitação de portabilidade de dados recebida. Você receberá seus dados em formato estruturado em até 15 dias úteis.';
                estimatedTime = '15 dias úteis';
                break;
            case 'correction':
                responseMessage = 'Solicitação de correção de dados recebida. Entraremos em contato para confirmar as alterações necessárias.';
                estimatedTime = '10 dias úteis';
                break;
        }

        return NextResponse.json({
            success: true,
            message: responseMessage,
            requestId: requestLog.id,
            estimatedTime,
            nextSteps: [
                'Você receberá um email de confirmação em breve',
                'Nossa equipe analisará sua solicitação',
                'Entraremos em contato se precisarmos de informações adicionais',
                `Sua solicitação será processada em até ${estimatedTime}`
            ]
        });

    } catch (error) {
        console.error('Error processing data request:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                message: 'Dados inválidos',
                errors: error.errors
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            message: 'Erro interno do servidor'
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const requestId = searchParams.get('requestId');

    if (!requestId) {
        return NextResponse.json({
            success: false,
            message: 'ID da solicitação é obrigatório'
        }, { status: 400 });
    }

    // In production, fetch from database
    // const request = await getDataRequestById(requestId);

    // Mock response for now
    return NextResponse.json({
        success: true,
        request: {
            id: requestId,
            status: 'processing',
            createdAt: new Date().toISOString(),
            estimatedCompletion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
        }
    });
}