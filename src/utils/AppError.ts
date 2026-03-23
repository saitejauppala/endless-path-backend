/**
 * Custom error class that includes an HTTP status code.
 * Use this to throw errors from services/repositories.
 */
export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
