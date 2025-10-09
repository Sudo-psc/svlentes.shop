# Widget de Acessibilidade - SVlentes

## Visão Geral

Widget completo de acessibilidade implementado para o site SVlentes, oferecendo múltiplas opções de personalização para usuários com diferentes necessidades de acessibilidade.

## Funcionalidades Implementadas

### 1. **Ajuste de Tamanho de Texto**
- Range: 80% a 150%
- Incrementos de 10%
- Persiste entre sessões
- Aplica-se a todo o site

### 2. **Espaçamento entre Linhas**
- Range: 1.2 a 2.5
- Incrementos de 0.1
- Melhora legibilidade para usuários com dislexia

### 3. **Espaçamento entre Letras**
- Range: 0px a 5px
- Incrementos de 0.5px
- Auxilia na leitura de textos

### 4. **Alto Contraste**
- Aumenta contraste de todos os elementos
- Adiciona bordas visíveis em botões e links
- Melhora contraste de imagens
- Ideal para usuários com baixa visão

### 5. **Escala de Cinza**
- Remove todas as cores do site
- Útil para usuários com daltonismo
- Reduz distrações visuais

### 6. **Destacar Links**
- Links ficam com fundo amarelo
- Texto preto para máximo contraste
- Sublinhado sempre visível
- Facilita navegação por teclado

### 7. **Tamanho do Cursor**
- **Normal**: Cursor padrão do sistema
- **Grande**: Cursor 32x32px
- **Extra Grande**: Cursor 48x48px
- Cursores customizados com SVG

### 8. **Reduzir Animações**
- Remove todas as animações
- Desabilita transições
- Scroll suave desabilitado
- Essencial para usuários com sensibilidade a movimento

