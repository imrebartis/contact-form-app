/**
 * References to all form elements in the DOM
 */
export interface FormElements {
  /** Input element for the user's first name */
  firstName: HTMLInputElement;

  /** Input element for the user's last name */
  lastName: HTMLInputElement;

  /** Input element for the user's email address */
  email: HTMLInputElement;

  /** Radio button group for selecting query type */
  queryType: RadioNodeList;

  /** Textarea element for the user's message */
  message: HTMLTextAreaElement;

  /** Checkbox element for consent to be contacted */
  consent: HTMLInputElement;
}

/**
 * Union type of all possible form element types
 */
export type FormElementType =
  | HTMLInputElement
  | HTMLTextAreaElement
  | RadioNodeList;

/**
 * Form data structure containing sanitized form values
 */
export interface FormData {
  /** Sanitized first name */
  firstName: string;

  /** Sanitized last name */
  lastName: string;

  /** Sanitized email address */
  email: string;

  /** Selected query type (general, support, etc.) */
  queryType: string;

  /** Sanitized message content */
  message: string;

  /** Whether user has consented to being contacted */
  consent: boolean;
}

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;

  /** Validation error message (empty if validation passed) */
  message: string;
}
