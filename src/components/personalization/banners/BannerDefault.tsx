/**
 * BannerDefault - Banner padrão para novos visitantes
 *
 * Mensagem genérica e acolhedora para usuários sem persona definida.
 * Foco em explicar o serviço de forma clara e convidativa.
 */

'use client'

export function BannerDefault() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Lentes de Contato por <span className="text-blue-200">Assinatura</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Receba suas lentes em casa todo mês, com acompanhamento médico contínuo.
            Praticidade e cuidado com sua visão.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#planos"
              className="rounded-md bg-white px-8 py-3 text-base font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all"
            >
              Ver Planos
            </a>
            <a
              href="#como-funciona"
              className="text-base font-semibold leading-7 text-white hover:text-blue-100 transition-colors"
            >
              Como funciona <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
