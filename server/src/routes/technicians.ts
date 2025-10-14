import { Router } from 'express';
import * as techniciansController from '../controllers/techniciansController';

const router = Router();

router.post('/', techniciansController.createTechnician);
router.get('/', techniciansController.getTechnicians);
router.get('/:id', techniciansController.getTechnicianById);

export default router;

