/**
 * BannerUrgentBuyer - Banner para persona Urgent Buyer
 * Destaca rapidez, disponibilidade imediata e atendimento urgente.
 */

'use client'

export function BannerUrgentBuyer() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-600 to-pink-700 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm text-white mb-4">
            ⚡ Atendimento Rápido
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Lentes em <span className="text-rose-200">48h</span> na sua Casa
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-rose-100">
            Precisa de lentes com urgência? Atendimento prioritário e entrega expressa disponível.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a href="https://wa.me/5533998601427" className="rounded-md bg-white px-8 py-3 text-base font-semibold text-rose-700 shadow-sm hover:bg-rose-50 transition-all">
              Falar no WhatsApp Agora
            </a>
            <a href="/consulta" className="rounded-md border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-all">
              Agendar Urgente
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
