export function ThemeScript() {
    const themeScript = `
        (function() {
            try {
                const theme = localStorage.getItem('theme') || 'system';
                const root = document.documentElement;
                
                if (theme === 'system') {
                    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.classList.add(systemTheme);
                } else {
                    root.classList.add(theme);
                }
            } catch (e) {
                console.error('Theme initialization error:', e);
            }
        })();
    `

    return (
        <script
            dangerouslySetInnerHTML={{ __html: themeScript }}
            suppressHydrationWarning
        />
    )
}
