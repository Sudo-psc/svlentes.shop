import { NextRequest, NextResponse } from 'next/server'
import { asaas } from '@/lib/payments/asaas'

// Next.js 15: params is now a Promise
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await params in Next.js 15
        const { id: paymentId } = await params

        if (!paymentId) {
            return NextResponse.json({
                success: false,
                error: 'ID do pagamento é obrigatório'
            }, { status: 400 })
        }

        // Buscar QR Code PIX no ASAAS
        const pixData = await fetch(`${process.env.ASAAS_ENV === 'production'
            ? 'https://api.asaas.com/v3'
            : 'https://sandbox.asaas.com/api/v3'
            }/payments/${paymentId}/pixQrCode`, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': process.env.ASAAS_ENV === 'production'
                    ? process.env.ASAAS_API_KEY_PROD!
                    : process.env.ASAAS_API_KEY_SANDBOX!,
                'User-Agent': 'SV-Lentes/1.0.0'
            }
        })

        if (!pixData.ok) {
            const error = await pixData.text()
            console.error('Erro ao buscar QR Code PIX:', error)
            return NextResponse.json({
                success: false,
                error: 'Erro ao buscar QR Code PIX'
            }, { status: pixData.status })
        }

        const qrCode = await pixData.json()

        // Log para desenvolvimento
        console.log('QR Code PIX gerado:', {
            paymentId,
            hasEncodedImage: !!qrCode.encodedImage,
            hasPayload: !!qrCode.payload
        })

        return NextResponse.json({
            success: true,
            qrCode: {
                encodedImage: qrCode.encodedImage,
                payload: qrCode.payload,
                expirationDate: qrCode.expirationDate
            }
        })

    } catch (error) {
        console.error('Erro ao buscar QR Code PIX:', error)

        return NextResponse.json({
            success: false,
            error: 'Erro ao buscar QR Code PIX'
        }, { status: 500 })
    }
}
