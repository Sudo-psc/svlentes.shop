'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Phone, CheckCircle, Star, Shield, Truck } from 'lucide-react'
import { ConversionForm } from './ConversionForm'

interface ConversionHeroProps {
    className?: string
}

export function ConversionHero({ className = '' }: ConversionHeroProps) {
    const [showForm, setShowForm] = useState(false)

    const handleStartConversion = () => {
        setShowForm(true)
    }

    if (showForm) {
        return <ConversionForm onBack={() => setShowForm(false)} />
    }

    return (
        <section className={`relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden ${className}`}>
            {/* Background Pattern para Foco Visual */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container-custom relative">
                <div className="max-w-4xl mx-auto text-center py-16 lg:py-24">

                    {/* Badge de Autoridade - Credibilidade Imediata */}
                    <div className="flex justify-center mb-8">
                        <Badge
                            variant="success"
                            size="lg"
                            className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 shadow-sm"
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            🏆 Pioneiro no Brasil em Assinatura de Lentes
                        </Badge>
                    </div>

                    {/* Headline Principal - Foco em Benefícios */}
                    <div className="space-y-6 mb-12">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                            <span className="block mb-2">Transforme</span>
                            <span className="block text-gradient">Sua Visão Hoje</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                            Nunca mais fique sem lentes. Receba em casa com acompanhamento médico do Dr. Philipe Saraiva Cruz.
                        </p>

                        {/* Proposta de Valor Clara */}
                        <div className="text-lg text-gray-700 max-w-2xl mx-auto">
                            <span className="font-semibold text-green-600">Economize até 40%</span> na sua assinatura de lentes de contato com entrega garantida e suporte médico especializado.
                        </div>
                    </div>

                    {/* Social Proof - Elementos de Confiança */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <div className="text-center">
                            <div className="flex justify-center mb-2">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">2.847</div>
                            <div className="text-sm text-gray-600">Clientes Ativos</div>
                        </div>

                        <div className="text-center">
                            <div className="flex justify-center mb-2">
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Star className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                            <div className="text-sm text-gray-600">Avaliação Média</div>
                        </div>

                        <div className="text-center">
                            <div className="flex justify-center mb-2">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">CRM 69.870</div>
                            <div className="text-sm text-gray-600">Médico Especialista</div>
                        </div>

                        <div className="text-center">
                            <div className="flex justify-center mb-2">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Truck className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">24h</div>
                            <div className="text-sm text-gray-600">Entrega SP</div>
                        </div>
                    </div>

                    {/* CTA Principal - Única Ação Desejada */}
                    <div className="space-y-6">
                        <div className="relative group max-w-md mx-auto">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                            <Button
                                onClick={handleStartConversion}
                                variant="cta"
                                size="xl"
                                className="relative w-full flex items-center justify-center space-x-3 text-lg py-6"
                                aria-label="Iniciar minha transformação visual - CTA principal"
                            >
                                <Phone className="w-6 h-6" aria-hidden="true" />
                                <span className="font-bold">QUERO TRANSFORMAR MINHA VISÃO</span>
                            </Button>
                        </div>

                        {/* Gatilho de Urgência */}
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span>Últimas 10 vagas disponíveis este mês</span>
                        </div>

                        {/* Garantia de Segurança */}
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                                <Shield className="w-4 h-4" />
                                <span>100% Seguro</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <CheckCircle className="w-4 h-4" />
                                <span>Satisfação Garantida</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <span>Suporte Médico</span>
                            </div>
                        </div>
                    </div>

                    {/* Depoimento Rápido - Social Proof Imediato */}
                    <div className="mt-16 max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <blockquote className="text-lg text-gray-700 mb-4 italic">
                                "Transformou completamente minha rotina. Nunca mais me preocupo em ficar sem lentes e o acompanhamento médico me dá total segurança."
                            </blockquote>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div>
                                    <div className="font-semibold text-gray-900">Mariana Silva</div>
                                    <div className="text-sm text-gray-600">Cliente há 8 meses</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
