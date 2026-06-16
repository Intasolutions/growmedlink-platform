import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@intelligen/types';
import { User } from '../models/User.js';
import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Middleware to authenticate requests using short-lived accessToken HTTP-only cookie
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accessToken } = req.cookies || {};

    if (!accessToken) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Access token is missing.',
      });
      return;
    }

    let payload;
    try {
      payload = verifyAccessToken(accessToken);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired access token.',
      });
      return;
    }

    const user = await User.findById(payload.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authenticated user no longer exists.',
      });
      return;
    }

    // Attach user document to Express request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to authorize requests based on UserRoles RBAC rules
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Access denied for role: ${req.user.role}.`,
      });
      return;
    }

    next();
  };
};
