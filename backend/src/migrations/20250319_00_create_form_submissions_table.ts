'use strict';

export const migration = {
  async up({ context }: { context: import('sequelize').QueryInterface }) {
    try {
      await context.createTable('form_submissions', {
        id: {
          type: 'INTEGER',
          primaryKey: true,
          autoIncrement: true,
        },
        firstName: {
          type: 'STRING',
          allowNull: false,
        },
        lastName: {
          type: 'STRING',
          allowNull: false,
        },
        email: {
          type: 'STRING',
          allowNull: false,
        },
        message: {
          type: 'TEXT',
          allowNull: false,
        },
        queryType: {
          type: 'STRING', // SQLite doesn't support ENUM directly, so we use STRING
          allowNull: false,
          defaultValue: 'general',
        },
        created_at: {
          type: 'DATE',
          allowNull: false,
          defaultValue: new Date(),
        },
        updated_at: {
          type: 'DATE',
          allowNull: false,
          defaultValue: new Date(),
        },
      });
      console.log('Successfully created form_submissions table');
    } catch (error) {
      console.error('Error creating form_submissions table:', error);
      throw error;
    }
  },

  async down({
    context: queryInterface,
  }: {
    context: import('sequelize').QueryInterface;
  }) {
    try {
      await queryInterface.dropTable('form_submissions');
      console.log('Successfully dropped form_submissions table');
    } catch (error) {
      console.error('Error dropping form_submissions table:', error);
      throw error;
    }
  },
};
