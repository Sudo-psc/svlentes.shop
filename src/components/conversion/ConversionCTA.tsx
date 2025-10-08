'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Phone, CheckCircle, Star, Shield, Truck, ArrowRight } from 'lucide-react'
import { ConversionForm } from './ConversionForm'

interface ConversionCTAProps {
    className?: string
}

export function ConversionCTA({ className = '' }: ConversionCTAProps) {
    const [showForm, setShowForm] = useState(false)

    const handleStartConversion = () => {
        setShowForm(true)
    }

    if (showForm) {
        return <ConversionForm onBack={() => setShowForm(false)} />
    }

    return (
        <section className={`bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden ${className}`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="container-custom relative">
                <div className="max-w-4xl mx-auto text-center py-16 lg:py-24">

                    {/* Header do CTA */}
                    <div className="space-y-6 mb-12">
                        <Badge
                            variant="secondary"
                            size="lg"
                            className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            🎯 Última Oportunidade Hoje
                        </Badge>

                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                            <span className="block mb-2">Não Perca</span>
                            <span className="block text-yellow-300">Sua Vaga</span>
                        </h2>

                        <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Junte-se a <span className="font-bold text-yellow-300">2.847 clientes</span> que já transformaram sua visão com o serviço pioneiro no Brasil.
                        </p>
                    </div>

                    {/* Benefícios Principais - Above the Fold */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Economia Imediata</h3>
                            <p className="text-white/80">Até 40% de desconto na sua assinatura mensal</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Acompanhamento Médico</h3>
                            <p className="text-white/80">Dr. Philipe Saraiva Cruz - CRM 69.870</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Entrega Garantida</h3>
                            <p className="text-white/80">Receba em casa em 24h (São Paulo)</p>
                        </div>
                    </div>

                    {/* Prova Social Adicional */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-12">
                        <div className="flex items-center justify-center mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                            ))}
                            <span className="ml-3 text-white font-bold">4.9/5</span>
                            <span className="ml-2 text-white/80">(1.247 avaliações)</span>
                        </div>

                        <blockquote className="text-lg text-white/90 italic mb-6">
                            "Melhor decisão que tomei! O atendimento médico é excepcional e nunca mais fiquei sem lentes. Vale cada centavo."
                        </blockquote>

                        <div className="flex items-center justify-center space-x-3">
                            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                            <div className="text-left">
                                <div className="font-semibold text-white">Carlos Mendes</div>
                                <div className="text-sm text-white/70">Cliente há 14 meses</div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Final - Última Chamada para Ação */}
                    <div className="space-y-8">
                        {/* Gatilho de Urgência Máximo */}
                        <div className="bg-red-500/20 border-2 border-red-400 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-center space-x-3 mb-3">
                                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                                <span className="text-red-200 font-bold text-lg">⚠️ OFERTA POR TEMPO LIMITADO</span>
                                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-white text-xl font-bold">
                                Apenas <span className="text-yellow-300 text-2xl">10 VAGAS</span> disponíveis este mês
                            </p>
                            <p className="text-white/80 mt-2">
                                Última chance para garantir seu desconto de 40%
                            </p>
                        </div>

                        {/* Botão CTA Principal */}
                        <div className="relative group max-w-md mx-auto">
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                            <Button
                                onClick={handleStartConversion}
                                variant="cta"
                                size="xl"
                                className="relative w-full flex items-center justify-center space-x-3 text-lg py-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-black"
                                aria-label="Garantir minha vaga agora - CTA final"
                            >
                                <Phone className="w-6 h-6" aria-hidden="true" />
                                <span>GARANTIR MINHA VAGA AGORA</span>
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Garantias Finais */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80 text-sm">
                            <div className="flex items-center justify-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>100% Gratuito</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>Sem Compromisso</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>Cancelamento a Qualquer Momento</span>
                            </div>
                        </div>

                        {/* Informações de Contato Direto */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <p className="text-white/70 text-sm mb-2">
                                Prefere falar diretamente? Ligue agora:
                            </p>
                            <a
                                href="tel:+5533998601427"
                                className="text-white font-bold text-lg hover:text-yellow-300 transition-colors"
                            >
                                (33) 99860-1427
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
