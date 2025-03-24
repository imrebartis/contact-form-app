'use strict';

import * as yup from 'yup';

export type FormSubmissionSchema = yup.ObjectSchema<
  {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    queryType: NonNullable<'general' | 'support' | undefined>;
    consent: boolean;
  },
  yup.AnyObject,
  {},
  ''
>;
