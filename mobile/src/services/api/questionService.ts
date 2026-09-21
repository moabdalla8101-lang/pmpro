import client from './client';

export const questionService = {
  async getQuestions(filters: {
    certificationId?: string;
    knowledgeAreaId?: string;
    difficulty?: string;
    domain?: string;
    limit?: string | number;
    offset?: string | number;
    random?: string | boolean;
    distributeByKnowledgeArea?: string | boolean;
  }) {
    const params = new URLSearchParams();
    if (filters.certificationId) params.append('certificationId', filters.certificationId);
    if (filters.knowledgeAreaId) params.append('knowledgeAreaId', filters.knowledgeAreaId);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.domain) params.append('domain', filters.domain);
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.offset) params.append('offset', String(filters.offset));
    if (filters.random !== undefined) params.append('random', String(filters.random));
    if (filters.distributeByKnowledgeArea !== undefined) {
      params.append('distributeByKnowledgeArea', String(filters.distributeByKnowledgeArea));
    }

    const response = await client.get(`/api/questions?${params.toString()}`);
    return response.data;
  },

  async getQuestion(id: string) {
    const response = await client.get(`/api/questions/${id}`);
    return response.data;
  },

  async getQuestionsByIds(ids: string[]) {
    const idsParam = ids.join(',');
    const response = await client.get(`/api/questions/by-ids?ids=${idsParam}`);
    return response.data;
  },

  async getQuestionsByKnowledgeArea(knowledgeAreaId: string) {
    const response = await client.get(`/api/questions/knowledge-area/${knowledgeAreaId}`);
    return response.data;
  },
};
