import client from './client';

export const questionService = {
  async getQuestions(filters?: any) {
    const params = new URLSearchParams();
    if (filters?.certificationId) params.append('certificationId', filters.certificationId);
    if (filters?.knowledgeAreaId) params.append('knowledgeAreaId', filters.knowledgeAreaId);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));
    // Default to fetching all questions if no limit specified
    if (!filters?.limit) params.append('limit', '1000');
    const response = await client.get(`/api/questions?${params.toString()}`);
    return response.data;
  },

  async getQuestion(id: string) {
    const response = await client.get(`/api/questions/${id}`);
    return response.data;
  },

  async createQuestion(data: any) {
    const response = await client.post('/api/questions', data);
    return response.data;
  },

  async updateQuestion(id: string, data: any) {
    const response = await client.put(`/api/questions/${id}`, data);
    return response.data;
  },

  async deleteQuestion(id: string) {
    const response = await client.delete(`/api/questions/${id}`);
    return response.data;
  },
};

