import { NextRequest, NextResponse } from 'next/server';
import { Asaas } from '@/lib/asaas';

// Next.js 15: params is now a Promise
type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        // Await params in Next.js 15
        const { id } = await params;
        const payment = await Asaas.getPayment(id);
        return NextResponse.json(payment);
    } catch (error: any) {
        console.error('Erro ao buscar pagamento Asaas:', error);
        return NextResponse.json(
            { error: error.message || 'Erro ao buscar pagamento' },
            { status: 500 }
        );
    }
}
