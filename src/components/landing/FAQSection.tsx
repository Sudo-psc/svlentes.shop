'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { featuredFAQ } from '@/data/faq-data'

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <section className="py-20 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Coluna Esquerda - FAQ */}
                    <div>
                        <div className="mb-8">
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                                Perguntas Frequentes
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                FAQ - Transforme sua visão com SV Lentes
                            </p>
                        </div>

                        <div className="space-y-4">
                            {featuredFAQ.map((faq, index) => (
                                <div
                                    key={faq.id}
                                    className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900 dark:text-white pr-4">
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>
                                    {openIndex === index && (
                                        <div className="px-6 pb-4">
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Coluna Direita - Testimonials */}
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            Quem usa aprova
                        </h3>
                        <div className="space-y-6">
                            <TestimonialCard
                                name="Ana Silva"
                                role="Profissional de Marketing"
                                text="A praticidade de receber as lentes em casa e ter acompanhamento médico regular mudou completamente minha rotina. Recomendo!"
                                rating={5}
                            />
                            <TestimonialCard
                                name="Maria S."
                                role="Professora"
                                text="Profissional em sua casa, cuidado com a saúde visual que eu sempre quis. O Dr. Philipe é muito atencioso."
                                rating={5}
                            />
                            <TestimonialCard
                                name="Ricardo T."
                                role="Empresário"
                                text="Os serviços me surpreenderam. Tudo muito organizado, entrega pontual e suporte excelente."
                                rating={5}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function TestimonialCard({
    name,
    role,
    text,
    rating
}: {
    name: string
    role: string
    text: string
    rating: number
}) {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-md">
            <div className="flex gap-1 mb-3">
                {Array.from({ length: rating }).map((_, i) => (
                    <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                "{text}"
            </p>
            <div>
                <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{role}</p>
            </div>
        </div>
    )
}
