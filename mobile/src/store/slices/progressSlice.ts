import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressService } from '../../services/api/progressService';
import { logout } from './authSlice';

interface ProgressState {
  overallProgress: any;
  performanceByKnowledgeArea: any[];
  performanceByDomain: any[];
  isLoading: boolean;
  isLoadingDomain: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  overallProgress: null,
  performanceByKnowledgeArea: [],
  performanceByDomain: [],
  isLoading: false,
  isLoadingDomain: false,
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
  reducers: {
    clearProgress: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, () => initialState)
      .addCase(fetchProgress.pending, (state) => {
        // Only show blocking loaders on first fetch — tab switches should not blank the UI.
        if (!state.overallProgress) {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.overallProgress = action.payload.progress?.[0] || null;
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch progress';
      })
      .addCase(fetchPerformanceByKnowledgeArea.fulfilled, (state, action) => {
        state.performanceByKnowledgeArea = action.payload.performance || [];
      })
      .addCase(fetchPerformanceByDomain.pending, (state) => {
        // Keep overall isLoading independent so domain refresh doesn't
        // flash a second full-page spinner on tab focus.
        state.isLoadingDomain = true;
      })
      .addCase(fetchPerformanceByDomain.fulfilled, (state, action) => {
        state.performanceByDomain = action.payload.performance || [];
        state.isLoadingDomain = false;
      })
      .addCase(fetchPerformanceByDomain.rejected, (state, action) => {
        const errorMessage = action.error.message || '';
        const errorCode = (action.error as any)?.response?.status;
        state.isLoadingDomain = false;

        // Handle rate limiting gracefully - don't set error state for 429
        if (errorCode === 429 || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
          console.warn('Rate limited on fetchPerformanceByDomain, will retry later');
          return;
        }

        // Handle network errors gracefully - don't log as errors if it's just a network issue
        if (errorCode === 0 || errorMessage.includes('Network Error') || errorMessage.includes('timeout')) {
          console.warn('Network issue fetching performance by domain, will retry later');
          return;
        }

        // Only log actual errors (not network issues or rate limits)
        if (errorCode && errorCode >= 500) {
          console.error('Server error fetching performance by domain:', errorCode);
        } else if (errorCode && errorCode >= 400 && errorCode < 500) {
          console.warn('Client error fetching performance by domain:', errorCode);
        }
      });
  },
});

export const { clearProgress } = progressSlice.actions;
export default progressSlice.reducer;


