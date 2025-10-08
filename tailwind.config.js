/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    50: '#eff6ff',   /* Azul muito claro */
                    100: '#dbeafe',  /* Azul claro */
                    200: '#bfdbfe',  /* Azul suave */
                    300: '#93c5fd',  /* Azul médio claro */
                    400: '#60a5fa',  /* Azul médio */
                    500: '#3b82f6',  /* Azul padrão */
                    600: '#0066CC',  /* Azul médico (brand) */
                    700: '#1d4ed8',  /* Azul escuro */
                    800: '#1e40af',  /* Azul profundo */
                    900: '#1e3a8a',  /* Azul muito escuro */
                    950: '#172554',  /* Azul quase preto */
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                    50: '#f0fdf4',   /* Verde muito claro */
                    100: '#dcfce7',  /* Verde claro */
                    200: '#bbf7d0',  /* Verde suave */
                    300: '#86efac',  /* Verde médio claro */
                    400: '#4ade80',  /* Verde médio */
                    500: '#10b981',  /* Verde saúde (brand) */
                    600: '#059669',  /* Verde escuro */
                    700: '#047857',  /* Verde profundo */
                    800: '#065f46',  /* Verde muito escuro */
                    900: '#064e3b',  /* Verde quase preto */
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                    50: '#fff7ed',   /* Laranja muito claro */
                    100: '#ffedd5',  /* Laranja claro */
                    200: '#fed7aa',  /* Laranja suave */
                    300: '#fdba74',  /* Laranja médio claro */
                    400: '#fb923c',  /* Laranja médio */
                    500: '#f97316',  /* Laranja energia (brand) */
                    600: '#ea580c',  /* Laranja escuro */
                    700: '#c2410c',  /* Laranja profundo */
                    800: '#9a3412',  /* Laranja muito escuro */
                    900: '#7c2d12',  /* Laranja quase preto */
                },
                success: {
                    DEFAULT: "hsl(var(--success))",
                    foreground: "hsl(var(--success-foreground))",
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
                warning: {
                    DEFAULT: "hsl(var(--warning))",
                    foreground: "hsl(var(--warning-foreground))",
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                whatsapp: {
                    DEFAULT: '#25d366',
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#25d366',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Poppins', 'system-ui', 'sans-serif'],
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'glass-lg': '0 16px 64px 0 rgba(31, 38, 135, 0.2)',
                'neon': '0 0 20px rgba(59, 130, 246, 0.5)',
                'neon-lg': '0 0 40px rgba(59, 130, 246, 0.7)',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
                    '100%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
