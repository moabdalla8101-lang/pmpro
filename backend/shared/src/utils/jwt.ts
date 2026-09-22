import jwt from 'jsonwebtoken';

const WEAK_SECRETS = new Set([
  'your-secret-key-change-in-production',
  'secret',
  'jwt_secret',
  'changeme',
  'change-me',
]);

const MIN_SECRET_LENGTH = 32;

function resolveJwtSecret(): string {
  const secret = (process.env.JWT_SECRET || '').trim();
  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is required and must not be empty'
    );
  }
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must be at least ${MIN_SECRET_LENGTH} characters`
    );
  }
  if (WEAK_SECRETS.has(secret.toLowerCase())) {
    throw new Error('JWT_SECRET is a known weak/default value and must be replaced');
  }
  return secret;
}

/** Lazily resolved so process.env can be set before first use (tests/dotenv). */
let cachedSecret: string | null = null;

function getJwtSecret(): string {
  if (!cachedSecret) {
    cachedSecret = resolveJwtSecret();
  }
  return cachedSecret;
}

/** Test helper — clears the cached secret so a new env value is picked up. */
export function resetJwtSecretCacheForTests(): void {
  cachedSecret = null;
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload as object, getJwtSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, getJwtSecret()) as JWTPayload;
  } catch (error) {
    if (error instanceof Error && error.message.includes('JWT_SECRET')) {
      throw error;
    }
    throw new Error('Invalid or expired token');
  }
}
