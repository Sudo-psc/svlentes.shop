# Guia de Imagens Hero - SVlentes

## Imagens Disponíveis 🖼️

Você tem 3 imagens hero disponíveis no diretório `/public/`:
- `HEro.png` - Imagem principal (hero1)
- `Hero2.png` - Imagem alternativa 2 (hero2)  
- `Hero3.png` - Imagem alternativa 3 (hero3)

## Componentes Criados ✨

### 1. HeroImage (Melhorado)
Componente principal para exibir uma única imagem hero com:
- **Loading skeleton** animado
- **Trust badges** flutuantes com ícones
- **Elementos decorativos** animados
- **Badge médico** de credibilidade
- **Efeitos hover** suaves

```tsx
<HeroImage 
    imageVariant="hero1" // ou "hero2", "hero3"
    className="lg:scale-105" 
/>
```

### 2. HeroImageCarousel (Novo)
Carrossel automático com navegação para alternar entre as 3 imagens:
- **Auto-play** configurável (5s por padrão)
- **Navegação** com setas
- **Indicadores** de posição (dots)
- **Transições** suaves

```tsx
<HeroImageCarousel 
    autoPlay={true}
    autoPlayInterval={5000}
    className="lg:scale-105"
/>
```

## Implementação Atual 🚀

**Atualmente usando**: `HeroImage` com `imageVariant="hero1"` no `HeroSection.tsx`

## Opções de Uso 🎛️

### Opção 1: Imagem Fixa (Atual)
```tsx
// Em HeroSection.tsx
<HeroImage 
    imageVariant="hero1" // Escolha: hero1, hero2, ou hero3
    className="lg:scale-105 transform hover:scale-110 transition-transform duration-500"
/>
```

### Opção 2: Carrossel Automático
```tsx
// Substitua HeroImage por HeroImageCarousel em HeroSection.tsx
<HeroImageCarousel 
    autoPlay={true}
    autoPlayInterval={4000} // 4 segundos
    className="lg:scale-105"
/>
```

### Opção 3: Carrossel Manual
```tsx
<HeroImageCarousel 
    autoPlay={false} // Apenas navegação manual
    className="lg:scale-105"
/>
```

## Melhorias Implementadas 🎨

### Visual
- ✅ **Bordas arredondadas** (rounded-3xl)
- ✅ **Sombras profundas** (shadow-2xl)
- ✅ **Trust badges flutuantes** com ícones coloridos
- ✅ **Badge de credibilidade médica** no topo
- ✅ **Elementos decorativos** animados
- ✅ **Gradiente overlay** para melhor legibilidade

### Performance
- ✅ **Loading skeleton** durante carregamento
- ✅ **Lazy loading** otimizado
- ✅ **Sizes responsivos** configurados
- ✅ **Quality 95%** para máxima nitidez

### Interatividade
- ✅ **Hover effects** suaves
- ✅ **Transições** de 500ms
- ✅ **Animações** de entrada
- ✅ **Estados visuais** para loading

## Próximos Passos 📋

1. **Teste as imagens**: Verifique qual das 3 imagens funciona melhor
2. **Escolha o modo**: Imagem fixa ou carrossel
3. **Otimize as imagens**: Use WebP/AVIF para melhor performance
4. **A/B Test**: Teste diferentes variantes para conversão

## Comandos Úteis 🛠️

```bash
# Otimizar imagens (se tiver sharp instalado)
npm install sharp
node -e "
const sharp = require('sharp');
['HEro.png', 'Hero2.png', 'Hero3.png'].forEach(img => {
  sharp(\`public/\${img}\`)
    .webp({ quality: 90 })
    .toFile(\`public/\${img.replace('.png', '.webp')}\`);
});
"

# Verificar tamanhos das imagens
ls -lh public/Hero*.png
```

A imagem hero agora está muito mais atrativa e profissional! 🎉