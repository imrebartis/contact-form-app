'use strict';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
// @ts-ignore
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Loads environment variables from .env files
 * Preserves the original NODE_ENV value set from command line
 */
export function loadEnvironmentVariables(): void {
  // Load environment variables from .env file
  const envResult = dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
  });

  if (envResult.error) {
    console.warn('No .env file found or error loading it:', envResult.error);
  }

  // Store the original NODE_ENV in a local variable
  // Using a getter function to prevent webpack from replacing it
  function getNodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  const originalNodeEnv = getNodeEnv();

  // Load base .env file first
  dotenv.config();

  // Then load environment-specific .env file
  try {
    dotenv.config({ path: `.env.${originalNodeEnv}` });
  } catch {
    console.log(`No .env.${originalNodeEnv} file found`);
  }

  if (process.env) {
    Object.defineProperty(process, 'env', {
      value: { ...process.env, NODE_ENV: originalNodeEnv },
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } else {
    process.env = { NODE_ENV: originalNodeEnv };
  }
}
