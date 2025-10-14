import { Router } from 'express';
import * as invoicesController from '../controllers/invoicesController';

const router = Router();

router.post('/:id/invoice', invoicesController.createInvoice);

export default router;

