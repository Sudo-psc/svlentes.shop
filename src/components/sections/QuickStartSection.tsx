'use client'

import Link from 'next/link'
import { Calculator, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react'

export function QuickStartSection() {
    return (
        <div className="py-16">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span className="text-white text-sm font-semibold">Comece agora</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Dois caminhos para começar
                    </h2>
                    <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                        Escolha a melhor forma de iniciar sua jornada com SV Lentes
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <button className="relative w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-3 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                                    <Calculator className="w-6 h-6" />
                                    <span>Calcular Economia Agora</span>
                                    <ArrowRight className="w-5 h-5" />
                                    <div className="ml-2 px-2 py-1 bg-yellow-400 text-green-900 text-xs font-bold rounded-full">
                                        GRÁTIS
                                    </div>
                                </button>
                            </div>
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
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <button className="relative w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-3 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                                    <ShoppingCart className="w-6 h-6" />
                                    <span>Começar Assinatura</span>
                                    <ArrowRight className="w-5 h-5" />
                                    <div className="ml-2 px-2 py-1 bg-yellow-400 text-primary-900 text-xs font-bold rounded-full">
                                        RÁPIDO
                                    </div>
                                </button>
                            </div>
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
