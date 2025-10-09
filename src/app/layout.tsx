import { Inter, Poppins } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import { ClientProviders } from '@/components/providers/ClientProviders'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    weight: ['300', '400', '500', '600', '700'],
})

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
    weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
    title: {
        default: 'SV Lentes - Assinatura de Lentes de Contato | Dr. Philipe Saraiva Cruz',
        template: '%s | SV Lentes'
    },
    description: 'Serviço de assinatura de lentes de contato com acompanhamento médico especializado em Caratinga/MG. Nunca mais fique sem lentes com comodidade e segurança.',
    keywords: ['lentes de contato', 'assinatura', 'oftalmologia', 'Caratinga', 'Dr. Philipe Saraiva Cruz', 'acompanhamento médico'],
}

export default function RootLayout({
    children,
    banner,
    recommendations,
}: {
    children: React.ReactNode
    banner?: React.ReactNode
    recommendations?: React.ReactNode
}) {
    return (
        <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://js.stripe.com" />
                <link rel="preconnect" href="https://api.whatsapp.com" />
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    const theme = localStorage.getItem('theme') || 'system';
                                    const root = document.documentElement;
                                    if (theme === 'system') {
                                        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                                        root.classList.add(systemTheme);
                                    } else {
                                        root.classList.add(theme);
                                    }
                                } catch (e) {}
                            })();
                        `,
                    }}
                />
            </head>
            <body className="antialiased">
                <ClientProviders>
                    {banner}
                    {children}
                    {recommendations}
                </ClientProviders>
            </body>
        </html>
    )
}
