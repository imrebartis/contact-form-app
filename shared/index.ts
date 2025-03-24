import DOMPurify from 'dompurify';
import * as yup from 'yup';

// Utility function to sanitize input using DOMPurify
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input);
};

// Custom email validation function
export const isValidEmail = (email: string): boolean => {
  // RFC 5322 compliant email regex pattern
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

// Custom URL validation function
export const isValidURL = (url: string): boolean => {
  try {
    // Use the URL constructor for validation
    new URL(url);

    // Additional check for http/https protocol
    return /^(http|https):\/\/[^ "]+$/.test(url);
  } catch (err) {
    return false;
  }
};

export const formSubmissionSchema = yup
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
      .oneOf([true], 'To submit this form, please consent to being contacted')
      .required('To submit this form, please consent to being contacted'),
  })
  .noUnknown(true);
