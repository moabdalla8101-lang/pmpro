import client from './client';

export const knowledgeAreaService = {
  async getKnowledgeAreas() {
    const response = await client.get('/api/knowledge-areas');
    return response.data;
  },

  async getKnowledgeArea(id: string) {
    const response = await client.get(`/api/knowledge-areas/${id}`);
    return response.data;
  },

  async getKnowledgeAreasByCertification(certificationId: string) {
    const response = await client.get(`/api/knowledge-areas/certification/${certificationId}`);
    return response.data;
  },

  async createKnowledgeArea(data: any) {
    const response = await client.post('/api/knowledge-areas', data);
    return response.data;
  },

  async updateKnowledgeArea(id: string, data: any) {
    const response = await client.put(`/api/knowledge-areas/${id}`, data);
    return response.data;
  },

  async deleteKnowledgeArea(id: string) {
    const response = await client.delete(`/api/knowledge-areas/${id}`);
    return response.data;
  },
};



