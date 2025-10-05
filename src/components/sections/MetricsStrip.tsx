'use client'

import { InlineTrustIndicators } from '@/components/trust/TrustBadges'
import { socialProofStats } from '@/data/trust-indicators'

interface MetricsStripProps {
    className?: string
}

export function MetricsStrip({ className = '' }: MetricsStripProps) {
    return (
        <section className={`bg-gradient-to-r from-primary-50 to-secondary-50 py-12 ${className}`}>
            <div className="container-custom">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-primary-100 shadow-lg">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {socialProofStats.map((stat) => (
                            <div
                                key={stat.id}
                                className="text-center group p-2 sm:p-0"
                            >
                                <div className="flex items-center justify-center space-x-1 mb-2">
                                    <span className="text-xl sm:text-2xl">{stat.icon}</span>
                                    <span className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                                        {stat.value}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-primary-100">
                        <InlineTrustIndicators className="justify-center" />
                    </div>
                </div>
            </div>
        </section>
    )
}
