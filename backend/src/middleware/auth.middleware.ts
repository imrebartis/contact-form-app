'use strict';

import { User } from '../types/express';
import { NextFunction, Request, Response } from '../types/express';

// Extended Request interface to include user property
export interface AuthRequest extends Request {
  user?: User;
}

// Middleware to check if user is authenticated
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    success: false,
    error: {
      code: 'AUTH_REQUIRED',
      message: 'Authentication required',
      details: null,
    },
  });
};

// Middleware to check if user is admin
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated() && req.user && req.user.isAdmin === true) {
    return next();
  }
  return res.status(403).json({
    success: false,
    error: {
      code: 'ADMIN_REQUIRED',
      message: 'Admin privileges required',
      details: null,
    },
  });
};
