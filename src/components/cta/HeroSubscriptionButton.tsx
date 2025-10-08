'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CreditCard } from 'lucide-react'

interface HeroSubscriptionButtonProps {
    className?: string
    text?: string
    planId?: string
    billingCycle?: 'monthly' | 'annual'
}

export function HeroSubscriptionButton({
    className = '',
    text = 'Começar Minha Assinatura',
    planId,
    billingCycle = 'monthly',
    onClick
}: HeroSubscriptionButtonProps & {
    onClick?: () => void
}) {
    const router = useRouter()
    const pathname = usePathname()

    const handleAssinarAgora = () => {
        // Se estivermos na página de checkout, não fazemos nada
        if (pathname === '/assinatura') {
            return
        }

        // Se houver onClick personalizado, usa-o
        if (onClick) {
            onClick()
            return
        }

        // Navegação suave para a página de assinatura
        router.push('/assinatura')
    }

    return (
        <Button
            onClick={handleAssinarAgora}
            size="lg"
            className={`font-bold text-lg px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all ${className}`}
        >
            <CreditCard className="w-5 h-5 mr-3" />
            {text}
        </Button>
    )
}
