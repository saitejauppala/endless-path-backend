import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Global error handler middleware.
 * Must be registered LAST in Express (after all routes).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('[Error]', err.message);

  // Handle our custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Handle Sequelize unique constraint errors
  if ((err as any).name === 'SequelizeUniqueConstraintError') {
    res.status(409).json({
      success: false,
      message: 'A record with this value already exists.',
    });
    return;
  }

  // Handle JWT errors
  if ((err as any).name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again.',
    });
    return;
  }

  if ((err as any).name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expired. Please login again.',
    });
    return;
  }

  // Fallback — 500 Internal Server Error
  res.status(500).json({
    success: false,
    message: 'Something went wrong on our end.',
  });
};
