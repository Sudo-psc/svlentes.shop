'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { generateWhatsAppLink } from '@/lib/utils'
import { doctorInfo, clinicInfo } from '@/data/doctor-info'
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

    const handleWhatsAppContact = () => {
        const message = `Olá! Entrei em contato através do site LAAS e gostaria de mais informações sobre o serviço de assinatura de lentes de contato com acompanhamento médico.`

        const whatsappLink = generateWhatsAppLink(
            clinicInfo.contact.whatsapp,
            message
        )

        window.open(whatsappLink, '_blank')
    }

    const quickLinks = [
        { name: 'Planos e Preços', href: '#planos-precos' },
        { name: 'Como Funciona', href: '#como-funciona' },
        { name: 'FAQ', href: '#perguntas-frequentes' },
        { name: 'Programa de Indicação', href: '#programa-indicacao' },
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <h3 className="text-3xl font-bold text-gradient mb-2">LAAS</h3>
                            <p className="text-lg text-gray-300 mb-4">
                                Lens as a Service - Pioneiro no Brasil
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                                Assinatura de lentes de contato com acompanhamento médico especializado.
                                Nunca mais fique sem lentes com a comodidade e segurança que você merece.
                            </p>
                        </div>

                        {/* Doctor Info */}
                        <div className="bg-medical-800 rounded-lg p-6 mb-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg text-white mb-1">
                                        {doctorInfo.name}
                                    </h4>
                                    <p className="text-primary-400 font-medium mb-1">
                                        {doctorInfo.crm} | {doctorInfo.specialty}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {doctorInfo.experience}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact CTA */}
                        <Button
                            onClick={handleWhatsAppContact}
                            variant="whatsapp"
                            className="flex items-center space-x-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>Falar com Especialista</span>
                        </Button>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Links Rápidos</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary-400 transition-colors duration-200 flex items-center group"
                                    >
                                        <span className="w-1 h-1 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Contato</h4>
                        <div className="space-y-4">

                            {/* Address */}
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                <div className="text-gray-400 text-sm">
                                    <p>{clinicInfo.address.street}</p>
                                    <p>{clinicInfo.address.neighborhood}</p>
                                    <p>{clinicInfo.address.city}, {clinicInfo.address.state}</p>
                                    <p>CEP: {clinicInfo.address.zipCode}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                <a
                                    href={`tel:${clinicInfo.contact.phone}`}
                                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                                >
                                    {clinicInfo.contact.phone}
                                </a>
                            </div>

                            {/* Email */}
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                <a
                                    href={`mailto:${clinicInfo.contact.email}`}
                                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                                >
                                    {clinicInfo.contact.email}
                                </a>
                            </div>

                            {/* Business Hours */}
                            <div className="flex items-start space-x-3">
                                <Clock className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                <div className="text-gray-400 text-sm">
                                    <p>{clinicInfo.businessHours.weekdays}</p>
                                    <p>{clinicInfo.businessHours.saturday}</p>
                                    <p className="text-xs text-gray-500 mt-1">
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

            {/* Bottom Bar */}
            <div className="bg-medical-950 py-6">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">

                        {/* Copyright */}
                        <div className="text-gray-400 text-sm text-center md:text-left">
                            <p>© {currentYear} LAAS - Lens as a Service. Todos os direitos reservados.</p>
                            <p className="text-xs mt-1">
                                CNPJ: {clinicInfo.cnpj} | {doctorInfo.crm} | {doctorInfo.crmEquipe}
                            </p>
                        </div>

                        {/* Legal Links */}
                        <div className="flex flex-wrap items-center justify-center space-x-6">
                            {legalLinks.map((link) => (
                                link.href ? (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary-400 transition-colors text-xs flex items-center space-x-1"
                                    >
                                        <FileText className="w-3 h-3" />
                                        <span>{link.name}</span>
                                    </a>
                                ) : (
                                    <button
                                        key={link.name}
                                        onClick={link.action}
                                        className="text-gray-400 hover:text-primary-400 transition-colors text-xs flex items-center space-x-1"
                                    >
                                        {link.name.includes('Configurações') ? (
                                            <Settings className="w-3 h-3" />
                                        ) : (
                                            <FileText className="w-3 h-3" />
                                        )}
                                        <span>{link.name}</span>
                                    </button>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-6 pt-6 border-t border-medical-800">
                        <div className="flex items-center justify-center space-x-8 text-xs text-gray-500">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Site Seguro SSL</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Conformidade LGPD</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>Produtos ANVISA</span>
                            </div>
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