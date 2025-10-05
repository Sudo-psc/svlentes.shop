'use client'

import { useState, useEffect } from 'react'
import { Calculator, TrendingDown, Save, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CalculatorResult {
    currentSpending: number
    svlentesPrice: number
    monthlySavings: number
    annualSavings: number
    savingsPercentage: number
}

interface ImprovedCalculatorProps {
    onSaveResult?: (result: CalculatorResult) => void
}

const lensTypePrices = {
    daily: { market: 180, svlentes: 120 },
    weekly: { market: 140, svlentes: 95 },
    monthly: { market: 100, svlentes: 70 }
}

export function ImprovedCalculator({ onSaveResult }: ImprovedCalculatorProps) {
    const [lensType, setLensType] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
    const [currentSpending, setCurrentSpending] = useState(100)
    const [result, setResult] = useState<CalculatorResult | null>(null)

    // Calcular automaticamente quando mudar tipo ou valor
    useEffect(() => {
        calculateEconomy()
    }, [lensType, currentSpending])

    const calculateEconomy = () => {
        const svlentesPrice = lensTypePrices[lensType].svlentes
        const monthlySavings = currentSpending - svlentesPrice
        const annualSavings = monthlySavings * 12
        const savingsPercentage = (monthlySavings / currentSpending) * 100

        const calculationResult: CalculatorResult = {
            currentSpending,
            svlentesPrice,
            monthlySavings,
            annualSavings,
            savingsPercentage
        }

        setResult(calculationResult)
    }

    const handleSaveResult = () => {
        if (result && onSaveResult) {
            onSaveResult(result)
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Calculadora de Economia</h3>
                        <p className="text-primary-100 text-sm">Veja quanto você economiza em tempo real</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Lens Type Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Tipo de lente que você usa
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { value: 'daily', label: 'Diárias', price: lensTypePrices.daily.market },
                            { value: 'weekly', label: 'Semanais', price: lensTypePrices.weekly.market },
                            { value: 'monthly', label: 'Mensais', price: lensTypePrices.monthly.market }
                        ].map((type) => (
                            <button
                                key={type.value}
                                onClick={() => {
                                    setLensType(type.value as any)
                                    setCurrentSpending(type.price)
                                }}
                                className={`p-4 rounded-lg border-2 transition-all ${lensType === type.value
                                        ? 'border-primary-600 bg-primary-50 shadow-md'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="font-semibold text-gray-900 mb-1">
                                    {type.label}
                                </div>
                                <div className="text-xs text-gray-600">
                                    ~R$ {type.price}/mês
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Spending Slider */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold text-gray-900">
                            Quanto você gasta por mês?
                        </label>
                        <div className="text-2xl font-bold text-primary-600">
                            R$ {currentSpending}
                        </div>
                    </div>
                    <input
                        type="range"
                        min="50"
                        max="300"
                        step="10"
                        value={currentSpending}
                        onChange={(e) => setCurrentSpending(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((currentSpending - 50) / 250) * 100}%, #e5e7eb ${((currentSpending - 50) / 250) * 100}%, #e5e7eb 100%)`
                        }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>R$ 50</span>
                        <span>R$ 300</span>
                    </div>
                </div>

                {/* Results */}
                {result && result.monthlySavings > 0 && (
                    <div className="space-y-4">
                        {/* Main Result */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                    <TrendingDown className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-green-700 font-medium">Sua economia mensal</p>
                                    <p className="text-3xl font-bold text-green-900">
                                        R$ {result.monthlySavings.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-gray-600 mb-1">Economia anual</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        R$ {result.annualSavings.toFixed(2)}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-gray-600 mb-1">Você economiza</p>
                                    <p className="text-xl font-bold text-green-600">
                                        {result.savingsPercentage.toFixed(0)}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Comparison */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">Seu gasto atual</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        R$ {result.currentSpending}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">por mês</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">Com SV Lentes</p>
                                    <p className="text-2xl font-bold text-primary-600">
                                        R$ {result.svlentesPrice}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">por mês</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleSaveResult}
                                className="w-full flex items-center justify-center space-x-2 text-base py-6"
                                size="lg"
                            >
                                <Save className="w-5 h-5" />
                                <span>Salvar Resultado e Continuar</span>
                            </Button>
                            <p className="text-xs text-center text-gray-500">
                                Salve seu cálculo e escolha o melhor plano para você
                            </p>
                        </div>
                    </div>
                )}

                {result && result.monthlySavings <= 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            Ajuste o valor do seu gasto atual para ver a economia com SV Lentes
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
