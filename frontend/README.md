## Frontend Validation Approach

### Overview
The frontend validation framework uses the shared `formSubmissionSchema` defined with Yup. This ensures consistent validation rules across both the frontend and backend.

### Key Features
1. **Real-time Validation**: Validation is triggered on `blur`, `change`, and `submit` events.
2. **Reusable Components**: The `ValidatedInput` component provides built-in validation and visual feedback.
3. **Accessibility**: Error messages are accessible via `aria-invalid`, `aria-describedby`, and `role` attributes.

### Usage Example

#### Using `ValidatedInput` Class

Here is an example of how to use the `ValidatedInput` class in a vanilla JavaScript setup:

```html
<form id="contactForm">
  <label for="firstName">First Name</label>
  <input id="firstName" name="firstName" type="text" />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" />

  <button type="submit">Submit</button>
</form>

<script type="module">
  import ValidatedInput from './utils/validated-input';
  import * as yup from 'yup';

  const schema = yup.object({
    firstName: yup.string().required('First name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
  });

  const firstNameInput = document.getElementById('firstName');
  const emailInput = document.getElementById('email');

  new ValidatedInput(firstNameInput, schema, 'firstName');
  new ValidatedInput(emailInput, schema, 'email');

  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Perform form submission logic
  });
</script>
```

### Testing
- Ensure validation triggers on `blur`, `change`, and `submit` events.
- Verify error messages are displayed correctly and are accessible.
- Test the form across different browsers for consistent behavior.