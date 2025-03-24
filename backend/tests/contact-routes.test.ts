'use strict';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteSubmissionDirect } from '../src/controllers/form-submission.controller';
import formSubmissionService from '../src/services/form-submission.service';

// Mock the form submission service
vi.mock('../src/services/form-submission.service', () => {
  return {
    default: {
      deleteById: vi.fn(),
    },
  };
});

describe('deleteSubmission', () => {
  // Create a spy for console.error to verify it's being called with errors
  const consoleErrorSpy = vi.spyOn(console, 'error');

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it('should successfully delete a submission when it exists', async () => {
    // Setup
    const mockId = '123';
    vi.mocked(formSubmissionService.deleteById).mockResolvedValueOnce(true);

    // Execute
    await expect(deleteSubmissionDirect(mockId)).resolves.toBeUndefined();

    // Verify
    expect(formSubmissionService.deleteById).toHaveBeenCalledWith(mockId);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should throw an error when the submission is not found', async () => {
    // Setup
    const mockId = '456';
    vi.mocked(formSubmissionService.deleteById).mockResolvedValueOnce(false);

    // Execute and verify
    await expect(deleteSubmissionDirect(mockId)).rejects.toThrow(
      'Submission not found'
    );
    expect(formSubmissionService.deleteById).toHaveBeenCalledWith(mockId);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error deleting submission:',
      expect.objectContaining({
        message: 'Submission not found',
      })
    );
  });

  it('should propagate service errors when deleteById fails', async () => {
    // Setup
    const mockId = '789';
    const testError = new Error('Database connection error');
    vi.mocked(formSubmissionService.deleteById).mockRejectedValueOnce(
      testError
    );

    // Execute and verify
    await expect(deleteSubmissionDirect(mockId)).rejects.toThrow(
      'Database connection error'
    );
    expect(formSubmissionService.deleteById).toHaveBeenCalledWith(mockId);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error deleting submission:',
      testError
    );
  });
});
