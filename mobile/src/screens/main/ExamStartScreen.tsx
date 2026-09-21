import React, { useState, useEffect, useRef } from 'react';
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
  isExamAnswerComplete,
} from '../../components';
import {
  buildExamSubmitPayload,
  computeRemainingSeconds,
} from '../../utils/examSubmitHelpers';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

const MOCK_EXAM_QUESTIONS = 180;
const MOCK_EXAM_DURATION_MINUTES = 230;
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

  const [examId, setExamId] = useState<string | null>(null);
  const [examQuestions, setExamQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: ExamAnswerValue }>({});
  const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION_MINUTES * 60);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingTimeout, setIsSubmittingTimeout] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const timeoutSubmitRef = useRef(false);
  const draftSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedAnswersRef = useRef(selectedAnswers);
  selectedAnswersRef.current = selectedAnswers;

  const currentQuestion = examQuestions[currentQuestionIndex];
  const progress =
    examQuestions.length > 0 ? (currentQuestionIndex + 1) / examQuestions.length : 0;

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
        const drafts = exam.draftAnswers || exam.draft_answers || {};
        setExamId(exam.id || resumeExamId);
        setExamQuestions(questions);
        setSelectedAnswers(drafts);
        setTimeRemaining(remaining);
        setIsExamStarted(true);
        dailyActivityService.startSession();
      } catch (error: any) {
        if (!cancelled) {
          Alert.alert('Error', error.message || 'Failed to resume exam');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resumeExamId]);

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

  const persistDraftAnswers = (answers: { [key: string]: ExamAnswerValue }) => {
    if (!examId || timeExpired) return;
    if (draftSaveTimerRef.current) clearTimeout(draftSaveTimerRef.current);
    draftSaveTimerRef.current = setTimeout(() => {
      examService.saveExamProgress(examId, answers).catch(() => {
        // Best-effort; resume still has last successful save
      });
    }, 500);
  };

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
      const response = await examService.startExam(certificationId, TOTAL_QUESTIONS);
      setExamId(response.examId);
      setExamQuestions(response.questions || []);
      setIsExamStarted(true);
      dailyActivityService.startSession();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start exam');
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
    persistDraftAnswers(next);
  };

  const handleToggleBookmark = async () => {
    if (!currentQuestion) return;
    const questionId = currentQuestion.id;
    const isBookmarked = bookmarkedQuestionIds.includes(questionId);

    if (isBookmarked) {
      await dispatch(removeBookmark(questionId) as any);
    } else {
      await dispatch(addBookmark(questionId) as any);
    }
  };

  useEffect(() => {
    if (currentQuestion?.id) {
      dispatch(checkBookmark(currentQuestion.id) as any);
    }
  }, [currentQuestion?.id, dispatch]);

  const handleNext = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitAnswers = async (opts?: { forceIncomplete?: boolean }) => {
    if (!examId || isSubmittingTimeout) return;
    if (!opts?.forceIncomplete) {
      const incomplete = examQuestions.filter(
        (q) => !isExamAnswerComplete(q, selectedAnswersRef.current[q.id])
      );
      if (incomplete.length > 0) {
        Alert.alert(
          'Incomplete Exam',
          `Please answer all ${examQuestions.length} questions before submitting (${incomplete.length} remaining).`
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
      await examService.submitExam(examId, answers);
      await dailyActivityService.incrementQuestions(examQuestions.length);
      await dailyActivityService.endSession();
      (navigation as any).navigate('ExamReview', { examId });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit exam');
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
                Mock PMP Exam
              </Text>
              <Text variant="bodyLarge" style={styles.preExamSubtitle}>
                Full-length simulation
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
                Make sure you have enough time and a quiet environment before starting.
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
  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading questions...</Text>
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
            onPress={handleToggleBookmark}
            style={styles.bookmarkButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={currentQuestion && bookmarkedQuestionIds.includes(currentQuestion.id) ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={currentQuestion && bookmarkedQuestionIds.includes(currentQuestion.id) ? colors.primary : colors.textSecondary}
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
        <ActionButton
          label={currentQuestionIndex === examQuestions.length - 1 ? 'Submit Exam' : 'Next'}
          onPress={
            currentQuestionIndex === examQuestions.length - 1
              ? () => handleSubmitExam(false)
              : handleNext
          }
          icon={currentQuestionIndex === examQuestions.length - 1 ? 'check-circle' : 'arrow-right'}
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
