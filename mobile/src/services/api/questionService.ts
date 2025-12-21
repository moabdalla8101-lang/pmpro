import client from './client';

export const questionService = {
  async getQuestions(filters: { certificationId?: string; knowledgeAreaId?: string; difficulty?: string; limit?: string | number; offset?: string | number }) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'questionService.ts:5',message:'getQuestions called',data:{filters},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1,H3'})}).catch(()=>{});
    // #endregion
    const params = new URLSearchParams();
    if (filters.certificationId) params.append('certificationId', filters.certificationId);
    if (filters.knowledgeAreaId) params.append('knowledgeAreaId', filters.knowledgeAreaId);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.offset) params.append('offset', String(filters.offset));
    
    try {
      const response = await client.get(`/api/questions?${params.toString()}`);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'questionService.ts:14',message:'getQuestions response received',data:{hasData:!!response.data,questionsCount:response.data?.questions?.length||0,hasQuestions:!!response.data?.questions},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1,H3'})}).catch(()=>{});
      // #endregion
      return response.data;
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'questionService.ts:18',message:'getQuestions error',data:{error:error?.message,status:error?.response?.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1,H2'})}).catch(()=>{});
      // #endregion
      throw error;
    }
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


