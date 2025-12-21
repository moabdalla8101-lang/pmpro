import client from './client';

export const authService = {
  async login(email: string, password: string) {
    const response = await client.post('/api/auth/login', { email, password });
    return response.data;
  },
};

