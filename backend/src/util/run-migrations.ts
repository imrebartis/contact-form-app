import fs from 'fs';
import path from 'path';
// Add pathToFileURL import
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import { sequelize } from './db.ts';

export const runMigrations = async () => {
  // Get proper __dirname equivalent in ESM
  // @ts-ignore
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Go up one level from util to src, then to migrations
  const migrationsDir = path.join(__dirname, '..', 'migrations');

  // Get sorted migration files (ascending order for running)
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
    .sort();

  console.log('Running migrations...');

  let hasErrors = false; // Track if any errors occur

  for (const file of migrationFiles) {
    try {
      console.log(`Migrating: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const migrationUrl = pathToFileURL(migrationPath).href; // Convert to file URL
      const { migration } = await import(migrationUrl); // Use file URL for import

      // Check if the table exists before attempting to run the migration
      const tableName = 'form_submissions'; // Replace with the actual table name
      const tableExists = await sequelize
        .getQueryInterface()
        .describeTable(tableName)
        .catch(() => null);
      if (
        !tableExists &&
        file !== '20250322_00_create_form_submissions_table.ts'
      ) {
        console.warn(
          `Table "${tableName}" does not exist yet, skipping migration ${file}.`
        );
        continue;
      }

      await migration.up({ context: sequelize.getQueryInterface() });
      console.log(`Migration of ${file} completed successfully`);
    } catch (error) {
      console.error(`Error running migration ${file}:`, error);
      hasErrors = true; // Set flag if an error occurs
    }
  }

  if (hasErrors) {
    console.error('Some migrations failed. Please check the logs for details.');
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1); // Exit with non-zero status if any errors occurred
    } else {
      throw new Error('Some migrations failed.');
    }
  } else {
    console.log('All migrations completed successfully');
    if (process.env.NODE_ENV !== 'test') {
      process.exit(0);
    }
  }
};

// Execute the migrations
if (process.env.NODE_ENV !== 'test') {
  runMigrations().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}
