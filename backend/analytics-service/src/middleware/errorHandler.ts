import { Request, Response, NextFunction } from 'express';
import { AppError } from '@pmp-app/shared';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode
      }
    });
  }

  console.error('Unexpected error:', err);
  res.status(500).json({
    error: {
      message: 'Internal server error',
      statusCode: 500
    }
  });
}


