import client from './client';

export const progressService = {
  async getProgress(certificationId: string) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'progressService.ts:4',message:'getProgress called',data:{certificationId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'progress-refresh'})}).catch(()=>{});
    // #endregion
    try {
      const response = await client.get(`/api/progress?certificationId=${certificationId}`);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'progressService.ts:8',message:'getProgress response received',data:{hasData:!!response.data,hasProgress:!!response.data?.progress,progressLength:response.data?.progress?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'progress-refresh'})}).catch(()=>{});
      // #endregion
      return response.data;
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'progressService.ts:12',message:'getProgress error',data:{error:error?.message,status:error?.response?.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'progress-refresh'})}).catch(()=>{});
      // #endregion
      throw error;
    }
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


