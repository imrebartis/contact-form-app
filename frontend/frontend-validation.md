# Frontend Validation Approach

## Overview
The frontend validation framework uses the shared `formSubmissionSchema` defined with Yup. This ensures consistent validation rules across both the frontend and backend.

## Key Features
1. **Real-time Validation**: Validation is triggered on `blur`, `change`, and `submit` events.
2. **Reusable Utility**: The `ValidatedInput` class provides built-in validation and visual feedback for individual form fields.
3. **Accessibility**: Error messages are accessible via `aria-invalid`, `aria-describedby`, and `role` attributes.

## Usage Example

### Using `ValidatedInput` Utility
The `ValidatedInput` class is used to attach validation logic to individual input fields. Below is an example of how to use it:

```javascript
import ValidatedInput from './utils/validated-input';
import { formSubmissionSchema } from '../../shared/index.ts';

// Example: Setting up validation for a form field
const firstNameInput = document.getElementById('first-name');
new ValidatedInput(firstNameInput, formSubmissionSchema, 'firstName');
```

### Integration in `FormView`
The `FormView` class integrates the `ValidatedInput` utility to provide real-time validation for all form fields. This ensures consistent validation behavior across the application.

## Testing
- Ensure validation triggers on `blur`, `change`, and `submit` events.
- Verify error messages are displayed correctly and are accessible.
- Test the form across different browsers for consistent behavior.

## Cross-Browser Testing
To ensure consistent behavior across different browsers, use tools like BrowserStack or Sauce Labs for automated cross-browser testing. Alternatively, perform manual testing on major browsers (Chrome, Firefox, Safari, Edge).