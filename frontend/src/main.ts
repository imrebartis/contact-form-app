'use strict';

import { LandingPage } from './components/landing-page';
import {
  IFormSubmitter,
  IFormValidator,
  IFormView,
} from './interfaces/form-interfaces';
import { ErrorHandler } from './services/form-handling/error-handler';
import { FormRenderer } from './services/form-handling/form-renderer';
import { FormSubmitter } from './services/form-handling/form-submitter';
import { ToastService } from './services/form-handling/toast-service';
import { FormValidator } from './services/validation/form-validator';
import { FormData, FormElements } from './types/form.types';
import { Router } from './utils/router';
import { SpinnerUtils } from './utils/spinner';
import { FormView } from './views/form-view';

import './styles/style.scss';

/**
 * Main class for handling contact form functionality
 * Manages form validation, submission and state
 */
export class ContactForm {
  /** View handling UI interactions and rendering */
  protected view: IFormView;

  /** Validator for form field validation */
  protected validator: IFormValidator;

  /** Service for handling form submission */
  protected submitter: IFormSubmitter;

  /** Form elements references */
  protected elements!: FormElements;

  /**
   * Cleans up resources and event listeners
   */
  cleanup(): void {
    this.view.cleanup();
  }

  /**
   * Initializes the Contact Form with required dependencies
   *
   * @param validator - Service for validating form fields
   * @param submitter - Service for submitting form data
   * @param view - Service for rendering and managing the form UI
   */
  constructor(
    validator: IFormValidator,
    submitter: IFormSubmitter,
    view: IFormView
  ) {
    this.validator = validator;
    this.submitter = submitter;
    this.view = view;
  }

  /**
   * Initializes form handlers and binds events
   */
  init(): void {
    try {
      this.view.createForm();
      this.elements = this.view.getFormElements();

      const boundSubmitHandler = (e: Event) => this.handleSubmit(e);
      const boundValidateField = (fieldName: keyof FormElements) =>
        this.validateField(fieldName);

      this.view.setupEventListeners(boundSubmitHandler, boundValidateField);
    } catch (error) {
      console.error('Error in ContactForm init:', error);
      throw error; // Re-throw to make test failures more obvious
    }
  }

  /**
   * Validates a specific form field
   *
   * @param fieldName - Name of the field to validate
   * @returns boolean indicating whether the field is valid
   */
  protected validateField(fieldName: keyof FormElements): boolean {
    const element = this.elements[fieldName];
    const { isValid, errorMessage } = this.validator.validateField(
      fieldName,
      element as HTMLElement
    );

    this.view.showFieldError(fieldName, isValid ? '' : errorMessage);
    return isValid;
  }

  /**
   * Handles form submission event
   * Prevents default behavior, validates all fields and submits if valid
   *
   * @param e - Form submission event
   */
  protected async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    if (this.view.getSubmitButton().disabled) {
      return;
    }

    if (this.validateAllFields()) {
      // Use the spinner during form submission
      await SpinnerUtils.withSpinner(async () => {
        await this.submitForm();
      });
    }
  }

  /**
   * Validates all form fields and returns overall validation status
   *
   * @returns boolean indicating whether all fields are valid
   */
  protected validateAllFields(): boolean {
    let allValid = true;

    Object.keys(this.elements).forEach((key) => {
      const fieldName = key as keyof FormElements;
      const isValid = this.validateField(fieldName);

      if (!isValid) {
        allValid = false;
      }
    });

    return allValid;
  }

  /**
   * Handles the form submission process
   * Collects form data, submits it, and handles success or failure
   */
  protected async submitForm(): Promise<void> {
    const abortSignal = this.view.getAbortSignal();
    /**
     * The abort signal may be null:
     * - When no AbortController was provided during form initialization
     * - When the view implementation doesn't support abort functionality
     */
    if (abortSignal?.aborted) {
      console.log('Form submission aborted before starting');
      return;
    }

    this.view.disableSubmitButton('Sending...');

    try {
      const formData = this.collectFormData();
      await this.submitter.submitForm(formData, abortSignal);
      this.handleSuccessfulSubmission();
    } catch (error: unknown) {
      this.handleSubmissionError(error);
    }
  }

  /**
   * Handles errors that occur during form submission
   *
   * @param error - The error object from the submission failure
   */
  protected handleSubmissionError(error: unknown): void {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Form submission was aborted during processing');
      this.view.resetSubmitButton();
      return;
    }

    this.handleFailedSubmission(error);
  }

  /**
   * Collects and sanitizes all form data into a FormData object
   *
   * @returns Sanitized form data ready for submission
   */
  protected collectFormData(): FormData {
    return {
      firstName: this.elements.firstName.value,
      lastName: this.elements.lastName.value,
      email: this.elements.email.value,
      queryType: (this.elements.queryType as RadioNodeList).value,
      message: this.elements.message.value,
      consent: this.elements.consent.checked,
    };
  }

  /**
   * Manages successful form submission UI updates
   */
  protected handleSuccessfulSubmission(): void {
    this.submitter.showSuccessMessage();
    this.view.disableFormElements();
    this.view.resetForm();
    this.view.disableSubmitButton('Sent');
  }

  /**
   * Manages failed form submission UI updates and error handling
   *
   * @param error - Optional error object from submission failure
   */
  protected handleFailedSubmission(error?: unknown): void {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('An unknown error occurred.');
    }

    this.view.showFormError('Failed to send message. Please try again.');
    this.view.resetSubmitButton();
  }
}

