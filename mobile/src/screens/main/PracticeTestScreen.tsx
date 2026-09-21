import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, ProgressBar, ActivityIndicator } from 'react-native-paper';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { examService } from '../../services/api/examService';
import { RootState, AppDispatch } from '../../store';
import { fetchQuestions } from '../../store/slices/questionSlice';
import { questionService } from '../../services/api/questionService';
import { dailyActivityService } from '../../services/dailyActivityService';
import client from '../../services/api/client';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { ActionButton } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';
import { useRequireAuth } from '../../utils/requireAuth';
import {
  clearPracticeDraft,
  isDraftAwaitingAuth,
  loadPracticeDraft,
  savePracticeDraft,
} from '../../utils/practiceTestDraft';

const TOTAL_QUESTIONS = 10;
const PMP_CERTIFICATION_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function PracticeTestScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const requireAuth = useRequireAuth();
  const { questions } = useSelector((state: RootState) => state.questions);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [examId, setExamId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testQuestions, setTestQuestions] = useState<any[]>([]);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const restoringRef = useRef(false);
  const selectedAnswersRef = useRef(selectedAnswers);
  const testQuestionsRef = useRef(testQuestions);

  selectedAnswersRef.current = selectedAnswers;
  testQuestionsRef.current = testQuestions;

  // Use testQuestions if available, otherwise fall back to Redux questions
  const displayQuestions = testQuestions.length > 0 ? testQuestions : questions;
  const currentQuestion = displayQuestions[currentQuestionIndex];
  const progress = displayQuestions.length > 0 ? (currentQuestionIndex + 1) / displayQuestions.length : 0;

  const clearPendingDraft = useCallback(async () => {
    await clearPracticeDraft();
  }, []);

  const savePendingDraft = useCallback(async () => {
    await savePracticeDraft({
      selectedAnswers: selectedAnswersRef.current,
      testQuestions: testQuestionsRef.current,
      currentQuestionIndex,
    });
  }, [currentQuestionIndex]);

  const loadPracticeQuestions = async () => {
    const questionsData = await questionService.getQuestions({
      certificationId: PMP_CERTIFICATION_ID,
      limit: TOTAL_QUESTIONS.toString(),
      random: 'true',
      distributeByKnowledgeArea: 'true',
    });

    if (questionsData.questions && questionsData.questions.length > 0) {
      setTestQuestions(questionsData.questions);
      return;
    }

    await dispatch(fetchQuestions({
      certificationId: PMP_CERTIFICATION_ID,
      limit: TOTAL_QUESTIONS.toString(),
    }) as any);
  };

  const handleStartTest = async () => {
    setIsLoading(true);
    try {
      await clearPendingDraft();
      // Guests can start immediately using the public question catalog.
      // Authenticated users also create a server exam so results can sync.
      if (isAuthenticated) {
        const response = await examService.startExam(PMP_CERTIFICATION_ID, TOTAL_QUESTIONS);
        setExamId(response.examId);
      } else {
        setExamId(null);
      }

      await loadPracticeQuestions();
      setIsTestStarted(true);
      dailyActivityService.startSession();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start practice test');
    } finally {
      setIsLoading(false);
    }
  };

  const finalizeAndShowResults = useCallback(async (answersOverride?: { [key: string]: string }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const answerMap = answersOverride || selectedAnswersRef.current;
      const answers = Object.entries(answerMap).map(([questionId, answerId]) => ({
        questionId,
        answerId,
      }));

      if (answers.length === 0) {
        throw new Error('No answers to submit. Please retake the practice test.');
      }

      let activeExamId = examId;
      if (!activeExamId) {
        const response = await examService.startExam(PMP_CERTIFICATION_ID, answers.length || TOTAL_QUESTIONS);
        activeExamId = response.examId;
        setExamId(activeExamId);
      }

      if (!activeExamId) {
        throw new Error('Failed to create exam session');
      }

      await examService.submitExam(activeExamId, answers);

      await dailyActivityService.incrementQuestions(answers.length);
      await dailyActivityService.endSession();
      await clearPendingDraft();

      try {
        await client.post('/api/badges/streak');
      } catch (error: any) {
        console.error('Failed to update streak:', error?.response?.data || error?.message);
      }

      (navigation as any).dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'PracticeDashboard' }],
        })
      );

      (navigation as any).navigate('Exam', {
        screen: 'ExamReview',
        params: { examId: activeExamId },
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit test');
    } finally {
      setIsSubmitting(false);
      setPendingSubmit(false);
    }
  }, [clearPendingDraft, examId, isSubmitting, navigation]);

  // After intentional "Sign In & View Results": restore draft and submit
  useEffect(() => {
    if (!isAuthenticated || !pendingSubmit) return;
    if (restoringRef.current) return;
    restoringRef.current = true;

    (async () => {
      try {
        const draft = await loadPracticeDraft();
        if (draft && isDraftAwaitingAuth(draft)) {
          setSelectedAnswers(draft.selectedAnswers || {});
          setTestQuestions(draft.testQuestions || []);
          setCurrentQuestionIndex(draft.currentQuestionIndex || 0);
          setIsTestStarted(true);
          setPendingSubmit(false);
          await finalizeAndShowResults(draft.selectedAnswers);
          return;
        }

        if (Object.keys(selectedAnswersRef.current).length > 0) {
          setPendingSubmit(false);
          await finalizeAndShowResults();
        } else {
          setPendingSubmit(false);
        }
      } catch (error) {
        console.error('Failed to finish pending practice test:', error);
        setPendingSubmit(false);
      } finally {
        restoringRef.current = false;
      }
    })();
  }, [isAuthenticated, pendingSubmit, finalizeAndShowResults]);

  // Unrelated later login / remount: never auto-submit — offer resume instead
  useEffect(() => {
    if (!isAuthenticated || pendingSubmit) return;
    if (restoringRef.current || isSubmitting || isTestStarted) return;

    (async () => {
      try {
        const draft = await loadPracticeDraft();
        if (!draft || !isDraftAwaitingAuth(draft)) return;

        restoringRef.current = true;
        Alert.alert(
          'Resume practice test?',
          'You have a saved practice test waiting for results. Submit it now?',
          [
            {
              text: 'Discard',
              style: 'destructive',
              onPress: async () => {
                await clearPendingDraft();
                restoringRef.current = false;
              },
            },
            {
              text: 'Submit results',
              onPress: async () => {
                setSelectedAnswers(draft.selectedAnswers || {});
                setTestQuestions(draft.testQuestions || []);
                setCurrentQuestionIndex(draft.currentQuestionIndex || 0);
                setIsTestStarted(true);
                try {
                  await finalizeAndShowResults(draft.selectedAnswers);
                } finally {
                  restoringRef.current = false;
                }
              },
            },
          ],
          { cancelable: true, onDismiss: () => { restoringRef.current = false; } }
        );
      } catch (error) {
        console.error('Failed to offer practice draft resume:', error);
        restoringRef.current = false;
      }
    })();
  }, [
    isAuthenticated,
    pendingSubmit,
    finalizeAndShowResults,
    isSubmitting,
    isTestStarted,
    clearPendingDraft,
  ]);

  const handleSubmitTest = () => {
    Alert.alert(
      'Submit Test',
      isAuthenticated
        ? 'Are you sure you want to submit? You cannot change answers after submission.'
        : 'Sign in to see your score and save results. Your answers will be kept.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isAuthenticated ? 'Submit' : 'Sign In & View Results',
          style: isAuthenticated ? 'destructive' : 'default',
          onPress: async () => {
            if (!isAuthenticated) {
              try {
                await savePendingDraft();
              } catch (error) {
                console.error('Failed to save practice draft:', error);
              }
              setPendingSubmit(true);
              requireAuth('practice_results');
              return;
            }
            finalizeAndShowResults();
          },
        },
      ]
    );
  };

  const handleAnswerSelect = (answerId: string) => {
    if (currentQuestion) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion.id]: answerId,
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < displayQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getAnswerStyle = (answerId: string) => {
    const isSelected = selectedAnswers[currentQuestion?.id || ''] === answerId;
    return isSelected
      ? [styles.answerOption, styles.answerOptionSelected]
      : styles.answerOption;
  };

  const getAnswerIcon = (answerId: string) => {
    const isSelected = selectedAnswers[currentQuestion?.id || ''] === answerId;
    return isSelected ? 'radiobox-marked' : 'radiobox-blank';
  };

  // Pre-test screen
  if (!isTestStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.preTestContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.preTestCard}>
            <View style={styles.preTestHeader}>
              <View style={styles.preTestIconContainer}>
                <Icon name="rocket-launch" size={64} color={colors.primary} />
              </View>
              <Text variant="headlineMedium" style={styles.preTestTitle}>
                Practice Test
              </Text>
              <Text variant="bodyLarge" style={styles.preTestSubtitle}>
                Test your knowledge with 10 random questions
              </Text>
              {!isAuthenticated && (
                <Text variant="bodySmall" style={styles.guestHint}>
                  Browse and answer as a guest. Sign in at the end to see your results.
                </Text>
              )}
            </View>

            <View style={styles.preTestDetails}>
              <View style={styles.preTestDetailItem}>
                <Icon name="help-circle" size={24} color={colors.primary} />
                <Text variant="bodyMedium" style={styles.preTestDetailText}>
                  {TOTAL_QUESTIONS} Questions
                </Text>
              </View>
              <View style={styles.preTestDetailItem}>
                <Icon name="fire" size={24} color={colors.warning} />
                <Text variant="bodyMedium" style={styles.preTestDetailText}>
                  Earn Streak Badge
                </Text>
              </View>
              <View style={styles.preTestDetailItem}>
                <Icon name="repeat" size={24} color={colors.info} />
                <Text variant="bodyMedium" style={styles.preTestDetailText}>
                  Unlimited Attempts
                </Text>
              </View>
            </View>

            <ActionButton
              label="Start Practice Test"
              onPress={handleStartTest}
              loading={isLoading}
              variant="primary"
              size="large"
              fullWidth
              icon="rocket-launch"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!currentQuestion || isSubmitting) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>
          {isSubmitting ? 'Saving results...' : 'Loading question...'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="titleMedium" style={styles.questionCountText}>
            Question {currentQuestionIndex + 1} / {displayQuestions.length}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text variant="bodySmall" style={styles.progressText}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </View>
      <ProgressBar progress={progress} color={colors.primary} style={styles.progressBar} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text variant="headlineSmall" style={styles.questionText}>
            {currentQuestion.questionText || currentQuestion.question_text || ''}
          </Text>

          <View style={styles.answerOptionsContainer}>
            {currentQuestion.answers?.map((answer: any) => (
              <TouchableOpacity
                key={answer.id}
                style={getAnswerStyle(answer.id)}
                onPress={() => handleAnswerSelect(answer.id)}
                activeOpacity={0.7}
              >
                <View style={styles.answerIconContainer}>
                  <Icon
                    name={getAnswerIcon(answer.id)}
                    size={24}
                    color={selectedAnswers[currentQuestion.id] === answer.id ? colors.primary : colors.gray400}
                  />
                </View>
                <Text style={styles.answerText}>{answer.answerText || answer.answer_text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton
          label="Previous"
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outlined"
          size="medium"
          icon="arrow-left"
        />
        <ActionButton
          label={currentQuestionIndex === displayQuestions.length - 1 ? 'View Results' : 'Next'}
          onPress={currentQuestionIndex === displayQuestions.length - 1 ? handleSubmitTest : handleNext}
          variant="primary"
          size="medium"
          icon={currentQuestionIndex === displayQuestions.length - 1 ? 'check-circle' : 'arrow-right'}
        />
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
  preTestContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.base,
  },
  preTestCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
    width: '100%',
    maxWidth: 400,
  },
  preTestHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  preTestIconContainer: {
    marginBottom: spacing.base,
  },
  preTestTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  preTestSubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  guestHint: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  preTestDetails: {
    width: '100%',
    marginBottom: spacing.lg,
    paddingVertical: spacing.base,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
  },
  preTestDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
    gap: spacing.sm,
  },
  preTestDetailText: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionCountText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  progressText: {
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  progressBar: {
    height: 4,
    borderRadius: 0,
  },
  content: {
    flex: 1,
    padding: spacing.base,
  },
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    ...shadows.sm,
  },
  questionText: {
    marginBottom: spacing.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  answerOptionsContainer: {
    gap: spacing.sm,
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  answerOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  answerIconContainer: {
    marginRight: spacing.sm,
  },
  answerText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.base,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    ...shadows.sm,
  },
});
