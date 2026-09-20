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
};
