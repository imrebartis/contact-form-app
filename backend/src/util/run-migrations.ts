import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

import { sequelize } from './db';

export const runMigrations = async () => {
  const __dirname = path.resolve();
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.ts'))
    .sort();

  console.log('Running migrations...');

  try {
    await sequelize.authenticate(); // Ensure connection before proceeding
    console.log('Database connection established successfully.');

    for (const file of migrationFiles) {
      console.log(`Migrating: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const migrationUrl = pathToFileURL(migrationPath).href;
      const { up } = await import(migrationUrl); // Import only the 'up' function

      try {
        await up({ context: sequelize.getQueryInterface() });
        console.log(`Migration of ${file} completed successfully`);
      } catch (error) {
        console.error(`Error running migration ${file}:`, error);
        if (error instanceof Error) {
          throw new Error(`Migration ${file} failed: ${error.message}`);
        } else {
          throw new Error(`Migration ${file} failed: Unknown error`);
        }
      }
    }
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration process failed:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  runMigrations().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}
