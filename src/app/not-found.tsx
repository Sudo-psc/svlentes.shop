import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Home, Search, Phone } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="container-custom px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-8">
                        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Página não encontrada
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Desculpe, a página que você está procurando não existe ou foi movida.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link href="/">
                            <Button variant="primary" size="lg" className="flex items-center space-x-2">
                                <Home className="w-5 h-5" />
                                <span>Voltar ao Início</span>
                            </Button>
                        </Link>
                        
                        <Link href="/assinatura">
                            <Button variant="outline" size="lg" className="flex items-center space-x-2">
                                <Search className="w-5 h-5" />
                                <span>Ver Planos</span>
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Precisa de ajuda?
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Nossa equipe está pronta para ajudar você
                        </p>
                        <Link href="/agendar-consulta">
                            <Button variant="whatsapp" size="md" className="flex items-center space-x-2 mx-auto">
                                <Phone className="w-4 h-4" />
                                <span>Falar com Especialista</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
