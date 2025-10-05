# 📝 Nota sobre Structured Data

## ⚠️ Temporariamente Desabilitado

O componente `StructuredData` foi temporariamente comentado para resolver um erro de runtime.

### Arquivos Afetados

```
src/app/layout.tsx          - Comentado
src/app/page.tsx            - Removido import
```

### Motivo

Erro: `Cannot read properties of undefined (reading 'call')`

Este erro estava impedindo a aplicação de carregar. A causa raiz pode ser:
- Problema com imports circulares
- Conflito de módulos
- Issue com o componente StructuredData

### Para Reativar

Quando o erro for resolvido, descomentar em:

**src/app/layout.tsx:**
```tsx
import { StructuredData } from '@/components/seo/StructuredData'

// ...

const organizationData = generateOrganizationStructuredData()
const websiteData = generateWebSiteStructuredData()

// ...

<StructuredData data={[organizationData, websiteData]} />
```

**src/app/page.tsx:**
```tsx
import { StructuredData } from '@/components/seo/StructuredData'
import { allSchemas } from '@/lib/schema'

// ...

<StructuredData data={allSchemas} />
```

### Impacto

**SEO:**
- Structured data não está sendo renderizado
- Pode afetar rich snippets no Google
- Não afeta funcionalidade do site

**Solução Temporária:**
- Metadata ainda está presente
- OpenGraph tags funcionando
- Site totalmente funcional

### Próximos Passos

1. Investigar causa raiz do erro
2. Testar StructuredData isoladamente
3. Verificar dependências
4. Reativar quando estável

---

**Status:** Desabilitado temporariamente
**Prioridade:** Média (não afeta funcionalidade)
**Data:** $(date)
