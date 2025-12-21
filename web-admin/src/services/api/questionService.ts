import client from './client';

export const questionService = {
  async getQuestions(filters?: any) {
    const params = new URLSearchParams();
    if (filters?.certificationId) params.append('certificationId', filters.certificationId);
    if (filters?.knowledgeAreaId) params.append('knowledgeAreaId', filters.knowledgeAreaId);
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

