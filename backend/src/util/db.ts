import { Sequelize } from 'sequelize';

import { config } from './config.ts';

export const sequelize = new Sequelize(config.database.url, {
  dialect: config.database.dialect,
  logging: config.nodeEnv === 'development',
  storage: config.database.storage,
  ...(config.database.dialect === 'sqlite'
    ? {
        define: {
          timestamps: true,
          underscored: true,
        },
        dialectOptions: {},
      }
    : {
        dialectOptions: {
          ssl:
            config.nodeEnv === 'production'
              ? {
                  require: true,
                  rejectUnauthorized: false,
                }
              : false,
        },
      }),
});

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      `Database connection established successfully using ${config.database.dialect}`
    );

    // Sync all models with the database
    await sequelize.sync({ alter: config.nodeEnv === 'development' });
    console.log('All models were synchronized successfully');

    return true;
  } catch (error) {
    if (config.database.dialect === 'postgres') {
      console.error('PostgreSQL connection error:', error);
      console.log('\n');
      console.log("If you don't have PostgreSQL installed or running:");
      console.log(
        ' - Install PostgreSQL from https://www.postgresql.org/download/'
      );
      console.log(' - Or create a .env file in the backend directory with:');
      console.log('   USE_POSTGRES=false');
      console.log(
        '   SQLITE_STORAGE=./database.sqlite (optional, defaults to in-memory)'
      );
      console.log('\n');
    } else {
      console.error('SQLite connection error:', error);
    }

    return false;
  }
};
