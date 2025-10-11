'use client'

import { useTheme } from './ThemeProvider'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()

    return (
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-md transition-colors ${theme === 'light'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                aria-label="Modo claro"
                title="Modo claro"
            >
                <SunIcon className="w-5 h-5" />
            </button>
            <button
                onClick={() => setTheme('system')}
                className={`p-2 rounded-md transition-colors ${theme === 'system'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                aria-label="Modo automático"
                title="Modo automático"
            >
                <ComputerDesktopIcon className="w-5 h-5" />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-md transition-colors ${theme === 'dark'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                aria-label="Modo escuro"
                title="Modo escuro"
            >
                <MoonIcon className="w-5 h-5" />
            </button>
        </div>
    )
}

export function ThemeToggleSimple() {
    const { toggleTheme, resolvedTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            aria-label={`Mudar para modo ${resolvedTheme === 'dark' ? 'claro' : 'escuro'}`}
            title={`Mudar para modo ${resolvedTheme === 'dark' ? 'claro' : 'escuro'}`}
        >
            {resolvedTheme === 'dark' ? (
                <SunIcon className="w-5 h-5 text-foreground" />
            ) : (
                <MoonIcon className="w-5 h-5 text-foreground" />
            )}
        </button>
    )
}
