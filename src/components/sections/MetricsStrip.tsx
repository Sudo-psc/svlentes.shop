'use client'

import { Shield, CheckCircle, Star, Users } from 'lucide-react'

interface MetricsStripProps {
    className?: string
}

export function MetricsStrip({ className = '' }: MetricsStripProps) {
    const badges = [
        {
            icon: Shield,
            label: 'CRM-MG 69.870',
            description: 'Médico responsável: Dr. Philipe Saraiva Cruz'
        },
        {
            icon: CheckCircle,
            label: 'LGPD compliant',
            description: 'Seus dados protegidos e seguros'
        },
        {
            icon: Star,
            label: '4.7/5 (Google)',
            description: 'Avaliação média dos pacientes'
        },
        {
            icon: Users,
            label: '+250 pacientes ativos',
            description: 'Confiam em nosso serviço'
        }
    ]

    return (
        <section className={`bg-white border-y border-gray-200 py-8 ${className}`}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {badges.map((badge, index) => {
                        const Icon = badge.icon
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Icon className="w-8 h-8 text-green-600 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">
                                        {badge.label}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {badge.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
