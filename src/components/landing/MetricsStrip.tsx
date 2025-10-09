'use client'

import { Shield, Lock, Star, Users } from 'lucide-react'

const metrics = [
    {
        icon: Shield,
        label: 'CRM-MG 69.970',
        description: 'Médico registrado'
    },
    {
        icon: Lock,
        label: 'LGPD compliant',
        description: 'Seus dados protegidos'
    },
    {
        icon: Star,
        label: '4.7/5',
        description: 'Avaliação Google',
        stars: 5
    },
    {
        icon: Users,
        label: '+250 pacientes',
        description: 'Pacientes ativos'
    }
]

export function MetricsStrip() {
    return (
        <section className="bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700 py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center space-y-2"
                            >
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-gray-900 dark:text-white flex items-center justify-center gap-1">
                                        {metric.label}
                                        {metric.stars && (
                                            <div className="flex ml-1">
                                                {Array.from({ length: metric.stars }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {metric.description}
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