/**
 * Configuration options for creating a ContactForm instance
 */
interface ContactFormFactoryConfig {
  validator?: IFormValidator;
  formRenderer?: FormRenderer;
  errorHandler?: ErrorHandler;
  toastService?: ToastService;
  view?: IFormView;
  submitter?: IFormSubmitter;
  abortController?: AbortController;
}

/**
 * Factory for creating fully configured ContactForm instances
 * Uses dependency injection to provide required services
 */
export class ContactFormFactory {
  /**
   * Creates a new ContactForm with default or provided dependencies
   *
   * @param config - Optional configuration to override default dependencies
   * @returns Fully configured ContactForm instance
   */
  static create(config: ContactFormFactoryConfig = {}): ContactForm {
    const validator = config.validator || new FormValidator();
    const toastService = config.toastService || new ToastService();
    const errorHandler = config.errorHandler || new ErrorHandler();
    const formRenderer = config.formRenderer || new FormRenderer();

    const view =
      config.view ||
      new FormView(formRenderer, errorHandler, config.abortController);
    const submitter = config.submitter || new FormSubmitter(toastService);

    return new ContactForm(validator, submitter, view);
  }
}

export class ContactFormApp {
  private static instance: ContactFormApp | null = null;
  private contactForm: ContactForm | null = null;
  private appContainer: HTMLElement | null = null;
  private landingPage: LandingPage | null = null;
  // @ts-ignore
  private isInitialized: boolean = false;

  private constructor() {
    // Private constructor to enforce singleton pattern
    this.appContainer = document.getElementById('app');
  }

  /**
   * Get the singleton instance of the ContactFormApp
   */
  public static getInstance(): ContactFormApp {
    if (!ContactFormApp.instance) {
      ContactFormApp.instance = new ContactFormApp();
    }
    return ContactFormApp.instance;
  }

  public init(): void {
    // Always clean up first when explicitly called
    this.cleanup();

    if (!this.appContainer) {
      console.error('App container not found');
      return;
    }

    // Initialize landing page
    this.landingPage = new LandingPage(this.appContainer);
    this.landingPage.render();

    // Set initialization flag
    this.isInitialized = true;

    // Listen for showContactForm event
    document.addEventListener('showContactForm', () => {
      this.initContactForm();
    });

    // Setup cleanup on page unload
    this.setupUnloadCleanup();
  }

  /**
   * Shows the contact form directly without showing the landing page first
   */
  public showContactFormDirectly(): void {
    SpinnerUtils.showSpinner();

    if (!this.appContainer) {
      console.error('App container not found');
      SpinnerUtils.hideSpinner();
      return;
    }

    // Clean up existing components but don't reinitialize the landing page
    this.cleanup();

    // Initialize the contact form
    this.initContactForm();

    // Mark as initialized to prevent reinitializing the landing page
    this.isInitialized = true;

    SpinnerUtils.hideSpinner(300);
  }

  private initContactForm(): void {
    this.contactForm = ContactFormFactory.create();
    this.contactForm.init();
  }

  public cleanup(): void {
    // Clean up contact form
    if (this.contactForm) {
      this.contactForm.cleanup();
      this.contactForm = null;
    }

    // Clean up landing page
    this.landingPage = null;

    // Clear the app container
    if (this.appContainer) {
      this.appContainer.innerHTML = '';
    }

    // Reset initialization state
    this.isInitialized = false;
  }

  private setupUnloadCleanup(): void {
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  /**
   * Gets the app container element
   */
  public getAppContainer(): HTMLElement | null {
    return this.appContainer;
  }

  /**
   * Shows the authenticated welcome view for logged-in users
   */
  public showAuthenticatedWelcome(): void {
    SpinnerUtils.showSpinner();

    if (!this.appContainer) {
      console.error('App container not found');
      SpinnerUtils.hideSpinner();
      return;
    }

    // Clean up existing components
    this.cleanup();

    // Initialize landing page to handle auth state
    this.landingPage = new LandingPage(this.appContainer);

    // Render the landing page which will check auth status and show the welcome view
    this.landingPage.render();

    // Mark as initialized
    this.isInitialized = true;

    SpinnerUtils.hideSpinner(300);
  }
}

// Check if we're in browser environment
function initApp() {
  // Initialize the router which will handle routes including /contact-form
  Router.getInstance();

  // Fix for browsers that don't have a proper history state on initial page load
  // This ensures the back button works correctly
  const path = window.location.pathname;
  if (path === '/' && window.history.state === null) {
    // Create an initial history entry if there isn't one
    window.history.replaceState({ initial: true }, '', '/');
  }
}

// Only attach event listeners if we're in a browser environment
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initApp);
}

export function initContactForm(): void {
  ContactFormApp.getInstance().init();
}

export function cleanupContactForm(): void {
  ContactFormApp.getInstance().cleanup();
}
