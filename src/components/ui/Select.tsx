import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
    value: string
    label: string
    description?: string
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label?: string
    error?: string
    helperText?: string
    options: SelectOption[]
    placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, helperText, options, placeholder, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    <select
                        className={cn(
                            'input-field appearance-none pr-10',
                            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                </div>

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

Select.displayName = 'Select'

export { Select }