import client from './client';

export const authService = {
  async login(email: string, password: string) {
    const response = await client.post('/api/auth/login', { email, password });
    return response.data;
  },

  async register(data: { email: string; password: string; firstName?: string; lastName?: string }) {
    const response = await client.post('/api/auth/register', data);
    return response.data;
  },

  async requestPasswordReset(email: string) {
    const response = await client.post('/api/auth/reset-password/request', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await client.post('/api/auth/reset-password', { token, password });
    return response.data;
  },

  async socialLogin(provider: 'google' | 'apple', token: string) {
    const response = await client.post('/api/auth/social-login', { provider, token });
    return response.data;
  },
};


