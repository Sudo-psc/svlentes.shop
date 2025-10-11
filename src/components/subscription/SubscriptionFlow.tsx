'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlanSelector } from './PlanSelector'
import { LensSelector } from './LensSelector'
import { AddOnsSelector } from './AddOnsSelector'
import { OrderSummary } from './OrderSummary'
import { Check } from 'lucide-react'

type FlowStep = 'plan' | 'lens' | 'addons' | 'summary'

interface FlowData {
    planId: string | null
    billingCycle: 'monthly' | 'annual'
    lensData: any
    addOns: string[]
}

interface SubscriptionFlowProps {
    onConfirm?: (data: any) => void
    onBack?: () => void
}

export function SubscriptionFlow({ onConfirm, onBack }: SubscriptionFlowProps) {
    const [currentStep, setCurrentStep] = useState<FlowStep>('plan')
    const [flowData, setFlowData] = useState<FlowData>({
        planId: null,
        billingCycle: 'monthly',
        lensData: null,
        addOns: []
    })
    const router = useRouter()

    const steps = [
        { id: 'plan', label: 'Plano', number: 1 },
        { id: 'lens', label: 'Lentes', number: 2 },
        { id: 'addons', label: 'Add-ons', number: 3 },
        { id: 'summary', label: 'Resumo', number: 4 }
    ]

    const currentStepIndex = steps.findIndex(s => s.id === currentStep)

    const handlePlanSelect = (planId: string, billingCycle: 'monthly' | 'annual') => {
        setFlowData(prev => ({ ...prev, planId, billingCycle }))
        setCurrentStep('lens')
    }

    const handleLensSelect = (lensData: any) => {
        setFlowData(prev => ({ ...prev, lensData }))
        setCurrentStep('addons')
    }

    const handleAddOnsSelect = (addOns: string[]) => {
        setFlowData(prev => ({ ...prev, addOns }))
        setCurrentStep('summary')
    }

    const handleConfirm = async (contactData: any) => {
        console.log('Order confirmed:', { ...flowData, contactData })

        // Chamar função externa se existir
        if (onConfirm) {
            onConfirm({ ...flowData, contactData })
        } else {
            // Redirecionar para página de sucesso
            router.push('/agendar-confirmado')
        }
    }

    const handleBack = () => {
        // Chamar função externa se existir
        if (onBack) {
            onBack()
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        {steps.map((step, index) => {
                            const isCompleted = index < currentStepIndex
                            const isCurrent = step.id === currentStep
                            const isLast = index === steps.length - 1

                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    {/* Step Circle */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${isCompleted
                                                ? 'bg-green-600 text-white'
                                                : isCurrent
                                                    ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                                                    : 'bg-gray-200 text-gray-500'
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <Check className="w-6 h-6" />
                                            ) : (
                                                step.number
                                            )}
                                        </div>
                                        <span
                                            className={`mt-2 text-sm font-medium ${isCurrent ? 'text-primary-600' : 'text-gray-600'
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>

                                    {/* Connector Line */}
                                    {!isLast && (
                                        <div
                                            className={`flex-1 h-1 mx-4 transition-all ${isCompleted ? 'bg-green-600' : 'bg-gray-200'
                                                }`}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {currentStep === 'plan' && (
                        <PlanSelector onSelectPlan={handlePlanSelect} />
                    )}

                    {currentStep === 'lens' && (
                        <LensSelector
                            onContinue={handleLensSelect}
                            onBack={handleBack}
                            onScheduleConsultation={() => {
                                // Redirecionar para página de agendamento
                                router.push('/agendar-consulta')
                            }}
                        />
                    )}

                    {currentStep === 'addons' && (
                        <AddOnsSelector
                            onContinue={handleAddOnsSelect}
                            onBack={handleBack}
                        />
                    )}

                    {currentStep === 'summary' && flowData.planId && (
                        <OrderSummary
                            planId={flowData.planId}
                            billingCycle={flowData.billingCycle}
                            lensData={flowData.lensData}
                            addOns={flowData.addOns}
                            onBack={handleBack}
                            onConfirm={handleConfirm}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
