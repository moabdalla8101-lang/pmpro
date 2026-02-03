import client from './client';

export interface SubscriptionStatus {
  tier: string;
  expiresAt: string | null;
  isActive: boolean;
}

export const subscriptionService = {
  /**
   * Get current subscription status
   */
  async getSubscription(): Promise<SubscriptionStatus> {
    const response = await client.get('/api/subscriptions');
    return response.data;
  },

  /**
   * Sync subscription from RevenueCat
   */
  async syncSubscription(tier: string, expiresAt: Date | null): Promise<SubscriptionStatus> {
    const response = await client.post('/api/subscriptions/sync', {
      tier,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
    });
    return response.data;
  },

  /**
   * Update subscription manually (admin use)
   */
  async updateSubscription(tier: string, expiresAt: Date | null): Promise<void> {
    await client.put('/api/subscriptions', {
      tier,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
    });
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(): Promise<void> {
    await client.delete('/api/subscriptions');
  },
};
