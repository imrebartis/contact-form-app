import { DataTypes } from 'sequelize';

import { Migration } from '../types/migration.ts';

export const migration: Migration = {
  up: async ({ context: queryInterface }) => {
    try {
      // Check if the table exists
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('form_submissions')) {
        await queryInterface.createTable('form_submissions', {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },
          first_name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          last_name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              isEmail: true,
            },
          },
          message: {
            type: DataTypes.TEXT,
            allowNull: false,
          },
          query_type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              isIn: [['general', 'support']],
            },
          },
          created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
          updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
        });
      }
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },
  down: async ({ context: queryInterface }) => {
    try {
      // Check if the table exists
      const tables = await queryInterface.showAllTables();
      if (tables.includes('form_submissions')) {
        await queryInterface.dropTable('form_submissions');
      }
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },
};
