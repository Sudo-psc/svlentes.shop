import { Metadata } from 'next'
import { SDDHero } from '@/components/sdd/SDDHero'
import { SDDBenefits } from '@/components/sdd/SDDBenefits'
import { SDDPlans } from '@/components/sdd/SDDPlans'
import { SDDFAQ } from '@/components/sdd/SDDFAQ'

export const metadata: Metadata = {
    title: 'Assinatura de Lentes com Acompanhamento Médico em Caratinga | SV Lentes',
    description: 'Transforme sua visão com assinatura de lentes de contato e acompanhamento médico do Dr. Philipe Saraiva Cruz (CRM-MG 69.870). Planos Básico R$99, Padrão R$139, Premium R$199. Entrega em Caratinga/MG.',
    keywords: [
        'assinatura lentes de contato',
        'acompanhamento médico oftalmologista',
        'lentes de contato Caratinga',
        'Dr. Philipe Saraiva Cruz',
        'CRM-MG 69.870',
        'lentes por assinatura',
        'entrega lentes Caratinga',
        'oftalmologista Caratinga',
        'lentes diárias mensais',
        'astigmatismo presbiopia',
        'Saraiva Vision'
    ],
    authors: [{ name: 'Dr. Philipe Saraiva Cruz' }],
    creator: 'Saraiva Vision Care LTDA',
    publisher: 'Saraiva Vision Care LTDA',
    alternates: {
        canonical: 'https://svlentes.shop/sdd-framework',
    },
    openGraph: {
        title: 'Assinatura de Lentes com Acompanhamento Médico em Caratinga',
        description: 'Planos a partir de R$99/mês. Acompanhamento médico do Dr. Philipe Saraiva Cruz (CRM-MG 69.870). Entrega garantida em Caratinga/MG.',
        url: 'https://svlentes.shop/sdd-framework',
        siteName: 'SV Lentes - Saraiva Vision',
        type: 'website',
        locale: 'pt_BR',
        images: [
            {
                url: '/logosv-lg.webp',
                width: 1200,
                height: 630,
                alt: 'SV Lentes - Assinatura de Lentes com Acompanhamento Médico',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Assinatura de Lentes com Acompanhamento Médico',
        description: 'Planos a partir de R$99/mês. Dr. Philipe Saraiva Cruz (CRM-MG 69.870). Atendimento em Caratinga/MG.',
        images: ['/logosv-lg.webp'],
        creator: '@drsaraivavision',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
        yandex: 'your-yandex-verification-code',
    },
}

export default function SDDFrameworkPage() {
    return (
        <main className="min-h-screen">
            {/* Camada 1: Ancoragem Imediata (0-3 segundos) */}
            <SDDHero />

            {/* Camada 2: Validação Progressiva (3-15 segundos) */}
            <SDDBenefits />

            {/* Planos e Preços Detalhados */}
            <SDDPlans />

            {/* Camada 3: Desmistificação de Objeções (15-45 segundos) */}
            <SDDFAQ />

            {/* Schema.org Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "MedicalBusiness",
                        "name": "SV Lentes - Saraiva Vision",
                        "description": "Assinatura de lentes de contato com acompanhamento médico especializado em Caratinga/MG",
                        "url": "https://svlentes.shop",
                        "telephone": "+5533998601427",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Rua Catarina Maria Passos, 97",
                            "addressLocality": "Caratinga",
                            "addressRegion": "MG",
                            "postalCode": "35300-000",
                            "addressCountry": "BR"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": "-19.7897",
                            "longitude": "-42.1417"
                        },
                        "openingHours": [
                            "Mo-Fr 08:00-18:00",
                            "Sa 08:00-12:00"
                        ],
                        "priceRange": "R$99-R$199",
                        "paymentAccepted": "Cash, Credit Card, Debit Card",
                        "currenciesAccepted": "BRL",
                        "founder": {
                            "@type": "Person",
                            "name": "Dr. Philipe Saraiva Cruz",
                            "title": "Oftalmologista",
                            "credential": "CRM-MG 69.870",
                            "specialty": "Oftalmologia"
                        },
                        "employee": {
                            "@type": "Person",
                            "name": "Dr. Philipe Saraiva Cruz",
                            "title": "Oftalmologista",
                            "credential": "CRM-MG 69.870",
                            "specialty": "Oftalmologia"
                        },
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Planos de Assinatura de Lentes",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Plano Básico",
                                        "description": "Lentes esféricas com acompanhamento médico trimestral",
                                        "provider": {
                                            "@type": "Person",
                                            "name": "Dr. Philipe Saraiva Cruz"
                                        }
                                    },
                                    "price": "99",
                                    "priceCurrency": "BRL",
                                    "availability": "https://schema.org/InStock",
                                    "validFrom": "2024-01-01"
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Plano Padrão",
                                        "description": "Lentes tóricas e multifocais com acompanhamento avançado",
                                        "provider": {
                                            "@type": "Person",
                                            "name": "Dr. Philipe Saraiva Cruz"
                                        }
                                    },
                                    "price": "139",
                                    "priceCurrency": "BRL",
                                    "availability": "https://schema.org/InStock",
                                    "validFrom": "2024-01-01"
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Plano Premium",
                                        "description": "Materiais avançados e casos especiais com atendimento exclusivo",
                                        "provider": {
                                            "@type": "Person",
                                            "name": "Dr. Philipe Saraiva Cruz"
                                        }
                                    },
                                    "price": "199",
                                    "priceCurrency": "BRL",
                                    "availability": "https://schema.org/InStock",
                                    "validFrom": "2024-01-01"
                                }
                            ]
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": "1247",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "review": [
                            {
                                "@type": "Review",
                                "author": {
                                    "@type": "Person",
                                    "name": "Ana Silva"
                                },
                                "reviewRating": {
                                    "@type": "Rating",
                                    "ratingValue": "5",
                                    "bestRating": "5"
                                },
                                "reviewBody": "Troquei mensal para diárias e reduzi irritação em 80%. O acompanhamento médico me dá total segurança.",
                                "datePublished": "2024-03-15"
                            },
                            {
                                "@type": "Review",
                                "author": {
                                    "@type": "Person",
                                    "name": "Carlos Mendes"
                                },
                                "reviewRating": {
                                    "@type": "Rating",
                                    "ratingValue": "5",
                                    "bestRating": "5"
                                },
                                "reviewBody": "Astigmatismo corrigido com tórica. Adaptação completa em 7 dias. Nunca tive visão tão clara.",
                                "datePublished": "2024-02-20"
                            }
                        ],
                        "sameAs": [
                            "https://www.instagram.com/saraivavision",
                            "https://www.facebook.com/saraivavision"
                        ]
                    })
                }}
            />
        </main>
    )
}
