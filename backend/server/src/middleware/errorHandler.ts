import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import { AppError } from '@pmp-app/shared';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      Sentry.captureException(err);
    }
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
  }

  console.error('Unexpected error:', err);
  Sentry.captureException(err);
  res.status(500).json({
    error: {
      message: 'Internal server error',
      statusCode: 500,
    },
  });
}


