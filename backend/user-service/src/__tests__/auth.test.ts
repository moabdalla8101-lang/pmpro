import { hashPassword, comparePassword } from '@pmp-app/shared';

describe('Password utilities', () => {
  it('should hash a password', async () => {
    const password = 'testpassword123';
    const hash = await hashPassword(password);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });

  it('should verify a correct password', async () => {
    const password = 'testpassword123';
    const hash = await hashPassword(password);
    const isValid = await comparePassword(password, hash);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const password = 'testpassword123';
    const hash = await hashPassword(password);
    const isValid = await comparePassword('wrongpassword', hash);
    expect(isValid).toBe(false);
  });
});



