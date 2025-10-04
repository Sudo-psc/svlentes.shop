import { Badge } from '@/components/ui/Badge'
import { trustBadges } from '@/data/trust-indicators'
import { Shield, CheckCircle } from 'lucide-react'

interface TrustBadgesProps {
    variant?: 'horizontal' | 'vertical' | 'grid'
    showIcons?: boolean
    className?: string
}

export function TrustBadges({
    variant = 'horizontal',
    showIcons = true,
    className = ''
}: TrustBadgesProps) {
    const layoutClasses = {
        horizontal: 'flex flex-wrap items-center gap-3',
        vertical: 'flex flex-col space-y-3',
        grid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3'
    }

    return (
        <div className={`${layoutClasses[variant]} ${className}`}>
            {trustBadges.map((badge) => (
                <div
                    key={badge.id}
                    className="flex items-center space-x-2 group"
                >
                    {showIcons && (
                        <div className="flex items-center space-x-1">
                            <span className="text-lg">{badge.icon}</span>
                            {badge.verified && (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                            )}
                        </div>
                    )}

                    <Badge
                        variant="success"
                        size="sm"
                        className={`${badge.color} transition-all duration-200 group-hover:scale-105`}
                    >
                        {badge.name}
                    </Badge>
                </div>
            ))}
        </div>
    )
}

// Componente para indicadores de confiança em linha
export function InlineTrustIndicators({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center space-x-4 text-sm text-gray-600 ${className}`}>
            <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span>ANVISA</span>
            </div>
            <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>CRM 65.870</span>
            </div>
            <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Pioneiro no Brasil</span>
            </div>
        </div>
    )
}