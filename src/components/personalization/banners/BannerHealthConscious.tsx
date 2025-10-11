/**
 * BannerHealthConscious - Banner para persona Health Conscious
 *
 * Foca em saúde ocular, acompanhamento médico e qualidade.
 * Destaca Dr. Philipe Saraiva Cruz e cuidados preventivos.
 */

'use client'

export function BannerHealthConscious() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm text-white mb-4">
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Acompanhamento médico contínuo
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Cuide da sua <span className="text-green-200">Saúde Ocular</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-green-100">
            Lentes de contato com consultório oftalmológico especializado em sua região.
            Dr. Philipe Saraiva Cruz (CRM-MG 69.870) acompanha sua visão durante toda a assinatura.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-green-100">Acompanhamento médico</div>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">Consultas</div>
                <div className="text-sm text-green-100">Inclusas no plano</div>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">Exames</div>
                <div className="text-sm text-green-100">Prioridade agendamento</div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#planos"
              className="rounded-md bg-white px-8 py-3 text-base font-semibold text-green-700 shadow-sm hover:bg-green-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all"
            >
              Ver Planos com Acompanhamento
            </a>
            <a
              href="/consulta"
              className="text-base font-semibold leading-7 text-white hover:text-green-100 transition-colors"
            >
              Agendar Consulta <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
