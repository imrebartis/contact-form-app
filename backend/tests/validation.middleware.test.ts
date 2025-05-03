import { NextFunction, Request } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as yup from 'yup';

import { validateFormSubmission } from '../src/middleware/validation.middleware';

vi.mock('../src/util/validation', () => {
  return {
    formSubmissionSchema: yup
      .object({
        firstName: yup.string().required('This field is required'),
        lastName: yup.string().required('This field is required'),
        email: yup
          .string()
          .email('Valid email is required')
          .required('This field is required'),
        message: yup.string().required('This field is required'),
        queryType: yup
          .string()
          .oneOf(['general', 'support'], 'Please select a query type')
          .required('Please select a query type'),
        consent: yup
          .boolean()
          .oneOf(
            [true],
            'To submit this form, please consent to being contacted'
          )
          .required('To submit this form, please consent to being contacted'),
      })
      .noUnknown(true),
  };
});

// Helper functions for creating mocks
const mockRequest = (body: any): Request => {
  const req: Partial<Request> = {
    body,
    cookies: {},
    signedCookies: {},
    get: vi.fn().mockReturnValue(''),
    header: vi.fn().mockReturnValue(''),
    query: {},
    params: {},
    path: '',
    protocol: '',
    secure: false,
    ip: '',
    ips: [],
    subdomains: [],
    originalUrl: '',
    hostname: '',
    method: '',
    baseUrl: '',
    url: '',
    xhr: false,
    accepts: vi
      .fn()
      .mockImplementation((...args: any[]) =>
        Array.isArray(args[0]) ? args[0][0] : args[0]
      ),
    acceptsCharsets: vi.fn().mockImplementation(() => []),
    acceptsEncodings: vi.fn().mockReturnValue([]),
    acceptsLanguages: vi.fn().mockReturnValue([]),
    range: vi.fn(),
    is: vi.fn(),
    app: {} as any,
    res: {} as any,
    next: vi.fn() as unknown as NextFunction,
  };
  return req as Request;
};

const mockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

// Clear mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});

// Tests
describe('validateFormSubmission middleware', () => {
  it('should call next() for valid data', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      message: 'Test message',
      queryType: 'general',
      consent: true,
    };

    const req = mockRequest(validData);
    const res = mockResponse();
    const next = vi.fn();

    validateFormSubmission(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 for invalid data', () => {
    const invalidData = {
      firstName: '',
      lastName: '',
      email: 'not-an-email',
      // Missing required fields
    };

    const req = mockRequest(invalidData);
    const res = mockResponse();
    const next = vi.fn();

    validateFormSubmission(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        errors: expect.any(Array),
      })
    );
  });
});
