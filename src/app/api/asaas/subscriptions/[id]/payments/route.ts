import { NextRequest, NextResponse } from 'next/server';
import { Asaas } from '@/lib/asaas';

// Next.js 15: params is now a Promise
type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        // Await params in Next.js 15
        const { id } = await params;
        const payments = await Asaas.getSubscriptionPayments(id);
        return NextResponse.json(payments);
    } catch (error: any) {
        console.error('Erro ao buscar pagamentos da assinatura:', error);
        return NextResponse.json(
            { error: error.message || 'Erro ao buscar pagamentos' },
            { status: 500 }
        );
    }
}
