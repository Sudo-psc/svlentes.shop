/**
 * BannerConvenienceSeeker - Banner para persona Convenience Seeker
 *
 * Destaca automatização, entrega automática e facilidade.
 * Foco em praticidade e não precisar se preocupar.
 */

'use client'

export function BannerConvenienceSeeker() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm text-white mb-4">
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Automatizado e sem complicação
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Suas lentes <span className="text-purple-200">no automático</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-purple-100">
            Configure uma vez e pronto. Suas lentes chegam todo mês em casa,
            sem você precisar se preocupar. Simples assim.
          </p>

          <div className="mx-auto mt-8 max-w-3xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-400/20">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-lg font-semibold text-white">Configure</div>
                <div className="text-sm text-purple-100">Uma única vez</div>
              </div>

              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-400/20">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-lg font-semibold text-white">Relaxe</div>
                <div className="text-sm text-purple-100">Automático</div>
              </div>

              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-400/20">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="text-lg font-semibold text-white">Receba</div>
                <div className="text-sm text-purple-100">Em casa</div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-lg font-semibold text-white">Lembretes Inteligentes</div>
                <div className="mt-1 text-sm text-purple-100">
                  Receba notificações quando suas lentes estiverem chegando e quando for hora de consulta.
                  Tudo sem você precisar lembrar.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#planos"
              className="rounded-md bg-white px-8 py-3 text-base font-semibold text-purple-700 shadow-sm hover:bg-purple-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all"
            >
              Ativar Assinatura Automática
            </a>
            <a
              href="#como-funciona"
              className="text-base font-semibold leading-7 text-white hover:text-purple-100 transition-colors"
            >
              Como funciona <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
