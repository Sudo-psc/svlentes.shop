'use client'

import { InlineTrustIndicators } from '@/components/trust/TrustBadges'
import { socialProofStats } from '@/data/trust-indicators'

interface MetricsStripProps {
    className?: string
}

export function MetricsStrip({ className = '' }: MetricsStripProps) {
    return (
        <section className={`bg-gradient-to-r from-primary-50 via-white to-secondary-50 py-16 sm:py-20 ${className}`}>
            <div className="container-custom">
                <div className="bg-white backdrop-blur-sm rounded-3xl p-10 sm:p-12 border-2 border-primary-100 shadow-2xl">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
                        {socialProofStats.map((stat) => (
                            <div
                                key={stat.id}
                                className="text-center group p-4 rounded-xl hover:bg-primary-50/50 transition-all duration-300"
                            >
                                <div className="flex items-center justify-center space-x-2 mb-3">
                                    <span className="text-2xl sm:text-3xl">{stat.icon}</span>
                                    <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 group-hover:text-primary-700 transition-colors">
                                        {stat.value}
                                    </span>
                                </div>
                                <p className="text-sm sm:text-base text-gray-700 font-semibold leading-tight">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 pt-10 border-t-2 border-primary-100">
                        <InlineTrustIndicators className="justify-center" />
                    </div>
                </div>
            </div>
        </section>
    )
}
