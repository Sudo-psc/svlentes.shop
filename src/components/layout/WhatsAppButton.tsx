'use client'

import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
    const handleClick = () => {
        const phoneNumber = '5533998765432' // Número do WhatsApp
        const message = encodeURIComponent('Olá! Gostaria de saber mais sobre a assinatura de lentes.')
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
    }

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
            aria-label="Falar no WhatsApp"
        >
            <MessageCircle className="w-7 h-7" />
        </button>
    )
}
