import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { examService } from '../../services/api/examService';

interface Exam {
  id: string;
  userId: string;
  certificationId: string;
  startedAt: string;
  completedAt?: string;
  totalQuestions: number;
  correctAnswers: number;
  score?: number;
}

interface ExamState {
  exams: Exam[];
  currentExam: Exam | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ExamState = {
  exams: [],
  currentExam: null,
  isLoading: false,
  error: null,
};

export const fetchUserExams = createAsyncThunk(
  'exams/fetchUserExams',
  async () => {
    const response = await examService.getUserExams();
    return response;
  }
);

export const fetchExam = createAsyncThunk(
  'exams/fetchExam',
  async (examId: string) => {
    const response = await examService.getExam(examId);
    return response;
  }
);

const examSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    clearExams: (state) => {
      state.exams = [];
      state.currentExam = null;
    },
    setCurrentExam: (state, action) => {
      state.currentExam = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserExams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserExams.fulfilled, (state, action) => {
        state.isLoading = false;
        // Transform snake_case to camelCase (with fallback for camelCase)
        state.exams = (action.payload.exams || []).map((exam: any) => {
          // Handle score - convert to number, default to null if not available
          let score = null;
          if (exam.score !== null && exam.score !== undefined) {
            if (typeof exam.score === 'number') {
              score = !isNaN(exam.score) ? exam.score : null;
            } else if (typeof exam.score === 'string') {
              const parsed = parseFloat(exam.score);
              score = !isNaN(parsed) ? parsed : null;
            }
          }
          
          return {
            id: exam.id,
            userId: exam.userId || exam.user_id,
            certificationId: exam.certificationId || exam.certification_id,
            startedAt: exam.startedAt || exam.started_at,
            completedAt: exam.completedAt || exam.completed_at,
            totalQuestions: exam.totalQuestions || exam.total_questions || 0,
            correctAnswers: exam.correctAnswers || exam.correct_answers || 0,
            score: score,
          };
        });
      })
      .addCase(fetchUserExams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch exams';
      })
      .addCase(fetchExam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExam.fulfilled, (state, action) => {
        state.isLoading = false;
        const exam = action.payload;
        // Transform snake_case to camelCase (with fallback for camelCase)
        state.currentExam = {
          id: exam.id,
          userId: exam.userId || exam.user_id,
          certificationId: exam.certificationId || exam.certification_id,
          startedAt: exam.startedAt || exam.started_at,
          completedAt: exam.completedAt || exam.completed_at,
          totalQuestions: exam.totalQuestions || exam.total_questions,
          correctAnswers: exam.correctAnswers || exam.correct_answers,
          score: exam.score,
        };
      })
      .addCase(fetchExam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch exam';
      });
  },
});

export const { clearExams, setCurrentExam } = examSlice.actions;
export default examSlice.reducer;

