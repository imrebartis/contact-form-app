export interface FormElements {
  firstName: HTMLInputElement;
  lastName: HTMLInputElement;
  email: HTMLInputElement;
  queryType: RadioNodeList;
  message: HTMLTextAreaElement;
  consent: HTMLInputElement;
}

export type FormElementType =
  | HTMLInputElement
  | HTMLTextAreaElement
  | RadioNodeList;

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  queryType: string;
  message: string;
  consent: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}
