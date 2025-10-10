'use client'

import Link from 'next/link'
import { Calculator, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react'

export function QuickStartSection() {
    return (
        <div className="py-20 sm:py-24">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6 shadow-lg">
                        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                        <span className="text-white text-base font-bold">Comece agora</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                        Dois caminhos para começar
                    </h2>
                    <p className="text-xl md:text-2xl text-primary-50 max-w-3xl mx-auto leading-relaxed">
                        Escolha a melhor forma de iniciar sua jornada com SV Lentes
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
                    {/* Calculator Path */}
                    <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                            <Calculator className="w-8 h-8 text-green-600" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Calcule sua Economia
                        </h3>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Descubra em segundos quanto você pode economizar com nossa assinatura.
                            Use o slider interativo e veja o resultado em tempo real.
                        </p>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-sm text-gray-700">
                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-green-600 text-xs">✓</span>
                                </div>
                                Cálculo instantâneo e personalizado
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-green-600 text-xs">✓</span>
                                </div>
                                Compare com seu gasto atual
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-green-600 text-xs">✓</span>
                                </div>
                                Salve o resultado e continue
                            </li>
                        </ul>

                        <Link href="/calculadora" className="block">
                            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg py-5 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95">
                                <Calculator className="w-6 h-6" />
                                <span>Calcular Economia</span>
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </Link>
                    </div>

                    {/* Direct Subscription Path */}
                    <div className="relative bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-primary-200">
                        <div className="absolute -top-3 right-8">
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                MAIS RÁPIDO
                            </span>
                        </div>

                        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6">
                            <ShoppingCart className="w-8 h-8 text-primary-600" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Assinar Direto
                        </h3>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Já conhece nossos planos? Vá direto ao ponto! Configure sua assinatura
                            em 4 passos simples e comece a economizar hoje.
                        </p>

                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-sm text-gray-700">
                                <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-primary-600 text-xs">1</span>
                                </div>
                                Escolha seu plano ideal
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                                <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-primary-600 text-xs">2</span>
                                </div>
                                Informe o grau das lentes
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                                <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-primary-600 text-xs">3</span>
                                </div>
                                Adicione serviços extras (opcional)
                            </li>
                            <li className="flex items-center text-sm text-gray-700">
                                <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-primary-600 text-xs">4</span>
                                </div>
                                Finalize e agende sua consulta
                            </li>
                        </ul>

                        <Link href="/assinar" className="block">
                            <button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-lg py-5 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 ring-2 ring-primary-400/30 hover:ring-primary-400/50">
                                <ShoppingCart className="w-6 h-6" />
                                <span>Começar Assinatura</span>
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Trust Indicator */}
                <div className="text-center mt-12">
                    <p className="text-primary-100 text-sm">
                        ✨ Mais de 1.000 pessoas já economizam com SV Lentes
                    </p>
                </div>
            </div>
        </div>
    )
}
