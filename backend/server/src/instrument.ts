/**
 * Must be imported before any other app modules so Sentry can patch modules.
 */
import * as Sentry from '@sentry/node';

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 0,
    enabled: process.env.NODE_ENV === 'production' || process.env.SENTRY_ENABLE === 'true',
  });
}

export { Sentry };
