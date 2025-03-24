'use strict';

import csrf from 'csurf';
import pg from 'pg';
import { DataTypes, Sequelize } from 'sequelize';
import { object, string } from 'yup';

// Adjust CSRF protection for API routes
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'none', // Important for cross-origin requests
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'], // Only enforce on state-changing methods
});

// Form validation schema
const formSubmissionSchema = object().shape({
  firstName: string().required('This field is required').trim(),
  lastName: string().required('This field is required').trim(),
  email: string()
    .required('Email is required')
    .email('Please enter a valid email')
    .trim(),
  message: string().required('Message is required').trim(),
  queryType: string()
    .required('Query type is required')
    .oneOf(['general', 'support', 'billing', 'other'], 'Invalid query type'),
});

// Get database configuration based on environment
function getDatabaseConfig() {
  // For Vercel with Postgres
  if (process.env.VERCEL && process.env.POSTGRES_URL) {
    return {
      url: process.env.POSTGRES_URL,
      options: {
        dialect: 'postgres',
        dialectModule: pg, // Explicitly provide the pg module
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        logging: false,
        pool: {
          max: 2,
          min: 0,
          idle: 10000,
          acquire: 30000,
          evict: 10000,
        },
      },
    };
  }

  // For non-Vercel environments, use DATABASE_URL
  if (process.env.DATABASE_URL) {
    // Check if using PostgreSQL
    if (process.env.DATABASE_URL.startsWith('postgres')) {
      return {
        url: process.env.DATABASE_URL,
        options: {
          dialect: 'postgres',
          dialectModule: pg, // Explicitly provide the pg module
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          },
          logging: false,
          pool: {
            max: 2,
            min: 0,
            idle: 10000,
            acquire: 30000,
            evict: 10000,
          },
        },
      };
    }
  }

  // Default to SQLite
  return {
    url: process.env.DATABASE_URL || 'sqlite::memory:',
    options: {
      dialect: 'sqlite',
      storage: process.env.DATABASE_URL?.replace('sqlite:', '') || ':memory:',
      logging: false,
    },
  };
}

// Database connection management
let sequelizeInstance = null;

async function getDatabase() {
  if (sequelizeInstance) {
    return sequelizeInstance;
  }

  const config = getDatabaseConfig();
  sequelizeInstance = new Sequelize(config.url, config.options);

  // Define FormSubmission model
  const FormSubmission = sequelizeInstance.define(
    'form_submission',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      queryType: {
        type: DataTypes.ENUM('general', 'support'),
        allowNull: false,
        defaultValue: 'general',
        validate: {
          isIn: [['general', 'support']],
        },
      },
    },
    {
      tableName: 'form_submissions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  try {
    await sequelizeInstance.authenticate();
    await sequelizeInstance.sync();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }

  return sequelizeInstance;
}

// Admin authorization middleware
function checkAdminAuthorization(req) {
  try {
    // Get the auth cookie
    const cookies = req.headers.cookie || '';

    // Basic auth check from cookie
    const cookieMap = {};
    cookies.split(';').forEach((cookie) => {
      const parts = cookie.trim().split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=');
        cookieMap[key] = value;
      }
    });

    // Parse the auth_user cookie
    if (!cookieMap.auth_user) {
      return { authorized: false, error: 'Not authenticated' };
    }

    const userData = JSON.parse(decodeURIComponent(cookieMap.auth_user));

    // Try both cookie-based check and direct ID check
    const cookieAdmin =
      userData.isAdmin === true || userData.isAdmin === 'true';
    const directIdCheck = String(userData.id) === process.env.ADMIN_GITHUB_ID;

    // Allow access if either check passes
    if (cookieAdmin || directIdCheck) {
      return { authorized: true, user: userData };
    }

    return { authorized: false, error: 'Not authorized' };
  } catch (error) {
    console.error('Authorization error:', error);
    return { authorized: false, error: 'Authentication error' };
  }
}

// Serverless function handler
export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.CLIENT_URL || 'https://contact-form-app-sable.vercel.app'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Skip CSRF for public form submissions
  if (req.method === 'POST' && !req.url.includes('/admin')) {
    try {
      // Initialize database
      const sequelizeInstance = await getDatabase();

      // Define FormSubmission model
      const FormSubmission = sequelizeInstance.models.form_submission;
      if (!FormSubmission) {
        console.error('FormSubmission model is not defined');
        return res
          .status(500)
          .json({ error: 'FormSubmission model is not defined' });
      }

      // Extract the submission object from the request body
      const { submission } = req.body;

      if (!submission) {
        console.error('No submission data provided');
        return res.status(400).json({ error: 'No submission data provided' });
      }

      // Create a new submission in the database
      const newSubmission = await FormSubmission.create(submission);

      return res.status(201).json(newSubmission);
    } catch (error) {
      console.error('Error processing public form submission:', error);
      return res
        .status(500)
        .json({ error: 'Internal server error', details: error.message });
    }
  }

  // Apply CSRF protection for admin routes
  csrfProtection(req, res, async (err) => {
    if (err) {
      console.error('CSRF validation failed:', err);
      return res.status(403).json({ error: 'CSRF validation failed' });
    }

    // Check admin authorization
    const authResult = checkAdminAuthorization(req);
    if (!authResult.authorized) {
      console.error('Authorization failed:', authResult.error);
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only administrators can access this endpoint',
      });
    }

    try {
      // Initialize database
      const sequelizeInstance = await getDatabase();

      // Define FormSubmission model
      const FormSubmission = sequelizeInstance.models.form_submission;
      if (!FormSubmission) {
        console.error('FormSubmission model is not defined');
        return res
          .status(500)
          .json({ error: 'FormSubmission model is not defined' });
      }

      // Handle GET method to fetch all submissions
      if (req.method === 'GET') {
        const submissions = await FormSubmission.findAll();
        return res.status(200).json(submissions);
      }

      // Handle POST method to create a new submission
      if (req.method === 'POST') {
        // Extract the submission object from the request body
        const { submission } = req.body;

        if (!submission) {
          console.error('No submission data provided');
          return res.status(400).json({ error: 'No submission data provided' });
        }

        // Create a new submission in the database
        const newSubmission = await FormSubmission.create(submission);

        return res.status(201).json(newSubmission);
      }

      // Method not allowed
      return res.status(405).json({
        error: 'Method not allowed. Allowed methods: GET, POST, OPTIONS',
      });
    } catch (error) {
      console.error('Error processing request:', error);
      return res
        .status(500)
        .json({ error: 'Internal server error', details: error.message });
    }
  });
};
