'use strict';

// Simple script to check environment variables
console.log('=============== ENVIRONMENT CHECK ===============');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('TEST_REDIRECT_URL:', process.env.TEST_REDIRECT_URL);
console.log('PRODUCTION_REDIRECT_URL:', process.env.PRODUCTION_REDIRECT_URL);
console.log('DEVELOPMENT_REDIRECT_URL:', process.env.DEVELOPMENT_REDIRECT_URL);
console.log('===============================================');

// Function to check these values at runtime
module.exports.checkEnv = function () {
  console.log('Runtime environment check:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log(
    '- Using redirect URL:',
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_REDIRECT_URL
      : process.env.NODE_ENV === 'test'
      ? process.env.TEST_REDIRECT_URL
      : process.env.DEVELOPMENT_REDIRECT_URL
  );
};
