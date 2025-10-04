import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
    size?: 'sm' | 'md' | 'lg'
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
        const baseClasses = 'inline-flex items-center font-medium rounded-full transition-colors'

        const variants = {
            default: 'bg-primary-100 text-primary-800 border border-primary-200',
            secondary: 'bg-gray-100 text-gray-800 border border-gray-200',
            success: 'bg-green-100 text-green-800 border border-green-200',
            warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            error: 'bg-red-100 text-red-800 border border-red-200',
            info: 'bg-blue-100 text-blue-800 border border-blue-200'
        }

        const sizes = {
            sm: 'px-2 py-1 text-xs',
            md: 'px-3 py-1.5 text-sm',
            lg: 'px-4 py-2 text-base'
        }

        return (
            <div
                className={cn(
                    baseClasses,
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Badge.displayName = 'Badge'

export { Badge }