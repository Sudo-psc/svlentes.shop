'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface TestimonialsCarouselProps {
    className?: string
}

export function TestimonialsCarousel({ className = '' }: TestimonialsCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const testimonials = [
        {
            name: 'Paula G.',
            location: 'Resende-RJ',
            text: 'Os serviços estão ao mais alto padrão. É muito tranquilizador',
            image: '/images/testimonials/placeholder-1.jpg'
        },
        {
            name: 'Maria S.',
            location: 'São Paulo-SP',
            text: 'O processo foi tão simples e prático! Adorei o acompanhamento médico.',
            image: '/images/testimonials/placeholder-2.jpg'
        },
        {
            name: 'João P.',
            location: 'Rio de Janeiro-RJ',
            text: 'Melhor serviço de lentes que já usei. Recomendo para todos!',
            image: '/images/testimonials/placeholder-3.jpg'
        }
    ]

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    return (
        <section className={`bg-white py-16 ${className}`}>
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                    Quem usa aprova
                </h2>

                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Featured Testimonial Card 1 */}
                        <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Paula G.</h4>
                                    <p className="text-sm text-gray-600">Resende-RJ</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">
                                "Os serviços estão ao mais alto padrão. É muito tranquilizador"
                            </p>
                        </div>

                        {/* Featured Testimonial Card 2 */}
                        <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Maria S.</h4>
                                    <p className="text-sm text-gray-600">São Paulo-SP</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">
                                "O serviço foi simples e prático! O acompanhamento médico me deixou segura."
                            </p>
                        </div>
                    </div>

                    {/* Carousel Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prevTestimonial}
                            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                            aria-label="Depoimento anterior"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Dots Indicator */}
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                        index === currentIndex ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                                    aria-label={`Ir para depoimento ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                            aria-label="Próximo depoimento"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
