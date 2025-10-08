/**
 * BannerResearcher - Banner para persona Researcher
 * Fornece informações detalhadas, dados técnicos e conteúdo educativo.
 */

'use client'

export function BannerResearcher() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-700 to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Informações <span className="text-slate-300">Completas</span> sobre Lentes
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-200">
            Saiba tudo sobre tipos, materiais, cuidados e tecnologias das lentes de contato.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a href="#planos" className="rounded-md bg-white px-8 py-3 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
              Comparar Planos
            </a>
            <a href="#faq" className="rounded-md border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-all">
              Perguntas Frequentes
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
