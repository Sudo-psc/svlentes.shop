import { Metadata } from 'next'
import { doctorInfo, clinicInfo } from '@/data/doctor-info'
import { pricingPlans } from '@/data/pricing-plans'
import { featuredFAQ } from '@/data/faq-data'

// Base metadata configuration
export const baseMetadata: Metadata = {
    metadataBase: new URL('https://laas.com.br'),
    title: {
        default: 'LAAS - Nunca mais fique sem lentes | Assinatura com Acompanhamento Médico',
        template: '%s | LAAS'
    },
    description: 'Pioneiro no Brasil em assinatura de lentes de contato com acompanhamento médico especializado. Dr. Philipe Saraiva Cruz - CRM 65.870. Economia de até 40%.',
    keywords: [
        'lentes de contato',
        'assinatura lentes',
        'acompanhamento médico',
        'Dr. Philipe Saraiva Cruz',
        'oftalmologia',
        'CRM 65.870',
        'lentes mensais',
        'lentes diárias',
        'consulta oftalmológica',
        'telemedicina',
        'entrega domicilio',
        'LAAS',
        'lens as a service'
    ],
    authors: [{
        name: doctorInfo.name,
        url: 'https://laas.com.br'
    }],
    creator: doctorInfo.name,
    publisher: clinicInfo.name,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: 'https://laas.com.br',
        siteName: 'LAAS',
        title: 'LAAS - Nunca mais fique sem lentes',
        description: 'Assinatura de lentes de contato com acompanhamento médico especializado. Pioneiro no Brasil.',
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'LAAS - Assinatura de Lentes de Contato com Acompanhamento Médico',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'LAAS - Nunca mais fique sem lentes',
        description: 'Assinatura de lentes de contato com acompanhamento médico especializado',
        images: ['/images/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: process.env.GOOGLE_VERIFICATION_CODE,
    },
    alternates: {
        canonical: 'https://laas.com.br',
    },
    category: 'healthcare',
}

// Generate structured data for medical business
export function generateMedicalBusinessStructuredData() {
    return {
        '@context': 'https://schema.org',
        '@type': 'MedicalBusiness',
        name: clinicInfo.name,
        alternateName: clinicInfo.fullName,
        description: 'Serviço pioneiro no Brasil de assinatura de lentes de contato com acompanhamento médico especializado',
        url: 'https://laas.com.br',
        logo: 'https://laas.com.br/images/logo.png',
        image: 'https://laas.com.br/images/og-image.jpg',
        telephone: clinicInfo.contact.phone,
        email: clinicInfo.contact.email,
        address: {
            '@type': 'PostalAddress',
            streetAddress: clinicInfo.address.street,
            addressLocality: clinicInfo.address.city,
            addressRegion: clinicInfo.address.state,
            postalCode: clinicInfo.address.zipCode,
            addressCountry: clinicInfo.address.country
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: -23.5505,
            longitude: -46.6333
        },
        openingHours: [
            'Mo-Fr 08:00-18:00',
            'Sa 08:00-12:00'
        ],
        priceRange: '$$',
        currenciesAccepted: 'BRL',
        paymentAccepted: ['Credit Card', 'Debit Card', 'PIX'],
        areaServed: {
            '@type': 'Country',
            name: 'Brasil'
        },
        medicalSpecialty: 'Ophthalmology',
        physician: {
            '@type': 'Physician',
            name: doctorInfo.name,
            medicalSpecialty: 'Ophthalmology',
            identifier: doctorInfo.crm,
            alumniOf: 'Universidade Federal',
            memberOf: 'Sociedade Brasileira de Oftalmologia',
            yearsOfExperience: 15,
            image: `https://laas.com.br${doctorInfo.photo}`,
            description: doctorInfo.bio
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Planos de Assinatura LAAS',
            itemListElement: pricingPlans.map(plan => ({
                '@type': 'Offer',
                name: plan.name,
                description: `Plano ${plan.name} - ${plan.features.join(', ')}`,
                price: plan.priceMonthly,
                priceCurrency: 'BRL',
                availability: 'InStock',
                category: 'MedicalService',
                itemOffered: {
                    '@type': 'Service',
                    name: plan.name,
                    description: `Assinatura de lentes de contato com acompanhamento médico - ${plan.name}`,
                    provider: {
                        '@type': 'MedicalBusiness',
                        name: clinicInfo.name
                    }
                }
            }))
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '847',
            bestRating: '5',
            worstRating: '1'
        },
        review: [
            {
                '@type': 'Review',
                reviewRating: {
                    '@type': 'Rating',
                    ratingValue: '5',
                    bestRating: '5'
                },
                author: {
                    '@type': 'Person',
                    name: 'Maria Silva'
                },
                reviewBody: 'Excelente serviço! Nunca mais me preocupo em ficar sem lentes. O Dr. Philipe é muito atencioso e o acompanhamento médico faz toda diferença.'
            }
        ]
    }
}

// Generate FAQ structured data
export function generateFAQStructuredData() {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: featuredFAQ.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    }
}

// Generate service structured data
export function generateServiceStructuredData() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Assinatura de Lentes de Contato com Acompanhamento Médico',
        description: 'Serviço pioneiro no Brasil que combina entrega automática de lentes de contato com acompanhamento médico especializado',
        provider: {
            '@type': 'MedicalBusiness',
            name: clinicInfo.name,
            address: {
                '@type': 'PostalAddress',
                addressLocality: clinicInfo.address.city,
                addressRegion: clinicInfo.address.state,
                addressCountry: clinicInfo.address.country
            }
        },
        areaServed: {
            '@type': 'Country',
            name: 'Brasil'
        },
        availableChannel: {
            '@type': 'ServiceChannel',
            serviceUrl: 'https://laas.com.br',
            serviceSmsNumber: clinicInfo.contact.whatsapp,
            servicePhone: clinicInfo.contact.phone
        },
        category: 'Medical Service',
        offers: pricingPlans.map(plan => ({
            '@type': 'Offer',
            name: plan.name,
            price: plan.priceMonthly,
            priceCurrency: 'BRL',
            availability: 'InStock'
        }))
    }
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string, url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    }
}

// Generate organization structured data
export function generateOrganizationStructuredData() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: clinicInfo.name,
        alternateName: clinicInfo.fullName,
        url: 'https://laas.com.br',
        logo: 'https://laas.com.br/images/logo.png',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: clinicInfo.contact.phone,
            contactType: 'customer service',
            areaServed: 'BR',
            availableLanguage: 'Portuguese'
        },
        sameAs: [
            'https://www.instagram.com/laas.brasil',
            'https://www.facebook.com/laas.brasil',
            'https://www.linkedin.com/company/laas-brasil'
        ],
        address: {
            '@type': 'PostalAddress',
            streetAddress: clinicInfo.address.street,
            addressLocality: clinicInfo.address.city,
            addressRegion: clinicInfo.address.state,
            postalCode: clinicInfo.address.zipCode,
            addressCountry: clinicInfo.address.country
        }
    }
}

// Generate WebSite structured data
export function generateWebSiteStructuredData() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'LAAS',
        alternateName: 'Lens as a Service',
        url: 'https://laas.com.br',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://laas.com.br/search?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
        }
    }
}