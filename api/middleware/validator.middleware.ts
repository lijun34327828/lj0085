import { Request, Response, NextFunction } from 'express';
import type { CalculateRequest } from '../types';

export function validateCalculateRequest(
  req: Request<unknown, unknown, CalculateRequest>,
  res: Response,
  next: NextFunction
): void {
  const { discountRate, estimatedFlow, avgPrice, dailyFlow, materialCostRate } = req.body;

  const errors: string[] = [];

  if (discountRate === undefined || discountRate === null) {
    errors.push('折扣比例 (discountRate) 是必填项');
  } else if (typeof discountRate !== 'number' || discountRate <= 0 || discountRate > 1) {
    errors.push('折扣比例 (discountRate) 必须是大于0且小于等于1的数字');
  }

  if (estimatedFlow === undefined || estimatedFlow === null) {
    errors.push('预估客流 (estimatedFlow) 是必填项');
  } else if (typeof estimatedFlow !== 'number' || estimatedFlow <= 0 || !Number.isInteger(estimatedFlow)) {
    errors.push('预估客流 (estimatedFlow) 必须是正整数');
  }

  if (avgPrice === undefined || avgPrice === null) {
    errors.push('项目定价 (avgPrice) 是必填项');
  } else if (typeof avgPrice !== 'number' || avgPrice <= 0) {
    errors.push('项目定价 (avgPrice) 必须是大于0的数字');
  }

  if (dailyFlow !== undefined && dailyFlow !== null) {
    if (typeof dailyFlow !== 'number' || dailyFlow <= 0 || !Number.isInteger(dailyFlow)) {
      errors.push('日常客流 (dailyFlow) 必须是正整数');
    }
  }

  if (materialCostRate !== undefined && materialCostRate !== null) {
    if (typeof materialCostRate !== 'number' || materialCostRate < 0 || materialCostRate >= 1) {
      errors.push('物料成本率 (materialCostRate) 必须是大于等于0且小于1的数字');
    }
  }

  if (errors.length > 0) {
    res.status(400).json({
      code: 400,
      message: '参数校验失败',
      errors,
    });
    return;
  }

  next();
}
