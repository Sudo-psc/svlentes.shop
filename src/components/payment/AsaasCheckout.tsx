'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AsaasCheckoutProps {
    planValue: number;
    planName: string;
    cycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
}

export function AsaasCheckout({ planValue, planName, cycle }: AsaasCheckoutProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'BOLETO' | 'CREDIT_CARD'>('PIX');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cpfCnpj: '',
        mobilePhone: '',
        postalCode: '',
        address: '',
        addressNumber: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Criar cliente
            const customerRes = await fetch('/api/asaas/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    cpfCnpj: formData.cpfCnpj.replace(/\D/g, ''),
                    mobilePhone: formData.mobilePhone.replace(/\D/g, ''),
                    postalCode: formData.postalCode.replace(/\D/g, ''),
                    address: formData.address,
                    addressNumber: formData.addressNumber,
                }),
            });

            if (!customerRes.ok) {
                throw new Error('Erro ao criar cliente');
            }

            const customer = await customerRes.json();

            // 2. Criar assinatura
            const nextDueDate = new Date();
            nextDueDate.setDate(nextDueDate.getDate() + 1);

            const subscriptionRes = await fetch('/api/asaas/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: customer.id,
                    billingType: paymentMethod,
                    nextDueDate: nextDueDate.toISOString().split('T')[0],
                    value: planValue,
                    cycle: cycle,
                    description: `Assinatura ${planName}`,
                }),
            });

            if (!subscriptionRes.ok) {
                throw new Error('Erro ao criar assinatura');
            }

            const subscription = await subscriptionRes.json();

            // 3. Buscar primeira cobrança
            const paymentsRes = await fetch(`/api/asaas/subscriptions/${subscription.id}/payments`);
            const payments = await paymentsRes.json();

            if (payments.data && payments.data.length > 0) {
                const firstPayment = payments.data[0];
                router.push(`/checkout/${firstPayment.id}`);
            } else {
                throw new Error('Nenhuma cobrança encontrada');
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao processar pagamento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Finalizar Assinatura</h2>

            <div className="mb-6 p-4 bg-blue-50 rounded-2xl">
                <p className="font-semibold">{planName}</p>
                <p className="text-2xl font-bold text-primary">R$ {planValue.toFixed(2)}/{cycle === 'MONTHLY' ? 'mês' : cycle === 'QUARTERLY' ? 'trimestre' : 'ano'}</p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Nome Completo</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">CPF/CNPJ</label>
                    <input
                        type="text"
                        required
                        value={formData.cpfCnpj}
                        onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                        placeholder="000.000.000-00"
                        className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Celular</label>
                    <input
                        type="tel"
                        required
                        value={formData.mobilePhone}
                        onChange={(e) => setFormData({ ...formData, mobilePhone: e.target.value })}
                        placeholder="(00) 00000-0000"
                        className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">CEP</label>
                        <input
                            type="text"
                            required
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            placeholder="00000-000"
                            className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Número</label>
                        <input
                            type="text"
                            required
                            value={formData.addressNumber}
                            onChange={(e) => setFormData({ ...formData, addressNumber: e.target.value })}
                            className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Endereço</label>
                    <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Forma de Pagamento</label>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('PIX')}
                            className={`p-4 border-2 rounded-2xl transition ${paymentMethod === 'PIX'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="font-semibold">Pix</div>
                            <div className="text-xs text-gray-600">Instantâneo</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('BOLETO')}
                            className={`p-4 border-2 rounded-2xl transition ${paymentMethod === 'BOLETO'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="font-semibold">Boleto</div>
                            <div className="text-xs text-gray-600">1-3 dias</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('CREDIT_CARD')}
                            className={`p-4 border-2 rounded-2xl transition ${paymentMethod === 'CREDIT_CARD'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="font-semibold">Cartão</div>
                            <div className="text-xs text-gray-600">Imediato</div>
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processando...' : 'Continuar para Pagamento'}
                </button>
            </form>
        </div>
    );
}
