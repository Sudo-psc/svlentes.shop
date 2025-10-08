/**
 * BannerPriceSensitive - Banner para persona Price Sensitive
 *
 * Destaca economia, custo-benefício e parcelamento.
 * Mostra comparação de preços e valor mensal acessível.
 */

'use client'

export function BannerPriceSensitive() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 to-red-600 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm text-white mb-4">
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Melhor custo-benefício
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            A partir de <span className="text-orange-200">R$ 49,90/mês</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-orange-100">
            Lentes de qualidade + acompanhamento médico por um preço justo.
            Compare: comprando avulso você pagaria até 3x mais.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="text-left">
                  <div className="text-sm text-orange-100">Compra avulsa (mensal)</div>
                  <div className="text-3xl font-bold text-white line-through opacity-75">R$ 149,90</div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-orange-100">Com assinatura (mensal)</div>
                  <div className="text-3xl font-bold text-white">R$ 49,90</div>
                  <div className="text-sm font-semibold text-green-300">Economia de 67%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-xl">
            <ul className="space-y-2 text-left text-orange-100">
              <li className="flex items-center">
                <svg className="mr-2 h-5 w-5 text-orange-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Sem taxa de adesão ou mensalidade adicional
              </li>
              <li className="flex items-center">
                <svg className="mr-2 h-5 w-5 text-orange-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Consultas e acompanhamento inclusos
              </li>
              <li className="flex items-center">
                <svg className="mr-2 h-5 w-5 text-orange-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Cancele quando quiser, sem multa
              </li>
            </ul>
          </div>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#planos"
              className="rounded-md bg-white px-8 py-3 text-base font-semibold text-orange-700 shadow-sm hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all"
            >
              Ver Planos e Economizar
            </a>
            <a
              href="#comparacao"
              className="text-base font-semibold leading-7 text-white hover:text-orange-100 transition-colors"
            >
              Comparar Preços <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
