import {
  generateToken,
  verifyToken,
  resetJwtSecretCacheForTests,
} from '@pmp-app/shared';

describe('JWT secret hardening', () => {
  const original = process.env.JWT_SECRET;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = original;
    }
    resetJwtSecretCacheForTests();
  });

  it('refuses to sign when JWT_SECRET is missing', () => {
    delete process.env.JWT_SECRET;
    resetJwtSecretCacheForTests();
    expect(() =>
      generateToken({ userId: 'u', email: 'a@b.c', role: 'user' })
    ).toThrow(/JWT_SECRET/);
  });

  it('refuses the published default secret', () => {
    process.env.JWT_SECRET = 'your-secret-key-change-in-production';
    resetJwtSecretCacheForTests();
    expect(() =>
      generateToken({ userId: 'u', email: 'a@b.c', role: 'user' })
    ).toThrow(/weak|default/i);
  });

  it('refuses secrets shorter than 32 characters', () => {
    process.env.JWT_SECRET = 'too-short-to-be-safe';
    resetJwtSecretCacheForTests();
    expect(() =>
      generateToken({ userId: 'u', email: 'a@b.c', role: 'user' })
    ).toThrow(/at least 32/);
  });

  it('signs and verifies with a strong secret', () => {
    process.env.JWT_SECRET = 'unit-test-jwt-secret-value-32chars!!';
    resetJwtSecretCacheForTests();
    const token = generateToken({ userId: 'u1', email: 'a@b.c', role: 'admin' });
    const payload = verifyToken(token);
    expect(payload.userId).toBe('u1');
    expect(payload.role).toBe('admin');
  });
});
