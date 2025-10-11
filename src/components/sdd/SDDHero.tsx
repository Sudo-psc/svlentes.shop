'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Phone, Shield, MapPin, Users, CheckCircle, Star } from 'lucide-react'
import { SDDConversionForm } from './SDDConversionForm'

interface SDDHeroProps {
    className?: string
}

export function SDDHero({ className = '' }: SDDHeroProps) {
    const [showForm, setShowForm] = useState(false)
    const [activeSubscriptions, setActiveSubscriptions] = useState(250)

    // Simulador de contador dinâmico
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSubscriptions(prev => {
                const increment = Math.floor(Math.random() * 3) + 1
                return prev + increment
            })
        }, 30000) // Atualiza a cada 30 segundos

        return () => clearInterval(interval)
    }, [])

    const handleStartConversion = () => {
        setShowForm(true)
    }

    if (showForm) {
        return <SDDConversionForm onBack={() => setShowForm(false)} />
    }

    return (
        <section className={`relative bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden ${className}`}>
            {/* Background Pattern sutil */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container-custom relative">
                <div className="max-w-5xl mx-auto py-16 lg:py-24">

                    {/* Prova Social Instantânea - Topo */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <Badge
                            variant="success"
                            size="lg"
                            className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 shadow-sm"
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            CRM-MG 69.870 — Dr. Philipe Saraiva Cruz
                        </Badge>

                        <Badge
                            variant="secondary"
                            size="lg"
                            className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 shadow-sm"
                        >
                            <MapPin className="w-4 h-4 mr-2" />
                            Atendimento em Caratinga/MG
                        </Badge>

                        <Badge
                            variant="default"
                            size="lg"
                            className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200 shadow-sm"
                        >
                            <Users className="w-4 h-4 mr-2" />
                            +{activeSubscriptions} assinaturas ativas
                        </Badge>
                    </div>

                    {/* Value Proposition Crystal Clear */}
                    <div className="text-center space-y-8 mb-12">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                            <span className="block mb-2">Assine lentes com</span>
                            <span className="block text-gradient bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                                acompanhamento médico
                            </span>
                            <span className="block text-3xl md:text-4xl lg:text-5xl mt-4 text-gray-700">
                                e entrega fácil
                            </span>
                        </h1>

                        {/* Subtítulo com benefícios claros */}
                        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                            Receba suas lentes em casa com <span className="font-semibold text-green-600">receita atualizada e segura</span> por 12 meses.
                            Economize até 40% com acompanhamento do Dr. Philipe Saraiva Cruz.
                        </p>

                        {/* Preços âncora dos 3 planos */}
                        <div className="flex flex-wrap justify-center gap-8 mt-8">
                            <div className="text-center">
                                <div className="text-sm text-gray-500 mb-1">Básico</div>
                                <div className="text-3xl font-bold text-gray-900">R$ 99<span className="text-lg text-gray-500">/mês</span></div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-gray-500 mb-1">Padrão</div>
                                <div className="text-3xl font-bold text-gray-900">R$ 139<span className="text-lg text-gray-500">/mês</span></div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-gray-500 mb-1">Premium</div>
                                <div className="text-3xl font-bold text-gray-900">R$ 199<span className="text-lg text-gray-500">/mês</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual Contextual - Placeholder para imagem real */}
                    <div className="relative max-w-4xl mx-auto mb-12">
                        <div className="aspect-video bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                                        <Phone className="w-12 h-12 text-blue-600" />
                                    </div>
                                    <p className="text-gray-600 font-medium">
                                        Paciente real da Saraiva Vision usando lentes no dia a dia
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Close nos olhos, embalagem de remessa e WhatsApp
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Selos de confiança sobre a imagem */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md">
                                <span className="text-xs font-semibold text-gray-700">ANVISA</span>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md">
                                <span className="text-xs font-semibold text-gray-700">CNPJ 53.864.119/0001-79</span>
                            </div>
                        </div>
                    </div>

                    {/* CTAs Principais */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
                        {/* CTA Primário Singular */}
                        <div className="relative group w-full md:w-auto">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                            <Button
                                onClick={handleStartConversion}
                                variant="cta"
                                size="xl"
                                className="relative w-full md:w-auto flex items-center justify-center space-x-3 text-lg py-6 px-12 min-w-[280px]"
                                aria-label="Assinar agora - CTA principal"
                            >
                                <Phone className="w-6 h-6" aria-hidden="true" />
                                <span className="font-bold">ASSINAR AGORA</span>
                            </Button>
                        </div>

                        {/* CTA Secundário */}
                        <Button
                            onClick={handleStartConversion}
                            variant="outline"
                            size="xl"
                            className="w-full md:w-auto px-12 py-6 text-lg border-2 border-gray-300 hover:border-gray-400"
                            aria-label="Agendar avaliação - CTA secundário"
                        >
                            AGENDAR AVALIAÇÃO
                        </Button>
                    </div>

                    {/* Prova Social Compacta */}
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                    <span className="ml-2 font-semibold text-gray-900">4.9/5</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Baseado em 1.247 avaliações
                                </div>
                            </div>

                            <blockquote className="text-gray-700 mb-4">
                                "Troquei mensal para diárias e reduzi irritação em 80%. O acompanhamento médico me dá total segurança."
                            </blockquote>

                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 font-semibold">AS</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Ana Silva</div>
                                    <div className="text-sm text-gray-600">Professora — Cliente há 8 meses</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Mobile CTA (será implementado com CSS) */}
                    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200">
                            <Button
                                onClick={handleStartConversion}
                                variant="cta"
                                size="lg"
                                className="w-full flex items-center justify-center space-x-2"
                                aria-label="Assinar agora - CTA mobile sticky"
                            >
                                <Phone className="w-5 h-5" />
                                <span className="font-bold">ASSINAR AGORA</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
