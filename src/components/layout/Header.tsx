'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { LogoHeader } from '@/components/ui/Logo'
import { scrollToSection, generateWhatsAppLink } from '@/lib/utils'
import { Menu, X, Phone } from 'lucide-react'

interface HeaderProps {
    className?: string
}

export function Header({ className }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    // Detectar scroll para adicionar sombra no header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Fechar menu mobile ao redimensionar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const navigation = [
        { name: 'Planos', href: '#planos-precos' },
        { name: 'Como Funciona', href: '#como-funciona' },
        { name: 'FAQ', href: '#perguntas-frequentes' },
        { name: 'Contato', href: '#contato' },
    ]

    const handleNavClick = (href: string) => {
        const sectionId = href.replace('#', '')
        scrollToSection(sectionId)
        setIsMenuOpen(false)
    }

    const handleAgendarConsulta = () => {
        const whatsappMessage = `Olá! Gostaria de agendar uma consulta com o Dr. Philipe Saraiva Cruz para avaliar minha necessidade de lentes de contato.

Vim através do site SV Lentes e tenho interesse no serviço de assinatura com acompanhamento médico.`

        const whatsappLink = generateWhatsAppLink(
            process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511947038078',
            whatsappMessage
        )

        window.open(whatsappLink, '_blank')
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
                : 'bg-white shadow-sm'
                } ${className}`}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <a
                        href="#hero"
                        onClick={(e) => {
                            e.preventDefault()
                            scrollToSection('hero')
                        }}
                        className="hover:opacity-90 transition-opacity"
                        aria-label="SV Lentes - Ir para o início"
                    >
                        <LogoHeader />
                    </a>

                    {/* Navigation Desktop */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleNavClick(item.href)
                                }}
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-200 group-hover:w-full"></span>
                            </a>
                        ))}
                    </nav>

                    {/* CTA Button Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Button
                            onClick={handleAgendarConsulta}
                            className="flex items-center space-x-2"
                            size="default"
                        >
                            <Phone className="w-4 h-4" />
                            <span>Agendar Consulta</span>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <div className="py-4 space-y-4">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleNavClick(item.href)
                                    }}
                                    className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium transition-colors duration-200"
                                >
                                    {item.name}
                                </a>
                            ))}

                            {/* Mobile CTA */}
                            <div className="px-4 pt-4 border-t border-gray-200">
                                <Button
                                    onClick={handleAgendarConsulta}
                                    className="w-full flex items-center justify-center space-x-2"
                                    size="default"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span>Agendar Consulta</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Trust Indicators Bar - Visible on scroll */}
            {isScrolled && (
                <div className="bg-primary-50 border-t border-primary-100 py-2">
                    <div className="container-custom">
                        <div className="flex items-center justify-center space-x-6 text-xs text-primary-700">
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>CRM-MG 69.870</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>ANVISA</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span>Pioneiro no Brasil</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
