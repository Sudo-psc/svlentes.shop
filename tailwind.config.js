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
                    50: '#f0f9ff',   /* Very light medical blue */
                    100: '#e0f2fe',  /* Light medical blue */
                    200: '#bae6fd',  /* Soft medical blue */
                    300: '#7dd3fc',  /* Medium light medical blue */
                    400: '#38bdf8',  /* Medium medical blue */
                    500: '#0ea5e9',  /* Standard medical blue */
                    600: '#0f4c75',  /* Deep medical blue (primary) */
                    700: '#0c3d5a',  /* Darker medical blue */
                    800: '#0a2e42',  /* Very dark medical blue */
                    900: '#082030',  /* Deepest medical blue */
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                    50: '#f8fafc',   /* Very light neutral */
                    100: '#f1f5f9',  /* Light neutral */
                    200: '#e2e8f0',  /* Soft neutral */
                    300: '#cbd5e1',  /* Medium light neutral */
                    400: '#94a3b8',  /* Medium neutral */
                    500: '#64748b',  /* Standard neutral */
                    600: '#475569',  /* Deep neutral */
                    700: '#334155',  /* Darker neutral */
                    800: '#1e293b',  /* Very dark neutral */
                    900: '#0f172a',  /* Deepest neutral */
                },
                success: {
                    DEFAULT: "hsl(var(--success))",
                    foreground: "hsl(var(--success-foreground))",
                    50: '#f0fdf4',   /* Very light green */
                    100: '#dcfce7',  /* Light green */
                    200: '#bbf7d0',  /* Soft green */
                    300: '#86efac',  /* Medium light green */
                    400: '#4ade80',  /* Medium green */
                    500: '#22c55e',  /* Standard green */
                    600: '#16a34a',  /* Deep green (success) */
                    700: '#15803d',  /* Darker green */
                    800: '#166534',  /* Very dark green */
                    900: '#14532d',  /* Deepest green */
                },
                warning: {
                    DEFAULT: "hsl(var(--warning))",
                    foreground: "hsl(var(--warning-foreground))",
                    50: '#fffbeb',   /* Very light amber */
                    100: '#fef3c7',  /* Light amber */
                    200: '#fde68a',  /* Soft amber */
                    300: '#fcd34d',  /* Medium light amber */
                    400: '#fbbf24',  /* Medium amber */
                    500: '#f59e0b',  /* Standard amber (warning) */
                    600: '#d97706',  /* Deep amber */
                    700: '#b45309',  /* Darker amber */
                    800: '#92400e',  /* Very dark amber */
                    900: '#78350f',  /* Deepest amber */
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                medical: {
                    50: '#f8fafc',   /* Very light medical gray */
                    100: '#f1f5f9',  /* Light medical gray */
                    200: '#e2e8f0',  /* Soft medical gray */
                    300: '#cbd5e1',  /* Medium light medical gray */
                    400: '#94a3b8',  /* Medium medical gray */
                    500: '#64748b',  /* Standard medical gray */
                    600: '#475569',  /* Deep medical gray */
                    700: '#334155',  /* Darker medical gray */
                    800: '#1e293b',  /* Very dark medical gray */
                    900: '#0f172a',  /* Deepest medical gray */
                },
                whatsapp: {
                    DEFAULT: '#25d366',  /* WhatsApp green */
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#25d366',  /* Official WhatsApp green */
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
