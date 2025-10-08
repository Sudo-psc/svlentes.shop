'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    resolvedTheme: 'light' | 'dark'
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('system')
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
    const [mounted, setMounted] = useState(false)

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        const stored = localStorage.getItem('theme') as Theme | null
        if (stored) {
            setTheme(stored)
        }
        setMounted(true)
    }, [])

    // Apply theme and listen for system changes
    useEffect(() => {
        const root = window.document.documentElement

        const applyTheme = (themeToApply: 'light' | 'dark') => {
            root.classList.remove('light', 'dark')
            root.classList.add(themeToApply)
            setResolvedTheme(themeToApply)
        }

        if (theme === 'system') {
            const systemTheme = getSystemTheme()
            applyTheme(systemTheme)

            // Listen for system theme changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const handleChange = (e: MediaQueryListEvent) => {
                applyTheme(e.matches ? 'dark' : 'light')
            }

            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        } else {
            applyTheme(theme)
        }

        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((current) => {
            if (current === 'system') {
                return resolvedTheme === 'dark' ? 'light' : 'dark'
            }
            return current === 'dark' ? 'light' : 'dark'
        })
    }

    // Prevent flash of wrong theme
    if (!mounted) {
        return <>{children}</>
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}
