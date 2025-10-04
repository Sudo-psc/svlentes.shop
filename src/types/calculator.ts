// Tipos para a calculadora de economia

export interface UsagePattern {
  id: string;
  name: string;
  daysPerMonth: number;
  description: string;
}

export interface LensType {
  id: string;
  name: string;
  avulsoPrice: number;
  subscriptionPrice: number;
}

export interface CalculatorInput {
  lensType: string;
  usagePattern: string;
  currentMonthlySpend?: number;
}

export interface CalculatorResult {
  monthlyAvulso: number;
  monthlySubscription: number;
  monthlySavings: number;
  yearlyAvulso: number;
  yearlySubscription: number;
  yearlySavings: number;
  savingsPercentage: number;
  recommendedPlan: string;
}

export interface CalculatorProps {
  onCalculate: (result: CalculatorResult) => void;
  initialData?: Partial<CalculatorInput>;
}