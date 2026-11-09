import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, ProgressBar, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { examService } from '../../services/api/examService';
import { RootState, AppDispatch } from '../../store';
import { addBookmark, removeBookmark, checkBookmark } from '../../store/slices/bookmarkSlice';
import { dailyActivityService } from '../../services/dailyActivityService';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import {
  ActionButton,
  ExamAnswerPanel,
  ExamAnswerValue,
  ExamQuestionReviewGrid,
  isExamAnswerComplete,
} from '../../components';
import {
  buildExamSubmitPayload,
  computeRemainingSeconds,
  EXAM_DRAFT_PROGRESS_KEY,
  resolveResumeQuestionIndex,
  splitExamDraft,
} from '../../utils/examSubmitHelpers';
import { getApiErrorMessage } from '../../utils/apiError';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

const MOCK_EXAM_QUESTIONS = 180;
const MOCK_EXAM_DURATION_MINUTES = 240;
const MINI_PMP_QUESTIONS = 25;
const MINI_PMP_DURATION_MINUTES = 15;

export default function ExamStartScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { bookmarkedQuestionIds } = useSelector((state: RootState) => state.bookmarks);

  const examType = (route.params as any)?.examType || 'mock';
  const resumeExamId = (route.params as any)?.examId as string | undefined;
  const TOTAL_QUESTIONS = examType === 'mini' ? MINI_PMP_QUESTIONS : MOCK_EXAM_QUESTIONS;
  const EXAM_DURATION_MINUTES = examType === 'mini' ? MINI_PMP_DURATION_MINUTES : MOCK_EXAM_DURATION_MINUTES;
  const examTypeLabel = examType === 'mini' ? 'Mini PMP' : 'Mock Exam';

  const [examId, setExamId] = useState<string | null>(null);
  const [examQuestions, setExamQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: ExamAnswerValue }>({});
  const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION_MINUTES * 60);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingTimeout, setIsSubmittingTimeout] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [showReviewGrid, setShowReviewGrid] = useState(false);
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<Set<string>>(new Set());
  const timeoutSubmitRef = useRef(false);
  const draftSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allowLeaveRef = useRef(false);
  const selectedAnswersRef = useRef(selectedAnswers);
  const currentQuestionIndexRef = useRef(currentQuestionIndex);
  const examIdRef = useRef(examId);
  const examQuestionsRef = useRef(examQuestions);
  selectedAnswersRef.current = selectedAnswers;
  currentQuestionIndexRef.current = currentQuestionIndex;
  examIdRef.current = examId;
  examQuestionsRef.current = examQuestions;

  const currentQuestion = examQuestions[currentQuestionIndex];
  const progress =
    examQuestions.length > 0 ? (currentQuestionIndex + 1) / examQuestions.length : 0;

  const buildDraftPayload = useCallback(
    (
      answers: { [key: string]: ExamAnswerValue },
      questionIndex: number
    ): { [key: string]: ExamAnswerValue | Record<string, unknown> } => ({
      ...answers,
      [EXAM_DRAFT_PROGRESS_KEY]: { currentQuestionIndex: questionIndex },
    }),
    []
  );

  const persistDraftAnswers = useCallback(
    (
      answers: { [key: string]: ExamAnswerValue },
      questionIndex: number,
      opts?: { immediate?: boolean }
    ) => {
      const activeExamId = examIdRef.current;
      if (!activeExamId || timeExpired) return;
      if (draftSaveTimerRef.current) clearTimeout(draftSaveTimerRef.current);

      const save = () =>
        examService
          .saveExamProgress(activeExamId, buildDraftPayload(answers, questionIndex))
          .catch(() => {
            // Best-effort; resume still has last successful save
          });

      if (opts?.immediate) {
        return save();
      }
      // Longer debounce — full mocks autosave often and used to trip API rate limits.
      draftSaveTimerRef.current = setTimeout(save, 2000);
    },
    [buildDraftPayload, timeExpired]
  );

  const flushProgress = useCallback(async () => {
    if (draftSaveTimerRef.current) {
      clearTimeout(draftSaveTimerRef.current);
      draftSaveTimerRef.current = null;
    }
    const activeExamId = examIdRef.current;
    if (!activeExamId || timeExpired) return;
    try {
      await examService.saveExamProgress(
        activeExamId,
        buildDraftPayload(selectedAnswersRef.current, currentQuestionIndexRef.current)
      );
    } catch {
      // Best-effort
    }
  }, [buildDraftPayload, timeExpired]);

  useEffect(() => {
    if (resumeExamId) return;
    setTimeRemaining(EXAM_DURATION_MINUTES * 60);
  }, [examType, EXAM_DURATION_MINUTES, resumeExamId]);

  useEffect(() => {
    if (!resumeExamId) return;
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const exam = await examService.getExam(resumeExamId);
        if (cancelled) return;
        if (exam.completedAt || exam.completed_at) {
          allowLeaveRef.current = true;
          (navigation as any).replace('ExamReview', { examId: resumeExamId });
          return;
        }
        const questions = exam.questions || [];
        if (questions.length === 0) {
          Alert.alert('Error', 'This exam has no assigned questions and cannot be resumed.');
          return;
        }
        const startedAt = new Date(exam.startedAt || exam.started_at).getTime();
        const remaining = computeRemainingSeconds(startedAt, EXAM_DURATION_MINUTES);
        if (remaining <= 0) {
          // Time already expired while away — auto-submit on resume path below via timer effect
        }
        const { answers, currentQuestionIndex: savedIndex } = splitExamDraft(
          exam.draftAnswers || exam.draft_answers || {}
        );
        const firstIncomplete = questions.findIndex(
          (q: any) => !isExamAnswerComplete(q, answers[q.id])
        );
        const resumeIndex = resolveResumeQuestionIndex(
          questions.length,
          savedIndex,
          firstIncomplete
        );
        setExamId(exam.id || resumeExamId);
        setExamQuestions(questions);
        setSelectedAnswers(answers);
        setCurrentQuestionIndex(resumeIndex);
        setTimeRemaining(remaining);
        setIsExamStarted(true);
        dailyActivityService.startSession();
      } catch (error: any) {
        if (!cancelled) {
          Alert.alert('Error', getApiErrorMessage(error, 'Failed to resume exam'));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resumeExamId, EXAM_DURATION_MINUTES, navigation]);

  useEffect(() => {
    if (!isExamStarted || timeExpired || isSubmittingTimeout) return;
    if (timeRemaining <= 0) {
      if (timeoutSubmitRef.current) return;
      timeoutSubmitRef.current = true;
      setTimeExpired(true);
      handleSubmitExam(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted, timeRemaining, timeExpired, isSubmittingTimeout]);

  useEffect(() => {
    return () => {
      if (draftSaveTimerRef.current) clearTimeout(draftSaveTimerRef.current);
    };
  }, []);

  // Confirm leaving an in-progress timed exam; progress + cursor are saved for resume.
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (
        allowLeaveRef.current ||
        !isExamStarted ||
        timeExpired ||
        isSubmittingTimeout ||
        !examIdRef.current
      ) {
        return;
      }

      e.preventDefault();

      flushProgress().finally(() => {
        Alert.alert(
          'Leave exam?',
          `Your ${examTypeLabel} progress is saved. You can return anytime from In Progress and continue from this question with the time remaining.`,
          [
            { text: 'Stay', style: 'cancel' },
            {
              text: 'Leave',
              style: 'destructive',
              onPress: () => {
                allowLeaveRef.current = true;
                navigation.dispatch(e.data.action);
              },
            },
          ]
        );
      });
    });

    return unsubscribe;
  }, [
    navigation,
    isExamStarted,
    timeExpired,
    isSubmittingTimeout,
    flushProgress,
    examTypeLabel,
  ]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = async () => {
    setIsLoading(true);
    try {
      const certificationId = '550e8400-e29b-41d4-a716-446655440000';
      const apiExamType = examType === 'mini' ? 'mini' : 'mock_exam';
      const response = await examService.startExam(
        certificationId,
        TOTAL_QUESTIONS,
        undefined,
        apiExamType
      );
      setExamId(response.examId);
      setExamQuestions(response.questions || []);
      setIsExamStarted(true);
      dailyActivityService.startSession();
    } catch (error: any) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to start exam'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (value: ExamAnswerValue) => {
    if (!currentQuestion || timeExpired || isSubmittingTimeout) return;
    const next = {
      ...selectedAnswers,
      [currentQuestion.id]: value,
    };
    setSelectedAnswers(next);
    persistDraftAnswers(next, currentQuestionIndex);
  };

  const isQuestionMarked = useCallback(
    (questionId: string) =>
      flaggedQuestionIds.has(questionId) || bookmarkedQuestionIds.includes(questionId),
    [flaggedQuestionIds, bookmarkedQuestionIds]
  );

  const handleToggleBookmark = async () => {
    if (!currentQuestion) return;
    const questionId = currentQuestion.id;
    const currentlyMarked = isQuestionMarked(questionId);

    setFlaggedQuestionIds((prev) => {
      const next = new Set(prev);
      if (currentlyMarked) next.delete(questionId);
      else next.add(questionId);
      return next;
    });

    // Best-effort sync to account bookmarks (premium); local flag always works in-exam.
    try {
      if (currentlyMarked) {
        await dispatch(removeBookmark(questionId) as any);
      } else {
        await dispatch(addBookmark(questionId) as any);
      }
    } catch {
      // Local mark still applies for the review grid
    }
  };

  useEffect(() => {
    if (currentQuestion?.id) {
      dispatch(checkBookmark(currentQuestion.id) as any);
    }
  }, [currentQuestion?.id, dispatch]);

  const handleNext = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      persistDraftAnswers(selectedAnswersRef.current, nextIndex);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const nextIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(nextIndex);
      persistDraftAnswers(selectedAnswersRef.current, nextIndex);
    }
  };

  const getIncompleteQuestions = () =>
    examQuestions.filter((q) => !isExamAnswerComplete(q, selectedAnswersRef.current[q.id]));

  const openReviewGrid = () => {
    persistDraftAnswers(selectedAnswersRef.current, currentQuestionIndexRef.current);
    setShowReviewGrid(true);
  };

  const jumpToQuestionFromReview = (index: number) => {
    setCurrentQuestionIndex(index);
    persistDraftAnswers(selectedAnswersRef.current, index);
    setShowReviewGrid(false);
  };

  const submitAnswers = async (opts?: { forceIncomplete?: boolean }) => {
    if (!examId || isSubmittingTimeout) return;
    if (!opts?.forceIncomplete) {
      const incomplete = getIncompleteQuestions();
      if (incomplete.length > 0) {
        setShowReviewGrid(true);
        Alert.alert(
          'Incomplete exam',
          `${incomplete.length} question${incomplete.length === 1 ? '' : 's'} still unanswered. Use the review grid to find and complete ${incomplete.length === 1 ? 'it' : 'them'} before submitting.`
        );
        return;
      }
    }

    const { answers } = buildExamSubmitPayload(
      examQuestions.map((q) => q.id),
      selectedAnswersRef.current,
      { forceIncomplete: true }
    );

    try {
      setIsSubmittingTimeout(Boolean(opts?.forceIncomplete));
      allowLeaveRef.current = true;
      await examService.submitExam(examId, answers);
      await dailyActivityService.incrementQuestions(examQuestions.length);
      await dailyActivityService.endSession();
      (navigation as any).navigate('ExamReview', { examId });
    } catch (error: any) {
      allowLeaveRef.current = false;
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to submit exam'));
      setIsSubmittingTimeout(false);
      if (opts?.forceIncomplete) {
        timeoutSubmitRef.current = false;
      }
    }
  };

  const handleSubmitExam = (auto = false) => {
    if (!examId) return;
    if (auto) {
      submitAnswers({ forceIncomplete: true });
      return;
    }

    const incomplete = getIncompleteQuestions();
    if (incomplete.length > 0) {
      setShowReviewGrid(true);
      Alert.alert(
        'Incomplete exam',
        `${incomplete.length} unanswered. Tap the gray numbers in the grid to finish them, then submit.`
      );
      return;
    }

    Alert.alert(
      'Submit Exam',
      'Are you sure you want to submit? You cannot change answers after submission.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', style: 'destructive', onPress: () => submitAnswers() },
      ]
    );
  };

  // Pre-exam screen
  if (!isExamStarted) {
    if (isLoading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            {resumeExamId ? 'Resuming exam...' : 'Starting exam...'}
          </Text>
        </SafeAreaView>
      );
    }

    if (resumeExamId) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Unable to resume this exam.</Text>
          <ActionButton
            label="Back"
            onPress={() => navigation.goBack()}
            variant="outlined"
            size="medium"
          />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.preExamContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.preExamCard}>
            <View style={styles.preExamHeader}>
              <View style={styles.preExamIconContainer}>
                <Icon name="file-document-edit" size={64} color={colors.primary} />
              </View>
              <Text variant="headlineMedium" style={styles.preExamTitle}>
                {examType === 'mini' ? 'Mini PMP Exam' : 'Mock PMP Exam'}
              </Text>
              <Text variant="bodyLarge" style={styles.preExamSubtitle}>
                {examType === 'mini' ? 'Quick timed practice' : 'Full-length simulation'}
              </Text>
            </View>

            <View style={styles.preExamDetails}>
              <View style={styles.preExamDetailItem}>
                <Icon name="help-circle" size={24} color={colors.textSecondary} />
                <Text variant="bodyLarge" style={styles.preExamDetailText}>
                  {TOTAL_QUESTIONS} questions
                </Text>
              </View>
              <View style={styles.preExamDetailItem}>
                <Icon name="clock-outline" size={24} color={colors.textSecondary} />
                <Text variant="bodyLarge" style={styles.preExamDetailText}>
                  {EXAM_DURATION_MINUTES} minutes
                </Text>
              </View>
            </View>

            <View style={styles.preExamWarning}>
              <Icon name="alert-circle" size={24} color={colors.warning} />
              <Text variant="bodyMedium" style={styles.preExamWarningText}>
                Make sure you have enough time and a quiet environment before starting. You can leave
                and resume later with your remaining time.
              </Text>
            </View>

            <ActionButton
              label={isLoading ? 'Starting...' : 'Start Exam'}
              onPress={handleStartExam}
              icon="rocket-launch"
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Loading state
  if (!currentQuestion && !showReviewGrid) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </SafeAreaView>
    );
  }

  const incompleteCount = examQuestions.filter(
    (q) => !isExamAnswerComplete(q, selectedAnswers[q.id])
  ).length;
  const isCurrentMarked = currentQuestion ? isQuestionMarked(currentQuestion.id) : false;

  // Review grid before submit (mock + mini)
  if (showReviewGrid) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.timerContainer}>
              <Icon name="clock-outline" size={20} color={colors.error} />
              <Text variant="titleMedium" style={styles.timerText}>
                {formatTime(timeRemaining)}
              </Text>
            </View>
            <View style={styles.questionCounter}>
              <Text variant="bodyMedium" style={styles.questionCounterText}>
                {incompleteCount === 0
                  ? 'Ready to submit'
                  : `${incompleteCount} unanswered`}
              </Text>
            </View>
          </View>
        </View>

        <ExamQuestionReviewGrid
          totalQuestions={examQuestions.length}
          isAnsweredAt={(index) =>
            isExamAnswerComplete(examQuestions[index], selectedAnswers[examQuestions[index]?.id])
          }
          isMarkedAt={(index) => {
            const q = examQuestions[index];
            return q ? isQuestionMarked(q.id) : false;
          }}
          currentIndex={currentQuestionIndex}
          onSelectQuestion={jumpToQuestionFromReview}
        />

        <View style={styles.footer}>
          {isSubmittingTimeout ? (
            <Text variant="bodyLarge" style={{ textAlign: 'center', width: '100%' }}>
              Time is up — submitting your exam...
            </Text>
          ) : (
            <>
              <ActionButton
                label="Back to question"
                onPress={() => setShowReviewGrid(false)}
                icon="arrow-left"
                variant="outlined"
                size="medium"
                disabled={timeExpired}
              />
              <ActionButton
                label={incompleteCount > 0 ? `Submit (${incompleteCount} left)` : 'Submit Exam'}
                onPress={() => handleSubmitExam(false)}
                icon="check-circle"
                variant="primary"
                size="medium"
                disabled={timeExpired}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Exam in progress
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with timer and progress */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.timerContainer}>
            <Icon name="clock-outline" size={20} color={colors.error} />
            <Text variant="titleMedium" style={styles.timerText}>
              {formatTime(timeRemaining)}
            </Text>
          </View>
          <View style={styles.questionCounter}>
            <Text variant="bodyMedium" style={styles.questionCounterText}>
              Question {currentQuestionIndex + 1} of {examQuestions.length}
            </Text>
          </View>
          <TouchableOpacity
            onPress={openReviewGrid}
            style={styles.bookmarkButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Open question review grid"
          >
            <Icon name="view-grid-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleBookmark}
            style={styles.bookmarkButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={isCurrentMarked ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isCurrentMarked ? colors.warning : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        <ProgressBar
          progress={progress}
          color={colors.primary}
          style={styles.progressBar}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text variant="headlineSmall" style={styles.questionText}>
            {currentQuestion.questionText || currentQuestion.question_text}
          </Text>
        </View>

        {/* Answer Options */}
        <View style={styles.answersContainer}>
          <Text variant="titleMedium" style={styles.answersTitle}>
            Select your answer:
          </Text>
          <ExamAnswerPanel
            question={currentQuestion}
            value={selectedAnswers[currentQuestion.id]}
            onChange={handleAnswerChange}
            disabled={timeExpired || isSubmittingTimeout}
          />
        </View>
      </ScrollView>

      {/* Footer with navigation */}
      <View style={styles.footer}>
        {isSubmittingTimeout ? (
          <Text variant="bodyLarge" style={{ textAlign: 'center', width: '100%' }}>
            Time is up — submitting your exam...
          </Text>
        ) : (
          <>
            <ActionButton
              label="Previous"
              onPress={handlePrevious}
              icon="arrow-left"
              variant="outlined"
              size="medium"
              disabled={currentQuestionIndex === 0 || timeExpired}
            />
            {currentQuestionIndex === examQuestions.length - 1 ? (
              <ActionButton
                label="Review & Submit"
                onPress={openReviewGrid}
                icon="view-grid"
                variant="primary"
                size="medium"
                disabled={timeExpired}
              />
            ) : (
              <ActionButton
                label="Next"
                onPress={handleNext}
                icon="arrow-right"
                variant="primary"
                size="medium"
                disabled={timeExpired}
              />
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray50,
  },
  loadingText: {
    marginTop: spacing.base,
    color: colors.textSecondary,
  },
  preExamContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.base,
  },
  preExamCard: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.md,
  },
  preExamHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  preExamIconContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.lg,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  preExamTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  preExamSubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  preExamDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
  },
  preExamDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  preExamDetailText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  preExamWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${colors.warning}10`,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  preExamWarningText: {
    flex: 1,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    ...shadows.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bookmarkButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timerText: {
    fontWeight: '700',
    color: colors.error,
  },
  questionCounter: {
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  questionCounterText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: borderRadius.sm,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  questionCard: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  questionText: {
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  answersContainer: {
    marginBottom: spacing.lg,
  },
  answersTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  answerOption: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  answerOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}05`,
  },
  answerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },
  answerIndicator: {
    marginRight: spacing.base,
  },
  answerLetter: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.round,
    backgroundColor: colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerLetterText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  answerTextContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  answerText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  answerIcon: {
    marginLeft: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.base,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    gap: spacing.base,
    ...shadows.md,
  },
});
