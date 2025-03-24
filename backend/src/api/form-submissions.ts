'use strict';

import { Router } from 'express';

import * as formSubmissionController from '../controllers/form-submission.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router: Router = Router();

// Protected route - only admin can view all submissions
router.get(
  '/',
  authenticate,
  requireAdmin,
  formSubmissionController.getAllSubmissions
);
router.post('/', formSubmissionController.createSubmission);
// Protected route - only admin can delete submissions
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  formSubmissionController.deleteSubmission
);

export default router;
