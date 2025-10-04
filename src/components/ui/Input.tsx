import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', label, error, helperText, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <input
                    type={type}
                    className={cn(
                        'input-field',
                        error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
                        className
                    )}
                    ref={ref}
                    {...props}
                />

                {error && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }