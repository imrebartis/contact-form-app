import * as yup from 'yup';

import FormSubmission from '../models/form-submission';
import formSubmissionService from '../services/form-submission.service';
import { Request, Response } from '../types/express';
import { FormSubmissionRepository } from '../types/form-submission-repository';
import { getSequelizeInstance } from '../util/db';
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

export const createSubmission = async (req: Request, res: Response) => {
  console.log('Received form submission request:', JSON.stringify(req.body));

  try {
    // Get optimized sequelize instance for serverless environment
    const sequelize = await getSequelizeInstance();
    console.log('Database connection established');

    // Ensure FormSubmission model is using the current connection
    const FormSubmissionModel =
      sequelize.models.FormSubmission || FormSubmission;

    // Extract submission data from request body
    const submissionData = req.body.submission;

    if (!submissionData) {
      console.log('Missing submission data in request body');
      return res.status(400).json({
        error: 'Missing submission data',
      });
    }

    console.log(
      'Creating submission with data:',
      JSON.stringify(submissionData)
    );

    // Create the submission record
    const submission = (await FormSubmissionModel.create(
      submissionData
    )) as FormSubmission;
    console.log('Submission created successfully:', submission.id);

    return res.status(201).json({
      success: true,
      id: submission.id,
    });
  } catch (error) {
    console.error('Error creating form submission:', error);
    return res.status(500).json({
      error: 'Failed to create submission',
      details:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

export const getAllSubmissions = async (_req: Request, res: Response) => {
  try {
    const sequelize = await getSequelizeInstance();
    const FormSubmissionModel =
      sequelize.models.FormSubmission || FormSubmission;

    const submissions = await FormSubmissionModel.findAll();
    return res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

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
    const sequelize = await getSequelizeInstance();
    const FormSubmissionModel =
      sequelize.models.FormSubmission || FormSubmission;

    const { id } = req.params;
    await FormSubmissionModel.destroy({ where: { id } });
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
