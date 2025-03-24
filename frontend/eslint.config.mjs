import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  js.configs.recommended,
  ...compat.extends('eslint:recommended', 'prettier'),
  prettierConfig,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        document: 'readonly',
      },
      ecmaVersion: 12,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      semi: ['error', 'always'],
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      'dist/**',
      '**/*.html',
      '**/*.json',
      '**/*.css',
      '**/*.md',
      '**/*.yml',
      '**/*.scss',
    ],
  },
];
