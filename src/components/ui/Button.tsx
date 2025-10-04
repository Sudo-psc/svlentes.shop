import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
        const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

        const variants = {
            primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
            secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500',
            outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500',
            whatsapp: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400',
            ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300'
        }

        const sizes = {
            sm: 'px-3 py-2 text-sm rounded-md',
            md: 'px-6 py-3 text-base rounded-lg',
            lg: 'px-8 py-4 text-lg rounded-xl'
        }

        return (
            <button
                className={cn(
                    baseClasses,
                    variants[variant],
                    sizes[size],
                    loading && 'cursor-wait',
                    className
                )}
                disabled={disabled || loading}
                ref={ref}
                {...props}
            >
                {loading && (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                )}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button }