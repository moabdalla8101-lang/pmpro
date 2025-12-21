import client from './client';

export const progressService = {
  async getProgress(certificationId: string) {
    const response = await client.get(`/api/progress?certificationId=${certificationId}`);
    return response.data;
  },

  async getPerformanceByKnowledgeArea(certificationId: string) {
    const response = await client.get(`/api/progress/knowledge-area?certificationId=${certificationId}`);
    return response.data;
  },

  async recordAnswer(questionId: string, answerId: string) {
    const response = await client.post('/api/progress/answer', { questionId, answerId });
    return response.data;
  },
};


