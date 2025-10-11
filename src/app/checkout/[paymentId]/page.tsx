'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Payment {
    id: string;
    status: string;
    value: number;
    description?: string;
    billingType: string;
    invoiceUrl?: string;
}

interface QrCode {
    encodedImage?: string;
    payload?: string;
}

// Next.js 15: params is now a Promise in client components
export default function CheckoutPage({ params }: { params: Promise<{ paymentId: string }> }) {
    // Unwrap params Promise using React use() hook
    const { paymentId } = use(params);
    const router = useRouter();
    const [payment, setPayment] = useState<Payment | null>(null);
    const [qrCode, setQrCode] = useState<QrCode | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function loadPayment() {
            try {
                const res = await fetch(`/api/asaas/payments/${paymentId}`);
                if (!res.ok) throw new Error('Erro ao carregar pagamento');
                const data = await res.json();
                setPayment(data);

                // Buscar QR Code se for PIX
                if (data.billingType === 'PIX') {
                    const qrRes = await fetch(`/api/asaas/pix/${paymentId}`);
                    if (qrRes.ok) {
                        const qrData = await qrRes.json();
                        setQrCode(qrData);
                    }
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadPayment();

        // Polling para verificar status do pagamento
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/asaas/payments/${paymentId}`);
                if (res.ok) {
                    const data = await res.json();
                    setPayment(data);

                    if (data.status === 'RECEIVED' || data.status === 'CONFIRMED') {
                        clearInterval(interval);
                        router.push('/pagamento-confirmado');
                    }
                }
            } catch (err) {
                console.error('Erro ao verificar status:', err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [paymentId, router]);

    const copyToClipboard = () => {
        if (qrCode?.payload) {
            navigator.clipboard.writeText(qrCode.payload);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando pagamento...</p>
                </div>
            </div>
        );
    }

    if (error || !payment) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Pagamento não encontrado'}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-2 bg-primary text-white rounded-2xl"
                    >
                        Voltar ao início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6 text-center">Finalize seu Pagamento</h1>

                <div className="mb-8 p-4 bg-blue-50 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-2">Descrição</p>
                    <p className="font-semibold text-lg">{payment.description || 'Pagamento'}</p>
                    <p className="text-2xl font-bold text-primary mt-2">
                        R$ {Number(payment.value).toFixed(2)}
                    </p>
                </div>

                {payment.billingType === 'PIX' && qrCode && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold mb-4">Pague com Pix</h2>
                            {qrCode.encodedImage && (
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={`data:image/png;base64,${qrCode.encodedImage}`}
                                        alt="QR Code Pix"
                                        className="w-64 h-64 rounded-2xl shadow-md"
                                    />
                                </div>
                            )}
                        </div>

                        {qrCode.payload && (
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Ou copie o código Pix:</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={qrCode.payload}
                                        readOnly
                                        className="flex-1 p-3 border rounded-2xl text-sm bg-gray-50"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className="px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary-dark transition"
                                    >
                                        {copied ? 'Copiado!' : 'Copiar'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                            <p className="text-sm text-yellow-800">
                                ⏱️ Aguardando confirmação do pagamento...
                            </p>
                            <p className="text-xs text-yellow-700 mt-1">
                                Status: {payment.status}
                            </p>
                        </div>
                    </div>
                )}

                {payment.billingType === 'BOLETO' && payment.invoiceUrl && (
                    <div className="text-center space-y-4">
                        <h2 className="text-xl font-semibold">Pague com Boleto</h2>
                        <a
                            href={payment.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-8 py-3 bg-primary text-white rounded-2xl hover:bg-primary-dark transition"
                        >
                            Visualizar Boleto
                        </a>
                    </div>
                )}

                {payment.billingType === 'CREDIT_CARD' && (
                    <div className="text-center">
                        <p className="text-gray-600">
                            Status: <span className="font-semibold">{payment.status}</span>
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
