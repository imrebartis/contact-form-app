import { IUser } from 'src/types/user';

import { NextFunction, Request, Response } from '../types/express';

// Extended Request interface to include user property
export interface AuthRequest extends Request {
  user?: IUser;
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
  return res.status(401).json({ error: 'Authentication required' });
};

// Middleware to check if user is admin
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated() && req.user && (req.user as any).isAdmin) {
    return next();
  }
  return res.status(403).json({ error: 'Admin privileges required' });
};
