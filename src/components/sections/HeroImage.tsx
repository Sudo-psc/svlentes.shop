'use client'

import Image from 'next/image'
import { useState } from 'react'

interface HeroImageProps {
    className?: string
}

export function HeroImage({ className = '' }: HeroImageProps) {
    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <div className={`relative ${className}`}>
            {/* Image container with aspect ratio */}
            <div className="relative w-full aspect-square lg:aspect-auto lg:h-[600px]">
                {/* Loading skeleton */}
                {!isLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 animate-pulse rounded-2xl" />
                )}

                {/* Hero Image */}
                <Image
                    src="/HEro.png"
                    alt="Assinatura de lentes de contato LAAS - Mulher feliz usando lentes de contato com acompanhamento médico especializado"
                    fill
                    priority
                    quality={90}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                    className={`object-contain transition-opacity duration-500 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setIsLoaded(true)}
                />

                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-500 rounded-full opacity-20 blur-2xl" />
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary-500 rounded-full opacity-20 blur-2xl" />
            </div>

            {/* Trust badges overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-primary-700">15+</p>
                        <p className="text-xs text-gray-600">Anos</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-primary-700">5K+</p>
                        <p className="text-xs text-gray-600">Pacientes</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-primary-700">98%</p>
                        <p className="text-xs text-gray-600">Satisfação</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
