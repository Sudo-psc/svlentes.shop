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
                    50: '#e8f4f8',   /* Very light medical blue - Saraiva Vision inspired */
                    100: '#d1e9f1',  /* Light medical blue */
                    200: '#a3d3e3',  /* Soft medical blue */
                    300: '#75bdd5',  /* Medium light medical blue */
                    400: '#47a7c7',  /* Medium medical blue */
                    500: '#1991b9',  /* Standard medical blue - Saraiva Vision primary */
                    600: '#147494',  /* Deep medical blue (primary brand) */
                    700: '#0f576f',  /* Darker medical blue */
                    800: '#0a3a4a',  /* Very dark medical blue */
                    900: '#051d25',  /* Deepest medical blue */
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                    50: '#f9fafb',   /* Very light neutral - Clean medical aesthetic */
                    100: '#f3f4f6',  /* Light neutral */
                    200: '#e5e7eb',  /* Soft neutral */
                    300: '#d1d5db',  /* Medium light neutral */
                    400: '#9ca3af',  /* Medium neutral */
                    500: '#6b7280',  /* Standard neutral */
                    600: '#4b5563',  /* Deep neutral - Professional gray */
                    700: '#374151',  /* Darker neutral */
                    800: '#1f2937',  /* Very dark neutral */
                    900: '#111827',  /* Deepest neutral */
                },
                success: {
                    DEFAULT: "hsl(var(--success))",
                    foreground: "hsl(var(--success-foreground))",
                    50: '#ecfdf5',   /* Very light green - Medical approval */
                    100: '#d1fae5',  /* Light green */
                    200: '#a7f3d0',  /* Soft green */
                    300: '#6ee7b7',  /* Medium light green */
                    400: '#34d399',  /* Medium green */
                    500: '#10b981',  /* Standard green - Health positive */
                    600: '#059669',  /* Deep green (success) */
                    700: '#047857',  /* Darker green */
                    800: '#065f46',  /* Very dark green */
                    900: '#064e3b',  /* Deepest green */
                },
                warning: {
                    DEFAULT: "hsl(var(--warning))",
                    foreground: "hsl(var(--warning-foreground))",
                    50: '#fefce8',   /* Very light amber - Attention indicator */
                    100: '#fef9c3',  /* Light amber */
                    200: '#fef08a',  /* Soft amber */
                    300: '#fde047',  /* Medium light amber */
                    400: '#facc15',  /* Medium amber */
                    500: '#eab308',  /* Standard amber (warning) */
                    600: '#ca8a04',  /* Deep amber */
                    700: '#a16207',  /* Darker amber */
                    800: '#854d0e',  /* Very dark amber */
                    900: '#713f12',  /* Deepest amber */
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
                    50: '#f0f9ff',   /* Very light medical blue-gray */
                    100: '#e0f2fe',  /* Light medical blue-gray */
                    200: '#bae6fd',  /* Soft medical blue-gray */
                    300: '#7dd3fc',  /* Medium light medical blue-gray */
                    400: '#38bdf8',  /* Medium medical blue-gray */
                    500: '#0ea5e9',  /* Standard medical blue-gray */
                    600: '#0284c7',  /* Deep medical blue-gray */
                    700: '#0369a1',  /* Darker medical blue-gray */
                    800: '#075985',  /* Very dark medical blue-gray */
                    900: '#0c4a6e',  /* Deepest medical blue-gray */
                },
                whatsapp: {
                    DEFAULT: '#0B5A50',  /* WhatsApp darkest green - WCAG AA compliant */
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#25d366',  /* Original WhatsApp green */
                    500: '#0B5A50',  /* WCAG AA compliant: 5.0:1 contrast with white */
                    600: '#084539',  /* Darker for hover */
                    700: '#063429',  /* Even darker */
                    800: '#042418',  /* Very dark */
                    900: '#021308',  /* Deepest */
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
