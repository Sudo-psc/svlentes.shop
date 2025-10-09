'use client'

import { Button } from '@/components/ui/Button'
import { Play } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
    return (
        <section className="relative bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Conteúdo Esquerdo */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                                Lentes por assinatura com{' '}
                                <span className="text-primary-600 dark:text-primary-400">
                                    acompanhamento médico
                                </span>
                            </h1>
                            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300">
                                Simplifique sua rotina, cuide da saúde da sua visão
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="bg-secondary-600 hover:bg-secondary-700 text-white text-lg px-8 py-6 h-auto"
                            >
                                <Link href="/assinatura">Assinar Agora</Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="text-lg px-8 py-6 h-auto border-2"
                            >
                                <Link href="/agendar-consulta">Agendar avaliação</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Vídeo Direito */}
                    <div className="relative">
                        <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                            {/* Placeholder do vídeo */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
                                <button
                                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                    aria-label="Reproduzir vídeo"
                                >
                                    <Play className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" />
                                </button>
                            </div>
                        </div>

                        {/* Texto abaixo do vídeo */}
                        <div className="mt-6 text-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Vídeo Explicativo
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Assista e entenda como nossa assinatura + Acompanhamento funciona
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
