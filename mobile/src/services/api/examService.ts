import client from './client';

export const examService = {
  async startExam(certificationId: string, totalQuestions: number) {
    const response = await client.post('/api/exams/start', { certificationId, totalQuestions });
    return response.data;
  },

  async submitExam(examId: string, answers: Array<{ questionId: string; answerId: string }>) {
    const response = await client.post(`/api/exams/${examId}/submit`, { answers });
    return response.data;
  },

  async getExam(examId: string) {
    const response = await client.get(`/api/exams/${examId}`);
    return response.data;
  },

  async getExamReview(examId: string) {
    const response = await client.get(`/api/exams/${examId}/review`);
    return response.data;
  },

  async getUserExams() {
    const response = await client.get('/api/exams');
    return response.data;
  },

  async deleteExam(examId: string) {
    const response = await client.delete(`/api/exams/${examId}`);
    return response.data;
  },
};


