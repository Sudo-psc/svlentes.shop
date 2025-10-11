'use client'

import { useState } from 'react'
import { Eye, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface LensData {
    type: 'monthly'
    brand: string
    userStatus: 'has-prescription' | 'no-lenses' | 'no-prescription'
    rightEye: {
        sphere: string
        cylinder: string
        axis: string
    }
    leftEye: {
        sphere: string
        cylinder: string
        axis: string
    }
}

interface LensSelectorProps {
    onContinue: (data: LensData) => void
    onBack: () => void
    onScheduleConsultation: () => void
}

const userStatusOptions = [
    {
        id: 'has-prescription',
        name: 'Já uso lentes e sei meu grau',
        description: 'Tenho minha receita em mãos',
        needsConsultation: false
    },
    {
        id: 'no-lenses',
        name: 'Não uso lentes de contato',
        description: 'Preciso de avaliação médica',
        needsConsultation: true
    },
    {
        id: 'no-prescription',
        name: 'Uso lentes mas não sei meu grau',
        description: 'Preciso atualizar minha receita',
        needsConsultation: true
    }
]

const popularBrands = [
    'Acuvue',
    'Biofinity',
    'Air Optix',
    'Bausch + Lomb',
    'CooperVision',
    'Outra marca'
]

export function LensSelector({ onContinue, onBack, onScheduleConsultation }: LensSelectorProps) {
    const [lensData, setLensData] = useState<LensData>({
        type: 'monthly',
        brand: '',
        userStatus: 'has-prescription',
        rightEye: { sphere: '', cylinder: '', axis: '' },
        leftEye: { sphere: '', cylinder: '', axis: '' }
    })

    const [sameForBothEyes, setSameForBothEyes] = useState(false)

    const handleStatusSelect = (status: 'has-prescription' | 'no-lenses' | 'no-prescription') => {
        setLensData(prev => ({ ...prev, userStatus: status }))

        // Se o usuário não tem lentes ou não sabe o grau, redirecionar para agendamento
        const selectedOption = userStatusOptions.find(opt => opt.id === status)
        if (selectedOption?.needsConsultation) {
            setTimeout(() => {
                onScheduleConsultation()
            }, 500)
        }
    }

    const handleRightEyeChange = (field: keyof LensData['rightEye'], value: string) => {
        setLensData(prev => ({
            ...prev,
            rightEye: { ...prev.rightEye, [field]: value },
            ...(sameForBothEyes && { leftEye: { ...prev.rightEye, [field]: value } })
        }))
    }

    const handleLeftEyeChange = (field: keyof LensData['leftEye'], value: string) => {
        setLensData(prev => ({
            ...prev,
            leftEye: { ...prev.leftEye, [field]: value }
        }))
    }

    const isValid = () => {
        return (
            lensData.brand &&
            lensData.rightEye.sphere &&
            lensData.leftEye.sphere
        )
    }

    const showPrescriptionForm = lensData.userStatus === 'has-prescription'
    const needsConsultation = userStatusOptions.find(opt => opt.id === lensData.userStatus)?.needsConsultation

    return (
        <div className="space-y-8">
            {/* User Status Selection */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Qual é a sua situação?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Selecione a opção que melhor descreve você
                </p>
                <div className="space-y-3">
                    {userStatusOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleStatusSelect(option.id as any)}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${lensData.userStatus === option.id
                                    ? 'border-primary-600 bg-primary-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="font-semibold text-gray-900 mb-1">
                                {option.name}
                            </div>
                            <div className="text-sm text-gray-600">
                                {option.description}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Info about monthly lenses */}
            {showPrescriptionForm && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-primary-900">
                            <p className="font-medium mb-1">Lentes de Troca Mensal</p>
                            <p className="text-primary-700">
                                Nosso serviço trabalha exclusivamente com lentes de troca mensal,
                                que oferecem o melhor custo-benefício e são mais sustentáveis.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Brand Selection - Only show if has prescription */}
            {showPrescriptionForm && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Marca Atual (opcional)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {popularBrands.map((brand) => (
                            <button
                                key={brand}
                                onClick={() => setLensData(prev => ({ ...prev, brand }))}
                                className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${lensData.brand === brand
                                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Prescription - Only show if has prescription */}
            {showPrescriptionForm && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Grau das Lentes
                        </h3>
                        <button
                            onClick={() => setSameForBothEyes(!sameForBothEyes)}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            {sameForBothEyes ? 'Graus diferentes' : 'Mesmo grau para ambos'}
                        </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                            <p className="font-medium mb-1">Encontre seu grau na receita</p>
                            <p className="text-blue-700">
                                Esférico (ESF), Cilíndrico (CIL) e Eixo são os valores principais.
                                Se não tiver certeza, podemos ajudar na consulta.
                            </p>
                        </div>
                    </div>

                    {/* Right Eye */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-3">
                            <Eye className="w-5 h-5 text-gray-600" />
                            <h4 className="font-semibold text-gray-900">Olho Direito (OD)</h4>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <Input
                                label="Esférico"
                                placeholder="-2.00"
                                value={lensData.rightEye.sphere}
                                onChange={(e) => handleRightEyeChange('sphere', e.target.value)}
                            />
                            <Input
                                label="Cilíndrico"
                                placeholder="-0.75"
                                value={lensData.rightEye.cylinder}
                                onChange={(e) => handleRightEyeChange('cylinder', e.target.value)}
                            />
                            <Input
                                label="Eixo"
                                placeholder="180"
                                value={lensData.rightEye.axis}
                                onChange={(e) => handleRightEyeChange('axis', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Left Eye */}
                    {!sameForBothEyes && (
                        <div>
                            <div className="flex items-center space-x-2 mb-3">
                                <Eye className="w-5 h-5 text-gray-600" />
                                <h4 className="font-semibold text-gray-900">Olho Esquerdo (OE)</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <Input
                                    label="Esférico"
                                    placeholder="-2.00"
                                    value={lensData.leftEye.sphere}
                                    onChange={(e) => handleLeftEyeChange('sphere', e.target.value)}
                                />
                                <Input
                                    label="Cilíndrico"
                                    placeholder="-0.75"
                                    value={lensData.leftEye.cylinder}
                                    onChange={(e) => handleLeftEyeChange('cylinder', e.target.value)}
                                />
                                <Input
                                    label="Eixo"
                                    placeholder="180"
                                    value={lensData.leftEye.axis}
                                    onChange={(e) => handleLeftEyeChange('axis', e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex space-x-4">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex-1"
                >
                    Voltar
                </Button>
                {showPrescriptionForm ? (
                    <Button
                        onClick={() => onContinue(lensData)}
                        disabled={!isValid()}
                        className="flex-1"
                    >
                        Continuar
                    </Button>
                ) : (
                    <Button
                        onClick={onScheduleConsultation}
                        className="flex-1"
                    >
                        Agendar Consulta
                    </Button>
                )}
            </div>
        </div>
    )
}
