// Otimizações para Core Web Vitals (CWV)
// Implemente este script antes do fechamento da tag </body>

(function () {
    'use strict';

    // Função para otimizar Largest Contentful Paint (LCP)
    function optimizeLCP() {
        // Preload de imagens críticas
        const criticalImages = [
            '/HEro.webp',
            '/icones/drphilipe_perfil.jpeg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });

        // Preconnect para domínios externos
        const domains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://www.googletagmanager.com'
        ];

        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    // Função para otimizar First Input Delay (FID)
    function optimizeFID() {
        // Lazy loading de imagens fora do viewport
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // Função para otimizar Cumulative Layout Shift (CLS)
    function optimizeCLS() {
        // Adicionar width e height às imagens para evitar layout shifts
        const images = document.querySelectorAll('img:not([width]):not([height])');

        images.forEach(img => {
            if (img.naturalWidth > 0) {
                img.width = img.naturalWidth;
                img.height = img.naturalHeight;
            }
        });

        // Adicionar font-display: swap para fontes externas
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Inter', sans-serif;
                font-display: swap;
                src: url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            }
        `;
        document.head.appendChild(style);
    }

    // Função para otimizar Time to Interactive (TTI)
    function optimizeTTI() {
        // Mover scripts não críticos para o final do body
        const scripts = document.querySelectorAll('script[data-defer]');

        scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.src = script.src;
            newScript.async = true;
            newScript.defer = true;
            document.body.appendChild(newScript);
            script.remove();
        });

        // Minificar CSS crítico inline
        const criticalCSS = `
            .hero-section { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
            .cta-button { padding: 16px 24px; }
        `;

        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.appendChild(style);
    }

    // Executar otimizações quando o DOM estiver carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            optimizeLCP();
            optimizeCLS();
            optimizeTTI();
        });
    } else {
        optimizeLCP();
        optimizeCLS();
        optimizeTTI();
    }

    // Lazy loading para FID
    if (document.readyState === 'complete') {
        optimizeFID();
    } else {
        window.addEventListener('load', optimizeFID);
    }

    // Monitorar performance
    if ('performance' in window && 'PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                }
                if (entry.entryType === 'first-input') {
                    console.log('FID:', entry.processingStart - entry.startTime);
                }
                if (entry.entryType === 'layout-shift') {
                    console.log('CLS:', entry.value);
                }
            });
        });

        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }

    // Otimizar rolagem suave para melhor experiência
    function smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    smoothScroll();

    // Adicionar atributos de acessibilidade
    function addAccessibility() {
        // ARIA labels para botões
        document.querySelectorAll('button').forEach(button => {
            if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
                button.setAttribute('aria-label', 'Botão');
            }
        });

        // Skip links para navegação por teclado
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Pular para conteúdo principal';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 left-4 bg-primary-600 text-white px-4 py-2 z-50';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    addAccessibility();

})();
