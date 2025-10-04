import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', label, error, helperText, ...props }, ref) => {
        const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`
        const errorId = `${inputId}-error`
        const helperId = `${inputId}-helper`

        return (
            <div className="space-y-2">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-900"
                    >
                        {label}
                        {props.required && <span className="text-red-600 ml-1" aria-label="campo obrigatório">*</span>}
                    </label>
                )}

                <input
                    id={inputId}
                    type={type}
                    className={cn(
                        'input-field',
                        'transition-all duration-200',
                        error && 'border-red-400 focus:border-red-600 focus:ring-red-500 bg-red-50',
                        !error && 'border-gray-300 focus:border-primary-600 focus:ring-primary-500',
                        props.disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
                        className
                    )}
                    ref={ref}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? errorId : helperText ? helperId : undefined}
                    aria-required={props.required}
                    {...props}
                />

                {error && (
                    <p
                        id={errorId}
                        className="text-sm text-red-700 flex items-center space-x-1 font-medium"
                        role="alert"
                        aria-live="polite"
                    >
                        <span aria-hidden="true">⚠️</span>
                        <span>{error}</span>
                    </p>
                )}

                {helperText && !error && (
                    <p
                        id={helperId}
                        className="text-sm text-gray-600"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }