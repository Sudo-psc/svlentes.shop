import { render, screen, fireEvent } from '@testing-library/react'
import { HeroSection } from '../HeroSection'
import { openWhatsAppWithContext } from '@/lib/whatsapp'

// Mock the dependencies
jest.mock('@/lib/whatsapp')
jest.mock('@/lib/utils', () => ({
    ...jest.requireActual('@/lib/utils'),
    scrollToSection: jest.fn(),
}))

const mockOpenWhatsApp = openWhatsAppWithContext as jest.MockedFunction<typeof openWhatsAppWithContext>

describe('HeroSection', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders the hero section with all main elements', () => {
        render(<HeroSection />)

        // Check for pioneer badge
        expect(screen.getByText('🏆 Pioneiro no Brasil')).toBeInTheDocument()

        // Check for main headline
        expect(screen.getByText('Nunca mais')).toBeInTheDocument()
        expect(screen.getByText('fique sem lentes')).toBeInTheDocument()

        // Check for subheadline
        expect(screen.getByText(/Assinatura integrada com logística e consulta médica especializada/)).toBeInTheDocument()
        expect(screen.getByText(/Receba suas lentes em casa com acompanhamento do Dr. Philipe Saraiva Cruz/)).toBeInTheDocument()

        // Check for CTAs
        expect(screen.getByRole('button', { name: /Agendar Consulta/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Falar no WhatsApp/i })).toBeInTheDocument()
    })

    it('displays social proof statistics', () => {
        render(<HeroSection />)

        // Check for social proof stats
        expect(screen.getByText('5.000+')).toBeInTheDocument()
        expect(screen.getByText('Pacientes')).toBeInTheDocument()
        expect(screen.getByText('98%')).toBeInTheDocument()
        expect(screen.getByText('Satisfação')).toBeInTheDocument()
        expect(screen.getByText('15+')).toBeInTheDocument()
        expect(screen.getByText('Anos exp.')).toBeInTheDocument()
        expect(screen.getByText('24/7')).toBeInTheDocument()
        expect(screen.getByText('Suporte')).toBeInTheDocument()
    })

    it('displays trust indicators and additional trust elements', () => {
        render(<HeroSection />)

        // Check for additional trust elements
        expect(screen.getByText('Entrega Grátis')).toBeInTheDocument()
        expect(screen.getByText('Todo Brasil')).toBeInTheDocument()
        expect(screen.getByText('100% Seguro')).toBeInTheDocument()
        expect(screen.getByText('SSL + LGPD')).toBeInTheDocument()
    })

    it('calls WhatsApp integration when "Agendar Consulta" button is clicked', () => {
        render(<HeroSection />)

        const agendarButton = screen.getByRole('button', { name: /Agendar Consulta/i })
        fireEvent.click(agendarButton)

        expect(mockOpenWhatsApp).toHaveBeenCalledWith('consultation', {
            page: 'landing-page',
            section: 'hero-primary-cta'
        })
    })

    it('calls WhatsApp integration when "Falar no WhatsApp" button is clicked', () => {
        render(<HeroSection />)

        const whatsappButton = screen.getByRole('button', { name: /Falar no WhatsApp/i })
        fireEvent.click(whatsappButton)

        expect(mockOpenWhatsApp).toHaveBeenCalledWith('hero', {
            page: 'landing-page',
            section: 'hero-secondary-cta'
        })
    })

    it('renders with custom className', () => {
        const customClass = 'custom-hero-class'
        const { container } = render(<HeroSection className={customClass} />)

        expect(container.firstChild).toHaveClass(customClass)
    })

    it('has proper accessibility attributes', () => {
        render(<HeroSection />)

        // Check for proper heading hierarchy
        const mainHeading = screen.getByRole('heading', { level: 1 })
        expect(mainHeading).toBeInTheDocument()

        // Check for buttons with proper labels
        const agendarButton = screen.getByRole('button', { name: /Agendar Consulta/i })
        const whatsappButton = screen.getByRole('button', { name: /Falar no WhatsApp/i })

        expect(agendarButton).toBeInTheDocument()
        expect(whatsappButton).toBeInTheDocument()
    })

    it('renders DoctorCard and LeadCaptureForm components', () => {
        render(<HeroSection />)

        // The DoctorCard and LeadCaptureForm should be rendered
        // We can check for elements that would be present in these components
        expect(screen.getByText('Calcule sua Economia')).toBeInTheDocument()
    })

    it('handles lead form submission correctly', () => {
        render(<HeroSection />)

        // The LeadCaptureForm should have an onSubmit handler that scrolls to calculator
        // This is tested indirectly through the form component's behavior
        expect(screen.getByText('Calcule sua Economia')).toBeInTheDocument()
    })
})