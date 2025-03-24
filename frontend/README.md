## Frontend Validation Approach

### Overview
The frontend validation framework uses the shared `formSubmissionSchema` defined with Yup. This ensures consistent validation rules across both the frontend and backend.

### Key Features
1. **Real-time Validation**: Validation is triggered on `blur`, `change`, and `submit` events.
2. **Reusable Components**: The `ValidatedInput` component provides built-in validation and visual feedback.
3. **Accessibility**: Error messages are accessible via `aria-invalid`, `aria-describedby`, and `role` attributes.

### Usage Example

#### Using `ValidatedInput` Component
```tsx
import React, { useState } from 'react';
import ValidatedInput from './components/ValidatedInput';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    queryType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform form submission logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <ValidatedInput
        name="firstName"
        label="First Name"
        value={formData.firstName}
        onChange={handleChange}
      />
      <ValidatedInput
        name="lastName"
        label="Last Name"
        value={formData.lastName}
        onChange={handleChange}
      />
      <ValidatedInput
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      <ValidatedInput
        name="message"
        label="Message"
        value={formData.message}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ContactForm;
```

### Testing
- Ensure validation triggers on `blur`, `change`, and `submit` events.
- Verify error messages are displayed correctly and are accessible.
- Test the form across different browsers for consistent behavior.