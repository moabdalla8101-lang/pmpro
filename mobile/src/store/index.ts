import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import questionReducer from './slices/questionSlice';
import progressReducer from './slices/progressSlice';
import examReducer from './slices/examSlice';
import bookmarkReducer from './slices/bookmarkSlice';
import missedQuestionsReducer from './slices/missedQuestionsSlice';
import flashcardReducer from './slices/flashcardSlice';
import settingsReducer from './slices/settingsSlice';
import subscriptionReducer from './slices/subscriptionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionReducer,
    progress: progressReducer,
    exams: examReducer,
    bookmarks: bookmarkReducer,
    missedQuestions: missedQuestionsReducer,
    flashcards: flashcardReducer,
    settings: settingsReducer,
    subscription: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


