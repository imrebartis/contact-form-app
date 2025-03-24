import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSubmissionFactory } from '../src/controllers/form-submission.controller';
import { MockFormSubmissionService } from './mocks/mock-form-submission-service';

// Mock the validators
vi.mock('../src/validators/form-submission.validators.ts', () => ({
  validateFormSubmission: vi.fn((data) => {
    const errors: Record<string, string> = {};

    if (!data.name) {
      errors.name = 'Name is required';
    }

    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email format is invalid';
    }

    return errors;
  }),
}));

describe('Contact Form API Handler', () => {
  let mockService: MockFormSubmissionService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;
  let createSpy: any;

  beforeEach(() => {
    // Create a new mock service for each test
    mockService = new MockFormSubmissionService();

    // Create spy on the create method
    createSpy = vi.spyOn(mockService, 'create');

    // Set up request/response mocks
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it('should return 400 if submission data is missing', async () => {
    mockRequest = {
      body: {},
    };

    // Create a controller with the mock service
    const controller = createSubmissionFactory(mockService);
    await controller(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Invalid request format: Expected data in "submission" field',
      })
    );
  });

  it('should return 400 if name is missing', async () => {
    mockRequest = {
      body: {
        submission: {
          email: 'test@example.com',
          message: 'Test message',
          queryType: 'general',
        },
      },
    };

    const controller = createSubmissionFactory(mockService);
    await controller(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation failed',
        details: expect.objectContaining({ name: expect.any(String) }),
      })
    );
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('should return 400 if email is missing', async () => {
    mockRequest = {
      body: {
        submission: {
          name: 'Test User',
          message: 'Test message',
          queryType: 'general',
        },
      },
    };

    const controller = createSubmissionFactory(mockService);
    await controller(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation failed',
        details: expect.objectContaining({ email: expect.any(String) }),
      })
    );
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('should return 400 if email format is invalid', async () => {
    mockRequest = {
      body: {
        submission: {
          name: 'Test User',
          email: 'invalid-email',
          message: 'Test message',
          queryType: 'general',
        },
      },
    };

    const controller = createSubmissionFactory(mockService);
    await controller(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation failed',
        details: expect.objectContaining({ email: expect.any(String) }),
      })
    );
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('should return 400 if queryType is missing', async () => {
    mockRequest = {
      body: {
        submission: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
        },
      },
    };

    const controller = createSubmissionFactory(mockService);
    await controller(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Missing required field',
        details: expect.stringContaining('queryType'),
      })
    );
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('should return 201 with valid data', async () => {
    // Mock successful service response
    const mockSubmissionResult = {
      id: '123',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      message: 'This is a test message.',
      queryType: 'support',
      created_at: new Date(),
      updated_at: new Date(),
    };

    createSpy.mockResolvedValueOnce(mockSubmissionResult);

    const submissionData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message.',
      queryType: 'support',
    };

    mockRequest = {
      body: {
        submission: submissionData,
      },
    };

    const controller = createSubmissionFactory(mockService);
    await controller(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: '123' })
    );
    expect(createSpy).toHaveBeenCalledWith(submissionData);
  });

  it('should return 500 when service throws an error', async () => {
    // Mock service error
    createSpy.mockRejectedValueOnce(new Error('Database error'));

    mockRequest = {
      body: {
        submission: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
          queryType: 'general',
        },
      },
    };

    const controller = createSubmissionFactory(mockService);
    await controller(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Server error processing submission',
      })
    );
  });
});
