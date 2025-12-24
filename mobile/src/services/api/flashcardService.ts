import client from './client';

export const flashcardService = {
  async getFlashcards(knowledgeAreaIds?: string[], random?: boolean) {
    const params = new URLSearchParams();
    if (knowledgeAreaIds && knowledgeAreaIds.length > 0) {
      params.append('knowledgeAreaIds', knowledgeAreaIds.join(','));
    }
    if (random) {
      params.append('random', 'true');
    }
    const response = await client.get(`/api/flashcards?${params.toString()}`);
    return response.data;
  },

  async getKnowledgeAreas() {
    const response = await client.get('/api/flashcards/knowledge-areas');
    return response.data;
  },

  async getMarkedFlashcards(random?: boolean) {
    const params = new URLSearchParams();
    if (random) {
      params.append('random', 'true');
    }
    const response = await client.get(`/api/flashcards/marked?${params.toString()}`);
    return response.data;
  },

  async toggleMarkFlashcard(flashcardId: string, isMarked: boolean) {
    const response = await client.post(`/api/flashcards/${flashcardId}/mark`, { isMarked });
    return response.data;
  },

  async recordReview(flashcardId: string, isCorrect: boolean) {
    const response = await client.post('/api/flashcards/review', { flashcardId, isCorrect });
    return response.data;
  },
};

