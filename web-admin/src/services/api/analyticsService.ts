import client from './client';

export const analyticsService = {
  async getAdminAnalytics() {
    const response = await client.get('/api/analytics/admin');
    return response.data;
  },

  async getUsageAnalytics(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await client.get(`/api/analytics/usage?${params.toString()}`);
    return response.data;
  },

  async getRevenueReport() {
    const response = await client.get('/api/analytics/revenue');
    return response.data;
  },
};



