import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PricingSection from '../PricingSection'
import { pricingPlans, featureComparison } from '@/data/pricing-plans'

// Mock das funções de pricing actions
jest.mock('@/lib/pricing-actions', () => ({
    handleSubscription: jest.fn().mockResolvedValue({ success: true }),
    handleScheduleConsultation: jest.fn().mockResolvedValue({ success: true }),
    trackPlanSelection: jest.fn(),
    trackTabChange: jest.fn(),
}))

// Mock do window.location
Object.defineProperty(window, 'location', {
    value: {
        href: '',
    },
    writable: true,
})

// Mock do gtag
Object.defineProperty(window, 'gtag', {
    value: jest.fn(),
    writable: true,
})

describe('PricingSection', () => {
    const mockProps = {
        tabs: ['Mensal', 'Anual'] as ['Mensal', 'Anual'],
        plans: pricingPlans,
        comparisonTable: featureComparison,
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('deve renderizar a seção de preços corretamente', () => {
        render(<PricingSection {...mockProps} />)

        expect(screen.getByText('Escolha o Plano Ideal para Você')).toBeInTheDocument()
        expect(screen.getAllByText('Mensal').length).toBeGreaterThan(0)
        expect(screen.getByText('Anual')).toBeInTheDocument()
        expect(screen.getByText('Planos de Assinatura')).toBeInTheDocument()
    })

    it('deve exibir todos os planos de preços', () => {
        render(<PricingSection {...mockProps} />)

        // Planos aparecem tanto na versão mobile quanto desktop
        expect(screen.getAllByText('Plano Básico')).toHaveLength(2) // Mobile e desktop
        expect(screen.getAllByText('Plano Premium')).toHaveLength(2) // Mobile e desktop
        expect(screen.getAllByText('Plano VIP')).toHaveLength(2) // Mobile e desktop
    })

    it('deve destacar o plano recomendado', () => {
        render(<PricingSection {...mockProps} />)

        // "Mais Popular" aparece tanto na versão mobile quanto desktop
        expect(screen.getAllByText('Mais Popular')).toHaveLength(2)
    })

    it('deve alternar entre abas mensal e anual', async () => {
        const { trackTabChange } = require('@/lib/pricing-actions')

        render(<PricingSection {...mockProps} />)

        // Inicialmente deve estar na aba mensal
        expect(screen.getByText('R$ 99,00')).toBeInTheDocument()

        // Clicar na aba anual
        const anualTab = screen.getByRole('button', { name: /anual/i })
        fireEvent.click(anualTab)

        await waitFor(() => {
            expect(trackTabChange).toHaveBeenCalledWith('annual')
            // Verificar se os preços mudaram para anuais (divididos por 12)
            expect(screen.getByText('R$ 90,75')).toBeInTheDocument() // 1089.00 / 12
        })

        // Voltar para mensal
        const mensalTab = screen.getByRole('button', { name: /^mensal$/i })
        fireEvent.click(mensalTab)

        await waitFor(() => {
            expect(trackTabChange).toHaveBeenCalledWith('monthly')
            // Verificar se voltou para preços mensais
            expect(screen.getByText('R$ 99,00')).toBeInTheDocument()
        })
    })

    it('deve exibir preços corretos para plano mensal', () => {
        render(<PricingSection {...mockProps} />)

        // Verificar se os preços mensais estão sendo exibidos
        expect(screen.getByText('R$ 99,00')).toBeInTheDocument()
        expect(screen.getByText('R$ 149,90')).toBeInTheDocument()
        expect(screen.getByText('R$ 249,90')).toBeInTheDocument()
    })

    it('deve exibir preços corretos para plano anual', async () => {
        render(<PricingSection {...mockProps} />)

        const anualTab = screen.getByText('Anual')
        fireEvent.click(anualTab)

        await waitFor(() => {
            // Preços anuais divididos por 12
            expect(screen.getByText('R$ 90,75')).toBeInTheDocument() // 1089.00 / 12
            expect(screen.getByText('R$ 137,41')).toBeInTheDocument() // 1648.90 / 12
            expect(screen.getByText('R$ 229,08')).toBeInTheDocument() // 2749.00 / 12
        })
    })

    it('deve calcular economia anual corretamente', async () => {
        render(<PricingSection {...mockProps} />)

        const anualTab = screen.getByText('Anual')
        fireEvent.click(anualTab)

        await waitFor(() => {
            // Verificar se a economia está sendo calculada corretamente
            // Básico: (99.00 * 12) - 1089.00 = 99.00
            expect(screen.getByText('Economize R$ 99,00')).toBeInTheDocument()
            // Premium: (149.90 * 12) - 1648.90 = 149.90
            expect(screen.getByText('Economize R$ 149,90')).toBeInTheDocument()
            // VIP: (249.90 * 12) - 2749.00 = 249.90
            expect(screen.getByText('Economize R$ 249,90')).toBeInTheDocument()
        })
    })

    it('deve alternar corretamente entre abas mensal e anual', async () => {
        const { trackTabChange } = require('@/lib/pricing-actions')

        render(<PricingSection {...mockProps} />)

        // Inicialmente deve estar na aba mensal
        expect(screen.getByText('R$ 99,00')).toBeInTheDocument()

        // Clicar na aba anual - usar role button para ser mais específico
        const anualTab = screen.getByRole('button', { name: /anual/i })
        fireEvent.click(anualTab)

        await waitFor(() => {
            expect(trackTabChange).toHaveBeenCalledWith('annual')
            // Preços devem mudar para anuais
            expect(screen.getByText('R$ 90,75')).toBeInTheDocument()
        })

        // Voltar para mensal - usar role button para ser mais específico
        const mensalTab = screen.getByRole('button', { name: /^mensal$/i })
        fireEvent.click(mensalTab)

        await waitFor(() => {
            expect(trackTabChange).toHaveBeenCalledWith('monthly')
            // Preços devem voltar para mensais
            expect(screen.getByText('R$ 99,00')).toBeInTheDocument()
        })
    })

    it('deve exibir badge "2 meses grátis" na aba anual', () => {
        render(<PricingSection {...mockProps} />)

        expect(screen.getByText('2 meses grátis')).toBeInTheDocument()
    })

    it('deve calcular preços mensais corretamente para planos anuais', async () => {
        render(<PricingSection {...mockProps} />)

        const anualTab = screen.getByText('Anual')
        fireEvent.click(anualTab)

        await waitFor(() => {
            // Verificar cálculos precisos (preço anual / 12)
            const basicMonthly = (1089.00 / 12).toFixed(2).replace('.', ',')
            const premiumMonthly = (1648.90 / 12).toFixed(2).replace('.', ',')
            const vipMonthly = (2749.00 / 12).toFixed(2).replace('.', ',')

            expect(screen.getByText(`R$ ${basicMonthly}`)).toBeInTheDocument()
            expect(screen.getByText(`R$ ${premiumMonthly}`)).toBeInTheDocument()
            expect(screen.getByText(`R$ ${vipMonthly}`)).toBeInTheDocument()
        })
    })

    it('deve exibir valores anuais totais na aba anual', async () => {
        render(<PricingSection {...mockProps} />)

        const anualTab = screen.getByRole('button', { name: /anual/i })
        fireEvent.click(anualTab)

        await waitFor(() => {
            // Verificar se os textos "cobrado anualmente" estão presentes
            const annualTexts = screen.getAllByText(/cobrado anualmente/i)
            expect(annualTexts).toHaveLength(3) // Um para cada plano

            // Verificar se pelo menos um valor anual está presente para cada plano
            expect(screen.getAllByText(/899,90/)).toHaveLength(2) // Básico: Mobile e desktop
            expect(screen.getAllByText(/1499,90/)).toHaveLength(2) // Premium: Mobile e desktop (sem ponto)
            expect(screen.getAllByText(/2499,90/)).toHaveLength(2) // VIP: Mobile e desktop (sem ponto)
        })
    })

    it('deve manter estado da aba selecionada durante interações', async () => {
        render(<PricingSection {...mockProps} />)

        // Mudar para anual
        const anualTab = screen.getByText('Anual')
        fireEvent.click(anualTab)

        await waitFor(() => {
            expect(screen.getByText('R$ 90,75')).toBeInTheDocument()
        })

        // Clicar em um botão de assinatura
        const subscribeButtons = screen.getAllByText(/Assinar/)
        fireEvent.click(subscribeButtons[0])

        // A aba deve continuar anual
        await waitFor(() => {
            expect(screen.getByText('R$ 90,75')).toBeInTheDocument()
        })
    })

    it('deve chamar handleSubscription ao clicar em assinar', async () => {
        const { handleSubscription } = require('@/lib/pricing-actions')

        render(<PricingSection {...mockProps} />)

        const subscribeButtons = screen.getAllByText(/Assinar/)
        fireEvent.click(subscribeButtons[0])

        await waitFor(() => {
            expect(handleSubscription).toHaveBeenCalledWith({
                planId: 'basic',
                billingInterval: 'monthly',
            })
        })
    })

    it('deve chamar handleScheduleConsultation ao clicar em agendar', async () => {
        const { handleScheduleConsultation } = require('@/lib/pricing-actions')

        render(<PricingSection {...mockProps} />)

        const scheduleButtons = screen.getAllByText('Agendar Consulta')
        fireEvent.click(scheduleButtons[0])

        await waitFor(() => {
            expect(handleScheduleConsultation).toHaveBeenCalledWith({
                planId: 'basic',
            })
        })
    })

    it('deve exibir tabela de comparação', () => {
        render(<PricingSection {...mockProps} />)

        // A tabela desktop tem o texto "Recursos Incluídos"
        expect(screen.getByText('Recursos Incluídos')).toBeInTheDocument()
        expect(screen.getAllByText('Lentes de contato')).toHaveLength(4) // Mobile (3 cards) + Desktop (1 header)
        expect(screen.getAllByText('Frequência de entrega')).toHaveLength(4) // Mobile (3 cards) + Desktop (1 header)
    })

    it('deve exibir indicadores de confiança', () => {
        render(<PricingSection {...mockProps} />)

        expect(screen.getByText('Cancele quando quiser')).toBeInTheDocument()
        expect(screen.getByText('Primeira entrega em 48h')).toBeInTheDocument()
        expect(screen.getByText('Acompanhamento médico incluído')).toBeInTheDocument()
        expect(screen.getByText('Pagamento 100% seguro')).toBeInTheDocument()
    })

    it('deve exibir features dos planos corretamente', () => {
        render(<PricingSection {...mockProps} />)

        // Verificar algumas features específicas que aparecem na comparação
        expect(screen.getAllByText('Mensais').length).toBeGreaterThan(0) // Valor da comparação
        expect(screen.getAllByText('A cada 3 meses').length).toBeGreaterThan(0) // Valor da comparação
        expect(screen.getAllByText('WhatsApp').length).toBeGreaterThan(0) // Valor da comparação
    })

    it('deve lidar com erros de assinatura graciosamente', async () => {
        const { handleSubscription } = require('@/lib/pricing-actions')
        handleSubscription.mockRejectedValueOnce(new Error('Erro de teste'))

        // Mock do alert
        window.alert = jest.fn()

        render(<PricingSection {...mockProps} />)

        const subscribeButtons = screen.getAllByText(/Assinar/)
        fireEvent.click(subscribeButtons[0])

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Erro ao processar assinatura. Tente novamente.')
        })
    })

    it('deve lidar com erros de agendamento graciosamente', async () => {
        const { handleScheduleConsultation } = require('@/lib/pricing-actions')
        handleScheduleConsultation.mockRejectedValueOnce(new Error('Erro de teste'))

        // Mock do alert
        window.alert = jest.fn()

        render(<PricingSection {...mockProps} />)

        const scheduleButtons = screen.getAllByText('Agendar Consulta')
        fireEvent.click(scheduleButtons[0])

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Erro ao agendar consulta. Tente novamente.')
        })
    })

    // Testes específicos para alternância de abas
    describe('Alternância de abas', () => {
        it('deve iniciar com a aba mensal selecionada', () => {
            render(<PricingSection {...mockProps} />)

            // Verificar se os preços mensais estão sendo exibidos
            expect(screen.getByText('R$ 99,00')).toBeInTheDocument()
            expect(screen.getByText('R$ 149,90')).toBeInTheDocument()
            expect(screen.getByText('R$ 249,90')).toBeInTheDocument()
        })

        it('deve alternar para aba anual e exibir preços corretos', async () => {
            const { trackTabChange } = require('@/lib/pricing-actions')

            render(<PricingSection {...mockProps} />)

            const anualTab = screen.getByRole('button', { name: /anual/i })
            fireEvent.click(anualTab)

            await waitFor(() => {
                // Verificar se trackTabChange foi chamado
                expect(trackTabChange).toHaveBeenCalledWith('annual')

                // Verificar preços anuais divididos por 12
                expect(screen.getByText('R$ 90,75')).toBeInTheDocument() // 1089.00 / 12
                expect(screen.getByText('R$ 137,41')).toBeInTheDocument() // 1648.90 / 12
                expect(screen.getByText('R$ 229,08')).toBeInTheDocument() // 2749.00 / 12
            })
        })

        it('deve alternar entre abas múltiplas vezes', async () => {
            const { trackTabChange } = require('@/lib/pricing-actions')

            render(<PricingSection {...mockProps} />)

            // Ir para anual
            const anualTab = screen.getByRole('button', { name: /anual/i })
            fireEvent.click(anualTab)

            await waitFor(() => {
                expect(screen.getByText('R$ 90,75')).toBeInTheDocument()
            })

            // Voltar para mensal
            const mensalTab = screen.getByRole('button', { name: /^mensal$/i })
            fireEvent.click(mensalTab)

            await waitFor(() => {
                expect(screen.getByText('R$ 99,00')).toBeInTheDocument()
            })

            // Ir para anual novamente
            fireEvent.click(anualTab)

            await waitFor(() => {
                expect(screen.getByText('R$ 90,75')).toBeInTheDocument()
                expect(trackTabChange).toHaveBeenCalledTimes(3) // 2 annual + 1 monthly
            })
        })

        it('deve manter estado da aba durante outras interações', async () => {
            render(<PricingSection {...mockProps} />)

            // Mudar para anual
            const anualTab = screen.getByRole('button', { name: /anual/i })
            fireEvent.click(anualTab)

            await waitFor(() => {
                expect(screen.getByText('R$ 90,75')).toBeInTheDocument()
            })

            // Interagir com outros elementos (scroll, hover, etc.)
            const subscribeButtons = screen.getAllByText(/Assinar/)
            fireEvent.mouseOver(subscribeButtons[0])

            // A aba deve continuar anual
            expect(screen.getByText('R$ 90,75')).toBeInTheDocument()
        })
    })

    // Testes específicos para cálculos de preços
    describe('Cálculos de preços', () => {
        it('deve calcular preços mensais corretamente para planos anuais', async () => {
            render(<PricingSection {...mockProps} />)

            const anualTab = screen.getByRole('button', { name: /anual/i })
            fireEvent.click(anualTab)

            await waitFor(() => {
                // Verificar cálculos precisos (preço anual / 12)
                const basicMonthly = (1089.00 / 12).toFixed(2).replace('.', ',')
                const premiumMonthly = (1648.90 / 12).toFixed(2).replace('.', ',')
                const vipMonthly = (2749.00 / 12).toFixed(2).replace('.', ',')

                expect(screen.getByText(`R$ ${basicMonthly}`)).toBeInTheDocument()
                expect(screen.getByText(`R$ ${premiumMonthly}`)).toBeInTheDocument()
                expect(screen.getByText(`R$ ${vipMonthly}`)).toBeInTheDocument()
            })
        })

        it('deve calcular economia anual corretamente', async () => {
            render(<PricingSection {...mockProps} />)

            const anualTab = screen.getByRole('button', { name: /anual/i })
            fireEvent.click(anualTab)

            await waitFor(() => {
                // Verificar cálculo de economia: (preço mensal * 12) - preço anual
                const basicSavings = (99.00 * 12 - 1089.00).toFixed(2).replace('.', ',')
                const premiumSavings = (149.90 * 12 - 1648.90).toFixed(2).replace('.', ',')
                const vipSavings = (249.90 * 12 - 2749.00).toFixed(2).replace('.', ',')

                expect(screen.getByText(`Economize R$ ${basicSavings}`)).toBeInTheDocument()
                expect(screen.getByText(`Economize R$ ${premiumSavings}`)).toBeInTheDocument()
                expect(screen.getByText(`Economize R$ ${vipSavings}`)).toBeInTheDocument()
            })
        })

        it('deve exibir valores anuais totais na aba anual', async () => {
            render(<PricingSection {...mockProps} />)

            const anualTab = screen.getByRole('button', { name: /anual/i })
            fireEvent.click(anualTab)

            await waitFor(() => {
                // Verificar se os valores anuais totais estão sendo exibidos
                expect(screen.getAllByText(/1089,00/)).toHaveLength(2) // Mobile e desktop
                expect(screen.getAllByText(/1648,90/)).toHaveLength(2) // Mobile e desktop
                expect(screen.getAllByText(/2749,00/)).toHaveLength(2) // Mobile e desktop

                // Verificar texto "cobrado anualmente"
                const annualTexts = screen.getAllByText(/cobrado anualmente/i)
                expect(annualTexts).toHaveLength(3) // Um para cada plano
            })
        })

        it('deve não exibir economia na aba mensal', () => {
            render(<PricingSection {...mockProps} />)

            // Na aba mensal, não deve haver texto de economia
            expect(screen.queryByText(/Economize R\$/)).not.toBeInTheDocument()
            expect(screen.queryByText(/cobrado anualmente/)).not.toBeInTheDocument()
        })

        it('deve formatar preços corretamente com vírgula decimal', async () => {
            render(<PricingSection {...mockProps} />)

            // Verificar formatação mensal
            expect(screen.getByText('R$ 99,00')).toBeInTheDocument()
            expect(screen.getByText('R$ 149,90')).toBeInTheDocument()
            expect(screen.getByText('R$ 249,90')).toBeInTheDocument()

            // Mudar para anual e verificar formatação
            const anualTab = screen.getByRole('button', { name: /anual/i })
            fireEvent.click(anualTab)

            await waitFor(() => {
                // Preços mensais calculados devem usar vírgula
                expect(screen.getByText('R$ 90,75')).toBeInTheDocument()
                expect(screen.getByText('R$ 137,41')).toBeInTheDocument()
                expect(screen.getByText('R$ 229,08')).toBeInTheDocument()

                // Valores anuais também devem usar vírgula
                expect(screen.getAllByText(/1089,00/)).toHaveLength(2)
                expect(screen.getAllByText(/1648,90/)).toHaveLength(2)
                expect(screen.getAllByText(/2749,00/)).toHaveLength(2)
            })
        })

        it('deve passar parâmetros corretos para handleSubscription baseado na aba', async () => {
            const { handleSubscription } = require('@/lib/pricing-actions')

            render(<PricingSection {...mockProps} />)

            // Testar na aba mensal
            const subscribeButtons = screen.getAllByText(/Assinar/)
            fireEvent.click(subscribeButtons[0])

            await waitFor(() => {
                expect(handleSubscription).toHaveBeenCalledWith({
                    planId: 'basic',
                    billingInterval: 'monthly',
                })
            })

            // Mudar para anual e testar
            const anualTab = screen.getByRole('button', { name: /anual/i })
            fireEvent.click(anualTab)

            await waitFor(() => {
                const annualSubscribeButtons = screen.getAllByText(/Assinar/)
                fireEvent.click(annualSubscribeButtons[0])
            })

            await waitFor(() => {
                expect(handleSubscription).toHaveBeenCalledWith({
                    planId: 'basic',
                    billingInterval: 'annual',
                })
            })
        })
    })
})
