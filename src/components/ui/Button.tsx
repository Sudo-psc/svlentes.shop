import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'whatsapp' | 'success' | 'warning'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'

        const variants = {
            primary: 'bg-primary hover:bg-primary-700 active:bg-primary-800 text-primary-foreground focus:ring-ring shadow-md hover:shadow-lg hover:scale-[1.02]',
            secondary: 'bg-secondary hover:bg-secondary-600 active:bg-secondary-700 text-secondary-foreground focus:ring-secondary shadow-md hover:shadow-lg hover:scale-[1.02]',
            accent: 'bg-accent hover:bg-accent-600 active:bg-accent-700 text-accent-foreground focus:ring-accent shadow-md hover:shadow-lg hover:scale-[1.02]',
            outline: 'border-2 border-primary bg-transparent hover:bg-primary text-primary hover:text-primary-foreground active:bg-primary-700 focus:ring-ring shadow-sm hover:shadow-md hover:scale-[1.02]',
            ghost: 'bg-transparent hover:bg-muted text-foreground focus:ring-ring',
            whatsapp: 'bg-whatsapp hover:bg-whatsapp-600 active:bg-whatsapp-700 text-white focus:ring-whatsapp shadow-md hover:shadow-lg hover:scale-[1.02]',
            success: 'bg-success hover:bg-success-600 active:bg-success-700 text-success-foreground focus:ring-success shadow-md hover:shadow-lg hover:scale-[1.02]',
            warning: 'bg-warning hover:bg-warning-600 active:bg-warning-700 text-warning-foreground focus:ring-warning shadow-md hover:shadow-lg hover:scale-[1.02]',
        }

        const sizes = {
            sm: 'min-h-[40px] px-4 py-2 text-sm',
            md: 'min-h-[44px] px-6 py-3 text-base',
            lg: 'min-h-[52px] px-8 py-4 text-lg',
        }

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    fullWidth && 'w-full',
                    className
                )}
                {...props}
            >
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button }
