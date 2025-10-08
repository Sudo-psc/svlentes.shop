import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function DesignSystemPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container-custom py-12 space-y-16">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">
                            Sistema de Design
                        </h1>
                        <p className="text-muted-foreground">
                            Componentes e paleta de cores do SVlentes
                        </p>
                    </div>
                    <ThemeToggle />
                </div>

                {/* Cores */}
                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        Paleta de Cores
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Primary */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-foreground">Primary (Azul Médico)</h3>
                            <div className="space-y-2">
                                <div className="bg-primary-50 p-4 rounded-lg border border-border">
                                    <span className="text-sm font-mono">50</span>
                                </div>
                                <div className="bg-primary-100 p-4 rounded-lg border border-border">
                                    <span className="text-sm font-mono">100</span>
                                </div>
                                <div className="bg-primary-200 p-4 rounded-lg border border-border">
                                    <span className="text-sm font-mono">200</span>
                                </div>
                                <div className="bg-primary-300 p-4 rounded-lg border border-border">
                                    <span className="text-sm font-mono">300</span>
                                </div>
                                <div className="bg-primary-400 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">400</span>
                                </div>
                                <div className="bg-primary-500 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">500</span>
                                </div>
                                <div className="bg-primary-600 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono font-bold">600 (Brand)</span>
                                </div>
                                <div className="bg-primary-700 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">700</span>
                                </div>
                                <div className="bg-primary-800 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">800</span>
                                </div>
                                <div className="bg-primary-900 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">900</span>
                                </div>
                            </div>
                        </div>

                        {/* Secondary */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-foreground">Secondary (Verde Saúde)</h3>
                            <div className="space-y-2">
                                <div className="bg-secondary-50 p-4 rounded-lg border border-border">
                                    <span className="text-sm font-mono">50</span>
                                </div>
                                <div className="bg-secondary-100 p-4 rounded-lg border border-border">
                                    <span className="text-sm font-mono">100</span>
                                </div>
                                <div className="bg-secondary-200 p-4 rounded-lg border border-border">
                                    <span className="text-sm font-mono">200</span>
                                </div>
                                <div className="bg-secondary-300 p-4 rounded-lg border border-border">
                                    <span className="text-sm font-mono">300</span>
                                </div>
                                <div className="bg-secondary-400 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">400</span>
                                </div>
                                <div className="bg-secondary-500 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono font-bold">500 (Brand)</span>
                                </div>
                                <div className="bg-secondary-600 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">600</span>
                                </div>
                                <div className="bg-secondary-700 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">700</span>
                                </div>
                                <div className="bg-secondary-800 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">800</span>
                                </div>
                                <div className="bg-secondary-900 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">900</span>
                                </div>
                            </div>
                        </div>

                        {/* Accent */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-foreground">Accent (Laranja Energia)</h3>
                            <div className="space-y-2">
                                <div className="bg-accent-50 p-4 rounded-lg border border-border">
                                    <span className="text-sm font-mono">50</span>
                                </div>
                                <div className="bg-accent-100 p-4 rounded-lg border border-border">
                                    <span className="text-sm font-mono">100</span>
                                </div>
                                <div className="bg-accent-200 p-4 rounded-lg border border-border">
                                    <span className="text-sm font-mono">200</span>
                                </div>
                                <div className="bg-accent-300 p-4 rounded-lg border border-border">
                                    <span className="text-sm font-mono">300</span>
                                </div>
                                <div className="bg-accent-400 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">400</span>
                                </div>
                                <div className="bg-accent-500 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono font-bold">500 (Brand)</span>
                                </div>
                                <div className="bg-accent-600 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">600</span>
                                </div>
                                <div className="bg-accent-700 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">700</span>
                                </div>
                                <div className="bg-accent-800 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">800</span>
                                </div>
                                <div className="bg-accent-900 p-4 rounded-lg border border-border text-white">
                                    <span className="text-sm font-mono">900</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Botões */}
                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        Botões
                    </h2>
                    <div className="space-y-8">
                        {/* Variantes */}
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Variantes</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary">Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="accent">Accent</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="whatsapp">WhatsApp</Button>
                                <Button variant="success">Success</Button>
                                <Button variant="warning">Warning</Button>
                            </div>
                        </div>

                        {/* Tamanhos */}
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Tamanhos</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button variant="primary" size="sm">Small (40px)</Button>
                                <Button variant="primary" size="md">Medium (44px)</Button>
                                <Button variant="primary" size="lg">Large (52px)</Button>
                            </div>
                        </div>

                        {/* Estados */}
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Estados</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary">Normal</Button>
                                <Button variant="primary" disabled>Disabled</Button>
                            </div>
                        </div>

                        {/* Full Width */}
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Full Width</h3>
                            <Button variant="primary" fullWidth>
                                Botão de Largura Total
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Cards */}
                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        Cards
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card">
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                Card Padrão
                            </h3>
                            <p className="text-muted-foreground">
                                Este é um card padrão com sombra e borda.
                            </p>
                        </div>

                        <div className="card-interactive">
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                Card Interativo
                            </h3>
                            <p className="text-muted-foreground">
                                Este card tem efeito hover e é clicável.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Inputs */}
                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        Inputs
                    </h2>
                    <div className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Nome
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Digite seu nome"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Mensagem
                            </label>
                            <textarea
                                className="input-field"
                                rows={4}
                                placeholder="Sua mensagem"
                            />
                        </div>
                    </div>
                </section>

                {/* Tipografia */}
                <section>
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        Tipografia
                    </h2>
                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold text-foreground">
                            Heading 1
                        </h1>
                        <h2 className="text-4xl font-bold text-foreground">
                            Heading 2
                        </h2>
                        <h3 className="text-3xl font-bold text-foreground">
                            Heading 3
                        </h3>
                        <h4 className="text-2xl font-bold text-foreground">
                            Heading 4
                        </h4>
                        <p className="text-lg text-foreground">
                            Parágrafo grande - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </p>
                        <p className="text-base text-foreground">
                            Parágrafo normal - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Texto pequeno - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}
