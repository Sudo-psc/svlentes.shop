import { FAQItem } from '@/types'

// Perguntas frequentes organizadas por categoria
export const faqData: FAQItem[] = [
    {
        id: 'how-it-works',
        question: 'Como funciona o serviço de assinatura?',
        answer: 'Você se cadastra, escolhe seu plano, e recebe suas lentes automaticamente em casa. O Dr. Philipe Saraiva Cruz acompanha sua saúde ocular através de consultas regulares e você nunca mais fica sem lentes.',
        category: 'geral'
    },
    {
        id: 'medical-follow-up',
        question: 'Como é feito o acompanhamento médico?',
        answer: 'O Dr. Philipe Saraiva Cruz (CRM 65.870) realiza consultas regulares conforme seu plano, além de estar disponível para teleorientação. Você tem acesso a um especialista em oftalmologia sempre que precisar.',
        category: 'medico'
    },
    {
        id: 'lens-types',
        question: 'Que tipos de lentes vocês oferecem?',
        answer: 'Trabalhamos com lentes de contato diárias, semanais e mensais das melhores marcas do mercado. O tipo ideal é definido durante sua consulta médica, considerando seu estilo de vida e necessidades.',
        category: 'produto'
    },
    {
        id: 'prescription-needed',
        question: 'Preciso ter receita médica?',
        answer: 'Sim, lentes de contato são dispositivos médicos que exigem prescrição. Se você não tem uma receita atualizada, podemos agendar uma consulta com o Dr. Philipe para avaliar suas necessidades.',
        category: 'medico'
    },
    {
        id: 'delivery-frequency',
        question: 'Com que frequência recebo as lentes?',
        answer: 'Depende do seu plano: Básico (a cada 3 meses), Premium (mensal) ou VIP (quinzenal se necessário). Você sempre recebe antes de acabar suas lentes atuais.',
        category: 'entrega'
    },
    {
        id: 'cancellation-policy',
        question: 'Posso cancelar a qualquer momento?',
        answer: 'Sim! Você pode pausar, alterar ou cancelar sua assinatura a qualquer momento sem multas ou taxas. Basta entrar em contato conosco pelo WhatsApp ou app.',
        category: 'assinatura'
    },
    {
        id: 'emergency-replacement',
        question: 'E se eu perder ou danificar minhas lentes?',
        answer: 'Nos planos Premium e VIP, você tem seguro incluído. No plano Básico, oferecemos reposição de emergência com desconto especial. Entre em contato e resolvemos rapidamente.',
        category: 'suporte'
    },
    {
        id: 'cost-savings',
        question: 'Quanto eu economizo com a assinatura?',
        answer: 'Em média, nossos clientes economizam entre 30% a 40% comparado à compra avulsa. Use nossa calculadora para ver sua economia personalizada baseada no seu uso atual.',
        category: 'preco'
    },
    {
        id: 'first-time-user',
        question: 'Nunca usei lentes de contato. Vocês me ajudam?',
        answer: 'Claro! O Dr. Philipe fará uma avaliação completa, ensinará como usar e cuidar das lentes, e acompanhará sua adaptação de perto. Você terá todo o suporte necessário.',
        category: 'medico'
    },
    {
        id: 'coverage-area',
        question: 'Vocês atendem em todo o Brasil?',
        answer: 'Sim! Fazemos entregas gratuitas em todo território nacional. As consultas podem ser presenciais (São Paulo) ou por telemedicina para outras regiões.',
        category: 'entrega'
    }
]

// FAQ organizado por categorias para melhor UX
export const faqByCategory = {
    geral: faqData.filter(item => item.category === 'geral'),
    medico: faqData.filter(item => item.category === 'medico'),
    produto: faqData.filter(item => item.category === 'produto'),
    entrega: faqData.filter(item => item.category === 'entrega'),
    assinatura: faqData.filter(item => item.category === 'assinatura'),
    suporte: faqData.filter(item => item.category === 'suporte'),
    preco: faqData.filter(item => item.category === 'preco')
}

// FAQ destacado para a landing page (6 principais)
export const featuredFAQ: FAQItem[] = [
    faqData.find(item => item.id === 'how-it-works')!,
    faqData.find(item => item.id === 'medical-follow-up')!,
    faqData.find(item => item.id === 'cost-savings')!,
    faqData.find(item => item.id === 'cancellation-policy')!,
    faqData.find(item => item.id === 'prescription-needed')!,
    faqData.find(item => item.id === 'coverage-area')!
]