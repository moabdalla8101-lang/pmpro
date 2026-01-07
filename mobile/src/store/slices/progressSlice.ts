import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressService } from '../../services/api/progressService';

interface ProgressState {
  overallProgress: any;
  performanceByKnowledgeArea: any[];
  performanceByDomain: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  overallProgress: null,
  performanceByKnowledgeArea: [],
  performanceByDomain: [],
  isLoading: false,
  error: null,
};

export const fetchProgress = createAsyncThunk(
  'progress/fetch',
  async (certificationId: string) => {
    return await progressService.getProgress(certificationId);
  }
);

export const fetchPerformanceByKnowledgeArea = createAsyncThunk(
  'progress/fetchByKnowledgeArea',
  async (certificationId: string) => {
    return await progressService.getPerformanceByKnowledgeArea(certificationId);
  }
);

export const fetchPerformanceByDomain = createAsyncThunk(
  'progress/fetchByDomain',
  async (certificationId: string) => {
    return await progressService.getPerformanceByDomain(certificationId);
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'progressSlice.ts:42',message:'Progress fetch fulfilled',data:{hasPayload:!!action.payload,hasProgress:!!action.payload?.progress,progressLength:action.payload?.progress?.length||0,firstProgress:action.payload?.progress?.[0]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'progress-refresh'})}).catch(()=>{});
        // #endregion
        state.isLoading = false;
        state.overallProgress = action.payload.progress?.[0] || null;
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'progressSlice.ts:45',message:'Progress state updated',data:{hasOverallProgress:!!state.overallProgress,accuracy:state.overallProgress?.accuracy,totalAnswered:state.overallProgress?.total_questions_answered},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'progress-refresh'})}).catch(()=>{});
        // #endregion
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'progressSlice.ts:46',message:'Progress fetch rejected',data:{error:action.error.message,errorCode:action.error.code},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'progress-refresh'})}).catch(()=>{});
        // #endregion
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch progress';
      })
      .addCase(fetchPerformanceByKnowledgeArea.fulfilled, (state, action) => {
        state.performanceByKnowledgeArea = action.payload.performance || [];
      })
      .addCase(fetchPerformanceByDomain.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPerformanceByDomain.fulfilled, (state, action) => {
        console.log('fetchPerformanceByDomain fulfilled:', action.payload);
        state.performanceByDomain = action.payload.performance || [];
        state.isLoading = false;
      })
      .addCase(fetchPerformanceByDomain.rejected, (state, action) => {
        const errorMessage = action.error.message || '';
        const errorCode = (action.error as any)?.response?.status;
        
        // Handle rate limiting gracefully - don't set error state for 429
        if (errorCode === 429 || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
          console.warn('Rate limited on fetchPerformanceByDomain, will retry later');
          state.isLoading = false;
          // Keep existing performanceByDomain data
          return;
        }
        
        // Handle network errors gracefully - don't log as errors if it's just a network issue
        if (errorCode === 0 || errorMessage.includes('Network Error') || errorMessage.includes('timeout')) {
          console.warn('Network issue fetching performance by domain, will retry later');
          state.isLoading = false;
          // Keep existing performanceByDomain data
          return;
        }
        
        // Only log actual errors (not network issues or rate limits)
        if (errorCode && errorCode >= 500) {
          console.error('Server error fetching performance by domain:', errorCode);
        } else if (errorCode && errorCode >= 400 && errorCode < 500) {
          console.warn('Client error fetching performance by domain:', errorCode);
        }
        
        state.isLoading = false;
        // Don't set error state for non-critical failures - keep existing data
        // state.error = errorMessage || 'Failed to fetch performance by domain';
      });
  },
});

export default progressSlice.reducer;


