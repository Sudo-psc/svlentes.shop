'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LogoFooter } from '@/components/ui/Logo'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { generateWhatsAppLink } from '@/lib/utils'
import { doctorInfo, clinicInfo } from '@/data/doctor-info'
import { HeroSubscriptionButton } from '@/components/cta/HeroSubscriptionButton'
import { PrivacyPolicy } from '@/components/privacy/PrivacyPolicy'
import { PrivacySettings } from '@/components/privacy/PrivacySettings'
import { DataControlPanel } from '@/components/privacy/DataControlPanel'
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Shield,
    FileText,
    Heart,
    MessageCircle,
    Settings
} from 'lucide-react'

interface FooterProps {
    className?: string
}

export function Footer({ className }: FooterProps) {
    const currentYear = new Date().getFullYear()
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
    const [showPrivacySettings, setShowPrivacySettings] = useState(false)
    const [showDataControl, setShowDataControl] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    const handleWhatsAppContact = () => {
        const message = `Olá! Entrei em contato através do site SV Lentes e gostaria de mais informações sobre o serviço de assinatura de lentes de contato com acompanhamento médico.`

        const whatsappLink = generateWhatsAppLink(
            clinicInfo.contact.whatsapp,
            message
        )

        window.open(whatsappLink, '_blank')
    }

    const handleAssinarAgora = () => {
        // Se estivermos na página de checkout, não fazemos nada
        if (pathname === '/assinatura') {
            return
        }

        // Navegação suave para a página de assinatura
        router.push('/assinatura')
    }

    const quickLinks = [
        { name: 'Assinar Agora', href: '/assinatura' },
        { name: 'Planos e Preços', href: '/assinatura' },
        { name: 'Como Funciona', href: '/sdd-framework' },
        { name: 'FAQ', href: '/sdd-framework#faq' },
        { name: 'Calculadora', href: '/calculadora' },
    ]

    const legalLinks = [
        {
            name: 'Política de Privacidade',
            action: () => setShowPrivacyPolicy(true)
        },
        {
            name: 'Configurações de Privacidade',
            action: () => setShowPrivacySettings(true)
        },
        {
            name: 'Meus Dados (LGPD)',
            action: () => setShowDataControl(true)
        },
        { name: 'Termos de Uso', href: '/termos-uso' },
    ]

    return (
        <footer className={`bg-medical-900 text-white ${className}`}>
            {/* Main Footer Content */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Company Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            {/* Logo */}
                            <div className="mb-4">
                                <LogoFooter />
                            </div>
                            <p className="text-lg text-gray-200 font-medium mb-3">
                                Pioneiro no Brasil em Assinatura de Lentes de Contato
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                Assinatura de lentes de contato com acompanhamento médico especializado.
                                Nunca mais fique sem lentes com a comodidade e segurança que você merece.
                            </p>
                        </div>

                        {/* Doctor Info */}
                        <div className="bg-medical-800 rounded-xl p-6 border border-medical-700">
                            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                                Responsável Técnico
                            </h4>
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-400 flex-shrink-0">
                                    <OptimizedImage
                                        src="/iconos/drphilipe_perfil.jpeg"
                                        alt="Dr. Philipe Saraiva Cruz"
                                        width={48}
                                        height={48}
                                        quality={85}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h5 className="font-semibold text-lg text-white mb-1">
                                        {doctorInfo.name}
                                    </h5>
                                    <p className="text-primary-400 font-medium mb-1">
                                        {doctorInfo.crm}
                                    </p>
                                    <p className="text-gray-300 text-sm mb-1">
                                        {doctorInfo.specialty}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {doctorInfo.experience}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact CTA */}
                        <div className="space-y-4">
                            <HeroSubscriptionButton
                                text="Assinar Agora"
                                className="w-full"
                                onClick={handleAssinarAgora}
                            />
                            <Button
                                onClick={handleWhatsAppContact}
                                variant="whatsapp"
                                className="w-full sm:w-auto flex items-center justify-center space-x-2"
                                aria-label="Falar com especialista pelo WhatsApp"
                            >
                                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                                <span>Falar com Especialista</span>
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg text-white mb-6 pb-2 border-b border-medical-700">
                            Navegação
                        </h4>
                        <nav aria-label="Links rápidos">
                            <ul className="space-y-3">
                                {quickLinks.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group text-sm"
                                        >
                                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></span>
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg text-white mb-6 pb-2 border-b border-medical-700">
                            Atendimento
                        </h4>
                        <div className="space-y-5">

                            {/* Address */}
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                                <address className="text-gray-300 text-sm not-italic">
                                    <p>{clinicInfo.address.street}</p>
                                    <p>{clinicInfo.address.neighborhood}</p>
                                    <p>{clinicInfo.address.city}, {clinicInfo.address.state}</p>
                                    <p>CEP: {clinicInfo.address.zipCode}</p>
                                </address>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" aria-hidden="true" />
                                <a
                                    href={`tel:${clinicInfo.contact.phone}`}
                                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm font-medium"
                                    aria-label={`Ligar para ${clinicInfo.contact.phone}`}
                                >
                                    {clinicInfo.contact.phone}
                                </a>
                            </div>

                            {/* Email */}
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" aria-hidden="true" />
                                <a
                                    href={`mailto:${clinicInfo.contact.email}`}
                                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm break-all"
                                    aria-label={`Enviar email para ${clinicInfo.contact.email}`}
                                >
                                    {clinicInfo.contact.email}
                                </a>
                            </div>

                            {/* Business Hours */}
                            <div className="flex items-start space-x-3">
                                <Clock className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                                <div className="text-gray-300 text-sm">
                                    <p className="font-medium mb-1">Horário de Atendimento:</p>
                                    <p>{clinicInfo.businessHours.weekdays}</p>
                                    <p>{clinicInfo.businessHours.saturday}</p>
                                    <p className="text-xs text-gray-400 mt-2 italic">
                                        {clinicInfo.businessHours.emergency}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coverage Banner */}
            <div className="bg-primary-600 py-4">
                <div className="container-custom">
                    <div className="flex items-center justify-center space-x-6 text-white">
                        <div className="flex items-center space-x-2">
                            <Shield className="w-5 h-5" />
                            <span className="font-medium">{clinicInfo.coverage.area}</span>
                        </div>
                        <div className="hidden md:block w-px h-6 bg-primary-400"></div>
                        <div className="hidden md:flex items-center space-x-2">
                            <span className="text-primary-100">{clinicInfo.coverage.shipping}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="bg-medical-800 border-t border-medical-700 py-6">
                <div className="container-custom">
                    <div className="bg-medical-900/50 rounded-lg p-6 border border-medical-700">
                        <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary-400" />
                            Responsabilidade Médica
                        </h3>
                        <div className="space-y-2 text-sm text-gray-300">
                            <p>
                                <strong className="text-white">Médico Responsável:</strong> {doctorInfo.name} - {doctorInfo.crm}
                            </p>
                            <p>
                                <strong className="text-white">Equipe Médica:</strong> {doctorInfo.crmEquipe}
                            </p>
                            <p className="text-gray-400 italic mt-3">
                                ⚕️ Serviço médico registrado no Conselho Regional de Medicina de Minas Gerais (CRM-MG).
                                Todas as prescrições de lentes de contato requerem avaliação oftalmológica prévia.
                                Este serviço não substitui consultas médicas regulares e exames oftalmológicos de rotina.
                            </p>
                            <p className="text-red-300 font-medium mt-3 bg-red-900/20 p-3 rounded border border-red-800">
                                ⚠️ <strong>Importante:</strong> Em caso de sintomas como dor ocular, vermelhidão intensa,
                                visão turva ou secreção, remova as lentes imediatamente e procure atendimento médico.
                                Emergências: <a href={`tel:${clinicInfo.contact.whatsapp}`} className="underline hover:no-underline font-bold">{clinicInfo.contact.phone}</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-medical-950 py-8">
                <div className="container-custom">
                    {/* Legal Links */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                        {legalLinks.map((link) => (
                            link.href ? (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center space-x-1.5 group"
                                >
                                    <FileText className="w-3.5 h-3.5 group-hover:text-primary-400 transition-colors" aria-hidden="true" />
                                    <span>{link.name}</span>
                                </a>
                            ) : (
                                <button
                                    key={link.name}
                                    onClick={link.action}
                                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center space-x-1.5 group"
                                >
                                    {link.name.includes('Configurações') ? (
                                        <Settings className="w-3.5 h-3.5 group-hover:text-primary-400 transition-colors" aria-hidden="true" />
                                    ) : (
                                        <FileText className="w-3.5 h-3.5 group-hover:text-primary-400 transition-colors" aria-hidden="true" />
                                    )}
                                    <span>{link.name}</span>
                                </button>
                            )
                        ))}
                    </div>

                    {/* Enhanced Trust Indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-6 pb-6 border-b border-medical-800">
                        {/* SSL Security Badge */}
                        <div className="ssl-badge-dark">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span>Site Seguro SSL</span>
                        </div>

                        {/* LGPD Compliance */}
                        <div className="flex items-center space-x-2 bg-green-900/30 border border-green-700/50 rounded-lg px-3 py-2 text-sm font-medium text-green-300">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span>LGPD Conforme</span>
                        </div>

                        {/* ANVISA */}
                        <div className="flex items-center space-x-2 bg-blue-900/30 border border-blue-700/50 rounded-lg px-3 py-2 text-sm font-medium text-blue-300">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 002.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Produtos ANVISA</span>
                        </div>

                        {/* Medical Council */}
                        <div className="flex items-center space-x-2 bg-purple-900/30 border border-purple-700/50 rounded-lg px-3 py-2 text-sm font-medium text-purple-300">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <span>CRM {doctorInfo.crm}</span>
                        </div>
                    </div>

                    {/* Copyright & Company Info */}
                    <div className="text-center space-y-2">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} SV Lentes. Todos os direitos reservados.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
                            <span>CNPJ: {clinicInfo.cnpj}</span>
                            <span aria-hidden="true">•</span>
                            <span>Responsável Técnico: {doctorInfo.crm}</span>
                            <span aria-hidden="true">•</span>
                            <span>Equipe: {doctorInfo.crmEquipe}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Modals */}
            <PrivacyPolicy
                isOpen={showPrivacyPolicy}
                onClose={() => setShowPrivacyPolicy(false)}
            />
            <PrivacySettings
                isOpen={showPrivacySettings}
                onClose={() => setShowPrivacySettings(false)}
            />
            <DataControlPanel
                isOpen={showDataControl}
                onClose={() => setShowDataControl(false)}
            />
        </footer>
    )
}
