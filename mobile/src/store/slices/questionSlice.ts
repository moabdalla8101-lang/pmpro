import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { questionService } from '../../services/api/questionService';

interface Question {
  id: string;
  questionText: string;
  question_text?: string; // Fallback for snake_case
  explanation?: string;
  difficulty: string;
  answers: Answer[];
  knowledgeAreaName?: string; // Added for consistency
  knowledge_area_name?: string; // Fallback for snake_case
}

interface Answer {
  id: string;
  answerText: string;
  answer_text?: string; // Fallback for snake_case
  isCorrect: boolean;
  is_correct?: boolean; // Fallback for snake_case
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
  async (filters: { certificationId?: string; knowledgeAreaId?: string; difficulty?: string; limit?: string | number; offset?: string | number }) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'questionSlice.ts:33',message:'fetchQuestions thunk called',data:{filters},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1,H3'})}).catch(()=>{});
    // #endregion
    try {
      const result = await questionService.getQuestions(filters);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'questionSlice.ts:37',message:'fetchQuestions result received',data:{hasResult:!!result,hasQuestions:!!result?.questions,questionsCount:result?.questions?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1,H3'})}).catch(()=>{});
      // #endregion
      return result;
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'questionSlice.ts:42',message:'fetchQuestions error in thunk',data:{error:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1,H2'})}).catch(()=>{});
      // #endregion
      throw error;
    }
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
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'questionSlice.ts:66',message:'Questions fetch fulfilled',data:{questionsCount:action.payload?.questions?.length||0,firstQuestionKeys:action.payload?.questions?.[0]?Object.keys(action.payload.questions[0]):[],hasPayload:!!action.payload},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1,H3,H4'})}).catch(()=>{});
        // #endregion
        state.isLoading = false;
        state.questions = action.payload.questions;
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'questionSlice.ts:68',message:'Questions state updated',data:{stateQuestionsCount:state.questions.length,firstQuestionId:state.questions[0]?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3,H5'})}).catch(()=>{});
        // #endregion
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'questionSlice.ts:75',message:'Questions fetch rejected',data:{error:action.error.message,errorCode:action.error.code},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1,H2'})}).catch(()=>{});
        // #endregion
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


