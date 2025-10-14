import { Router } from 'express';
import customersRoutes from './customers';
import techniciansRoutes from './technicians';
import jobsRoutes from './jobs';
import appointmentsRoutes from './appointments';
import invoicesRoutes from './invoices';
import paymentsRoutes from './payments';

const router = Router();

router.use('/customers', customersRoutes);
router.use('/technicians', techniciansRoutes);
router.use('/jobs', jobsRoutes);
router.use('/jobs', appointmentsRoutes);
router.use('/jobs', invoicesRoutes);
router.use('/invoices', paymentsRoutes);

export default router;

