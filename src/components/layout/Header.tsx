'use client'

import { useState, useEffect } from 'react'
import { LogoHeader } from '@/components/ui/Logo'
import { generateWhatsAppLink } from '@/lib/utils'
import { Phone, CreditCard, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ThemeToggleSimple } from '@/components/theme/ThemeToggle'
import { useRouter } from 'next/navigation'

interface HeaderProps {
    className?: string
    variant?: 'default' | 'conversion-focused'
}

const navigation = [
    { name: 'Planos', href: '/assinatura' },
    { name: 'Como Funciona', href: '/sdd-framework' },
    { name: 'FAQ', href: '/sdd-framework#faq' },
    { name: 'Contato', href: '#contato' },
]

export function Header({ className, variant = 'conversion-focused' }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('')
    const [scrollProgress, setScrollProgress] = useState(0)
    const router = useRouter()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)

            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight
            const scrollTop = window.scrollY
            const progress = (scrollTop / (documentHeight - windowHeight)) * 100
            setScrollProgress(Math.min(progress, 100))

            const sections = navigation.map(item => item.href.substring(1))
            for (const section of sections) {
                const element = document.getElementById(section)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(`#${section}`)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleNavClick = (href: string) => {
        setIsMobileMenuOpen(false)

        if (href.startsWith('#')) {
            const element = document.querySelector(href)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        } else {
            router.push(href)
        }
    }

    const handleAssinarAgora = () => {
        setIsMobileMenuOpen(false)
        router.push('/assinatura')
    }

    const handleAgendarConsulta = () => {
        setIsMobileMenuOpen(false)
        const whatsappMessage = `Olá! Gostaria de agendar uma consulta com o Dr. Philipe Saraiva Cruz para avaliar minha necessidade de lentes de contato.

Vim através do site SV Lentes e tenho interesse no serviço de assinatura com acompanhamento médico.`

        const whatsappLink = generateWhatsAppLink(
            process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5533998601427',
            whatsappMessage
        )

        window.open(whatsappLink, '_blank')
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border'
                : 'bg-background shadow-sm border-b border-border/50'
                } ${className}`}
        >
            <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16 lg:h-18' : 'h-20 lg:h-24'}`}>
                    <div className={`hover:opacity-90 transition-all duration-300 -ml-2 lg:-ml-4 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
                        <LogoHeader />
                    </div>

                    <nav className="hidden lg:flex items-center space-x-10 xl:space-x-12">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleNavClick(item.href)
                                }}
                                className={`font-semibold text-base transition-all duration-200 relative group whitespace-nowrap cursor-pointer ${activeSection === item.href
                                    ? 'text-primary'
                                    : 'text-foreground hover:text-primary'
                                    }`}
                            >
                                {item.name}
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200 ${activeSection === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`}></span>
                            </a>
                        ))}
                    </nav>

                    {/* CTAs - Desktop */}
                    <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
                        <ThemeToggleSimple />

                        <Button
                            onClick={handleAssinarAgora}
                            variant="primary"
                            size="md"
                            className="flex items-center space-x-2 relative overflow-hidden group"
                        >
                            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                            <CreditCard className="w-4 h-4 relative z-10 animate-pulse" />
                            <span className="relative z-10">Assinar Agora</span>
                        </Button>

                        <Button
                            onClick={handleAgendarConsulta}
                            variant="outline"
                            size="md"
                            className="flex items-center space-x-2"
                        >
                            <Phone className="w-4 h-4" />
                            <span>Agendar Consulta</span>
                        </Button>
                    </div>

                    {/* Mobile Menu Button & Theme Toggle */}
                    <div className="lg:hidden flex items-center space-x-2">
                        <ThemeToggleSimple />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-foreground hover:text-primary transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-7 h-7" />
                            ) : (
                                <Menu className="w-7 h-7" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-border py-4 space-y-2">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleNavClick(item.href)
                                }}
                                className={`block px-4 py-3 font-medium transition-all cursor-pointer rounded-lg ${activeSection === item.href
                                    ? 'text-primary bg-primary/10 font-semibold'
                                    : 'text-foreground hover:text-primary hover:bg-muted'
                                    }`}
                            >
                                {item.name}
                            </a>
                        ))}

                        <div className="px-4 pt-4 pb-2 space-y-3 border-t border-border mt-4">
                            <Button
                                onClick={handleAssinarAgora}
                                variant="primary"
                                size="lg"
                                fullWidth
                                className="flex items-center justify-center space-x-2 relative overflow-hidden group"
                            >
                                <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                                <CreditCard className="w-4 h-4 relative z-10" />
                                <span className="relative z-10">Assinar Agora</span>
                            </Button>

                            <Button
                                onClick={handleAgendarConsulta}
                                variant="outline"
                                size="lg"
                                fullWidth
                                className="flex items-center justify-center space-x-2"
                            >
                                <Phone className="w-4 h-4" />
                                <span>Agendar Consulta</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Trust Indicators Bar - Visible on scroll */}
            {isScrolled && (
                <div className="bg-primary/5 dark:bg-primary/10 border-t border-primary/20 py-2.5">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center space-x-8 text-xs text-primary font-medium">
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                                <span className="hidden sm:inline">CRM-MG 69.870</span>
                                <span className="sm:hidden">CRM</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                <span>ANVISA</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                                <span className="hidden sm:inline">Pioneiro no Brasil</span>
                                <span className="sm:hidden">Pioneiro</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
