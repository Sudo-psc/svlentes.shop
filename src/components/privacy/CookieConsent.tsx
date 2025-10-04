'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true, // Always required
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAcceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true,
        };

        saveCookiePreferences(allAccepted);
        setIsVisible(false);
    };

    const handleAcceptSelected = () => {
        saveCookiePreferences(preferences);
        setIsVisible(false);
    };

    const handleRejectAll = () => {
        const onlyNecessary = {
            necessary: true,
            analytics: false,
            marketing: false,
        };

        saveCookiePreferences(onlyNecessary);
        setIsVisible(false);
    };

    const saveCookiePreferences = (prefs: CookiePreferences) => {
        const consentData = {
            preferences: prefs,
            timestamp: new Date().toISOString(),
            version: '1.0',
        };

        localStorage.setItem('cookie-consent', JSON.stringify(consentData));

        // Dispatch event for analytics initialization
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
            detail: prefs
        }));
    };

    const handlePreferenceChange = (type: keyof CookiePreferences, checked: boolean) => {
        if (type === 'necessary') return; // Cannot disable necessary cookies

        setPreferences(prev => ({
            ...prev,
            [type]: checked
        }));
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-7xl mx-auto p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Utilizamos cookies para melhorar sua experiência
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 lg:mb-0">
                            Utilizamos cookies essenciais para o funcionamento do site e cookies opcionais
                            para análise e marketing. Você pode escolher quais aceitar.
                        </p>

                        {showDetails && (
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="necessary"
                                        checked={preferences.necessary}
                                        disabled
                                    />
                                    <Label htmlFor="necessary" className="text-sm">
                                        <strong>Cookies Necessários</strong> - Essenciais para o funcionamento do site
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="analytics"
                                        checked={preferences.analytics}
                                        onCheckedChange={(checked) => handlePreferenceChange('analytics', checked as boolean)}
                                    />
                                    <Label htmlFor="analytics" className="text-sm">
                                        <strong>Cookies de Análise</strong> - Nos ajudam a entender como você usa o site
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="marketing"
                                        checked={preferences.marketing}
                                        onCheckedChange={(checked) => handlePreferenceChange('marketing', checked as boolean)}
                                    />
                                    <Label htmlFor="marketing" className="text-sm">
                                        <strong>Cookies de Marketing</strong> - Para personalizar anúncios e comunicações
                                    </Label>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                        {!showDetails ? (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDetails(true)}
                                >
                                    Personalizar
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRejectAll}
                                >
                                    Rejeitar Opcionais
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleAcceptAll}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Aceitar Todos
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDetails(false)}
                                >
                                    Voltar
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleAcceptSelected}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Salvar Preferências
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}