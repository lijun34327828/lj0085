import { Router } from 'express';
import { calculatorController } from '../controllers/calculator.controller';
import { validateCalculateRequest } from '../middleware/validator.middleware';

const router = Router();

router.post('/calculate', validateCalculateRequest, (req, res) => {
  calculatorController.calculate(req, res);
});

router.get('/health', (_req, res) => {
  calculatorController.health(_req, res);
});

export default router;
