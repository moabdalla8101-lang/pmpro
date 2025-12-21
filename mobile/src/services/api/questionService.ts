import client from './client';

export const questionService = {
  async getQuestions(filters: { certificationId?: string; knowledgeAreaId?: string; difficulty?: string }) {
    const params = new URLSearchParams();
    if (filters.certificationId) params.append('certificationId', filters.certificationId);
    if (filters.knowledgeAreaId) params.append('knowledgeAreaId', filters.knowledgeAreaId);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    
    const response = await client.get(`/api/questions?${params.toString()}`);
    return response.data;
  },

  async getQuestion(id: string) {
    const response = await client.get(`/api/questions/${id}`);
    return response.data;
  },

  async getQuestionsByKnowledgeArea(knowledgeAreaId: string) {
    const response = await client.get(`/api/questions/knowledge-area/${knowledgeAreaId}`);
    return response.data;
  },
};


