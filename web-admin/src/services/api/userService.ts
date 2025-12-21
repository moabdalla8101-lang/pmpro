import client from './client';

export const userService = {
  async getUsers(filters?: any) {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.subscriptionTier) params.append('subscriptionTier', filters.subscriptionTier);
    const response = await client.get(`/api/admin/users?${params.toString()}`);
    return response.data;
  },

  async getUser(id: string) {
    const response = await client.get(`/api/admin/users/${id}`);
    return response.data;
  },
};

