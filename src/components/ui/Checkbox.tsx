import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string
    error?: string
    description?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, error, description, children, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <div className="flex items-start space-x-3">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            className={cn(
                                'sr-only',
                                className
                            )}
                            ref={ref}
                            {...props}
                        />
                        <div className={cn(
                            'w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200',
                            props.checked
                                ? 'bg-primary-600 border-primary-600'
                                : 'border-gray-300 hover:border-primary-400',
                            error && 'border-red-300',
                            props.disabled && 'opacity-50 cursor-not-allowed'
                        )}>
                            {props.checked && (
                                <Check className="w-3 h-3 text-white" />
                            )}
                        </div>
                    </div>

                    <div className="flex-1">
                        {label && (
                            <label className="block text-sm font-medium text-gray-700 cursor-pointer">
                                {label}
                                {props.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        )}

                        {children}

                        {description && (
                            <p className="text-sm text-gray-500 mt-1">{description}</p>
                        )}
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-600 flex items-center space-x-1 ml-8">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </p>
                )}
            </div>
        )
    }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }