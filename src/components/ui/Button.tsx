import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'whatsapp' | 'success' | 'warning' | 'cta' | 'default' | 'destructive'
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'default' | 'icon'
    fullWidth?: boolean
    loading?: boolean
    asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, loading = false, asChild = false, children, disabled, ...props }, ref) => {
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
            cta: 'bg-gradient-to-r from-primary to-accent hover:from-primary-700 hover:to-accent-600 text-white focus:ring-primary shadow-lg hover:shadow-xl hover:scale-[1.05]',
            default: 'bg-primary hover:bg-primary-700 active:bg-primary-800 text-primary-foreground focus:ring-ring shadow-md hover:shadow-lg hover:scale-[1.02]',
            destructive: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground focus:ring-destructive shadow-md hover:shadow-lg hover:scale-[1.02]',
        }

        const sizes = {
            sm: 'min-h-[40px] px-4 py-2 text-sm',
            md: 'min-h-[44px] px-6 py-3 text-base',
            lg: 'min-h-[52px] px-8 py-4 text-lg',
            xl: 'min-h-[60px] px-10 py-5 text-xl',
            default: 'min-h-[44px] px-6 py-3 text-base',
            icon: 'h-10 w-10 p-0',
        }

        // If asChild is true, render children directly (used for Link wrappers)
        if (asChild) {
            return <>{children}</>
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
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        {children}
                    </>
                ) : (
                    children
                )}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button }
