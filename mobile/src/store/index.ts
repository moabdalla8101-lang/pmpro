import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import questionReducer from './slices/questionSlice';
import progressReducer from './slices/progressSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionReducer,
    progress: progressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


