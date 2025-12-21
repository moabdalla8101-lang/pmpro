import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { ValidationError as AppValidationError } from '@pmp-app/shared';

export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err: ValidationError) => err.msg);
    return next(new AppValidationError(errorMessages.join(', ')));
  }
  
  next();
}


