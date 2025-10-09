'use client'

import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion'
import { featuredFAQ } from '@/data/faq-data'
import { FAQProps } from '@/types/wireframe'
import { trackEvent } from '@/lib/analytics'
import { openWhatsAppWithContext } from '@/lib/whatsapp'

interface FAQSectionProps {
    className?: string
}

export default function FAQ({ className }: FAQSectionProps) {
    const faqProps: FAQProps = {
        items: featuredFAQ,
        layout: 'accordion',
        numbering: true
    }

    const handleFAQClick = (questionId: string, questionText: string, position: number) => {
        trackEvent('faq_opened', {
            question_id: questionId,
            question_text: questionText,
            section_position: position,
        })
    }

    // Structured data for SEO
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqProps.items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    }

    return (
        <section
            id="perguntas-frequentes"
            className={`py-16 bg-gray-50 ${className || ''}`}
        >
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - FAQ Title and CTA */}
                    <div>
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Perguntas Frequentes
                            </h2>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Transforme sua visão com SV Lentes.
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Entrega completa e licenciamento à data de suas
                                consultas.
                            </p>
                            <button
                                onClick={() => openWhatsAppWithContext('consultation', {
                                    page: 'landing-page',
                                    section: 'faq-cta'
                                })}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Falar com um consultor
                            </button>
                            <p className="text-sm text-gray-500 mt-4">
                                Atendemos toda a{' '}
                                <span className="font-semibold">
                                    Região Médio Piauí, SP, Caratinga/MG
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Right Column - FAQ Accordion */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            Quem usa aprova
                        </h3>

                        <Accordion type="single" collapsible className="space-y-3">
                            {faqProps.items.slice(0, 2).map((item, index) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="border border-gray-200 rounded-lg px-4 py-2 bg-white shadow-sm"
                                >
                                    <AccordionTrigger
                                        className="text-left hover:no-underline py-3"
                                        onClick={() => handleFAQClick(item.id, item.question, index + 1)}
                                    >
                                        <span className="font-semibold text-gray-900 text-sm">
                                            {item.question}
                                        </span>
                                    </AccordionTrigger>

                                    <AccordionContent className="pt-2 pb-3">
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}