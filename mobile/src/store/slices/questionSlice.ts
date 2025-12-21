import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { questionService } from '../../services/api/questionService';

interface Question {
  id: string;
  questionText: string;
  explanation?: string;
  difficulty: string;
  answers: Answer[];
}

interface Answer {
  id: string;
  answerText: string;
  isCorrect: boolean;
  order: number;
}

interface QuestionState {
  questions: Question[];
  currentQuestion: Question | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  questions: [],
  currentQuestion: null,
  isLoading: false,
  error: null,
};

export const fetchQuestions = createAsyncThunk(
  'questions/fetch',
  async (filters: { certificationId?: string; knowledgeAreaId?: string; difficulty?: string }) => {
    return await questionService.getQuestions(filters);
  }
);

export const fetchQuestion = createAsyncThunk(
  'questions/fetchOne',
  async (id: string) => {
    return await questionService.getQuestion(id);
  }
);

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    clearQuestions: (state) => {
      state.questions = [];
      state.currentQuestion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload.questions;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch questions';
      })
      .addCase(fetchQuestion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuestion = action.payload;
      })
      .addCase(fetchQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch question';
      });
  },
});

export const { setCurrentQuestion, clearQuestions } = questionSlice.actions;
export default questionSlice.reducer;


