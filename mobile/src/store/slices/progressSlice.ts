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
        state.isLoading = false;
        state.overallProgress = action.payload.progress?.[0] || null;
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch progress';
      })
      .addCase(fetchPerformanceByKnowledgeArea.fulfilled, (state, action) => {
        state.performanceByKnowledgeArea = action.payload.performance || [];
      });
  },
});

export default progressSlice.reducer;


