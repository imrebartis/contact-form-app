'use strict';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import fs from 'fs';
import path from 'path';

import authRouter from './api/auth';
import formSubmissionsRouter from './api/form-submissions';
import envCheck from './env-check';
import { config } from './util/config';
import { connectToDatabase } from './util/db';
import { loadEnvironmentVariables } from './util/env';
import { configurePassport } from './util/passport';
import { initializeSessionStore, sessionConfig } from './util/session';

loadEnvironmentVariables();

envCheck.checkEnv();

export const app = express();
const PORT = config.port;

// --- CORS Configuration ---
// Define allowed origins based on environment
const allowedOrigins =
  config.nodeEnv === 'production'
    ? [
        config.clientUrl, // the PRODUCTION frontend URL from config/env vars
      ].filter(Boolean) // Remove undefined/null entries if config.clientUrl isn't set
    : [
        'http://localhost:3001',
        'http://localhost:5173',
        'http://localhost:4173',
      ];

// Ensure there's at least one allowed origin, especially for production
if (config.nodeEnv === 'production' && allowedOrigins.length === 0) {
  console.error('---------------------------------------------------------');
  console.error('ERROR: No production client URL defined for CORS!');
  console.error('Set the CLIENT_URL environment variable for production.');
  console.error('---------------------------------------------------------');
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      // or requests from allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        // Origin is allowed
        callback(null, true); // Standard practice: callback with true
      } else {
        // Origin is not allowed
        console.warn(`Origin ${origin} not allowed by CORS policy`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Important for cookies/auth sessions
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Ensure OPTIONS is present for preflight
    allowedHeaders: [
      // Headers the client is allowed to send
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Cache-Control',
      'Pragma',
      'X-CSRF-Token',
      'X-Form-Origin',
      'X-Form-Submission-Time',
      'x-form-origin',
      'x-form-submission-time',
    ],
    exposedHeaders: ['Content-Length', 'Content-Type'],
  })
);
// --- End CORS Configuration ---

app.use(cookieParser());
app.use(express.json());

// Session middleware
app.use(session(sessionConfig));

// Initialize Passport
const passportInstance = configurePassport();
app.use(passportInstance.initialize());
app.use(passportInstance.session());

interface ErrorHandler {
  (
    err: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void;
}

const errorHandler: ErrorHandler = (
  err: unknown,
  _req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: express.NextFunction
) => {
  // Check if it's a CORS error and handle specifically if needed
  if (err instanceof Error && err.message === 'Not allowed by CORS') {
    console.error(
      'CORS Error:',
      err.message,
      '- Origin:',
      (_req as any).origin || 'N/A'
    );
    res.status(403).send('Forbidden: Origin not allowed by CORS policy.');
  } else {
    // Handle other errors
    console.error('Unhandled Error:', err);
    res.status(500).send('Internal Server Error');
  }
};

// API routes with proper prefixes
app.use('/api/auth', authRouter);
app.use('/api/submissions', formSubmissionsRouter);

// Serve static files from the frontend build directory
const appRoot = process.cwd();
const frontendDistPath = process.env.VERCEL
  ? path.join(appRoot, 'frontend/dist') // Vercel deployment path
  : path.join(appRoot, '../frontend/dist'); // Local development path

// Check if frontend build exists
if (fs.existsSync(frontendDistPath)) {
  console.log('✅ Frontend build directory exists');
  if (fs.existsSync(path.join(frontendDistPath, 'index.html'))) {
    console.log('✅ Frontend index.html exists');
    app.use(express.static(frontendDistPath)); // Serve static files ONLY if dir exists
  } else {
    console.warn('⚠️ Frontend index.html DOES NOT exist in dist folder.');
  }
} else {
  console.warn('⚠️ Frontend build directory DOES NOT exist.');
}

// Catch-all route
app.get('*', (req, res, next) => {
  // Skip API routes from falling back to index.html
  if (req.originalUrl.startsWith('/api/')) {
    return next();
  }

  // Check if we have an index.html file to send
  const indexHtmlPath = path.join(frontendDistPath, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    // For client-side routes, always return the index.html
    res.sendFile(indexHtmlPath);
  } else {
    console.error(`Index HTML not found at: ${indexHtmlPath}`);
    res
      .status(404)
      .send('Frontend application not found. Check build directory and path.');
  }
});

// Apply the custom error
app.use(errorHandler);

const startServer = async () => {
  try {
    const connected = await connectToDatabase();

    await initializeSessionStore();

    if (!connected) {
      console.log('⚠️ WARNING: Running without database connection!');
    }
    return connected;
  } catch (error) {
    console.error('❌ Error starting backend server:', error);
    throw error;
  }
};

// Run initialization logic when the module loads
startServer().catch((error) => {
  console.error('❌ Fatal error during server startup:', error);
  process.exit(1); // Exit if essential initialization fails
});

// Start listening only if not in a Vercel environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`✅ Local backend server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
  });
}

export default app;
