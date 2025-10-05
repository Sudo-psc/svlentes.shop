import { Metadata } from 'next'

export const consultationMetadata: Metadata = {
    title: 'Agendar Consulta com Dr. Philipe Saraiva Cruz - Saraiva Vision',
    description: 'Agende sua consulta oftalmológica com o Dr. Philipe Saraiva Cruz (CRM-MG 69.870) para iniciar sua assinatura de lentes de contato com acompanhamento médico especializado.',
    alternates: {
        canonical: 'https://saraivavision.com.br/agendar-consulta',
    },
    openGraph: {
        title: 'Agendar Consulta - SVlentes',
        description: 'Consulta oftalmológica com Dr. Philipe Saraiva Cruz para assinatura de lentes',
        url: 'https://svlentes.com.br/agendar-consulta',
    },
    robots: {
        index: true,
        follow: true,
    },
}