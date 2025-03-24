'use strict';

import dotenv from 'dotenv';
import path from 'path';
import * as pg from 'pg';
import { Sequelize } from 'sequelize';

dotenv.config();

// Check if running on Vercel with POSTGRES_URL variable
const isProdWithPostgres = process.env.VERCEL && process.env.POSTGRES_URL;

export function getDatabaseConfig(): {
  url: string;
  dialect: string;
  logging: boolean;
  storage?: string;
  dialectModule?: any;
  dialectOptions?: any;
  pool?: {
    max: number;
    min: number;
    idle: number;
    acquire: number;
    evict: number;
  };
} {
  if (isProdWithPostgres) {
    return {
      url: process.env.POSTGRES_URL as string,
      dialect: 'postgres',
      // Use the imported pg module
      dialectModule: pg,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
      // Add pool settings for serverless
      pool: {
        max: 2,
        min: 0,
        idle: 10000,
        acquire: 30000,
        evict: 10000,
      },
    };
  }

  const nodeEnv = process.env.NODE_ENV || 'development';

  // Default to SQLite for development and testing
  let config: {
    url: string;
    dialect: string;
    logging: boolean;
    storage?: string;
    dialectOptions?: any;
    pool?: {
      max: number;
      min: number;
      idle: number;
      acquire: number;
      evict: number;
    };
  };

  // Handle SQLite configuration
  if (!process.env.DATABASE_URL?.startsWith('postgres')) {
    // Parse SQLite connection string if provided
    const dbUrl = process.env.DATABASE_URL || 'sqlite::memory:';
    const isMemoryDb = dbUrl === 'sqlite::memory:';

    // Determine storage location
    let storage;
    if (isMemoryDb) {
      storage = ':memory:';
    } else if (dbUrl.startsWith('sqlite:')) {
      // Extract filename from URL and create a proper path
      const fileName = dbUrl.replace('sqlite:', '');
      storage = path.join(process.cwd(), fileName);
    } else {
      storage = path.join(process.cwd(), 'database.sqlite');
    }

    config = {
      url: dbUrl,
      dialect: 'sqlite',
      storage:
        nodeEnv === 'test' && !process.env.DATABASE_URL ? ':memory:' : storage,
      logging: nodeEnv === 'development',
    };
  } else {
    // PostgreSQL configuration for production with optimized pool settings
    config = {
      url: process.env.DATABASE_URL,
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      // Pool settings for serverless environments
      pool: {
        max: 2, // Keep connection pool minimal
        min: 0, // Allow all connections to close
        idle: 10000, // How long a connection can be idle before being released
        acquire: 30000, // Maximum time to get connection from pool
        evict: 10000, // Run cleanup every 10 seconds
      },
    };
  }

  return config;
}

// Create Sequelize instance based on environment variables
const dbConfig = getDatabaseConfig();
if (!dbConfig.url) {
  throw new Error('Database URL is not defined');
}
export const sequelize = new Sequelize(dbConfig.url, {
  dialect: dbConfig.dialect as any,
  logging: dbConfig.logging,
  storage: dbConfig.storage,
  ...(dbConfig.dialectOptions
    ? { dialectOptions: dbConfig.dialectOptions }
    : {}),
  ...(dbConfig.dialect === 'sqlite'
    ? {
        define: {
          timestamps: true,
          underscored: true,
        },
      }
    : {}),
});

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();

    // Sync all models with the database
    const nodeEnv = process.env.NODE_ENV || 'development';
    await sequelize.sync({
      alter: nodeEnv === 'development',
      // Don't alter in production to prevent data loss
    });

    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

// Global variable to maintain connection across function invocations
let sequelizeInstance: Sequelize | null = null;

/**
 * Gets a Sequelize instance optimized for serverless environment
 * Reuses connection between serverless function invocations
 */
export async function getSequelizeInstance() {
  // Reuse existing connection if available
  if (sequelizeInstance && sequelizeInstance.authenticate) {
    try {
      // Test if connection is still valid
      await sequelizeInstance.authenticate();
      return sequelizeInstance;
    } catch {
      console.log('Connection lost, creating new connection...');
      sequelizeInstance = null;
    }
  }

  // Create new connection with optimized pool settings
  const dbConfig = getDatabaseConfig();
  sequelizeInstance = new Sequelize(dbConfig.url, {
    dialect: dbConfig.dialect as any,
    logging: dbConfig.logging,
    storage: dbConfig.storage,
    ...(dbConfig.dialectOptions
      ? { dialectOptions: dbConfig.dialectOptions }
      : {}),
    ...(dbConfig.dialect === 'sqlite'
      ? {
          define: {
            timestamps: true,
            underscored: true,
          },
        }
      : {}),
  });

  return sequelizeInstance;
}
