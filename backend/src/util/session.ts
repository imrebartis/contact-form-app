'use strict';

import SequelizeStore from 'connect-session-sequelize';
import session from 'express-session';
import { Sequelize } from 'sequelize';

import { config } from './config';
import { sequelize } from './db';

// Create session store
const SessionStore = SequelizeStore(session.Store);
const store = new SessionStore({
  db: sequelize as Sequelize,
  tableName: 'sessions',
  checkExpirationInterval: 15 * 60 * 1000, // Clean up expired sessions every 15 minutes
  expiration: 24 * 60 * 60 * 1000, // Sessions expire after 24 hours
});

// Session configuration
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'fancy-session-secret',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    secure: config.nodeEnv === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' as const,
    domain: 'localhost',
  },
};

// Initialize session store
export const initializeSessionStore = async () => {
  try {
    // Type assertion to ensure TypeScript understands this returns a Promise
    await new Promise<void>((resolve, reject) => {
      try {
        store.sync();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    console.log('Session store initialized successfully');
  } catch (error) {
    console.error('Failed to initialize session store:', error);
  }
};
