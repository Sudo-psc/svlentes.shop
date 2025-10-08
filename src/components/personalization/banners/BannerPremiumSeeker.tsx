/**
 * BannerPremiumSeeker - Banner para persona Premium Seeker
 * Foca em qualidade premium, tecnologia avançada e serviço exclusivo.
 */

'use client'

export function BannerPremiumSeeker() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-yellow-700 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Lentes <span className="text-amber-200">Premium</span> para sua Visão
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-amber-100">
            Tecnologia de ponta, conforto superior e acompanhamento médico personalizado.
          </p>
          <div className="mt-10">
            <a href="#planos" className="rounded-md bg-white px-8 py-3 text-base font-semibold text-amber-700 shadow-sm hover:bg-amber-50 transition-all">
              Explorar Planos Premium
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
