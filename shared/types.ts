export interface CalculateRequest {
  discountRate: number;
  estimatedFlow: number;
  avgPrice: number;
  dailyFlow?: number;
  materialCostRate?: number;
}

export interface ActivityData {
  revenue: number;
  discountCost: number;
  profit: number;
  grossMargin: number;
}

export interface DailyData {
  revenue: number;
  profit: number;
  grossMargin: number;
}

export interface ComparisonData {
  revenueDiff: number;
  profitDiff: number;
  revenueChangeRate: number;
  profitChangeRate: number;
}

export interface BreakdownData {
  labels: string[];
  activityData: number[];
  dailyData: number[];
}

export interface CalculateResponse {
  activity: ActivityData;
  daily: DailyData;
  comparison: ComparisonData;
  breakdown: BreakdownData;
}
