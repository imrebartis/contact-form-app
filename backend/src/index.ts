import cors from 'cors';
import express from 'express';
import path from 'path';

import formSubmissionsRouter from './api/form-submissions.ts';
import { config } from './util/config.ts';
import { connectToDatabase } from './util/db.ts';

export const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// API routes with proper prefixes
app.use('/api/submissions', formSubmissionsRouter);

// Add this after your API routes but before starting the server
const __dirname = path.resolve();

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
const startServer = async () => {
  try {
    const connected = await connectToDatabase();

    // Continue starting the server even if database connection fails
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
      if (!connected) {
        console.log('WARNING: Server running without database connection!');
        console.log('Some features may not work correctly.');
      }
    });
  } catch (error) {
    console.error('Error starting backend server:', error);
    process.exit(1);
  }
};

startServer();
