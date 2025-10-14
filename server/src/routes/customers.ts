import { Router } from 'express';
import * as customersController from '../controllers/customersController';

const router = Router();

router.post('/', customersController.createCustomer);
router.get('/', customersController.getCustomers);
router.get('/:id', customersController.getCustomerById);

export default router;

