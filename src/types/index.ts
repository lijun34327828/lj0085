export * from '../../shared/types';

export interface CalculatorParams {
  discountRate: number;
  estimatedFlow: number;
  avgPrice: number;
  dailyFlow: number;
  materialCostRate: number;
}

export interface CalculatorState {
  params: CalculatorParams;
  result: CalculateResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}
