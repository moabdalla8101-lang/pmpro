import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, resetPassword, requestPasswordReset, socialLogin } from '../controllers/authController';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').optional().trim(),
    body('lastName').optional().trim(),
    validate
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate
  ],
  login
);

router.post(
  '/reset-password/request',
  [
    body('email').isEmail().normalizeEmail(),
    validate
  ],
  requestPasswordReset
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 8 }),
    validate
  ],
  resetPassword
);

router.post(
  '/social-login',
  [
    body('provider').isIn(['google', 'apple']),
    body('token').notEmpty(),
    validate
  ],
  socialLogin
);

export default router;




