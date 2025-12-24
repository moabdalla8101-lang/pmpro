import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressService } from '../../services/api/progressService';

interface MissedQuestion {
  questionId: string;
  question: any;
  answeredAt: string;
  isReviewed: boolean;
  userAnswerId: string | null;
}

interface MissedQuestionsState {
  missedQuestions: MissedQuestion[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MissedQuestionsState = {
  missedQuestions: [],
  isLoading: false,
  error: null,
};

export const fetchMissedQuestions = createAsyncThunk(
  'missedQuestions/fetch',
  async ({ knowledgeAreaId, reviewed, certificationId }: { knowledgeAreaId?: string; reviewed?: boolean; certificationId?: string }) => {
    const response = await progressService.getMissedQuestions(knowledgeAreaId, reviewed, certificationId);
    return response;
  }
);

export const markAsReviewed = createAsyncThunk(
  'missedQuestions/markReviewed',
  async (questionId: string) => {
    await progressService.markAsReviewed(questionId);
    return questionId;
  }
);

const missedQuestionsSlice = createSlice({
  name: 'missedQuestions',
  initialState,
  reducers: {
    clearMissedQuestions: (state) => {
      state.missedQuestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissedQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMissedQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('Missed Questions Fetched:', {
          payload: action.payload,
          missedQuestions: action.payload?.missedQuestions,
          count: action.payload?.missedQuestions?.length || 0
        });
        state.missedQuestions = action.payload.missedQuestions || [];
      })
      .addCase(fetchMissedQuestions.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Missed Questions Fetch Error:', action.error);
        state.error = action.error.message || 'Failed to fetch missed questions';
      })
      .addCase(markAsReviewed.fulfilled, (state, action) => {
        state.missedQuestions = state.missedQuestions.filter(
          (mq) => mq.questionId !== action.payload
        );
      });
  },
});

export const { clearMissedQuestions } = missedQuestionsSlice.actions;
export default missedQuestionsSlice.reducer;

