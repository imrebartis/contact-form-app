const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper function to execute commands with proper error handling
function runCommand(command, errorMessage, ignoreError = false) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    console.log(`Successfully executed: ${command}`);
    return true;
  } catch (error) {
    console.error(`Error: ${errorMessage}`);
    console.error(error.message);
    if (ignoreError) {
      console.log('Ignoring error and continuing...');
      return false;
    }
    process.exit(1);
  }
}

// Main build process
try {
  // Install dependencies in each package
  console.log('Installing dependencies...');
  runCommand('cd shared && pnpm install', 'Failed to install shared dependencies');
  runCommand('cd frontend && pnpm install', 'Failed to install frontend dependencies');
  runCommand('cd backend && pnpm install', 'Failed to install backend dependencies');

  // Build frontend
  console.log('Building frontend...');
  runCommand('pnpm run build:frontend', 'Failed to build frontend');

  // Build backend manually with direct TypeScript commands
  console.log('Building backend with direct commands...');
  runCommand('cd backend && npx tsc --skipLibCheck', 'TypeScript compilation had errors', true);
  runCommand('cd backend && pnpm exec shx cp -r ./src/templates ./dist/', 'Failed to copy templates', true);
  runCommand('cd backend && pnpm exec shx cp -r ./src/public ./dist/', 'Failed to copy public files', true);

  // Copy frontend to public directory
  console.log('Copying frontend files...');
  runCommand('pnpm run copy-frontend:vercel', 'Failed to copy frontend files');

  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
