import { UsagePattern, LensType } from '@/types';

// Padrões de uso de lentes
export const usagePatterns: UsagePattern[] = [
  {
    id: 'occasional',
    name: 'Uso Ocasional',
    daysPerMonth: 10,
    description: 'Fins de semana e eventos especiais'
  },
  {
    id: 'regular',
    name: 'Uso Regular',
    daysPerMonth: 20,
    description: 'Trabalho e atividades sociais'
  },
  {
    id: 'daily',
    name: 'Uso Diário',
    daysPerMonth: 30,
    description: 'Todos os dias da semana'
  }
];

// Tipos de lentes com preços
export const lensTypes: LensType[] = [
  {
    id: 'daily',
    name: 'Lentes Diárias',
    avulsoPrice: 4.50, // por lente
    subscriptionPrice: 2.70 // por lente na assinatura
  },
  {
    id: 'weekly',
    name: 'Lentes Semanais',
    avulsoPrice: 12.00, // por lente
    subscriptionPrice: 7.20 // por lente na assinatura
  },
  {
    id: 'monthly',
    name: 'Lentes Mensais',
    avulsoPrice: 25.00, // por lente
    subscriptionPrice: 15.00 // por lente na assinatura
  }
];

// Mapeamento de planos recomendados baseado no uso
export const planRecommendations = {
  occasional: 'basic',
  regular: 'premium',
  daily: 'premium'
};