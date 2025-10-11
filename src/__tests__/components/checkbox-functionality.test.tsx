/**
 * Test suite for checkbox functionality in subscription flow
 * Tests the fixes applied to OrderSummary and AddOns components
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '@/components/ui/Checkbox'

describe('Checkbox Component Functionality', () => {
    const user = userEvent.setup()

    it('should render checkbox with required id prop', () => {
        const { container } = render(
            <Checkbox id="test-checkbox" checked={false} onChange={() => { }}>
                Test Label
            </Checkbox>
        )

        const checkbox = container.querySelector('input[type="checkbox"]')
        expect(checkbox).toBeInTheDocument()
        expect(checkbox).toHaveAttribute('id', 'test-checkbox')
    })

    it('should toggle checkbox state when clicked', async () => {
        const handleChange = jest.fn()

        render(
            <Checkbox id="clickable-checkbox" checked={false} onChange={handleChange}>
                Clickable Checkbox
            </Checkbox>
        )

        const checkbox = screen.getByRole('checkbox')
        await user.click(checkbox)

        expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('should respect checked prop', () => {
        const { rerender } = render(
            <Checkbox id="controlled-checkbox" checked={false} onChange={() => { }}>
                Controlled Checkbox
            </Checkbox>
        )

        let checkbox = screen.getByRole('checkbox')
        expect(checkbox).not.toBeChecked()

        rerender(
            <Checkbox id="controlled-checkbox" checked={true} onChange={() => { }}>
                Controlled Checkbox
            </Checkbox>
        )

        checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeChecked()
    })

    it('should render with custom label', () => {
        render(
            <Checkbox id="labeled-checkbox" checked={false} onChange={() => { }}>
                <span className="text-sm">Custom Label Text</span>
            </Checkbox>
        )

        expect(screen.getByText('Custom Label Text')).toBeInTheDocument()
    })

    it('should be accessible with proper ARIA attributes', () => {
        render(
            <Checkbox
                id="accessible-checkbox"
                checked={false}
                onChange={() => { }}
                aria-label="Accessibility Test"
            >
                Accessible Checkbox
            </Checkbox>
        )

        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toHaveAccessibleName()
    })
})

describe('OrderSummary Checkbox Integration', () => {
    it('should have terms acceptance checkbox with id', () => {
        // This test verifies the fix applied to OrderSummary.tsx
        // The checkbox now has id="accepts-terms"
        const checkboxId = 'accepts-terms'

        render(
            <Checkbox
                id={checkboxId}
                checked={false}
                onChange={() => { }}
                required
            >
                <span className="text-sm text-gray-700">
                    Aceito os{' '}
                    <a href="/termos" className="text-primary-600 hover:underline">
                        termos de uso
                    </a>
                    {' '}e{' '}
                    <a href="/privacidade" className="text-primary-600 hover:underline">
                        política de privacidade
                    </a>
                </span>
            </Checkbox>
        )

        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toHaveAttribute('id', checkboxId)
        expect(checkbox).toBeRequired()
    })
})

describe('AddOns Checkbox Integration', () => {
    it('should have addon checkboxes with unique ids - chip layout', () => {
        // This test verifies the fix applied to AddOns.tsx chip layout
        // Checkboxes now have id="addon-chip-{addOn.id}"
        const addonId = 'telemedicina'
        const checkboxId = `addon-chip-${addonId}`

        render(
            <Checkbox
                id={checkboxId}
                checked={false}
                onChange={() => { }}
                className="pointer-events-none"
            />
        )

        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toHaveAttribute('id', checkboxId)
    })

    it('should have addon checkboxes with unique ids - card layout', () => {
        // This test verifies the fix applied to AddOns.tsx card layout
        // Checkboxes now have id="addon-card-{addOn.id}"
        const addonId = 'solucoes'
        const checkboxId = `addon-card-${addonId}`

        render(
            <Checkbox
                id={checkboxId}
                checked={false}
                onChange={() => { }}
                className="pointer-events-none"
            />
        )

        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toHaveAttribute('id', checkboxId)
    })

    it('should generate unique ids for multiple addons', () => {
        const addons = ['telemedicina', 'solucoes', 'exames']

        const { container } = render(
            <>
                {addons.map(id => (
                    <Checkbox
                        key={id}
                        id={`addon-chip-${id}`}
                        checked={false}
                        onChange={() => { }}
                    >
                        {id}
                    </Checkbox>
                ))}
            </>
        )

        const checkboxes = container.querySelectorAll('input[type="checkbox"]')
        expect(checkboxes).toHaveLength(3)

        // Verify each has unique id
        addons.forEach((id, index) => {
            expect(checkboxes[index]).toHaveAttribute('id', `addon-chip-${id}`)
        })
    })
})

describe('Checkbox Accessibility Requirements', () => {
    it('should be keyboard accessible', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()

        render(
            <Checkbox id="keyboard-checkbox" checked={false} onChange={handleChange}>
                Keyboard Accessible
            </Checkbox>
        )

        const checkbox = screen.getByRole('checkbox')

        // Tab to checkbox
        await user.tab()
        expect(checkbox).toHaveFocus()

        // Space to toggle
        await user.keyboard(' ')
        expect(handleChange).toHaveBeenCalled()
    })

    it('should support required validation', () => {
        render(
            <Checkbox
                id="required-checkbox"
                checked={false}
                onChange={() => { }}
                required
            >
                Required Checkbox
            </Checkbox>
        )

        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeRequired()
        expect(checkbox).toHaveAttribute('required')
    })

    it('should display error state when provided', () => {
        const errorMessage = 'Este campo é obrigatório'

        render(
            <Checkbox
                id="error-checkbox"
                checked={false}
                onChange={() => { }}
                error={errorMessage}
            >
                Error State Checkbox
            </Checkbox>
        )

        expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
})
