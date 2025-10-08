import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Transforme Sua Visão Hoje | Assinatura de Lentes com Acompanhamento Médico',
    description: 'Nunca mais fique sem lentes! Assinatura completa com entrega mensal e acompanhamento médico especializado. Economize até 40% com Dr. Philipe Saraiva Cruz - CRM 69.870.',
    keywords: [
        'assinatura lentes de contato',
        'lentes de contato mensal',
        'acompanhamento médico oftalmologista',
        'entrega domiciliar lentes',
        'economia lentes de contato',
        'Dr. Philipe Saraiva Cruz'
    ],
    alternates: {
        canonical: 'https://saraivavision.com.br/landing-conversao',
    },
    openGraph: {
        title: 'Transforme Sua Visão Hoje | Assinatura de Lentes',
        description: 'Nunca mais fique sem lentes! Assinatura completa com acompanhamento médico especializado e economia de até 40%',
        url: 'https://saraivavision.com.br/landing-conversao',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function LandingConversaoLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
            <head>
                {/* Meta tags para performance */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name="theme-color" content="#2563eb" />

                {/* Preconnect para performance */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                {/* Critical CSS inline para carregamento rápido */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.6;
                            color: #1f2937;
                            background-color: #ffffff;
                        }
                        
                        .container-custom {
                            max-width: 1200px;
                            margin: 0 auto;
                            padding: 0 1rem;
                        }
                        
                        @media (min-width: 640px) {
                            .container-custom {
                                padding: 0 2rem;
                            }
                        }
                        
                        .text-gradient {
                            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            background-clip: text;
                        }
                        
                        .animate-pulse-slow {
                            animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                        }
                        
                        @keyframes pulse {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.5; }
                        }
                        
                        .animate-fade-in {
                            animation: fadeIn 0.6s ease-out;
                        }
                        
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        
                        .animate-slide-up {
                            animation: slideUp 0.8s ease-out;
                        }
                        
                        @keyframes slideUp {
                            from { opacity: 0; transform: translateY(40px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        
                        /* Otimizações para mobile */
                        @media (max-width: 768px) {
                            .text-4xl { font-size: 2rem; }
                            .text-5xl { font-size: 2.5rem; }
                            .text-6xl { font-size: 3rem; }
                            .text-7xl { font-size: 3.5rem; }
                        }
                    `
                }} />
            </head>
            <body className="antialiased">
                {/* Sem Header, Sem Footer, Sem Navegação - Foco Total na Conversão */}
                <main>
                    {children}
                </main>

                {/* Scripts essenciais para performance e conversão */}
                <script dangerouslySetInnerHTML={{
                    __html: `
                        // Prevenir zoom em mobile para melhor experiência
                        document.addEventListener('gesturestart', function(e) {
                            e.preventDefault();
                        });
                        
                        // Rastreamento de conversão
                        function trackConversion(action) {
                            if (typeof gtag !== 'undefined') {
                                gtag('event', 'conversion', {
                                    'event_category': 'landing-conversao',
                                    'event_label': action
                                });
                            }
                        }
                        
                        // Detectar quando usuário está prestes a sair
                        document.addEventListener('mouseleave', function(e) {
                            if (e.clientY <= 0) {
                                // Mostrar CTA de última chance
                                console.log('User about to leave - show exit intent');
                            }
                        });
                    `
                }} />
            </body>
        </html>
    )
}
