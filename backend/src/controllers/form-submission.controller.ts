import { Request, Response } from 'express';

import formSubmissionService from '../services/form-submission.service';
import { FormSubmissionRepository } from '../types/form-submission-repository';
import { validateFormSubmission } from '../validators/form-submission.validators';

export const getAllSubmissions = async (_req: Request, res: Response) => {
  try {
    const submissions = await formSubmissionService.findAll();
    res.json(submissions);
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    res.status(500).json({ error: 'Failed to retrieve submissions' });
  }
};

// Factory function that returns a controller with the service injected
export const createSubmissionFactory = (
  service: FormSubmissionRepository = formSubmissionService
) => {
  // Return the actual controller function
  return async (req: Request, res: Response) => {
    try {
      if (!req.body.submission) {
        return res.status(400).json({
          error: 'Invalid request format: Expected data in "submission" field',
        });
      }

      const submissionData = req.body.submission;

      // Validate the submission data
      const validationErrors = validateFormSubmission(submissionData);
      if (Object.keys(validationErrors).length > 0) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validationErrors,
        });
      }

      if (!submissionData.queryType) {
        return res.status(400).json({
          error: 'Missing required field',
          details: 'queryType is required',
        });
      }

      // Create the submission
      const result = await service.create(submissionData);
      return res.status(201).json(result);
    } catch (error) {
      console.error('Error creating submission:', error);
      return res.status(500).json({
        error: 'Server error processing submission',
      });
    }
  };
};

// Export the default controller using the factory
export const createSubmission = createSubmissionFactory();

export const deleteSubmission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    const result = await formSubmissionService.deleteById(id);

    if (result === 0) {
      res.status(404).json({ message: 'Submission not found' });
      return;
    }

    res.status(200).json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting submission', error });
  }
};
