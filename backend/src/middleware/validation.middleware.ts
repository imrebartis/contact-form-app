import { NextFunction, Request, Response } from 'express';

import { formSubmissionSchema } from '../util/validation';

export const validateFormSubmission = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract data whether it's nested or not
    const submissionData = req.body.submission || req.body;
    console.log(
      'Validation middleware received body:',
      JSON.stringify(req.body)
    );
    formSubmissionSchema.validateSync(submissionData, { abortEarly: false });
    next();
  } catch (error) {
    if (error instanceof Error && 'errors' in error) {
      res.status(400).json({
        success: false,
        errors: (error as { errors: string[] }).errors,
      });
    } else {
      res.status(400).json({
        success: false,
        errors: ['Validation failed'],
      });
    }
  }
};
