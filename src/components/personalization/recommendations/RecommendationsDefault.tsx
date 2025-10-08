/**
 * RecommendationsDefault - Recomendações padrão para novos visitantes
 * Mostra os 3 planos principais de forma equilibrada.
 */

'use client'

export function RecommendationsDefault() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Escolha o Plano Ideal para Você
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plano Básico */}
          <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-gray-900">Plano Básico</h3>
            <p className="mt-2 text-gray-600">Lentes mensais com acompanhamento</p>
            <p className="mt-4 text-3xl font-bold text-gray-900">R$ 49,90<span className="text-sm font-normal text-gray-500">/mês</span></p>
            <a href="#planos" className="mt-6 block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700 transition-colors">
              Assinar
            </a>
          </div>

          {/* Plano Conforto */}
          <div className="rounded-lg border-2 border-blue-600 bg-white p-6 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
              Mais Popular
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Plano Conforto</h3>
            <p className="mt-2 text-gray-600">Lentes quinzenais + consultas</p>
            <p className="mt-4 text-3xl font-bold text-gray-900">R$ 89,90<span className="text-sm font-normal text-gray-500">/mês</span></p>
            <a href="#planos" className="mt-6 block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700 transition-colors">
              Assinar
            </a>
          </div>

          {/* Plano Premium */}
          <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-gray-900">Plano Premium</h3>
            <p className="mt-2 text-gray-600">Lentes diárias + exames prioritários</p>
            <p className="mt-4 text-3xl font-bold text-gray-900">R$ 149,90<span className="text-sm font-normal text-gray-500">/mês</span></p>
            <a href="#planos" className="mt-6 block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700 transition-colors">
              Assinar
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
