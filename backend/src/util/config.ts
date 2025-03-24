'use strict';

import * as dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

const pgClient = new Client({
  connectionString: process.env.POSTGRES_URL,
});

interface DatabaseConfig {
  url: string;
  dialect: 'postgres' | 'sqlite';
  storage?: string;
  pgClient?: Client;
}

// Validate PostgreSQL URL
const isValidPostgresURL = (url: string): boolean => {
  try {
    if (!url || !url.startsWith('postgres://')) {
      return false;
    }

    // Try parsing the URL to check if it's valid
    new URL(url);

    // Check if it contains placeholder values
    const placeholders = [
      'username',
      'password',
      'hostname',
      'port',
      'database',
    ];
    return !placeholders.some((p) => url.includes(p));
  } catch {
    return false;
  }
};

// Default to SQLite if no valid DATABASE_URL provided
const getDatabaseConfig = (): DatabaseConfig => {
  // Check for Vercel's PostgreSQL URL first, then fallback to DATABASE_URL
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  // Always use PostgreSQL when in Vercel environment
  const isVercel = process.env.VERCEL === '1';
  const usePostgres =
    isVercel ||
    (process.env.USE_POSTGRES === 'true' && isValidPostgresURL(dbUrl || ''));

  if (usePostgres && dbUrl) {
    return {
      url: dbUrl,
      dialect: 'postgres',
      pgClient: pgClient,
    };
  }

  // SQLite fallback for local development only
  return {
    url: process.env.SQLITE_STORAGE
      ? `sqlite:${process.env.SQLITE_STORAGE}`
      : 'sqlite:./database.sqlite',
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || './database.sqlite',
  };
};

export const config = {
  database: getDatabaseConfig(),
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl:
    process.env.CLIENT_URL || 'https://contact-form-app-sable.vercel.app',
};
