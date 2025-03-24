const { Sequelize, DataTypes, Model } = require('sequelize');
const yup = require('yup');
const pg = require('pg');

// Form validation schema
const formSubmissionSchema = yup.object().shape({
  firstName: yup.string().required('First name is required').trim(),
  lastName: yup.string().required('Last name is required').trim(),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email')
    .trim(),
  message: yup.string().required('Message is required').trim(),
  queryType: yup
    .string()
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
    try {
      await sequelizeInstance.authenticate();
      return sequelizeInstance;
    } catch (error) {
      console.log('Reconnecting to database...');
      sequelizeInstance = null;
    }
  }

  const config = getDatabaseConfig();
  sequelizeInstance = new Sequelize(config.url, config.options);
  
  // Define FormSubmission model
  const FormSubmission = sequelizeInstance.define('form_submission', {
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
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'form_submissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  
  try {
    await sequelizeInstance.authenticate();
    await sequelizeInstance.sync();
    console.log('Database connection established');
  } catch (error) {
    console.error('Unable to connect to database:', error);
    throw error;
  }
  
  return { sequelize: sequelizeInstance, FormSubmission };
}

// Serverless function handler
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST for this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Request received:', { 
      method: req.method, 
      url: req.url,
      contentType: req.headers['content-type'],
      hasBody: !!req.body 
    });

    // Connect to database
    const { FormSubmission } = await getDatabase();

    // Get submission data from request body
    const submissionData = req.body.submission || req.body;
    console.log('Submission data received:', submissionData);

    // Validate the data
    const validatedData = await formSubmissionSchema.validate(submissionData, {
      abortEarly: false,
    });
    console.log('Data validated successfully');

    // Create the submission
    const newContact = await FormSubmission.create({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      message: validatedData.message,
      queryType: validatedData.queryType,
    });
    console.log('Form submission created:', newContact.id);

    // Return success response
    return res.status(201).json(newContact.toJSON());
  } catch (error) {
    console.error('Error creating submission:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors?.map(err => ({
          path: err.path,
          message: err.message,
        })) || [{ message: error.message }],
      });
    }

    // Handle other errors
    return res.status(500).json({
      error: 'Failed to create submission',
      details: error.message || String(error),
    });
  }
};