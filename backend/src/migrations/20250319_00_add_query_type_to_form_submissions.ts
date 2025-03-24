import { DataTypes } from 'sequelize';

import { Migration } from '../types/migration.ts';

export const migration: Migration = {
  up: async ({ context: queryInterface }) => {
    const tableDescription = await queryInterface.describeTable(
      'form_submissions'
    );
    if (!tableDescription.query_type) {
      await queryInterface.addColumn('form_submissions', 'query_type', {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'general',
      });
    }
    if (tableDescription.id && tableDescription.id.type !== 'UUID') {
      await queryInterface.changeColumn('form_submissions', 'id', {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      });
    }
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('form_submissions', 'query_type');
  },
};
