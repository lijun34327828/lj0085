import type { CalculateRequest, CalculateResponse } from '../types';

export class CalculatorService {
  private readonly DEFAULT_DAILY_FLOW = 50;
  private readonly DEFAULT_MATERIAL_COST_RATE = 0.3;

  public calculate(request: CalculateRequest): CalculateResponse {
    const {
      discountRate,
      estimatedFlow,
      avgPrice,
      dailyFlow = this.DEFAULT_DAILY_FLOW,
      materialCostRate = this.DEFAULT_MATERIAL_COST_RATE,
    } = request;

    const dailyRevenue = avgPrice * dailyFlow;
    const dailyMaterialCost = dailyRevenue * materialCostRate;
    const dailyProfit = dailyRevenue - dailyMaterialCost;
    const dailyGrossMargin = dailyRevenue > 0 ? (dailyProfit / dailyRevenue) * 100 : 0;

    const activityRevenue = avgPrice * discountRate * estimatedFlow;
    const discountCost = (avgPrice - avgPrice * discountRate) * estimatedFlow;
    const activityMaterialCost = activityRevenue * materialCostRate;
    const activityProfit = activityRevenue - activityMaterialCost;
    const activityGrossMargin = activityRevenue > 0 ? (activityProfit / activityRevenue) * 100 : 0;

    const revenueDiff = activityRevenue - dailyRevenue;
    const profitDiff = activityProfit - dailyProfit;
    const revenueChangeRate = dailyRevenue > 0 ? (revenueDiff / dailyRevenue) * 100 : 0;
    const profitChangeRate = dailyProfit > 0 ? (profitDiff / dailyProfit) * 100 : 0;

    const breakdownLabels = ['营业收入', '让利成本', '物料成本', '毛利'];
    const activityBreakdown = [activityRevenue, discountCost, activityMaterialCost, activityProfit];
    const dailyBreakdown = [dailyRevenue, 0, dailyMaterialCost, dailyProfit];

    return {
      activity: {
        revenue: Math.round(activityRevenue * 100) / 100,
        discountCost: Math.round(discountCost * 100) / 100,
        profit: Math.round(activityProfit * 100) / 100,
        grossMargin: Math.round(activityGrossMargin * 100) / 100,
      },
      daily: {
        revenue: Math.round(dailyRevenue * 100) / 100,
        profit: Math.round(dailyProfit * 100) / 100,
        grossMargin: Math.round(dailyGrossMargin * 100) / 100,
      },
      comparison: {
        revenueDiff: Math.round(revenueDiff * 100) / 100,
        profitDiff: Math.round(profitDiff * 100) / 100,
        revenueChangeRate: Math.round(revenueChangeRate * 100) / 100,
        profitChangeRate: Math.round(profitChangeRate * 100) / 100,
      },
      breakdown: {
        labels: breakdownLabels,
        activityData: activityBreakdown.map(v => Math.round(v * 100) / 100),
        dailyData: dailyBreakdown.map(v => Math.round(v * 100) / 100),
      },
    };
  }
}

export const calculatorService = new CalculatorService();
