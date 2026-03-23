import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { AppError } from '../utils/AppError';

// Extend Express Request to include authenticated user info
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * Middleware to verify JWT and attach user payload to request.
 * Usage: router.get('/protected', authenticate, handler)
 */
export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided. Please login.', 401);
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware factory for role-based access control.
 * Usage: router.get('/admin', authenticate, authorize('admin'), handler)
 * @param roles - allowed roles
 */
export const authorize = (...roles: Array<'customer' | 'provider' | 'admin'>) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};
