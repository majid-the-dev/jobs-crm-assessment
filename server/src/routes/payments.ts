import { Router } from 'express';
import * as paymentsController from '../controllers/paymentsController';

const router = Router();

router.post('/:id/payments', paymentsController.createPayment);

export default router;

