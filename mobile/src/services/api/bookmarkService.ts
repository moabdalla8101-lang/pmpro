import client from './client';

export const bookmarkService = {
  async getBookmarks(knowledgeAreaId?: string) {
    const params = new URLSearchParams();
    if (knowledgeAreaId) {
      params.append('knowledgeAreaId', knowledgeAreaId);
    }
    const response = await client.get(`/api/bookmarks?${params.toString()}`);
    return response.data;
  },

  async addBookmark(questionId: string) {
    const response = await client.post('/api/bookmarks', { questionId });
    return response.data;
  },

  async removeBookmark(questionId: string) {
    const response = await client.delete(`/api/bookmarks/${questionId}`);
    return response.data;
  },

  async checkBookmark(questionId: string) {
    const response = await client.get(`/api/bookmarks/check/${questionId}`);
    return response.data;
  },
};

