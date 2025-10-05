'use client'

import { DoctorCard } from '@/components/trust/DoctorCard'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'
import { scrollToSection } from '@/lib/utils'
import { Shield, Truck } from 'lucide-react'

interface LeadCaptureSectionProps {
    className?: string
}

export function LeadCaptureSection({ className = '' }: LeadCaptureSectionProps) {
    return (
        <section id="formulario-contato" className={`bg-white py-16 lg:py-24 ${className}`}>
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                    {/* Left Column - Doctor Card */}
                    <div className="space-y-6">
                        {/* Doctor Card */}
                        <DoctorCard variant="hero" showCTA={false} />

                        {/* Trust Elements */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-md rounded-2xl p-6 shadow-glass border border-green-200/50 text-center group hover:shadow-glass-lg transform hover:-translate-y-1 transition-all duration-300">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Truck className="w-7 h-7 text-green-700" aria-hidden="true" />
                                </div>
                                <p className="text-sm font-bold text-gray-900 mb-1 drop-shadow-sm">Entrega Grátis</p>
                                <p className="text-xs text-gray-700 font-medium">Todo Brasil</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-md rounded-2xl p-6 shadow-glass border border-blue-200/50 text-center group hover:shadow-glass-lg transform hover:-translate-y-1 transition-all duration-300">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Shield className="w-7 h-7 text-blue-700" aria-hidden="true" />
                                </div>
                                <p className="text-sm font-bold text-gray-900 mb-1 drop-shadow-sm">100% Seguro</p>
                                <p className="text-xs text-gray-700 font-medium">SSL + LGPD</p>
                            </div>
                        </div>

                        {/* Additional info */}
                        <div className="bg-gradient-to-r from-primary-50/95 to-secondary-50/95 backdrop-blur-md rounded-2xl p-6 shadow-glass border border-primary-200/50 transform hover:scale-105 transition-all duration-300">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                                <span className="w-3 h-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mr-3 animate-pulse shadow-lg shadow-primary-500/50"></span>
                                Por que escolher SVlentes?
                            </h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start group">
                                    <span className="text-primary-600 mr-3 mt-0.5 text-lg font-bold drop-shadow-sm">✓</span>
                                    <span className="text-gray-800 font-medium group-hover:text-primary-700 transition-colors">Acompanhamento médico especializado contínuo</span>
                                </li>
                                <li className="flex items-start group">
                                    <span className="text-primary-600 mr-3 mt-0.5 text-lg font-bold drop-shadow-sm">✓</span>
                                    <span className="text-gray-800 font-medium group-hover:text-primary-700 transition-colors">Lentes sempre em dia, sem preocupações</span>
                                </li>
                                <li className="flex items-start group">
                                    <span className="text-primary-600 mr-3 mt-0.5 text-lg font-bold drop-shadow-sm">✓</span>
                                    <span className="text-gray-800 font-medium group-hover:text-primary-700 transition-colors">Economia de até 40% comparado à compra avulsa</span>
                                </li>
                                <li className="flex items-start group">
                                    <span className="text-primary-600 mr-3 mt-0.5 text-lg font-bold drop-shadow-sm">✓</span>
                                    <span className="text-gray-800 font-medium group-hover:text-primary-700 transition-colors">Entrega programada no conforto da sua casa</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Lead Form */}
                    <div className="lg:sticky lg:top-24">
                        <LeadCaptureForm
                            variant="hero"
                            onSubmit={(data) => {
                                // Redirecionar para calculadora com dados do lead
                                console.log('Lead capturado:', data)
                                scrollToSection('calculadora-economia')
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
