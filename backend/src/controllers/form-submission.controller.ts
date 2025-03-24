'use strict';

import * as yup from 'yup';

import formSubmissionService from '../services/form-submission.service';
import { Request, Response } from '../types/express';
import { FormSubmissionRepository } from '../types/form-submission-repository';
import { formSubmissionSchema } from '../util/validation';

const sanitizeText = (text: string): string => {
  // Escape HTML special characters
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Factory function that returns a controller with the service injected
export const createSubmissionFactory = (
  service: FormSubmissionRepository = formSubmissionService
) => {
  return async (req: Request, res: Response) => {
    try {
      const submissionData = req.body.submission || req.body;

      // Validate using Yup
      const validatedData = await formSubmissionSchema.validate(
        submissionData,
        {
          abortEarly: false,
        }
      );

      // Ensure the name field is present and properly formatted
      const firstName = sanitizeText(validatedData.firstName);
      const lastName = sanitizeText(validatedData.lastName);

      // Sanitize the validated data
      const sanitizedData = {
        firstName,
        lastName,
        email: sanitizeText(validatedData.email),
        message: sanitizeText(validatedData.message),
        queryType: sanitizeText(validatedData.queryType),
      };

      // Create the submission using sanitized data
      const result = await service.create(sanitizedData);
      return res.status(201).json(result);
    } catch (error: unknown) {
      console.error('Error creating submission:', error);

      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.inner.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      }

      return res.status(500).json({
        error: 'Failed to create submission',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  };
};

export const createSubmission = createSubmissionFactory();

// Factory function for getting all submissions
export const getAllSubmissionsFactory = (
  service: FormSubmissionRepository = formSubmissionService
) => {
  return async (_req: Request, res: Response) => {
    try {
      const submissions = await service.findAll();
      return res.json(submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return res.status(500).json({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };
};

// The Express controller that uses the factory
export const getAllSubmissions = getAllSubmissionsFactory();

// Factory function for deletion
export const deleteSubmissionFactory = (
  service: FormSubmissionRepository = formSubmissionService
) => {
  return async (id: string) => {
    try {
      const deleted = await service.deleteById(id);

      if (!deleted) {
        const error = new Error('Submission not found');
        console.error('Error deleting submission:', error);
        throw error;
      }

      // Return void/undefined as expected by tests
      return;
    } catch (error) {
      // Log and rethrow any errors from the service
      console.error('Error deleting submission:', error);
      throw error;
    }
  };
};

// The direct function to be used in tests
export const deleteSubmissionDirect = deleteSubmissionFactory();

// The Express controller that uses the factory
export const deleteSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await formSubmissionService.deleteById(id);
    return res.status(200).json({
      success: true,
      message: 'Submission deleted successfully',
      id: id,
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};
