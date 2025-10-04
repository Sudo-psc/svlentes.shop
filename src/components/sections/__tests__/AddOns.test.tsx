import { render, screen, fireEvent } from '@testing-library/react'
import AddOns from '../AddOns'
import { AddOn } from '@/types'

const mockAddOns: AddOn[] = [
    {
        id: 'consulta-test',
        name: 'Consulta Teste',
        description: 'Consulta de teste',
        price: 100,
        type: 'consulta'
    },
    {
        id: 'seguro-test',
        name: 'Seguro Teste',
        description: 'Seguro de teste',
        price: 50,
        type: 'seguro'
    }
]

describe('AddOns Component', () => {
    it('renders add-ons section with title', () => {
        render(<AddOns services={mockAddOns} layout="cards" />)

        expect(screen.getByText('Serviços Adicionais')).toBeInTheDocument()
        expect(screen.getByText(/Personalize sua experiência/)).toBeInTheDocument()
    })

    it('displays all add-on services', () => {
        render(<AddOns services={mockAddOns} layout="cards" />)

        expect(screen.getByText('Consulta Teste')).toBeInTheDocument()
        expect(screen.getByText('Seguro Teste')).toBeInTheDocument()
        expect(screen.getByText('Consulta de teste')).toBeInTheDocument()
        expect(screen.getByText('Seguro de teste')).toBeInTheDocument()
    })

    it('allows selecting and deselecting add-ons', () => {
        render(<AddOns services={mockAddOns} layout="cards" />)

        const consultaCard = screen.getByText('Consulta Teste').closest('div')
        const seguroCard = screen.getByText('Seguro Teste').closest('div')

        // Initially no services selected
        expect(screen.queryByText('Serviços Selecionados')).not.toBeInTheDocument()

        // Select first add-on
        fireEvent.click(consultaCard!)
        expect(screen.getByText('Serviços Selecionados (1)')).toBeInTheDocument()

        // Select second add-on
        fireEvent.click(seguroCard!)
        expect(screen.getByText('Serviços Selecionados (2)')).toBeInTheDocument()
    })

    it('calculates total price correctly', () => {
        render(<AddOns services={mockAddOns} layout="cards" />)

        const consultaCard = screen.getByText('Consulta Teste').closest('div')
        const seguroCard = screen.getByText('Seguro Teste').closest('div')

        // Select both add-ons
        fireEvent.click(consultaCard!)
        fireEvent.click(seguroCard!)

        // Check total calculation (100 + 50 = 150)
        expect(screen.getByText('R$ 150,00')).toBeInTheDocument()
    })

    it('renders in chips layout', () => {
        render(<AddOns services={mockAddOns} layout="chips" />)

        expect(screen.getByText('Consulta Teste')).toBeInTheDocument()
        expect(screen.getByText('Seguro Teste')).toBeInTheDocument()
    })

    it('clears selection when clear button is clicked', () => {
        render(<AddOns services={mockAddOns} layout="cards" />)

        const consultaCard = screen.getByText('Consulta Teste').closest('div')

        // Select add-on
        fireEvent.click(consultaCard!)
        expect(screen.getByText('Serviços Selecionados (1)')).toBeInTheDocument()

        // Clear selection
        const clearButton = screen.getByText('Limpar seleção')
        fireEvent.click(clearButton)

        expect(screen.queryByText('Serviços Selecionados')).not.toBeInTheDocument()
    })

    it('shows WhatsApp button when no services selected', () => {
        render(<AddOns services={mockAddOns} layout="cards" />)

        expect(screen.getByText('Tenho dúvidas - Falar no WhatsApp')).toBeInTheDocument()
    })
})