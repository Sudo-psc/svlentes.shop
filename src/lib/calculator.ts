import { CalculatorInput, CalculatorResult } from '@/types';
import { usagePatterns, lensTypes, planRecommendations } from '@/data/calculator-data';

/**
 * Calcula a economia baseada no padrão de uso e tipo de lente
 */
export function calculateEconomy(input: CalculatorInput): CalculatorResult {
  const usagePattern = usagePatterns.find(p => p.id === input.usagePattern);
  const lensType = lensTypes.find(l => l.id === input.lensType);
  
  if (!usagePattern || !lensType) {
    throw new Error('Padrão de uso ou tipo de lente inválido');
  }

  // Cálculo baseado no uso mensal (2 lentes por dia de uso)
  const lensesPerMonth = usagePattern.daysPerMonth * 2;
  
  // Custos mensais
  const monthlyAvulso = lensesPerMonth * lensType.avulsoPrice;
  const monthlySubscription = lensesPerMonth * lensType.subscriptionPrice;
  const monthlySavings = monthlyAvulso - monthlySubscription;
  
  // Custos anuais
  const yearlyAvulso = monthlyAvulso * 12;
  const yearlySubscription = monthlySubscription * 12;
  const yearlySavings = yearlyAvulso - yearlySubscription;
  
  // Percentual de economia
  const savingsPercentage = (monthlySavings / monthlyAvulso) * 100;
  
  // Plano recomendado
  const recommendedPlan = planRecommendations[input.usagePattern as keyof typeof planRecommendations];

  return {
    monthlyAvulso,
    monthlySubscription,
    monthlySavings,
    yearlyAvulso,
    yearlySubscription,
    yearlySavings,
    savingsPercentage,
    recommendedPlan
  };
}

/**
 * Formata valor monetário para exibição
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata percentual para exibição
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}