/**
 * BannerTechSavvy - Banner para persona Tech Savvy
 * Destaca app, tecnologia, automação e inovação.
 */

'use client'

export function BannerTechSavvy() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cyan-600 to-blue-700 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Tecnologia <span className="text-cyan-200">Inteligente</span> para suas Lentes
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-cyan-100">
            App com IA, lembretes automáticos e consultas por vídeo. O futuro da oftalmologia.
          </p>
          <div className="mt-10">
            <a href="#planos" className="rounded-md bg-white px-8 py-3 text-base font-semibold text-cyan-700 shadow-sm hover:bg-cyan-50 transition-all">
              Ver Tecnologia
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
