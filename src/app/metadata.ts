import { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        default: 'SV Lentes - Assinatura de Lentes de Contato | Dr. Philipe Saraiva Cruz',
        template: '%s | SV Lentes'
    },
    description: 'Serviço de assinatura de lentes de contato com acompanhamento médico especializado em Caratinga/MG. Nunca mais fique sem lentes com comodidade e segurança.',
    keywords: ['lentes de contato', 'assinatura', 'oftalmologia', 'Caratinga', 'Dr. Philipe Saraiva Cruz', 'acompanhamento médico'],
    authors: [{ name: 'Dr. Philipe Saraiva Cruz', url: 'https://saraivavision.com.br' }],
    creator: 'Saraiva Vision',
    publisher: 'Saraiva Vision Care LTDA',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://svlentes.shop'),
    openGraph: {
        title: 'SV Lentes - Assinatura de Lentes de Contato',
        description: 'Serviço de assinatura de lentes de contato com acompanhamento médico especializado',
        url: 'https://svlentes.shop',
        siteName: 'SV Lentes',
        locale: 'pt_BR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SV Lentes - Assinatura de Lentes de Contato',
        description: 'Serviço de assinatura de lentes de contato com acompanhamento médico especializado',
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
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    },
}
