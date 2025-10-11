import { NextRequest, NextResponse } from 'next/server'
import { handleApiError, logError } from '@/lib/error-handler'

interface LeadData {
    nome: string
    telefone: string
    email?: string
    source: string
    timestamp: string
    userAgent?: string
    ip?: string
}

export async function POST(request: NextRequest) {
    try {
        // Obter headers para análise
        const userAgent = request.headers.get('user-agent') || undefined
        const forwarded = request.headers.get('x-forwarded-for')
        const ip = forwarded ? forwarded.split(',')[0] : undefined

        // Rate limiting check
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: 'Muitas requisições. Tente novamente em alguns minutos.' },
                { status: 429 }
            )
        }

        // Parse do corpo da requisição
        const body: LeadData = await request.json()

        // Validação básica dos dados
        const { nome, telefone, email, source, timestamp } = body

        if (!nome || !telefone || !source || !timestamp) {
            return NextResponse.json(
                { error: 'Campos obrigatórios faltando' },
                { status: 400 }
            )
        }

        // Validação de formato do telefone
        const telefoneLimpo = telefone.replace(/\D/g, '')
        if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
            return NextResponse.json(
                { error: 'Telefone inválido' },
                { status: 400 }
            )
        }

        // Validação de email se fornecido
        if (email && !email.includes('@')) {
            return NextResponse.json(
                { error: 'Email inválido' },
                { status: 400 }
            )
        }

        // Preparar dados completos do lead
        const leadData: LeadData = {
            nome: nome.trim(),
            telefone: telefone.trim(),
            email: email?.trim() || undefined,
            source,
            timestamp,
            userAgent,
            ip
        }

        // Log para debug (remover em produção)
        console.log('Novo lead recebido:', {
            ...leadData,
            ip: ip ? `${ip.substring(0, 3)}***` : undefined, // Mask IP for privacy
            userAgent: userAgent?.substring(0, 50) + '...'
        })

        // Aqui você pode integrar com seu sistema de CRM
        // Exemplos de integrações que você pode adicionar:

        // 1. Salvar em banco de dados
        // await saveLeadToDatabase(leadData)

        // 2. Enviar para Google Sheets
        // await appendToGoogleSheet(leadData)

        // 3. Enviar para RD Station, HubSpot, etc.
        // await sendToCRM(leadData)

        // 4. Enviar notificação para Slack/Discord
        // await sendSlackNotification(leadData)

        // 5. Enviar email de notificação
        // await sendEmailNotification(leadData)

        // Simulação de processamento assíncrono
        // Em produção, você deve implementar uma fila para processar os leads
        setTimeout(async () => {
            try {
                await processLeadAsync(leadData)
            } catch (error) {
                logError(error, 'lead-capture-async')
            }
        }, 0)

        // Resposta de sucesso
        return NextResponse.json({
            success: true,
            message: 'Lead capturado com sucesso',
            leadId: generateLeadId(leadData)
        })

    } catch (error) {
        logError(error, 'lead-capture')
        const appError = handleApiError(error)

        return NextResponse.json(
            { 
                error: appError.message,
                code: appError.code
            },
            { status: appError.statusCode || 500 }
        )
    }
}

// Função auxiliar para gerar ID do lead
function generateLeadId(leadData: LeadData): string {
    const timestamp = Date.now()
    const nomeHash = leadData.nome.substring(0, 3).toUpperCase()
    const telefoneHash = leadData.telefone.replace(/\D/g, '').slice(-4)
    return `LEAD_${timestamp}_${nomeHash}_${telefoneHash}`
}

// Função de processamento assíncrono (implementar conforme necessário)
async function processLeadAsync(leadData: LeadData) {
    // Implementar integrações reais aqui

    // Exemplo: Enviar para WhatsApp Business API
    if (process.env.WHATSAPP_BUSINESS_API_KEY) {
        try {
            // await sendWhatsAppMessage(leadData.telefone, generateWelcomeMessage(leadData.nome))
        } catch (error) {
            console.error('Erro ao enviar WhatsApp:', error)
        }
    }

    // Exemplo: Adicionar à fila de follow-up
    // await addToFollowUpQueue(leadData)

    // Exemplo: Calcular score de lead
    const leadScore = calculateLeadScore(leadData)
    console.log(`Lead score para ${leadData.nome}: ${leadScore}`)
}

// Função para calcular score do lead (personalizar conforme seu negócio)
function calculateLeadScore(leadData: LeadData): number {
    let score = 0

    // Pontuação por fonte
    if (leadData.source === 'landing-conversao') score += 10

    // Pontuação por ter email
    if (leadData.email) score += 5

    // Pontuação por horário (horário comercial = maior score)
    const hour = new Date(leadData.timestamp).getHours()
    if (hour >= 9 && hour <= 18) score += 3

    // Pontuação por telefone celular
    const telefoneLimpo = leadData.telefone.replace(/\D/g, '')
    if (telefoneLimpo.length === 11 && telefoneLimpo.startsWith('9')) {
        score += 2
    }

    return score
}

// Função para gerar mensagem de boas-vindas
function generateWelcomeMessage(nome: string): string {
    return `Olá ${nome}! Recebemos seu contato na SV Lentes. Em breve nosso especialista entrará em contato para agendar sua consulta. Transforme sua visão conosco! 🎯`
}

// Rate limiting (opcional, mas recomendado)
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>()

function checkRateLimit(ip: string | undefined): boolean {
    if (!ip) return true // Sem IP, não aplicar rate limit

    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minuto
    const maxRequests = 5 // Máximo 5 requisições por minuto

    const existing = rateLimitMap.get(ip)

    if (!existing || now - existing.lastRequest > windowMs) {
        rateLimitMap.set(ip, { count: 1, lastRequest: now })
        return true
    }

    if (existing.count >= maxRequests) {
        return false
    }

    existing.count++
    return true
}
