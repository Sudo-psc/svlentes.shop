'use client'

import { useState, useEffect } from 'react'
import { QrCode, Copy, CheckCircle, Clock, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { asaasService } from '@/lib/asaas-service'

interface PixCheckoutProps {
    paymentId: string
    amount: number
    description: string
    onPaymentConfirmed?: () => void
    onCancel?: () => void
}

export function PixCheckout({
    paymentId,
    amount,
    description,
    onPaymentConfirmed,
    onCancel
}: PixCheckoutProps) {
    const [qrCode, setQrCode] = useState<{
        encodedImage: string
        payload: string
        expirationDate?: string
    } | null>(null)
    const [paymentStatus, setPaymentStatus] = useState<string>('PENDING')
    const [copied, setCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [timeLeft, setTimeLeft] = useState<number>(0)

    // Buscar QR Code PIX
    useEffect(() => {
        const fetchQrCode = async () => {
            try {
                setIsLoading(true)
                const qrData = await asaasService.getPixQrCode(paymentId)
                setQrCode(qrData)

                // Calcular tempo restante
                if (qrData.expirationDate) {
                    const expiration = new Date(qrData.expirationDate).getTime()
                    const now = new Date().getTime()
                    const timeRemaining = Math.max(0, expiration - now)
                    setTimeLeft(timeRemaining)
                }
            } catch (err) {
                console.error('Erro ao buscar QR Code:', err)
                setError('Não foi possível gerar o QR Code PIX. Tente novamente.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchQrCode()
    }, [paymentId])

    // Timer de contagem regressiva
    useEffect(() => {
        if (timeLeft <= 0) return

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1000) {
                    return 0
                }
                return prev - 1000
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    // Verificar status do pagamento
    useEffect(() => {
        if (paymentStatus === 'RECEIVED' || paymentStatus === 'CONFIRMED') {
            onPaymentConfirmed?.()
            return
        }

        const checkPaymentStatus = async () => {
            try {
                const payment = await asaasService.getPayment(paymentId)
                setPaymentStatus(payment.status)

                if (payment.status === 'RECEIVED' || payment.status === 'CONFIRMED') {
                    onPaymentConfirmed?.()
                }
            } catch (err) {
                console.error('Erro ao verificar status:', err)
            }
        }

        // Verificar status a cada 5 segundos
        const interval = setInterval(checkPaymentStatus, 5000)
        return () => clearInterval(interval)
    }, [paymentId, paymentStatus, onPaymentConfirmed])

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    const copyToClipboard = async () => {
        if (qrCode?.payload) {
            try {
                await navigator.clipboard.writeText(qrCode.payload)
                setCopied(true)
                setTimeout(() => setCopied(false), 3000)
            } catch (err) {
                console.error('Erro ao copiar:', err)
            }
        }
    }

    const isExpired = timeLeft === 0
    const isPaid = paymentStatus === 'RECEIVED' || paymentStatus === 'CONFIRMED'

    if (isLoading) {
        return (
            <div className="max-w-md mx-auto p-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
                    <p className="text-gray-600">Gerando QR Code PIX...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-center">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="w-full mt-4"
                        variant="outline"
                    >
                        Tentar novamente
                    </Button>
                </div>
            </div>
        )
    }

    if (isPaid) {
        return (
            <div className="max-w-md mx-auto p-6">
                <div className="text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                    <h3 className="text-xl font-semibold text-gray-900">Pagamento Confirmado!</h3>
                    <p className="text-gray-600">
                        Seu pagamento foi processado com sucesso.
                    </p>
                    <Button
                        onClick={onPaymentConfirmed}
                        className="w-full"
                    >
                        Continuar
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <div className="text-center space-y-6">
                {/* Header */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Pague com PIX
                    </h3>
                    <p className="text-gray-600">
                        Escaneie o QR Code ou copie o código
                    </p>
                </div>

                {/* Valor */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Valor a pagar</p>
                    <p className="text-2xl font-bold text-gray-900">
                        R$ {amount.toFixed(2)}
                    </p>
                </div>

                {/* QR Code */}
                {qrCode && (
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                            {qrCode.encodedImage ? (
                                <img
                                    src={`data:image/png;base64,${qrCode.encodedImage}`}
                                    alt="QR Code PIX"
                                    className="w-64 h-64"
                                />
                            ) : (
                                <div className="w-64 h-64 flex items-center justify-center">
                                    <QrCode className="w-32 h-32 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Timer */}
                        {timeLeft > 0 && (
                            <div className="flex items-center justify-center space-x-2 text-amber-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    Expira em {formatTime(timeLeft)}
                                </span>
                            </div>
                        )}

                        {isExpired && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-red-800 text-sm">
                                    QR Code expirado. Recarregue a página para gerar um novo.
                                </p>
                            </div>
                        )}

                        {/* Código PIX */}
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">Código PIX:</p>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-700 break-all font-mono">
                                    {qrCode.payload}
                                </p>
                            </div>
                            <Button
                                onClick={copyToClipboard}
                                variant="outline"
                                className="w-full"
                                disabled={isExpired}
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Copiado!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copiar código
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                        <strong>Status:</strong> {paymentStatus === 'PENDING' ? 'Aguardando pagamento' : paymentStatus}
                    </p>
                </div>

                {/* Ações */}
                <div className="space-y-3">
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        className="w-full"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Atualizar status
                    </Button>

                    {onCancel && (
                        <Button
                            onClick={onCancel}
                            variant="ghost"
                            className="w-full"
                        >
                            Cancelar
                        </Button>
                    )}
                </div>

                {/* Instruções */}
                <div className="text-left bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Como pagar:</h4>
                    <ol className="text-sm text-gray-600 space-y-1">
                        <li>1. Abra o app do seu banco</li>
                        <li>2. Escolha a opção PIX</li>
                        <li>3. Escaneie o QR Code ou cole o código</li>
                        <li>4. Confirme o pagamento</li>
                        <li>5. Aguarde a confirmação (até 1 minuto)</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
