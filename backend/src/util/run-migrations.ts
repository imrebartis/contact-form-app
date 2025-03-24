import { existsSync, mkdirSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { DataTypes, Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';

// Set __dirname in ESM
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Update the database path to use the correct location
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: join(__dirname, '../../../database.sqlite'),
});

// Define a model to track migrations
const Migration = sequelize.define('Migration', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  executedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

async function runMigrations() {
  // Ensure the migrations table exists
  await Migration.sync();

  // Get list of executed migrations
  const executedMigrations = await Migration.findAll();
  const executedMigrationNames = executedMigrations.map((m: any) => m.name);

  // Path to migrations in the backend/src directory
  const migrationsPath = join(__dirname, '../migrations');

  // Ensure the migrations directory exists
  if (!existsSync(migrationsPath)) {
    console.log('Creating migrations directory...');
    mkdirSync(migrationsPath, { recursive: true });
    return;
  }

  const migrationFiles = readdirSync(migrationsPath)
    .filter((file) => file.endsWith('.ts')) // Ensure only TypeScript files are loaded
    .sort();

  // Filter out already executed migrations
  const pendingMigrations = migrationFiles.filter(
    (file) => !executedMigrationNames.includes(file)
  );

  console.log('Migration files to be executed:', pendingMigrations);

  for (const file of pendingMigrations) {
    console.log(`Running migration: ${file}`);

    // Convert the file path to a proper file:// URL for ESM imports
    const fileUrl = new URL(
      `file://${join(migrationsPath, file).replace(/\\/g, '/')}`
    );

    try {
      const migration = await import(fileUrl.href);
      await migration.migration.up({ context: sequelize.getQueryInterface() });

      // Record that this migration has been executed
      await Migration.create({ name: file });
      console.log(`Completed migration: ${file}`);
    } catch (error) {
      console.error(`Failed to run migration ${file}:`, error);
      throw error;
    }
  }

  if (pendingMigrations.length === 0) {
    console.log('No pending migrations to run');
  } else {
    console.log(`Successfully ran ${pendingMigrations.length} migrations`);
  }
}

runMigrations().catch((err) => {
  console.error('Migration process failed:', err);
  process.exit(1);
});
