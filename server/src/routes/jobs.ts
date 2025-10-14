import { Router } from 'express';
import * as jobsController from '../controllers/jobsController';

const router = Router();

router.post('/', jobsController.createJob);
router.get('/', jobsController.getJobs);
router.get('/:id', jobsController.getJobById);
router.patch('/:id/status', jobsController.updateJobStatus);

export default router;

