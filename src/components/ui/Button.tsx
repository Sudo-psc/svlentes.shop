import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-lg",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 hover:shadow-lg",
                outline:
                    "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary hover:scale-105",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 hover:shadow-md",
                ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105",
                link: "text-primary underline-offset-4 hover:underline hover:scale-105",
                // Custom variants for SV Lentes - Enhanced CTAs
                primary: "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 font-semibold",
                primaryGlow: "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-all duration-300 font-semibold before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
                whatsapp: "bg-gradient-to-r from-whatsapp-500 to-whatsapp-600 text-white hover:from-whatsapp-600 hover:to-whatsapp-700 focus:ring-whatsapp-400 shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 font-semibold",
                success: "bg-gradient-to-r from-success-600 to-success-700 text-white hover:from-success-700 hover:to-success-800 focus:ring-success-500 shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 font-semibold",
                warning: "bg-gradient-to-r from-warning-500 to-warning-600 text-warning-900 hover:from-warning-600 hover:to-warning-700 focus:ring-warning-400 shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 font-semibold",
                glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-xl transform transition-all duration-300 font-semibold",
                cta: "bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 focus:ring-primary-500 shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-all duration-300 font-bold text-lg px-8 py-4 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
                ctaSecondary: "bg-gradient-to-r from-success-600 to-emerald-700 text-white hover:from-success-700 hover:to-emerald-800 focus:ring-success-500 shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-all duration-300 font-bold text-lg px-8 py-4 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
            },
            size: {
                default: "h-11 px-6 py-3 text-base",
                sm: "h-9 rounded-lg px-4 text-sm",
                lg: "h-13 rounded-xl px-8 text-lg",
                xl: "h-16 rounded-2xl px-12 text-xl font-bold",
                icon: "h-11 w-11",
                iconLg: "h-13 w-13",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
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
            </Comp>
        )
    }
)

Button.displayName = 'Button'

export { Button }
