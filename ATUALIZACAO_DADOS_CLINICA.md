# Atualização de Dados - Saraiva Vision

## Resumo das Alterações

Todos os dados de contato e informações empresariais foram atualizados para refletir os dados da **Clínica Saraiva Vision - Caratinga/MG**.

## Dados Atualizados

### Informações Empresariais
- **Nome Empresarial**: Saraiva Vision Care LTDA
- **CNPJ**: 53.864.119/0001-79
- **Nome Fantasia**: Saraiva Vision

### Endereço
- **Rua**: Catarina Maria Passos, 97
- **Bairro**: Santa Zita
- **Cidade**: Caratinga
- **Estado**: MG
- **Complemento**: dentro da Clínica Amor e Saúde

### Contatos
- **Telefone/WhatsApp**: +55 33 99860-1427
- **E-mail**: saraivavision@gmail.com
- **Website**: https://saraivavision.com.br
- **Instagram**: @saraiva_vision

### Responsável Técnico
- **Nome**: Dr. Philipe Saraiva Cruz
- **CRM**: CRM-MG 69.870

### Contato de Enfermagem
- **Nome**: Ana Lúcia
- **COREN**: COREN-MG 834184
- **Telefone**: +55 33 98420-7437

### Chatbot
- **URL**: https://chatgpt.com/g/g-quepJB90J-saraiva-vision-clinica-oftalmologica

### Coordenadas Geográficas
- **Latitude**: -19.7897
- **Longitude**: -42.1394

## Arquivos Modificados

### 1. Dados Principais
- ✅ `src/data/doctor-info.ts` - Atualizado com todos os novos dados
- ✅ `src/data/faq-data.ts` - CRM atualizado

### 2. SEO e Metadados
- ✅ `src/lib/seo.ts` - URLs, metadados e structured data atualizados
- ✅ `src/lib/schema.ts` - Schema.org structured data atualizado
- ✅ `src/app/page.tsx` - Canonical URL e metadados atualizados
- ✅ `src/app/robots.ts` - Base URL atualizado

### 3. Páginas Legais
- ✅ `src/app/politica-privacidade/page.tsx` - Dados de contato atualizados
- ✅ `src/app/termos-uso/page.tsx` - Informações empresariais e endereço atualizados

### 4. Páginas de Serviço
- ✅ `src/app/lentes-diarias/page.tsx` - CRM atualizado
- ✅ `src/app/agendar-consulta/page.tsx` - CRM atualizado
- ✅ `src/app/agendar-consulta/layout.tsx` - Metadados e URLs atualizados
- ✅ `src/app/agendar-consulta/metadata.ts` - Metadados atualizados
- ✅ `src/app/agendamento-confirmado/page.tsx` - CRM atualizado

### 5. Componentes
- ✅ `src/components/privacy/PrivacyPolicy.tsx` - Dados atualizados
- ✅ `src/components/sections/FinalCTA.tsx` - CRM atualizado
- ✅ `src/components/sections/HowItWorksSection.tsx` - CRM atualizado
- ✅ `src/components/layout/Header.tsx` - CRM atualizado

### 6. API Routes
- ✅ `src/app/api/schedule-consultation/route.ts` - CRM atualizado

### 7. Arquivos Públicos
- ✅ `public/sitemap.xml` - Todas as URLs atualizadas para saraivavision.com.br
- ✅ `public/robots.txt` - Host e sitemap URL atualizados

### 8. Configurações
- ✅ `vercel.json` - CORS origin atualizado

## Observações Importantes

### Foco da Clínica
A descrição foi atualizada para refletir:
- Tecnologia diagnóstica avançada
- Cuidado familiar
- Atuação em consultório próprio
- Parceria com Clínica Amor e Saúde

### URLs Atualizadas
Todas as referências foram alteradas de:
- `https://svlentes.shop` → `https://saraivavision.com.br`

### Redes Sociais
- Instagram: `@svlentes.shop` → `@saraiva_vision`
- Adicionado link do chatbot oficial

### CRM Atualizado
- De: CRM 69.870 (sem estado)
- Para: CRM-MG 69.870 (com estado especificado)

## Próximos Passos Recomendados

1. **Verificar Imagens**
   - Confirmar se o logo em `/icones/logosv.webp` está correto
   - Verificar foto do Dr. Philipe em `/icones/drphilipe_perfil.jpeg`

2. **Configurar DNS**
   - Apontar domínio saraivavision.com.br para Vercel
   - Configurar certificado SSL

3. **Atualizar Integrações**
   - Verificar configurações do Stripe
   - Atualizar webhooks com nova URL
   - Configurar WhatsApp Business API com novo número

4. **Google Search Console**
   - Adicionar novo domínio
   - Submeter novo sitemap
   - Configurar redirecionamentos se necessário

5. **Analytics**
   - Atualizar Google Analytics com novo domínio
   - Configurar eventos de conversão

6. **Testes**
   - Testar todos os formulários de contato
   - Verificar links do WhatsApp
   - Testar fluxo de assinatura completo

## Status

✅ **Concluído** - Todos os dados foram atualizados nos arquivos principais do sistema.

Os canais de contato (telefone, WhatsApp, e-mail, site e Instagram) agora apontam corretamente para a Clínica Saraiva Vision.
