/**
 * RecommendationsHealthConscious - Recomendações para Health Conscious
 * Destaca planos com mais consultas e exames inclusos.
 */

'use client'

export function RecommendationsHealthConscious() {
  return (
    <section className="py-12 bg-green-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-green-900 text-center mb-2">
          Planos com Acompanhamento Médico Completo
        </h2>
        <p className="text-center text-green-700 mb-8">
          Dr. Philipe Saraiva Cruz (CRM-MG 69.870) acompanha sua saúde ocular
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="rounded-lg border-2 border-green-600 bg-white p-6">
            <div className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 mb-3">
              Recomendado para você
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Plano Saúde Total</h3>
            <p className="mt-2 text-gray-600">4 consultas/ano + exames prioritários</p>
            <p className="mt-4 text-3xl font-bold text-gray-900">R$ 129,90<span className="text-sm font-normal text-gray-500">/mês</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-center"><svg className="mr-2 h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>Consultas trimestrais inclusas</li>
              <li className="flex items-center"><svg className="mr-2 h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>Topografia + paquimetria anuais</li>
              <li className="flex items-center"><svg className="mr-2 h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>Monitoramento saúde ocular</li>
            </ul>
            <a href="#planos" className="mt-6 block w-full rounded-md bg-green-600 px-4 py-2 text-center text-white hover:bg-green-700 transition-colors">
              Assinar Agora
            </a>
          </div>
          <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-gray-900">Plano Conforto</h3>
            <p className="mt-2 text-gray-600">2 consultas/ano + lentes quinzenais</p>
            <p className="mt-4 text-3xl font-bold text-gray-900">R$ 89,90<span className="text-sm font-normal text-gray-500">/mês</span></p>
            <a href="#planos" className="mt-6 block w-full rounded-md bg-gray-600 px-4 py-2 text-center text-white hover:bg-gray-700 transition-colors">
              Ver Detalhes
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
