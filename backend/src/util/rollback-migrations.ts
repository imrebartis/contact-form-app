'use strict';

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

    const queryInterface = sequelize.getQueryInterface();

    for (const file of migrationFiles) {
      console.log(`Rolling back: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const migrationUrl = pathToFileURL(migrationPath).href;

      try {
        // Import the module
        const moduleExports = await import(migrationUrl);
        console.log(
          `Available exports for ${file}:`,
          Object.keys(moduleExports)
        );

        // Look for the migration object and use its down function
        if (
          moduleExports.migration &&
          typeof moduleExports.migration.down === 'function'
        ) {
          await moduleExports.migration.down(queryInterface);
          console.log(`Rollback of ${file} completed successfully`);
        } else {
          throw new Error(
            `No down function found in ${file}. Available exports: ${Object.keys(
              moduleExports
            )}`
          );
        }
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
