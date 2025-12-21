import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressService } from '../../services/api/progressService';

interface ProgressState {
  overallProgress: any;
  performanceByKnowledgeArea: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  overallProgress: null,
  performanceByKnowledgeArea: [],
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
      });
  },
});

export default progressSlice.reducer;


