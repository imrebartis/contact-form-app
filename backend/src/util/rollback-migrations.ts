import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

import { sequelize } from './db';

export const rollbackMigrations = async () => {
  const __dirname = path.resolve();
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.ts'))
    .sort()
    .reverse();

  console.log('Rolling back migrations...');

  try {
    await sequelize.authenticate(); // Ensure connection before proceeding
    console.log('Database connection established successfully.');

    for (const file of migrationFiles) {
      console.log(`Rolling back: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const migrationUrl = pathToFileURL(migrationPath).href;
      const { down } = await import(migrationUrl); // Import only the 'down' function

      try {
        await down({ context: sequelize.getQueryInterface() });
        console.log(`Rollback of ${file} completed successfully`);
      } catch (error) {
        console.error(`Error rolling back migration ${file}:`, error);
        if (error instanceof Error) {
          throw new Error(`Rollback of ${file} failed: ${error.message}`);
        } else {
          throw new Error(`Rollback of ${file} failed: ${String(error)}`);
        }
      }
    }
    console.log('All rollbacks completed successfully');
  } catch (error) {
    console.error('Rollback process failed:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  rollbackMigrations().catch((error) => {
    console.error('Rollback failed:', error);
    process.exit(1);
  });
}
