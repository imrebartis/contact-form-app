import * as yup from 'yup';

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
