import { Router } from 'express';
import * as appointmentsController from '../controllers/appointmentsController';

const router = Router();

router.post('/:id/appointments', appointmentsController.createAppointment);

export default router;

