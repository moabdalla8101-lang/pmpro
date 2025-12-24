import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, ProgressBar, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { examService } from '../../services/api/examService';
import { RootState, AppDispatch } from '../../store';
import { fetchQuestions } from '../../store/slices/questionSlice';
import { questionService } from '../../services/api/questionService';
import { addBookmark, removeBookmark, checkBookmark } from '../../store/slices/bookmarkSlice';
import { dailyActivityService } from '../../services/dailyActivityService';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActionButton } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

const TOTAL_QUESTIONS = 10;
const PMP_CERTIFICATION_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function DailyQuizScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { questions } = useSelector((state: RootState) => state.questions);
  const { bookmarkedQuestionIds } = useSelector((state: RootState) => state.bookmarks);
  
  const [examId, setExamId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

  // Use quizQuestions if available, otherwise fall back to Redux questions
  const displayQuestions = quizQuestions.length > 0 ? quizQuestions : questions;
  const currentQuestion = displayQuestions[currentQuestionIndex];
  const progress = displayQuestions.length > 0 ? (currentQuestionIndex + 1) / displayQuestions.length : 0;
  const allQuestionsAnswered = Boolean(displayQuestions.length > 0 && Object.keys(selectedAnswers).length === displayQuestions.length);

  useEffect(() => {
    // Check if we're resuming an existing quiz
    // Handle nested navigation params - params might be in route.params or route.params.params
    try {
      const params = route.params;
      if (!params || typeof params !== 'object') {
        return;
      }
      const examIdParam = (params as any)?.examId || (params as any)?.params?.examId;
      if (examIdParam && typeof examIdParam === 'string') {
        setExamId(examIdParam);
        setIsQuizStarted(true);
        // Fetch questions for this exam
        loadQuizQuestions(examIdParam);
      }
    } catch (error) {
      console.error('Error accessing route params:', error);
    }
  }, [route.params]);

  const loadQuizQuestions = async (quizExamId: string) => {
    try {
      const examData = await examService.getExam(quizExamId);
      // For now, fetch questions - in a real scenario, we'd store question IDs with the exam
      // or create an endpoint to get exam questions
      await dispatch(fetchQuestions({ 
        certificationId: PMP_CERTIFICATION_ID, 
        limit: TOTAL_QUESTIONS.toString() 
      }) as any);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load quiz questions');
    }
  };

  const handleStartQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await examService.startDailyQuiz(PMP_CERTIFICATION_ID);
      setExamId(response.examId);
      setIsQuizStarted(true);
      dailyActivityService.startSession();

      // Fetch the specific questions for this quiz using the questionIds returned
      if (response.questionIds && response.questionIds.length > 0) {
        const questionsData = await questionService.getQuestionsByIds(response.questionIds);
        // Store questions in Redux or local state
        // For now, we'll dispatch them to Redux
        if (questionsData.questions) {
          // We need to manually set the questions in Redux or use a different approach
          // Let's use a local state for quiz questions
          setQuizQuestions(questionsData.questions);
        }
      } else {
        // Fallback: fetch random questions
        await dispatch(fetchQuestions({ 
          certificationId: PMP_CERTIFICATION_ID, 
          limit: TOTAL_QUESTIONS.toString() 
        }) as any);
      }
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.error === 'Daily quiz already completed') {
        Alert.alert(
          'Quiz Already Completed',
          'You have already completed today\'s quiz. Come back tomorrow for a new one!',
          [
            {
              text: 'View Results',
              onPress: () => {
                if (error.response?.data?.examId) {
                  navigation.navigate('ExamReview' as never, { examId: error.response.data.examId } as never);
                }
              }
            },
            { text: 'OK', onPress: () => navigation.goBack() }
          ]
        );
      } else {
        Alert.alert('Error', error.message || 'Failed to start daily quiz');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    if (currentQuestion) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion.id]: answerId,
      });
    }
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
    if (currentQuestionIndex < displayQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!examId) return;

    // Check if all questions are answered
    if (!allQuestionsAnswered) {
      Alert.alert(
        'Incomplete Quiz',
        `You have ${displayQuestions.length - Object.keys(selectedAnswers).length} unanswered question(s). Are you sure you want to submit?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit Anyway',
            style: 'destructive',
            onPress: submitAnswers,
          },
        ]
      );
      return;
    }

    Alert.alert(
      'Submit Quiz',
      'Are you sure you want to submit? You cannot change answers after submission.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          style: 'destructive',
          onPress: submitAnswers,
        },
      ]
    );
  };

  const submitAnswers = async () => {
    if (!examId) return;

    try {
      const answers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
        questionId,
        answerId,
      }));

      await examService.submitExam(examId, answers);
      
      // Track questions answered for daily goals
      await dailyActivityService.incrementQuestions(displayQuestions.length);
      
      // End session and track time
      await dailyActivityService.endSession();
      
      navigation.navigate('ExamReview' as never, { examId } as never);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit quiz');
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

  // Pre-quiz screen
  if (!isQuizStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.preQuizContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.preQuizCard}>
            <View style={styles.preQuizHeader}>
              <View style={styles.preQuizIconContainer}>
                <Icon name="calendar-star" size={64} color={colors.primary} />
              </View>
              <Text variant="headlineMedium" style={styles.preQuizTitle}>
                Today's Quiz
              </Text>
              <Text variant="bodyLarge" style={styles.preQuizSubtitle}>
                Test your knowledge with 10 random questions
              </Text>
            </View>

            <View style={styles.preQuizDetails}>
              <View style={styles.preQuizDetailItem}>
                <Icon name="help-circle" size={24} color={colors.textSecondary} />
                <Text variant="bodyLarge" style={styles.preQuizDetailText}>
                  {TOTAL_QUESTIONS} questions
                </Text>
              </View>
              <View style={styles.preQuizDetailItem}>
                <Icon name="clock-outline" size={24} color={colors.textSecondary} />
                <Text variant="bodyLarge" style={styles.preQuizDetailText}>
                  No time limit
                </Text>
              </View>
            </View>

            <View style={styles.preQuizInfo}>
              <Icon name="information" size={24} color={colors.info} />
              <Text variant="bodyMedium" style={styles.preQuizInfoText}>
                Complete today's quiz to track your daily progress and improve your accuracy!
              </Text>
            </View>

            <ActionButton
              label={isLoading ? 'Starting...' : 'Start Quiz'}
              onPress={handleStartQuiz}
              icon="rocket-launch"
              variant="primary"
              size="large"
              fullWidth={true}
              loading={isLoading}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Loading state
  if (!currentQuestion && displayQuestions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  // Quiz in progress
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with progress */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.questionCounter}>
            <Text variant="bodyMedium" style={styles.questionCounterText}>
              Question {currentQuestionIndex + 1} of {displayQuestions.length}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleToggleBookmark}
            style={styles.bookmarkButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={bookmarkedQuestionIds.includes(currentQuestion.id) ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={bookmarkedQuestionIds.includes(currentQuestion.id) ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        <ProgressBar progress={progress} color={colors.primary} style={styles.progressBar} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Question */}
        <View style={styles.questionCard}>
          <Text variant="headlineSmall" style={styles.questionText}>
            {currentQuestion.questionText || currentQuestion.question_text}
          </Text>
        </View>

        {/* Answer Options */}
        <View style={styles.answersContainer}>
          {currentQuestion.answers?.map((answer: any, index: number) => (
            <TouchableOpacity
              key={answer.id}
              style={getAnswerStyle(answer.id)}
              onPress={() => handleAnswerSelect(answer.id)}
              activeOpacity={0.7}
            >
              <View style={styles.answerContent}>
                <View style={styles.answerIndicator}>
                  <View style={styles.answerLetter}>
                    <Text style={styles.answerLetterText}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                </View>
                <View style={styles.answerTextContainer}>
                  <Text style={styles.answerText}>
                    {answer.answerText || answer.answer_text}
                  </Text>
                </View>
                <Icon
                  name={getAnswerIcon(answer.id)}
                  size={24}
                  color={selectedAnswers[currentQuestion.id] === answer.id ? colors.primary : colors.gray400}
                  style={styles.answerIcon}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer with navigation and submit */}
      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <ActionButton
            label="Previous"
            onPress={handlePrevious}
            icon="chevron-left"
            variant="outlined"
            disabled={currentQuestionIndex === 0}
          />
          <View style={styles.footerSpacer} />
          {currentQuestionIndex < displayQuestions.length - 1 ? (
            <ActionButton
              label="Next"
              onPress={handleNext}
              icon="chevron-right"
              variant="primary"
            />
          ) : (
            <ActionButton
              label="Submit"
              onPress={handleSubmitQuiz}
              icon="send"
              variant="primary"
              disabled={!allQuestionsAnswered}
            />
          )}
        </View>
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
  preQuizContent: {
    padding: spacing.base,
  },
  preQuizCard: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.lg,
  },
  preQuizHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  preQuizIconContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.round,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  preQuizTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  preQuizSubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  preQuizDetails: {
    marginBottom: spacing.lg,
  },
  preQuizDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.base,
  },
  preQuizDetailText: {
    color: colors.textPrimary,
  },
  preQuizInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${colors.info}10`,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
    gap: spacing.base,
  },
  preQuizInfoText: {
    flex: 1,
    color: colors.textPrimary,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: spacing.sm,
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.base,
    ...shadows.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  questionCounter: {
    flex: 1,
  },
  questionCounterText: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bookmarkButton: {
    padding: spacing.xs,
  },
  progressBar: {
    height: 4,
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
  },
  answerText: {
    fontSize: 16,
    color: colors.textPrimary,
    flexWrap: 'wrap',
  },
  answerIcon: {
    marginLeft: spacing.base,
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    ...shadows.md,
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerSpacer: {
    width: spacing.base,
  },
});

