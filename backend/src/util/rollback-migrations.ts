import fs from 'fs';
import path from 'path';
// Add pathToFileURL import
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import { sequelize } from './db.ts';

const rollbackMigration = async () => {
  // Get proper __dirname equivalent in ESM
  // @ts-ignore
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Go up one level from util to src, then to migrations
  const migrationsDir = path.join(__dirname, '..', 'migrations');

  // Get sorted migration files (descending order for rollback)
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
    .sort()
    .reverse();

  console.log('Rolling back migrations...');

  let hasErrors = false; // Track if any errors occur

  for (const file of migrationFiles) {
    try {
      console.log(`Rolling back: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const migrationUrl = pathToFileURL(migrationPath).href; // Convert to file URL
      const { migration } = await import(migrationUrl); // Use file URL for import

      // Check if the table exists before attempting to rollback
      const tableName = 'form_submissions'; // Replace with the actual table name
      const tableExists = await sequelize
        .getQueryInterface()
        .describeTable(tableName)
        .catch(() => null);
      if (!tableExists) {
        console.warn(
          `Table "${tableName}" does not exist. Skipping rollback for ${file}.`
        );
        continue;
      }

      await migration.down({ context: sequelize.getQueryInterface() });
      console.log(`Rollback of ${file} completed successfully`);
    } catch (error) {
      console.error(`Error rolling back migration ${file}:`, error);
      hasErrors = true; // Set flag if an error occurs
    }
  }

  if (hasErrors) {
    console.error('Some rollbacks failed. Please check the logs for details.');
    process.exit(1); // Exit with non-zero status if any errors occurred
  } else {
    console.log('All rollbacks completed successfully');
    process.exit(0);
  }
};

// Execute the rollback
rollbackMigration().catch((error) => {
  console.error('Rollback failed:', error);
  process.exit(1);
});
