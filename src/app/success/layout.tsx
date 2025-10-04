import { Metadata } from 'next'
import { StructuredData } from '@/components/seo/StructuredData'
import { generateBreadcrumbStructuredData } from '@/lib/seo'

export const metadata: Metadata = {
    title: 'Pagamento Realizado com Sucesso - LAAS',
    description: 'Seu pagamento foi processado com sucesso. Bem-vindo ao LAAS! Suas lentes de contato serão enviadas conforme seu plano.',
    alternates: {
        canonical: 'https://laas.com.br/success',
    },
    robots: {
        index: false,
        follow: false,
    },
}

export default function SuccessLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const breadcrumbData = generateBreadcrumbStructuredData([
        { name: 'Início', url: 'https://laas.com.br' },
        { name: 'Sucesso', url: 'https://laas.com.br/success' }
    ])

    return (
        <>
            <StructuredData data={breadcrumbData} />
            {children}
        </>
    )
}