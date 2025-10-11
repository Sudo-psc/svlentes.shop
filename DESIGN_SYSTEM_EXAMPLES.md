# 📚 Exemplos de Código - Sistema de Design

## 🎨 Componentes Prontos para Copiar

### Hero Section com CTA
```tsx
<section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10">
  <div className="container-custom section-padding">
    <div className="max-w-4xl mx-auto text-center space-y-8">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground animate-fade-in">
        Lentes de Contato por Assinatura
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
        Receba suas lentes em casa com acompanhamento médico especializado
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
        <Button variant="primary" size="lg">
          Assinar Agora
        </Button>
        <Button variant="outline" size="lg">
          Saiba Mais
        </Button>
      </div>
    </div>
  </div>
</section>
```

### Card de Plano
```tsx
<div className="card-interactive group">
  {/* Badge */}
  <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
    Mais Popular
  </div>
  
  {/* Título */}
  <h3 className="text-2xl font-bold text-foreground mb-2">
    Plano Mensal
  </h3>
  
  {/* Descrição */}
  <p className="text-muted-foreground mb-6">
    Ideal para quem quer flexibilidade
  </p>
  
  {/* Preço */}
  <div className="mb-6">
    <div className="flex items-baseline">
      <span className="text-4xl font-bold text-primary">R$ 99</span>
      <span className="text-lg text-muted-foreground ml-2">/mês</span>
    </div>
    <p className="text-sm text-muted-foreground mt-1">
      Cancele quando quiser
    </p>
  </div>
  
  {/* Features */}
  <ul className="space-y-3 mb-8">
    <li className="flex items-center text-foreground">
      <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      Entrega mensal em casa
    </li>
    <li className="flex items-center text-foreground">
      <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      Acompanhamento médico
    </li>
    <li className="flex items-center text-foreground">
      <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      Suporte via WhatsApp
    </li>
  </ul>
  
  {/* CTA */}
  <Button variant="primary" fullWidth size="lg">
    Escolher Plano
  </Button>
</div>
```

### Formulário de Contato
```tsx
<form className="space-y-6 max-w-md mx-auto">
  {/* Nome */}
  <div>
    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
      Nome Completo
    </label>
    <input
      type="text"
      id="name"
      name="name"
      className="input-field"
      placeholder="João Silva"
      required
    />
  </div>
  
  {/* Email */}
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
      Email
    </label>
    <input
      type="email"
      id="email"
      name="email"
      className="input-field"
      placeholder="joao@email.com"
      required
    />
  </div>
  
  {/* Telefone */}
  <div>
    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
      Telefone
    </label>
    <input
      type="tel"
      id="phone"
      name="phone"
      className="input-field"
      placeholder="(11) 99999-9999"
      required
    />
  </div>
  
  {/* Mensagem */}
  <div>
    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
      Mensagem
    </label>
    <textarea
      id="message"
      name="message"
      rows={4}
      className="input-field"
      placeholder="Como podemos ajudar?"
      required
    />
  </div>
  
  {/* Submit */}
  <Button variant="primary" fullWidth size="lg" type="submit">
    Enviar Mensagem
  </Button>
</form>
```

### Trust Badges
```tsx
<div className="flex flex-wrap items-center justify-center gap-6 py-8">
  {/* CRM Badge */}
  <div className="flex items-center space-x-2 px-4 py-2 bg-success/10 dark:bg-success/20 rounded-lg border border-success/20">
    <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    <span className="text-sm font-semibold text-success">CRM-MG 69.870</span>
  </div>
  
  {/* ANVISA Badge */}
  <div className="flex items-center space-x-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20">
    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    <span className="text-sm font-semibold text-primary">Aprovado ANVISA</span>
  </div>
  
  {/* Pioneiro Badge */}
  <div className="flex items-center space-x-2 px-4 py-2 bg-accent/10 dark:bg-accent/20 rounded-lg border border-accent/20">
    <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
    <span className="text-sm font-semibold text-accent">Pioneiro no Brasil</span>
  </div>
</div>
```

### FAQ Accordion
```tsx
<div className="max-w-3xl mx-auto space-y-4">
  {faqs.map((faq, index) => (
    <div key={index} className="card">
      <button
        onClick={() => toggleFaq(index)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="text-lg font-semibold text-foreground pr-4">
          {faq.question}
        </h3>
        <svg
          className={`w-5 h-5 text-muted-foreground transition-transform ${
            openFaq === index ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {openFaq === index && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-muted-foreground">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  ))}
</div>
```

### Loading Skeleton
```tsx
<div className="card animate-pulse">
  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
  <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
  <div className="h-32 bg-muted rounded mb-4"></div>
  <div className="h-10 bg-muted rounded"></div>
</div>
```

### Toast Notification
```tsx
<div className="fixed bottom-4 right-4 z-50 animate-slide-up">
  <div className="card flex items-center space-x-3 min-w-[300px] shadow-2xl">
    {/* Success Icon */}
    <div className="flex-shrink-0 w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
      <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </div>
    
    {/* Message */}
    <div className="flex-1">
      <p className="font-semibold text-foreground">Sucesso!</p>
      <p className="text-sm text-muted-foreground">Sua assinatura foi confirmada.</p>
    </div>
    
    {/* Close Button */}
    <button className="text-muted-foreground hover:text-foreground">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </div>
</div>
```

### Modal
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
  <div className="card max-w-md w-full animate-scale-in">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-foreground">
        Confirmar Assinatura
      </h2>
      <button className="text-muted-foreground hover:text-foreground">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
    
    {/* Content */}
    <p className="text-muted-foreground mb-6">
      Você está prestes a assinar o plano mensal por R$ 99,90/mês.
      Deseja continuar?
    </p>
    
    {/* Actions */}
    <div className="flex gap-3">
      <Button variant="outline" fullWidth>
        Cancelar
      </Button>
      <Button variant="primary" fullWidth>
        Confirmar
      </Button>
    </div>
  </div>
</div>
```

### Stats Section
```tsx
<section className="bg-primary/5 dark:bg-primary/10 py-16">
  <div className="container-custom">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Stat 1 */}
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
          10k+
        </div>
        <p className="text-muted-foreground">
          Clientes Satisfeitos
        </p>
      </div>
      
      {/* Stat 2 */}
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
          98%
        </div>
        <p className="text-muted-foreground">
          Taxa de Satisfação
        </p>
      </div>
      
      {/* Stat 3 */}
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
          5 anos
        </div>
        <p className="text-muted-foreground">
          No Mercado
        </p>
      </div>
    </div>
  </div>
</section>
```

## 🎯 Dicas de Uso

1. **Copie e cole** os exemplos diretamente no seu código
2. **Ajuste as cores** usando as variantes (primary, secondary, accent)
3. **Teste em dark mode** para garantir que funciona bem
4. **Mantenha consistência** usando os mesmos padrões
5. **Combine componentes** para criar layouts complexos

## 📚 Mais Recursos

- Ver todos os componentes: `/design-system`
- Guia rápido: `DESIGN_SYSTEM_QUICK_GUIDE.md`
- Documentação completa: `DESIGN_SYSTEM_IMPLEMENTATION.md`
