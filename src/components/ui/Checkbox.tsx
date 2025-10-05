import { InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string
    error?: string
    description?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, error, description, children, ...props }, ref) => {
        const checkboxId = props.id
        const errorId = `${checkboxId}-error`
        const descId = `${checkboxId}-desc`

        return (
            <div className="space-y-2">
                <div className="flex items-start space-x-3">
                    <div className="relative flex items-center mt-0.5">
                        <input
                            id={checkboxId}
                            type="checkbox"
                            className={cn(
                                'sr-only',
                                className
                            )}
                            ref={ref}
                            aria-invalid={error ? 'true' : 'false'}
                            aria-describedby={error ? errorId : description ? descId : undefined}
                            aria-required={props.required}
                            {...props}
                        />
                        <label
                            htmlFor={checkboxId}
                            className={cn(
                                'w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 cursor-pointer',
                                props.checked
                                    ? 'bg-primary-600 border-primary-600 shadow-sm'
                                    : 'border-gray-400 hover:border-primary-500 hover:bg-primary-50',
                                error && 'border-red-400 hover:border-red-500',
                                props.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
                            )}
                            aria-hidden="true"
                        >
                            {props.checked && (
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            )}
                        </label>
                    </div>

                    <div className="flex-1">
                        {label && checkboxId && (
                            <label
                                htmlFor={checkboxId}
                                className="block text-sm font-medium text-gray-900 cursor-pointer leading-relaxed"
                            >
                                {label}
                                {props.required && <span className="text-red-600 ml-1" aria-label="campo obrigatório">*</span>}
                            </label>
                        )}

                        {children && (
                            <div className="mt-1 text-sm text-gray-700 leading-relaxed">
                                {children}
                            </div>
                        )}

                        {description && checkboxId && (
                            <p
                                id={descId}
                                className="text-sm text-gray-600 mt-1"
                            >
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {error && (
                    <p
                        id={errorId}
                        className="text-sm text-red-700 flex items-center space-x-1 ml-8 font-medium"
                        role="alert"
                        aria-live="polite"
                    >
                        <span aria-hidden="true">⚠️</span>
                        <span>{error}</span>
                    </p>
                )}
            </div>
        )
    }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
