import { Request, Response, NextFunction } from 'express';
import { hashPassword, comparePassword, generateToken, ValidationError, ConflictError, UnauthorizedError } from '@pmp-app/shared';
import { pool } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return next(new ConflictError('User with this email already exists'));
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    const userId = uuidv4();

    // Create user
    const result = await pool.query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, role, subscription_tier, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING id, email, first_name, last_name, role, subscription_tier, created_at`,
      [userId, email, passwordHash, firstName || null, lastName || null, 'user', 'free']
    );

    const user = result.rows[0];

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        subscriptionTier: user.subscription_tier
      },
      token
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    // #region agent log
    const fs = require('fs');
    const logPath = '/Users/mohamed/Documents/pmpro/.cursor/debug.log';
    fs.appendFileSync(logPath, JSON.stringify({location:'authController.ts:68',message:'Login endpoint called',data:{email:req.body?.email,hasPassword:!!req.body?.password,passwordLength:req.body?.password?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2,H3'})+'\n');
    // #endregion
    const { email, password } = req.body;

    // #region agent log
    fs.appendFileSync(logPath, JSON.stringify({location:'authController.ts:72',message:'Querying database for user',data:{email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})+'\n');
    // #endregion
    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash, first_name, last_name, role, subscription_tier FROM users WHERE email = $1',
      [email]
    );

    // #region agent log
    fs.appendFileSync(logPath, JSON.stringify({location:'authController.ts:78',message:'Database query result',data:{userFound:result.rows.length>0,userId:result.rows[0]?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})+'\n');
    // #endregion
    if (result.rows.length === 0) {
      // #region agent log
      fs.appendFileSync(logPath, JSON.stringify({location:'authController.ts:80',message:'User not found',data:{email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})+'\n');
      // #endregion
      return next(new UnauthorizedError('Invalid email or password'));
    }

    const user = result.rows[0];

    // #region agent log
    fs.appendFileSync(logPath, JSON.stringify({location:'authController.ts:85',message:'Comparing password',data:{userId:user.id,hasPasswordHash:!!user.password_hash},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})+'\n');
    // #endregion
    // Verify password
    const isValid = await comparePassword(password, user.password_hash);
    // #region agent log
    fs.appendFileSync(logPath, JSON.stringify({location:'authController.ts:87',message:'Password comparison result',data:{isValid},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})+'\n');
    // #endregion
    if (!isValid) {
      // #region agent log
      fs.appendFileSync(logPath, JSON.stringify({location:'authController.ts:88',message:'Password invalid',data:{userId:user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})+'\n');
      // #endregion
      return next(new UnauthorizedError('Invalid email or password'));
    }

    // #region agent log
    fs.appendFileSync(logPath, JSON.stringify({location:'authController.ts:92',message:'Generating token',data:{userId:user.id,email:user.email,role:user.role},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})+'\n');
    // #endregion
    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // #region agent log
    fs.appendFileSync(logPath, JSON.stringify({location:'authController.ts:100',message:'Sending login response',data:{hasToken:!!token,tokenLength:token?.length,userId:user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})+'\n');
    // #endregion
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        subscriptionTier: user.subscription_tier
      },
      token
    });
  } catch (error) {
    // #region agent log
    const fs = require('fs');
    const logPath = '/Users/mohamed/Documents/pmpro/.cursor/debug.log';
    fs.appendFileSync(logPath, JSON.stringify({location:'authController.ts:109',message:'Login endpoint error',data:{errorMessage:error?.message,errorStack:error?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})+'\n');
    // #endregion
    next(error);
  }
}

export async function requestPasswordReset(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    const result = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // Don't reveal if user exists
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    const user = result.rows[0];
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id) DO UPDATE SET token = $2, expires_at = $3, created_at = NOW()`,
      [user.id, resetToken, expiresAt]
    );

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    });

    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = req.body;

    // Find valid token
    const tokenResult = await pool.query(
      `SELECT user_id FROM password_reset_tokens 
       WHERE token = $1 AND expires_at > NOW()`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return next(new ValidationError('Invalid or expired reset token'));
    }

    const userId = tokenResult.rows[0].user_id;

    // Update password
    const passwordHash = await hashPassword(password);
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, userId]
    );

    // Delete token
    await pool.query(
      'DELETE FROM password_reset_tokens WHERE token = $1',
      [token]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
}

export async function socialLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { provider, token } = req.body;

    // TODO: Verify token with provider (Google/Apple)
    // For now, this is a placeholder
    // In production, verify the token with the respective provider's API

    res.json({ message: 'Social login not fully implemented yet' });
  } catch (error) {
    next(error);
  }
}


