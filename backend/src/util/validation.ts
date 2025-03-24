// Using dynamic import to resolve module compatibility issue
let formSubmissionSchema: any;

// Immediately invoke async function to load the schema
(async () => {
  const shared = await import('../../../shared/index.ts');
  formSubmissionSchema = shared.formSubmissionSchema;
})();

export { formSubmissionSchema };
