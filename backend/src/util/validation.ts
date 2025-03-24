'use strict';

import { FormSubmissionSchema } from '../types/form-submission-schema';

let formSubmissionSchema: FormSubmissionSchema;

// Immediately invoke async function to load the schema
(async () => {
  const shared = await import('../../../shared/index.ts');
  formSubmissionSchema = shared.formSubmissionSchema;
})();

export { formSubmissionSchema };
