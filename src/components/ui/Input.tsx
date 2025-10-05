import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, helperText, ...props }, ref) => {
        const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`
        const errorId = `${inputId}-error`
        const helperId = `${inputId}-helper`

        const inputElement = (
            <input
                id={inputId}
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-destructive focus-visible:ring-destructive",
                    className
                )}
                ref={ref}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? errorId : helperText ? helperId : undefined}
                aria-required={props.required}
                {...props}
            />
        )

        // If no label, error, or helper text, return just the input
        if (!label && !error && !helperText) {
            return inputElement
        }

        // Return wrapped input with label and messages
        return (
            <div className="space-y-2">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {label}
                        {props.required && (
                            <span className="text-destructive ml-1" aria-label="campo obrigatório">
                                *
                            </span>
                        )}
                    </label>
                )}

                {inputElement}

                {error && (
                    <p
                        id={errorId}
                        className="text-sm text-destructive flex items-center space-x-1 font-medium"
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
                        className="text-sm text-muted-foreground"
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