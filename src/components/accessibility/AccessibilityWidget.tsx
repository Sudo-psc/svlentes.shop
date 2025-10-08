'use client'

import { useState, useEffect } from 'react'
import { X, Settings, Type, Eye, MousePointer, Contrast } from 'lucide-react'

interface AccessibilitySettings {
    fontSize: number
    lineHeight: number
    letterSpacing: number
    highContrast: boolean
    grayscale: boolean
    highlightLinks: boolean
    cursorSize: 'normal' | 'large' | 'extra-large'
    reducedMotion: boolean
}

const defaultSettings: AccessibilitySettings = {
    fontSize: 100,
    lineHeight: 1.5,
    letterSpacing: 0,
    highContrast: false,
    grayscale: false,
    highlightLinks: false,
    cursorSize: 'normal',
    reducedMotion: false,
}

export function AccessibilityWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

    // Load settings from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('accessibility-settings')
        if (saved) {
            setSettings(JSON.parse(saved))
        }
    }, [])

    // Apply settings to document
    useEffect(() => {
        const root = document.documentElement

        // Font size
        root.style.fontSize = `${settings.fontSize}%`

        // Line height
        root.style.setProperty('--line-height', settings.lineHeight.toString())

        // Letter spacing
        root.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`)

        // High contrast
        if (settings.highContrast) {
            root.classList.add('high-contrast')
        } else {
            root.classList.remove('high-contrast')
        }

        // Grayscale
        if (settings.grayscale) {
            root.classList.add('grayscale')
        } else {
            root.classList.remove('grayscale')
        }

        // Highlight links
        if (settings.highlightLinks) {
            root.classList.add('highlight-links')
        } else {
            root.classList.remove('highlight-links')
        }

        // Cursor size
        root.classList.remove('cursor-large', 'cursor-extra-large')
        if (settings.cursorSize === 'large') {
            root.classList.add('cursor-large')
        } else if (settings.cursorSize === 'extra-large') {
            root.classList.add('cursor-extra-large')
        }

        // Reduced motion
        if (settings.reducedMotion) {
            root.classList.add('reduce-motion')
        } else {
            root.classList.remove('reduce-motion')
        }

        // Save to localStorage
        localStorage.setItem('accessibility-settings', JSON.stringify(settings))
    }, [settings])

    const updateSetting = <K extends keyof AccessibilitySettings>(
        key: K,
        value: AccessibilitySettings[K]
    ) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const resetSettings = () => {
        setSettings(defaultSettings)
        localStorage.removeItem('accessibility-settings')
    }

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/50"
                aria-label="Abrir opções de acessibilidade"
                aria-expanded={isOpen}
            >
                <Settings className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Widget Panel */}
            {isOpen && (
                <div
                    className="fixed bottom-20 right-4 z-50 w-80 max-h-[80vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700"
                    role="dialog"
                    aria-label="Painel de acessibilidade"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Acessibilidade
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Fechar painel"
                        >
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="p-4 space-y-6">
                        {/* Font Size */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Type className="h-4 w-4" aria-hidden="true" />
                                Tamanho do Texto: {settings.fontSize}%
                            </label>
                            <input
                                type="range"
                                min="80"
                                max="150"
                                step="10"
                                value={settings.fontSize}
                                onChange={(e) => updateSetting('fontSize', Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                aria-label="Ajustar tamanho do texto"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span>80%</span>
                                <span>150%</span>
                            </div>
                        </div>

                        {/* Line Height */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Espaçamento entre Linhas: {settings.lineHeight.toFixed(1)}
                            </label>
                            <input
                                type="range"
                                min="1.2"
                                max="2.5"
                                step="0.1"
                                value={settings.lineHeight}
                                onChange={(e) => updateSetting('lineHeight', Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                aria-label="Ajustar espaçamento entre linhas"
                            />
                        </div>

                        {/* Letter Spacing */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Espaçamento entre Letras: {settings.letterSpacing}px
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="5"
                                step="0.5"
                                value={settings.letterSpacing}
                                onChange={(e) => updateSetting('letterSpacing', Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                aria-label="Ajustar espaçamento entre letras"
                            />
                        </div>

                        {/* High Contrast */}
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Contrast className="h-4 w-4" aria-hidden="true" />
                                Alto Contraste
                            </span>
                            <input
                                type="checkbox"
                                checked={settings.highContrast}
                                onChange={(e) => updateSetting('highContrast', e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                aria-label="Ativar alto contraste"
                            />
                        </label>

                        {/* Grayscale */}
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Eye className="h-4 w-4" aria-hidden="true" />
                                Escala de Cinza
                            </span>
                            <input
                                type="checkbox"
                                checked={settings.grayscale}
                                onChange={(e) => updateSetting('grayscale', e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                aria-label="Ativar escala de cinza"
                            />
                        </label>

                        {/* Highlight Links */}
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Destacar Links
                            </span>
                            <input
                                type="checkbox"
                                checked={settings.highlightLinks}
                                onChange={(e) => updateSetting('highlightLinks', e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                aria-label="Destacar links"
                            />
                        </label>

                        {/* Cursor Size */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <MousePointer className="h-4 w-4" aria-hidden="true" />
                                Tamanho do Cursor
                            </label>
                            <div className="space-y-2">
                                {(['normal', 'large', 'extra-large'] as const).map((size) => (
                                    <label key={size} className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="cursorSize"
                                            value={size}
                                            checked={settings.cursorSize === size}
                                            onChange={(e) => updateSetting('cursorSize', e.target.value as any)}
                                            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            {size === 'normal' && 'Normal'}
                                            {size === 'large' && 'Grande'}
                                            {size === 'extra-large' && 'Extra Grande'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Reduced Motion */}
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Reduzir Animações
                            </span>
                            <input
                                type="checkbox"
                                checked={settings.reducedMotion}
                                onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                aria-label="Reduzir animações"
                            />
                        </label>

                        {/* Reset Button */}
                        <button
                            onClick={resetSettings}
                            className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                        >
                            Restaurar Padrões
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
