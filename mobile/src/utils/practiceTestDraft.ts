import AsyncStorage from '@react-native-async-storage/async-storage';

export const PENDING_PRACTICE_KEY = 'pendingPracticeTest';
export const PRACTICE_DRAFT_TTL_MS = 30 * 60 * 1000; // 30 minutes

export type PendingPracticeDraft = {
  attemptId: string;
  selectedAnswers: { [key: string]: string };
  testQuestions: any[];
  currentQuestionIndex: number;
  awaitingAuthForResults: boolean;
  createdAt: number;
  expiresAt: number;
  cancelledAt?: number;
};

function createAttemptId(): string {
  return `practice-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function isDraftExpired(draft: PendingPracticeDraft, now = Date.now()): boolean {
  return !draft.expiresAt || draft.expiresAt <= now;
}

export function isDraftAwaitingAuth(draft: PendingPracticeDraft, now = Date.now()): boolean {
  return (
    Boolean(draft.awaitingAuthForResults) &&
    !draft.cancelledAt &&
    !isDraftExpired(draft, now) &&
    Object.keys(draft.selectedAnswers || {}).length > 0
  );
}

export async function savePracticeDraft(input: {
  selectedAnswers: { [key: string]: string };
  testQuestions: any[];
  currentQuestionIndex: number;
  attemptId?: string;
}): Promise<PendingPracticeDraft> {
  const now = Date.now();
  const draft: PendingPracticeDraft = {
    attemptId: input.attemptId || createAttemptId(),
    selectedAnswers: input.selectedAnswers,
    testQuestions: input.testQuestions,
    currentQuestionIndex: input.currentQuestionIndex,
    awaitingAuthForResults: true,
    createdAt: now,
    expiresAt: now + PRACTICE_DRAFT_TTL_MS,
  };
  await AsyncStorage.setItem(PENDING_PRACTICE_KEY, JSON.stringify(draft));
  return draft;
}

export async function loadPracticeDraft(): Promise<PendingPracticeDraft | null> {
  const raw = await AsyncStorage.getItem(PENDING_PRACTICE_KEY);
  if (!raw) return null;
  try {
    const draft = JSON.parse(raw) as PendingPracticeDraft;
    if (isDraftExpired(draft)) {
      await clearPracticeDraft();
      return null;
    }
    return draft;
  } catch {
    await clearPracticeDraft();
    return null;
  }
}

export async function clearPracticeDraft(): Promise<void> {
  await AsyncStorage.removeItem(PENDING_PRACTICE_KEY);
}

/** Mark draft cancelled when guest dismisses auth without signing in. */
export async function cancelPendingPracticeAuth(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(PENDING_PRACTICE_KEY);
    if (!raw) return;
    const draft = JSON.parse(raw) as PendingPracticeDraft;
    draft.awaitingAuthForResults = false;
    draft.cancelledAt = Date.now();
    await AsyncStorage.setItem(PENDING_PRACTICE_KEY, JSON.stringify(draft));
  } catch {
    // ignore
  }
}
