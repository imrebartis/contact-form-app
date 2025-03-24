'use strict';

/**
 * Interface representing the data structure of a user
 */
export interface IUser {
  id: string;
  email?: string;
  name?: string;
  githubId?: string;
  isAdmin: boolean;
}

// Augment the Express namespace to include the user property in Request
declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
