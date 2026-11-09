import rateLimit from 'express-rate-limit';

const RATE_LIMIT_MESSAGE = {
  error: {
    message: 'Too many requests. Please wait a moment and try again.',
    statusCode: 429,
  },
};

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Enough for normal login retries; still slows credential stuffing
  skipSuccessfulRequests: true, // Only failed auth attempts count toward the limit
  message: {
    error: {
      message: 'Too many sign-in attempts. Please wait a few minutes and try again.',
      statusCode: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API limiter. Kept moderate — exam sessions need a much higher
 * ceiling because progress saves fire often across a 180-question mock.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 600 : 2000,
  message: RATE_LIMIT_MESSAGE,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for localhost in development
    return process.env.NODE_ENV !== 'production' && (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1');
  },
});

/** Timed exams autosave frequently; allow a full mock without 429 mid-submit. */
export const examRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 2500 : 5000,
  message: {
    error: {
      message:
        'Too many exam requests. Please wait a minute, then try submitting again. Your answers are saved.',
      statusCode: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
