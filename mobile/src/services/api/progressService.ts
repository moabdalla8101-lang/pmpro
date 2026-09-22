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

  async getPerformanceByDomain(certificationId: string) {
    const response = await client.get(`/api/progress/domain?certificationId=${certificationId}`);
    return response.data;
  },

  async recordAnswer(
    questionId: string,
    answerId?: string,
    options?: {
      answerIds?: string[];
      dragMatches?: Record<string, string>;
      idempotencyKey?: string;
      certificationId?: string;
    }
  ) {
    const certificationId =
      options?.certificationId || '550e8400-e29b-41d4-a716-446655440000';
    const body: any = { questionId, certificationId };
    if (options?.answerIds?.length) {
      body.answerIds = options.answerIds;
    } else if (answerId) {
      body.answerId = answerId;
    }
    if (options?.dragMatches) {
      body.dragMatches = options.dragMatches;
    }
    // Stable per submit action so axios/network retries cannot double-insert.
    const idempotencyKey =
      options?.idempotencyKey ||
      `practice:${questionId}:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`;
    const response = await client.post('/api/progress/answer', body, {
      headers: { 'Idempotency-Key': idempotencyKey },
    });
    return response.data;
  },

  async getMissedQuestions(knowledgeAreaId?: string, reviewed?: boolean, certificationId?: string) {
    const params = new URLSearchParams();
    if (certificationId) {
      params.append('certificationId', certificationId);
    }
    if (knowledgeAreaId) {
      params.append('knowledgeAreaId', knowledgeAreaId);
    }
    if (reviewed !== undefined) {
      // Explicitly pass 'true' or 'false' as strings
      params.append('reviewed', reviewed ? 'true' : 'false');
    }
    const response = await client.get(`/api/progress/missed-questions?${params.toString()}`);
    return response.data;
  },

  async markAsReviewed(questionId: string) {
    const response = await client.post('/api/progress/missed-questions/reviewed', { questionId });
    return response.data;
  },

  async getAnsweredQuestionIds(certificationId?: string) {
    const params = new URLSearchParams();
    if (certificationId) {
      params.append('certificationId', certificationId);
    }
    const response = await client.get(`/api/progress/answered-questions?${params.toString()}`);
    return response.data;
  },
};


