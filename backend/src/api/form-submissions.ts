import { Router } from 'express';

import * as formSubmissionController from '../controllers/form-submission.controller.ts';

const router: Router = Router();

router.get('/', formSubmissionController.getAllSubmissions);
router.post('/', formSubmissionController.createSubmission);
router.delete('/:id', formSubmissionController.deleteSubmission);

export default router;