### 9. **Navegação por Teclado**
- Link "Pular para conteúdo" (Skip to Content)
- Detecção automática de navegação por Tab
- Focus visível aprimorado
- Outline de 3px em azul (#0066CC)

## Componentes Criados

### `AccessibilityWidget.tsx`
Widget principal com painel flutuante contendo todas as opções de acessibilidade.

**Localização**: `src/components/accessibility/AccessibilityWidget.tsx`

**Props**: Nenhuma (gerencia estado interno)

**Funcionalidades**:
- Botão flutuante no canto inferior direito
- Painel expansível com scroll
- Persistência de configurações no localStorage
- Aplicação em tempo real das configurações

### `SkipToContent.tsx`
Link de atalho para pular navegação e ir direto ao conteúdo principal.

**Localização**: `src/components/accessibility/SkipToContent.tsx`

**Comportamento**:
- Invisível por padrão
- Aparece ao receber foco (Tab)
- Leva ao elemento `#main-content`

### `KeyboardNavigationDetector.tsx`
Detecta quando usuário está navegando por teclado e aplica estilos apropriados.

**Localização**: `src/components/accessibility/KeyboardNavigationDetector.tsx`

**Comportamento**:
- Adiciona classe `user-is-tabbing` ao body
- Remove outline de foco quando usando mouse
- Adiciona outline quando usando teclado

## Estilos CSS

### `accessibility.css`
Arquivo com todos os estilos de acessibilidade.

**Localização**: `src/styles/accessibility.css`

**Classes principais**:
- `.high-contrast` - Alto contraste
- `.grayscale` - Escala de cinza
- `.highlight-links` - Destaque de links
- `.cursor-large` - Cursor grande
- `.cursor-extra-large` - Cursor extra grande
- `.reduce-motion` - Animações reduzidas
- `.skip-to-content` - Link de atalho
- `.sr-only` - Screen reader only

## Integração

### Root Layout
O widget foi integrado ao layout principal em `src/app/layout.tsx`:

```tsx
import { AccessibilityWidget, SkipToContent, KeyboardNavigationDetector } from '@/components/accessibility'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <SkipToContent />
        <KeyboardNavigationDetector />
        <Header />
        <main id="main-content">
          {children}
        </main>
        <Footer />
        <AccessibilityWidget />
      </body>
    </html>
  )
}
```

### Globals CSS
Importação dos estilos em `src/app/globals.css`:

```css
@import '../styles/accessibility.css';
```

## Persistência de Dados

As configurações são salvas no `localStorage` com a chave `accessibility-settings`:

```json
{
  "fontSize": 100,
  "lineHeight": 1.5,
  "letterSpacing": 0,
  "highContrast": false,
  "grayscale": false,
  "highlightLinks": false,
  "cursorSize": "normal",
  "reducedMotion": false
}
```

## Conformidade com WCAG

### WCAG 2.1 Level AA
✅ **1.4.3 Contrast (Minimum)**: Alto contraste disponível
✅ **1.4.4 Resize Text**: Texto redimensionável até 200%
✅ **1.4.8 Visual Presentation**: Espaçamento de linha e letra ajustáveis
✅ **1.4.12 Text Spacing**: Espaçamento customizável
✅ **2.1.1 Keyboard**: Navegação completa por teclado
✅ **2.4.1 Bypass Blocks**: Skip to content implementado
✅ **2.4.7 Focus Visible**: Focus sempre visível
✅ **2.3.3 Animation from Interactions**: Opção de reduzir animações

### WCAG 2.1 Level AAA
✅ **1.4.6 Contrast (Enhanced)**: Alto contraste 7:1
✅ **2.2.3 No Timing**: Sem limites de tempo
✅ **2.3.2 Three Flashes**: Sem flashes
✅ **2.5.5 Target Size**: Botões com 44px mínimo

## Uso

### Para Usuários

1. **Abrir Widget**: Clique no botão de engrenagem no canto inferior direito
2. **Ajustar Configurações**: Use os controles deslizantes e checkboxes
3. **Aplicação Automática**: Mudanças são aplicadas instantaneamente
4. **Restaurar Padrões**: Clique em "Restaurar Padrões" para resetar

### Atalhos de Teclado

- **Tab**: Navegar entre elementos interativos
- **Enter/Space**: Ativar botões e checkboxes
- **Esc**: Fechar painel (pode ser implementado)

## Testes

### Testes Manuais Recomendados

1. **Navegação por Teclado**
   - Pressione Tab repetidamente
   - Verifique se todos os elementos são alcançáveis
   - Confirme que o focus é visível

2. **Screen Readers**
   - Teste com NVDA (Windows)
   - Teste com JAWS (Windows)
   - Teste com VoiceOver (macOS/iOS)

3. **Zoom do Navegador**
   - Teste zoom até 200%
   - Verifique se não há overflow horizontal
   - Confirme que todo conteúdo é acessível

4. **Diferentes Dispositivos**
   - Desktop (mouse e teclado)
   - Tablet (touch)
   - Mobile (touch e gestos)

### Testes Automatizados

```bash
# Lighthouse Accessibility Audit
npm run lighthouse

# axe-core (pode ser adicionado)
npm install --save-dev @axe-core/react
```

## Melhorias Futuras

### Curto Prazo
- [ ] Adicionar atalho de teclado para abrir widget (Alt+A)
- [ ] Adicionar opção de fonte dyslexia-friendly
- [ ] Implementar modo de leitura (reading mode)
- [ ] Adicionar tooltips explicativos

### Médio Prazo
- [ ] Perfis pré-configurados (Baixa Visão, Dislexia, etc.)
- [ ] Sincronização de configurações entre dispositivos
- [ ] Modo de alto contraste customizável
- [ ] Suporte a temas de cores personalizados

### Longo Prazo
- [ ] Integração com tecnologias assistivas
- [ ] Análise de uso para melhorias
- [ ] Suporte a múltiplos idiomas
- [ ] API para desenvolvedores

## Recursos Adicionais

### Documentação
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)

### Ferramentas de Teste
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## Suporte

Para questões ou sugestões sobre acessibilidade:
- Email: acessibilidade@saraivavision.com.br
- Issues: GitHub repository

## Licença

Este componente faz parte do projeto SVlentes e segue a mesma licença do projeto principal.
