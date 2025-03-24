'use strict';

import { QueryInterface } from 'sequelize';

/**
 * Migration interface for database migrations
 * Provides typed structure for up/down migration operations
 */
export interface Migration {
  /**
   * Migration up operation - applies changes to the database
   * @param options Object containing queryInterface as context
   */
  up: (options: { context: QueryInterface }) => Promise<void>;

  /**
   * Migration down operation - reverts changes from the database
   * @param options Object containing queryInterface as context
   */
  down: (options: { context: QueryInterface }) => Promise<void>;
}
