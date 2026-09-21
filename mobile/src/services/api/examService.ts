import client from './client';

export type ExamSubmitAnswer = {
  questionId: string;
  answerId?: string;
  answerIds?: string[];
  dragMatches?: { [leftItem: string]: string };
};

export const examService = {
  async startExam(certificationId: string, totalQuestions: number, questionIds?: string[]) {
    const response = await client.post('/api/exams/start', {
      certificationId,
      totalQuestions,
      ...(questionIds ? { questionIds } : {}),
    });
    return response.data;
  },

  async submitExam(examId: string, answers: ExamSubmitAnswer[]) {
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

  async startDailyQuiz(certificationId: string) {
    const response = await client.post('/api/exams/daily-quiz/start', { certificationId });
    return response.data;
  },

  async getDailyQuizStatus(certificationId: string) {
    const response = await client.get(
      `/api/exams/daily-quiz/status?certificationId=${certificationId}`
    );
    return response.data;
  },
};
