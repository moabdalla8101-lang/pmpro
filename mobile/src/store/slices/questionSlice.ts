import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { questionService } from '../../services/api/questionService';
import { LearnerQuestion, LearnerAnswer } from '../../types/question';

interface QuestionState {
  questions: LearnerQuestion[];
  currentQuestion: LearnerQuestion | null;
  total: number;
  offset: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  questions: [],
  currentQuestion: null,
  total: 0,
  offset: 0,
  hasMore: false,
  isLoading: false,
  isLoadingMore: false,
  error: null,
};

function mapLearnerAnswer(ans: any): LearnerAnswer {
  return {
    id: ans.id,
    questionId: ans.questionId,
    answerText: ans.answerText || ans.answer_text,
    answer_text: ans.answer_text || ans.answerText,
    order: ans.order ?? 0,
  };
}

function mapLearnerQuestion(question: any): LearnerQuestion {
  let parsedMetadata = question.questionMetadata || question.question_metadata;
  if (typeof parsedMetadata === 'string') {
    try {
      parsedMetadata = JSON.parse(parsedMetadata);
    } catch {
      parsedMetadata = null;
    }
  }

  return {
    id: question.id,
    questionId: question.questionId || question.question_id,
    questionText: question.questionText || question.question_text,
    question_text: question.question_text || question.questionText,
    difficulty: question.difficulty,
    questionType: question.questionType || question.question_type,
    question_type: question.question_type || question.questionType,
    domain: question.domain,
    task: question.task,
    pmApproach: question.pmApproach || question.pm_approach,
    pm_approach: question.pm_approach || question.pmApproach,
    questionMetadata: parsedMetadata,
    question_metadata: parsedMetadata,
    questionImages: question.questionImages || question.question_images,
    question_images: question.question_images || question.questionImages,
    knowledgeAreaName: question.knowledgeAreaName || question.knowledge_area_name,
    knowledge_area_name: question.knowledge_area_name || question.knowledgeAreaName,
    knowledgeAreaId: question.knowledgeAreaId || question.knowledge_area_id,
    certificationId: question.certificationId || question.certification_id,
    answers: (question.answers || []).map(mapLearnerAnswer),
  };
}

export type FetchQuestionsArgs = {
  certificationId?: string;
  knowledgeAreaId?: string;
  difficulty?: string;
  domain?: string;
  limit?: string | number;
  offset?: string | number;
  random?: string | boolean;
  distributeByKnowledgeArea?: string | boolean;
  append?: boolean;
};

export const fetchQuestions = createAsyncThunk(
  'questions/fetch',
  async (filters: FetchQuestionsArgs) => {
    const data = await questionService.getQuestions(filters);
    return {
      questions: data?.questions || [],
      total: typeof data?.total === 'number' ? data.total : (data?.questions || []).length,
      append: Boolean(filters.append),
      offset: Number(filters.offset || 0),
      limit: Number(filters.limit || 25),
    };
  }
);

export const fetchQuestion = createAsyncThunk('questions/fetchOne', async (id: string) => {
  return questionService.getQuestion(id);
});

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload ? mapLearnerQuestion(action.payload) : null;
    },
    clearQuestions: (state) => {
      state.questions = [];
      state.currentQuestion = null;
      state.total = 0;
      state.offset = 0;
      state.hasMore = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state, action) => {
        const appending = Boolean(action.meta.arg?.append);
        state.isLoading = !appending;
        state.isLoadingMore = appending;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        const mapped = (action.payload.questions || []).map(mapLearnerQuestion);
        if (action.payload.append) {
          const seen = new Set(state.questions.map((q) => q.id));
          const merged = [...state.questions];
          for (const q of mapped) {
            if (!seen.has(q.id)) {
              seen.add(q.id);
              merged.push(q);
            }
          }
          state.questions = merged;
        } else {
          state.questions = mapped;
        }
        state.total = action.payload.total;
        state.offset = action.payload.offset + mapped.length;
        state.hasMore = state.questions.length < state.total;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = action.error.message || 'Failed to fetch questions';
      })
      .addCase(fetchQuestion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentQuestion = null;
      })
      .addCase(fetchQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuestion = mapLearnerQuestion(action.payload);
      })
      .addCase(fetchQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch question';
      });
  },
});

export const { setCurrentQuestion, clearQuestions } = questionSlice.actions;
export default questionSlice.reducer;
