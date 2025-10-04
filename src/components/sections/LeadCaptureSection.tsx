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
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-md border border-green-100 text-center group hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                                    <Truck className="w-6 h-6 text-green-700" aria-hidden="true" />
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mb-1">Entrega Grátis</p>
                                <p className="text-xs text-gray-600">Todo Brasil</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-md border border-blue-100 text-center group hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                                    <Shield className="w-6 h-6 text-blue-700" aria-hidden="true" />
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mb-1">100% Seguro</p>
                                <p className="text-xs text-gray-600">SSL + LGPD</p>
                            </div>
                        </div>

                        {/* Additional info */}
                        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-100">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
                                Por que escolher LAAS?
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2 mt-0.5">✓</span>
                                    <span>Acompanhamento médico especializado contínuo</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2 mt-0.5">✓</span>
                                    <span>Lentes sempre em dia, sem preocupações</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2 mt-0.5">✓</span>
                                    <span>Economia de até 40% comparado à compra avulsa</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2 mt-0.5">✓</span>
                                    <span>Entrega programada no conforto da sua casa</span>
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
