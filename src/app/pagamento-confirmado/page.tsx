'use client'

import Link from 'next/link';

// Force dynamic rendering to prevent prerender issues with ThemeProvider
export const dynamic = 'force-dynamic'

export default function PagamentoConfirmado() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-10 h-10 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Pagamento Confirmado!
                </h1>

                <p className="text-gray-600 mb-8">
                    Seu pagamento foi processado com sucesso. Em breve você receberá um email com os detalhes da sua assinatura.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="block w-full px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary-dark transition"
                    >
                        Voltar ao Início
                    </Link>

                    <Link
                        href="/minha-conta"
                        className="block w-full px-6 py-3 border-2 border-primary text-primary rounded-2xl hover:bg-primary hover:text-white transition"
                    >
                        Acessar Minha Conta
                    </Link>
                </div>
            </div>
        </main>
    );
}
