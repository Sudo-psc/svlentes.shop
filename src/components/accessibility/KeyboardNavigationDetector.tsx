'use client'

import { useEffect } from 'react'

export function KeyboardNavigationDetector() {
    useEffect(() => {
        function handleFirstTab(e: KeyboardEvent) {
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing')
                window.removeEventListener('keydown', handleFirstTab)
                window.addEventListener('mousedown', handleMouseDownOnce)
            }
        }

        function handleMouseDownOnce() {
            document.body.classList.remove('user-is-tabbing')
            window.removeEventListener('mousedown', handleMouseDownOnce)
            window.addEventListener('keydown', handleFirstTab)
        }

        window.addEventListener('keydown', handleFirstTab)

        return () => {
            window.removeEventListener('keydown', handleFirstTab)
            window.removeEventListener('mousedown', handleMouseDownOnce)
        }
    }, [])

    return null
}
