'use client'

import { useState } from 'react'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Testimonial {
    id: number
    name: string
    role: string
    avatar: string
    rating: number
    text: string
    date: string
    verified: boolean
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Ana Paula Silva',
        role: 'Paciente há 2 anos',
        avatar: '/testimonials/avatar-1.jpg',
        rating: 5,
        text: 'O serviço de assinatura da SV Lentes mudou minha vida! Nunca mais precisei me preocupar em ficar sem lentes. O acompanhamento médico do Dr. Philipe é excepcional e a entrega sempre pontual.',
        date: '2024-01-15',
        verified: true
    },
    {
        id: 2,
        name: 'Carlos Eduardo Santos',
        role: 'Paciente há 1 ano',
        avatar: '/testimonials/avatar-2.jpg',
        rating: 5,
        text: 'Excelente atendimento! A consulta inicial foi muito detalhada, e recebo minhas lentes tóricas todo mês sem atrasos. Economia e praticidade em um só lugar.',
        date: '2024-02-20',
        verified: true
    },
    {
        id: 3,
        name: 'Mariana Costa',
        role: 'Paciente há 3 anos',
        avatar: '/testimonials/avatar-3.jpg',
        rating: 5,
        text: 'Uso lentes multifocais e estava tendo dificuldade com a adaptação. O Dr. Philipe ajustou minha prescrição perfeitamente. Agora tenho visão nítida e conforto o dia todo!',
        date: '2023-11-10',
        verified: true
    },
    {
        id: 4,
        name: 'Roberto Oliveira',
        role: 'Paciente há 6 meses',
        avatar: '/testimonials/avatar-4.jpg',
        rating: 5,
        text: 'A telemedicina facilitou muito minha vida. Consigo tirar dúvidas rapidamente pelo WhatsApp e o acompanhamento é constante. Recomendo muito!',
        date: '2024-03-05',
        verified: true
    }
]

export function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const previousTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    const currentTestimonial = testimonials[currentIndex]

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl"></div>
            </div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-flex items-center justify-center p-2 bg-success-100 rounded-full mb-6">
                        <Star className="w-6 h-6 text-success-600 fill-success-600" aria-hidden="true" />
                        <Star className="w-6 h-6 text-success-600 fill-success-600 -ml-1" aria-hidden="true" />
                        <Star className="w-6 h-6 text-success-600 fill-success-600 -ml-1" aria-hidden="true" />
                        <Star className="w-6 h-6 text-success-600 fill-success-600 -ml-1" aria-hidden="true" />
                        <Star className="w-6 h-6 text-success-600 fill-success-600 -ml-1" aria-hidden="true" />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        O que nossos pacientes dizem
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Mais de 5.000 pacientes confiam na SV Lentes para cuidar da sua visão
                    </p>
                </div>

                {/* Main Testimonial Card */}
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 relative border border-gray-100">
                        {/* Quote Icon */}
                        <div className="absolute top-6 right-6 opacity-10">
                            <Quote className="w-24 h-24 text-primary-600" aria-hidden="true" />
                        </div>

                        {/* Testimonial Content */}
                        <div className="relative z-10">
                            {/* Rating */}
                            <div className="flex items-center justify-center mb-6">
                                {[...Array(currentTestimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-6 h-6 text-yellow-400 fill-yellow-400"
                                        aria-hidden="true"
                                    />
                                ))}
                                <span className="sr-only">{currentTestimonial.rating} de 5 estrelas</span>
                            </div>

                            {/* Text */}
                            <blockquote className="text-xl md:text-2xl text-gray-700 text-center mb-8 leading-relaxed">
                                "{currentTestimonial.text}"
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center justify-center space-x-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-400 flex-shrink-0">
                                    <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-primary-700">
                                            {currentTestimonial.name.charAt(0)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center space-x-2">
                                        <p className="font-semibold text-gray-900 text-lg">
                                            {currentTestimonial.name}
                                        </p>
                                        {currentTestimonial.verified && (
                                            <div className="flex items-center space-x-1 bg-blue-100 px-2 py-1 rounded-full">
                                                <svg
                                                    className="w-4 h-4 text-blue-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className="text-xs font-medium text-blue-600">Verificado</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-500">{currentTestimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center space-x-4 mt-8">
                        <Button
                            onClick={previousTestimonial}
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            aria-label="Depoimento anterior"
                        >
                            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                        </Button>

                        {/* Dots Indicator */}
                        <div className="flex items-center space-x-2" role="tablist" aria-label="Navegação de depoimentos">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                                        index === currentIndex
                                            ? 'bg-primary-600 w-8'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    role="tab"
                                    aria-selected={index === currentIndex}
                                    aria-label={`Depoimento ${index + 1} de ${testimonials.length}`}
                                />
                            ))}
                        </div>

                        <Button
                            onClick={nextTestimonial}
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            aria-label="Próximo depoimento"
                        >
                            <ChevronRight className="w-5 h-5" aria-hidden="true" />
                        </Button>
                    </div>
                </div>

                {/* Trust Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-16">
                    <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200">
                        <p className="text-4xl font-bold text-primary-600 mb-2">98%</p>
                        <p className="text-gray-600 font-medium">Taxa de Satisfação</p>
                    </div>
                    <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200">
                        <p className="text-4xl font-bold text-primary-600 mb-2">5K+</p>
                        <p className="text-gray-600 font-medium">Pacientes Ativos</p>
                    </div>
                    <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200">
                        <p className="text-4xl font-bold text-primary-600 mb-2">15+</p>
                        <p className="text-gray-600 font-medium">Anos de Experiência</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
