import { Request, Response } from 'express';
import { calculatorService } from '../services/calculator.service';
import type { CalculateRequest, CalculateResponse } from '../types';

export class CalculatorController {
  public calculate(req: Request<unknown, CalculateResponse, CalculateRequest>, res: Response<CalculateResponse>): void {
    const result = calculatorService.calculate(req.body);
    res.json(result);
  }

  public health(_req: Request, res: Response): void {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: '手作门店活动成本预估服务',
      version: '1.0.0',
    });
  }
}

export const calculatorController = new CalculatorController();
