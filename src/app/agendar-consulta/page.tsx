'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import {
    leadFormSchema,
    personalInfoSchema,
    prescriptionSchema,
    preferencesSchema,
    validateCPF,
    formatCPF,
    formatPhone,
    formatCEP
} from '@/lib/validations'
import { pricingPlans } from '@/data/pricing-plans'

// Schema completo para agendamento
const schedulingFormSchema = z.object({
    // Dados de lead (podem vir preenchidos)
    leadInfo: leadFormSchema,

    // Dados pessoais completos
    personalInfo: personalInfoSchema,

    // Dados de prescrição
    prescription: prescriptionSchema,

    // Preferências
    preferences: preferencesSchema,

    // Plano selecionado
    selectedPlan: z.enum(['basic', 'premium', 'vip']),

    // Dados específicos do agendamento
    scheduling: z.object({
        preferredDate: z.string().min(1, 'Data preferida é obrigatória'),
        preferredTime: z.enum(['morning', 'afternoon', 'evening']),
        consultationType: z.enum(['initial', 'followup', 'emergency']),
        additionalNotes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional()
    })
})

type SchedulingFormData = z.infer<typeof schedulingFormSchema>

function AgendarConsultaPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Pré-preencher dados se vieram da URL
    const prefilledData = {
        nome: searchParams.get('nome') || '',
        whatsapp: searchParams.get('whatsapp') || '',
        email: searchParams.get('email') || '',
        selectedPlan: (searchParams.get('plan') as 'basic' | 'premium' | 'vip') || 'premium'
    }

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        trigger
    } = useForm<SchedulingFormData>({
        resolver: zodResolver(schedulingFormSchema),
        defaultValues: {
            leadInfo: {
                nome: prefilledData.nome,
                whatsapp: prefilledData.whatsapp,
                email: prefilledData.email,
                lgpdConsent: false
            },
            selectedPlan: prefilledData.selectedPlan,
            prescription: {
                hasValidPrescription: false,
                needsConsultation: true,
                rightEye: { sphere: 0, cylinder: 0, axis: 0 },
                leftEye: { sphere: 0, cylinder: 0, axis: 0 },
                prescriptionDate: '',
                doctorName: ''
            },
            preferences: {
                lensType: 'monthly',
                deliveryFrequency: 'monthly',
                addOns: []
            },
            scheduling: {
                preferredDate: '',
                preferredTime: 'morning',
                consultationType: 'initial'
            }
        }
    })

    const selectedPlan = watch('selectedPlan')
    const hasValidPrescription = watch('prescription.hasValidPrescription')
    const needsConsultation = watch('prescription.needsConsultation')

    const steps = [
        { id: 1, title: 'Dados Pessoais', description: 'Informações básicas e contato' },
        { id: 2, title: 'Endereço', description: 'Dados para entrega' },
        { id: 3, title: 'Prescrição', description: 'Dados oftalmológicos' },
        { id: 4, title: 'Preferências', description: 'Tipo de lente e entrega' },
        { id: 5, title: 'Agendamento', description: 'Data e horário da consulta' }
    ]

    const handleNextStep = async () => {
        let fieldsToValidate: (keyof SchedulingFormData)[] = []

        switch (currentStep) {
            case 1:
                fieldsToValidate = ['leadInfo']
                break
            case 2:
                fieldsToValidate = ['personalInfo']
                break
            case 3:
                fieldsToValidate = ['prescription']
                break
            case 4:
                fieldsToValidate = ['preferences']
                break
        }

        const isValid = await trigger(fieldsToValidate)
        if (isValid && currentStep < 5) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const onSubmit = async (data: SchedulingFormData) => {
        setIsSubmitting(true)

        try {
            // Aqui seria a integração com o sistema de agendamento
            const response = await fetch('/api/schedule-consultation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                const result = await response.json()
                // Redirecionar para página de confirmação
                router.push(`/agendamento-confirmado?id=${result.schedulingId}`)
            } else {
                throw new Error('Erro ao agendar consulta')
            }
        } catch (error) {
            console.error('Erro no agendamento:', error)
            alert('Erro ao agendar consulta. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const selectedPlanData = pricingPlans.find(plan => plan.id === selectedPlan)

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Agendar Consulta
                    </h1>
                    <p className="text-lg text-gray-600">
                        Complete seus dados para agendar sua consulta com Dr. Philipe Saraiva Cruz
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${currentStep >= step.id
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-500'
                                    }
                `}>
                                    {step.id}
                                </div>
                                <div className="ml-3 hidden sm:block">
                                    <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                                        }`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-gray-500">{step.description}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`
                    hidden sm:block w-16 h-0.5 ml-4
                    ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'}
                  `} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selected Plan Info */}
                {selectedPlanData && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-blue-900">{selectedPlanData.name}</h3>
                                <p className="text-blue-700">
                                    R$ {selectedPlanData.priceMonthly.toFixed(2).replace('.', ',')} /mês
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/#planos-precos')}
                            >
                                Alterar Plano
                            </Button>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm p-6">
                    {/* Step 1: Dados Pessoais */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Dados Pessoais
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="nome">Nome Completo *</Label>
                                    <Input
                                        id="nome"
                                        {...register('leadInfo.nome')}
                                        placeholder="Seu nome completo"
                                        error={errors.leadInfo?.nome?.message}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="whatsapp">WhatsApp *</Label>
                                    <Input
                                        id="whatsapp"
                                        {...register('leadInfo.whatsapp')}
                                        placeholder="(11) 99999-9999"
                                        onChange={(e) => {
                                            const formatted = formatPhone(e.target.value)
                                            setValue('leadInfo.whatsapp', formatted)
                                        }}
                                        error={errors.leadInfo?.whatsapp?.message}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register('leadInfo.email')}
                                        placeholder="seu@email.com"
                                        error={errors.leadInfo?.email?.message}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="cpf">CPF *</Label>
                                    <Input
                                        id="cpf"
                                        {...register('personalInfo.cpf')}
                                        placeholder="000.000.000-00"
                                        onChange={(e) => {
                                            const formatted = formatCPF(e.target.value)
                                            setValue('personalInfo.cpf', formatted.replace(/\D/g, ''))
                                        }}
                                        error={errors.personalInfo?.cpf?.message}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="birthDate">Data de Nascimento *</Label>
                                    <Input
                                        id="birthDate"
                                        type="date"
                                        {...register('personalInfo.birthDate')}
                                        error={errors.personalInfo?.birthDate?.message}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="fullName">Nome Completo (Documento) *</Label>
                                    <Input
                                        id="fullName"
                                        {...register('personalInfo.fullName')}
                                        placeholder="Nome conforme documento"
                                        error={errors.personalInfo?.fullName?.message}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="lgpdConsent"
                                    {...register('leadInfo.lgpdConsent')}
                                />
                                <Label htmlFor="lgpdConsent" className="text-sm">
                                    Aceito os termos de privacidade e autorizo o uso dos meus dados conforme a LGPD *
                                </Label>
                            </div>
                            {errors.leadInfo?.lgpdConsent && (
                                <p className="text-red-600 text-sm">{errors.leadInfo.lgpdConsent.message}</p>
                            )}
                        </div>
                    )}

                    {/* Step 2: Endereço */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Endereço para Entrega
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="cep">CEP *</Label>
                                    <Input
                                        id="cep"
                                        {...register('personalInfo.address.cep')}
                                        placeholder="00000-000"
                                        onChange={(e) => {
                                            const formatted = formatCEP(e.target.value)
                                            setValue('personalInfo.address.cep', formatted.replace(/\D/g, ''))
                                        }}
                                        error={errors.personalInfo?.address?.cep?.message}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="street">Endereço *</Label>
                                    <Input
                                        id="street"
                                        {...register('personalInfo.address.street')}
                                        placeholder="Rua, Avenida, etc."
                                        error={errors.personalInfo?.address?.street?.message}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="number">Número *</Label>
                                    <Input
                                        id="number"
                                        {...register('personalInfo.address.number')}
                                        placeholder="123"
                                        error={errors.personalInfo?.address?.number?.message}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="complement">Complemento</Label>
                                    <Input
                                        id="complement"
                                        {...register('personalInfo.address.complement')}
                                        placeholder="Apto, Bloco, etc."
                                        error={errors.personalInfo?.address?.complement?.message}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="city">Cidade *</Label>
                                    <Input
                                        id="city"
                                        {...register('personalInfo.address.city')}
                                        placeholder="São Paulo"
                                        error={errors.personalInfo?.address?.city?.message}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="state">Estado *</Label>
                                    <Select
                                        id="state"
                                        {...register('personalInfo.address.state')}
                                        error={errors.personalInfo?.address?.state?.message}
                                        placeholder="Selecione o estado"
                                        options={[
                                            { value: "AC", label: "Acre" },
                                            { value: "AL", label: "Alagoas" },
                                            { value: "AP", label: "Amapá" },
                                            { value: "AM", label: "Amazonas" },
                                            { value: "BA", label: "Bahia" },
                                            { value: "CE", label: "Ceará" },
                                            { value: "DF", label: "Distrito Federal" },
                                            { value: "ES", label: "Espírito Santo" },
                                            { value: "GO", label: "Goiás" },
                                            { value: "MA", label: "Maranhão" },
                                            { value: "MT", label: "Mato Grosso" },
                                            { value: "MS", label: "Mato Grosso do Sul" },
                                            { value: "MG", label: "Minas Gerais" },
                                            { value: "PA", label: "Pará" },
                                            { value: "PB", label: "Paraíba" },
                                            { value: "PR", label: "Paraná" },
                                            { value: "PE", label: "Pernambuco" },
                                            { value: "PI", label: "Piauí" },
                                            { value: "RJ", label: "Rio de Janeiro" },
                                            { value: "RN", label: "Rio Grande do Norte" },
                                            { value: "RS", label: "Rio Grande do Sul" },
                                            { value: "RO", label: "Rondônia" },
                                            { value: "RR", label: "Roraima" },
                                            { value: "SC", label: "Santa Catarina" },
                                            { value: "SP", label: "São Paulo" },
                                            { value: "SE", label: "Sergipe" },
                                            { value: "TO", label: "Tocantins" }
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Prescrição */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Dados de Prescrição
                            </h2>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="hasValidPrescription"
                                        {...register('prescription.hasValidPrescription')}
                                    />
                                    <Label htmlFor="hasValidPrescription">
                                        Tenho uma prescrição médica válida (menos de 1 ano)
                                    </Label>
                                </div>
                            </div>

                            {hasValidPrescription && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="prescriptionDate">Data da Prescrição *</Label>
                                            <Input
                                                id="prescriptionDate"
                                                type="date"
                                                {...register('prescription.prescriptionDate')}
                                                error={errors.prescription?.prescriptionDate?.message}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="doctorName">Nome do Médico *</Label>
                                            <Input
                                                id="doctorName"
                                                {...register('prescription.doctorName')}
                                                placeholder="Dr. Nome do Oftalmologista"
                                                error={errors.prescription?.doctorName?.message}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Olho Direito */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-900">Olho Direito (OD)</h3>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="rightSphere">Esfera</Label>
                                                    <Input
                                                        id="rightSphere"
                                                        type="number"
                                                        step="0.25"
                                                        {...register('prescription.rightEye.sphere', { valueAsNumber: true })}
                                                        placeholder="0.00"
                                                        error={errors.prescription?.rightEye?.sphere?.message}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="rightCylinder">Cilindro</Label>
                                                    <Input
                                                        id="rightCylinder"
                                                        type="number"
                                                        step="0.25"
                                                        {...register('prescription.rightEye.cylinder', { valueAsNumber: true })}
                                                        placeholder="0.00"
                                                        error={errors.prescription?.rightEye?.cylinder?.message}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="rightAxis">Eixo</Label>
                                                    <Input
                                                        id="rightAxis"
                                                        type="number"
                                                        {...register('prescription.rightEye.axis', { valueAsNumber: true })}
                                                        placeholder="0"
                                                        error={errors.prescription?.rightEye?.axis?.message}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Olho Esquerdo */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-900">Olho Esquerdo (OE)</h3>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="leftSphere">Esfera</Label>
                                                    <Input
                                                        id="leftSphere"
                                                        type="number"
                                                        step="0.25"
                                                        {...register('prescription.leftEye.sphere', { valueAsNumber: true })}
                                                        placeholder="0.00"
                                                        error={errors.prescription?.leftEye?.sphere?.message}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="leftCylinder">Cilindro</Label>
                                                    <Input
                                                        id="leftCylinder"
                                                        type="number"
                                                        step="0.25"
                                                        {...register('prescription.leftEye.cylinder', { valueAsNumber: true })}
                                                        placeholder="0.00"
                                                        error={errors.prescription?.leftEye?.cylinder?.message}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="leftAxis">Eixo</Label>
                                                    <Input
                                                        id="leftAxis"
                                                        type="number"
                                                        {...register('prescription.leftEye.axis', { valueAsNumber: true })}
                                                        placeholder="0"
                                                        error={errors.prescription?.leftEye?.axis?.message}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="needsConsultation"
                                        {...register('prescription.needsConsultation')}
                                    />
                                    <Label htmlFor="needsConsultation">
                                        Preciso de uma consulta para obter/atualizar minha prescrição
                                    </Label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Preferências */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Preferências de Lentes
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="lensType">Tipo de Lente *</Label>
                                    <Select
                                        id="lensType"
                                        {...register('preferences.lensType')}
                                        error={errors.preferences?.lensType?.message}
                                        options={[
                                            { value: "daily", label: "Diárias" },
                                            { value: "weekly", label: "Semanais" },
                                            { value: "monthly", label: "Mensais" }
                                        ]}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="deliveryFrequency">Frequência de Entrega *</Label>
                                    <Select
                                        id="deliveryFrequency"
                                        {...register('preferences.deliveryFrequency')}
                                        error={errors.preferences?.deliveryFrequency?.message}
                                        options={[
                                            { value: "monthly", label: "Mensal" },
                                            { value: "quarterly", label: "Trimestral" },
                                            { value: "semiannual", label: "Semestral" }
                                        ]}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="specialNeeds">Necessidades Especiais</Label>
                                <textarea
                                    id="specialNeeds"
                                    {...register('preferences.specialNeeds')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Descreva qualquer necessidade especial ou observação sobre suas lentes..."
                                />
                                {errors.preferences?.specialNeeds && (
                                    <p className="text-red-600 text-sm mt-1">{errors.preferences.specialNeeds.message}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 5: Agendamento */}
                    {currentStep === 5 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Agendamento da Consulta
                            </h2>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <h3 className="font-semibold text-green-900 mb-2">Dr. Philipe Saraiva Cruz</h3>
                                <p className="text-green-700 text-sm">
                                    CRM-MG 69.870 - Oftalmologista especialista em lentes de contato
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="preferredDate">Data Preferida *</Label>
                                    <Input
                                        id="preferredDate"
                                        type="date"
                                        {...register('scheduling.preferredDate')}
                                        min={new Date().toISOString().split('T')[0]}
                                        error={errors.scheduling?.preferredDate?.message}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="preferredTime">Período Preferido *</Label>
                                    <Select
                                        id="preferredTime"
                                        {...register('scheduling.preferredTime')}
                                        error={errors.scheduling?.preferredTime?.message}
                                        options={[
                                            { value: "morning", label: "Manhã (8h às 12h)" },
                                            { value: "afternoon", label: "Tarde (13h às 17h)" },
                                            { value: "evening", label: "Noite (18h às 20h)" }
                                        ]}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="consultationType">Tipo de Consulta *</Label>
                                    <Select
                                        id="consultationType"
                                        {...register('scheduling.consultationType')}
                                        error={errors.scheduling?.consultationType?.message}
                                        options={[
                                            { value: "initial", label: "Consulta Inicial" },
                                            { value: "followup", label: "Retorno" },
                                            { value: "emergency", label: "Urgência" }
                                        ]}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="additionalNotes">Observações Adicionais</Label>
                                <textarea
                                    id="additionalNotes"
                                    {...register('scheduling.additionalNotes')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Alguma observação especial para a consulta..."
                                />
                                {errors.scheduling?.additionalNotes && (
                                    <p className="text-red-600 text-sm mt-1">{errors.scheduling.additionalNotes.message}</p>
                                )}
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">Resumo do Agendamento</h4>
                                <div className="text-blue-700 text-sm space-y-1">
                                    <p><strong>Plano:</strong> {selectedPlanData?.name}</p>
                                    <p><strong>Valor:</strong> R$ {selectedPlanData?.priceMonthly.toFixed(2).replace('.', ',')} /mês</p>
                                    <p><strong>Consulta:</strong> {needsConsultation ? 'Necessária' : 'Não necessária'}</p>
                                    <p><strong>Prescrição:</strong> {hasValidPrescription ? 'Possui válida' : 'Precisa obter'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevStep}
                            disabled={currentStep === 1}
                        >
                            Voltar
                        </Button>

                        {currentStep < 5 ? (
                            <Button
                                type="button"
                                onClick={handleNextStep}
                            >
                                Próximo
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Agendando...' : 'Agendar Consulta'}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function AgendarConsultaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando formulário...</p>
                </div>
            </div>
        }>
            <AgendarConsultaPageContent />
        </Suspense>
    )
}
