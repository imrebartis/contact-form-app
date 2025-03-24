import js from '@eslint/js';
import process from 'node:process';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

// Use JSDoc to provide the type annotation
/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  js.configs.recommended,
  // Base configuration for all JavaScript files
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      globals: {
        console: true,
        process: true,
        module: true,
        require: true,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },
  // TypeScript-specific configuration
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: {
        console: true,
        process: true,
        module: true,
        require: true,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      'no-unused-vars': 'off', // Turned off in favor of TS version
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'public/**'],
  },
];

export default config;
