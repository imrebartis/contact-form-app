'use strict';

import { FormSubmissionSchema } from 'src/types/form-submission-schema';
import { beforeAll, describe, expect, it } from 'vitest';

let formSubmissionSchema: FormSubmissionSchema;

// Load the schema before tests run
beforeAll(async () => {
  const shared = await import('../../shared/index.ts');
  formSubmissionSchema = shared.formSubmissionSchema;
});

describe('formSubmissionSchema (Backend)', () => {
  it('should validate correct data', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      message: 'Hello, this is a test message.',
      queryType: 'general',
      consent: true,
    };

    expect(() => formSubmissionSchema.validateSync(validData)).not.toThrow();
  });

  it('should throw validation errors for invalid data', () => {
    const invalidData = {
      firstName: '',
      lastName: '',
      email: 'invalid-email',
      message: '',
      queryType: 'invalid-type',
    };

    try {
      formSubmissionSchema.validateSync(invalidData, { abortEarly: false });
    } catch (error) {
      if (error instanceof Error && 'errors' in error) {
        expect(error.errors).toContain('This field is required');
        expect(error.errors).toContain('Valid email is required');
        expect(error.errors).toContain('Please select a query type');
        expect(error.errors).toContain(
          'To submit this form, please consent to being contacted'
        );
      } else {
        throw error; // Re-throw if it's not the expected error type
      }
    }
  });

  it('should handle edge cases like special characters', () => {
    const edgeCaseData = {
      firstName: '!',
      lastName: '@',
      email: 'edge.case@example.com',
      message: 'Special characters: !@#$%^&*()',
      queryType: 'support',
      consent: true,
    };

    expect(() => formSubmissionSchema.validateSync(edgeCaseData)).not.toThrow();
  });
});
