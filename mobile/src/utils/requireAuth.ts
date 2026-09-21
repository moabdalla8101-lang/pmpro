import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export type AuthPromptReason =
  | 'bookmarks'
  | 'progress'
  | 'exams'
  | 'missed_questions'
  | 'flashcards'
  | 'paywall'
  | 'submit_answer'
  | 'practice_results'
  | 'settings'
  | 'default';

const REASON_MESSAGES: Record<AuthPromptReason, string> = {
  bookmarks: 'Sign in to bookmark questions and sync them across devices.',
  progress: 'Sign in to track your progress and study streaks.',
  exams: 'Sign in to take mock exams and save your results.',
  missed_questions: 'Sign in to review questions you missed.',
  flashcards: 'Sign in to mark flashcards and sync your study progress.',
  paywall: 'Sign in to manage your subscription and purchases.',
  submit_answer: 'Sign in to save your answers and track progress.',
  practice_results: 'Sign in to see your score and save your practice test results.',
  settings: 'Sign in to sync goals and account preferences.',
  default: 'Sign in to unlock this feature and save your progress.',
};

export function getAuthPromptMessage(reason?: AuthPromptReason | string): string {
  if (reason && reason in REASON_MESSAGES) {
    return REASON_MESSAGES[reason as AuthPromptReason];
  }
  return REASON_MESSAGES.default;
}

/**
 * Returns true if the user is authenticated.
 * Otherwise opens the Auth modal and returns false.
 */
export function useRequireAuth() {
  const navigation = useNavigation<any>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return useCallback(
    (reason: AuthPromptReason = 'default'): boolean => {
      if (isAuthenticated) {
        return true;
      }

      navigation.navigate('Auth', {
        screen: 'Login',
        params: { reason, allowDismiss: true },
      });
      return false;
    },
    [isAuthenticated, navigation]
  );
}
