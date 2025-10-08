import { ThemeToggle, ThemeToggleSimple } from '@/components/theme/ThemeToggle'

export default function ThemeDemoPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container-custom section-padding">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                            Demonstração de Tema
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Teste o modo claro, escuro e automático
                        </p>
                    </div>

                    {/* Theme Toggles */}
                    <div className="card space-y-6">
                        <h2 className="text-2xl font-bold text-foreground">Controles de Tema</h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">
                                    Toggle Completo (3 opções)
                                </p>
                                <ThemeToggle />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">
                                    Toggle Simples (alternância)
                                </p>
                                <ThemeToggleSimple />
                            </div>
                        </div>
                    </div>

                    {/* Color Palette */}
                    <div className="card space-y-6">
                        <h2 className="text-2xl font-bold text-foreground">Paleta de Cores</h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <div className="h-20 bg-primary rounded-lg"></div>
                                <p className="text-sm font-medium">Primary</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-20 bg-secondary rounded-lg"></div>
                                <p className="text-sm font-medium">Secondary</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-20 bg-accent rounded-lg"></div>
                                <p className="text-sm font-medium">Accent</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-20 bg-success rounded-lg"></div>
                                <p className="text-sm font-medium">Success</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-20 bg-warning rounded-lg"></div>
                                <p className="text-sm font-medium">Warning</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-20 bg-destructive rounded-lg"></div>
                                <p className="text-sm font-medium">Destructive</p>
                            </div>
                        </div>
                    </div>

                    {/* Components */}
                    <div className="card space-y-6">
                        <h2 className="text-2xl font-bold text-foreground">Componentes</h2>

                        <div className="space-y-4">
                            <button className="btn-primary w-full">
                                Botão Primary
                            </button>
                            <button className="btn-secondary w-full">
                                Botão Secondary
                            </button>
                            <button className="btn-outline w-full">
                                Botão Outline
                            </button>
                            <button className="btn-ghost w-full">
                                Botão Ghost
                            </button>
                        </div>
                    </div>

                    {/* Cards */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">Cards</h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="card">
                                <h3 className="text-lg font-semibold mb-2">Card Padrão</h3>
                                <p className="text-muted-foreground">
                                    Este é um card padrão com hover effect
                                </p>
                            </div>
                            <div className="card-interactive">
                                <h3 className="text-lg font-semibold mb-2">Card Interativo</h3>
                                <p className="text-muted-foreground">
                                    Este card tem efeitos de hover mais pronunciados
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Typography */}
                    <div className="card space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">Tipografia</h2>

                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold text-foreground">Heading 1</h1>
                            <h2 className="text-3xl font-bold text-foreground">Heading 2</h2>
                            <h3 className="text-2xl font-bold text-foreground">Heading 3</h3>
                            <p className="text-base text-foreground">
                                Texto normal com contraste adequado
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Texto secundário com cor muted
                            </p>
                        </div>
                    </div>

                    {/* Form Elements */}
                    <div className="card space-y-6">
                        <h2 className="text-2xl font-bold text-foreground">Formulários</h2>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Campo de texto"
                                className="input-field"
                            />
                            <textarea
                                placeholder="Área de texto"
                                className="input-field"
                                rows={4}
                            />
                            <select className="input-field">
                                <option>Opção 1</option>
                                <option>Opção 2</option>
                                <option>Opção 3</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
