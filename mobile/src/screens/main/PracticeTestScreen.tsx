import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, ProgressBar, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { examService } from '../../services/api/examService';
import { RootState, AppDispatch } from '../../store';
import { fetchQuestions } from '../../store/slices/questionSlice';
import { questionService } from '../../services/api/questionService';
import { dailyActivityService } from '../../services/dailyActivityService';
import client from '../../services/api/client';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActionButton } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

const TOTAL_QUESTIONS = 10;
const PMP_CERTIFICATION_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function PracticeTestScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { questions } = useSelector((state: RootState) => state.questions);
  
  const [examId, setExamId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testQuestions, setTestQuestions] = useState<any[]>([]);

  // Use testQuestions if available, otherwise fall back to Redux questions
  const displayQuestions = testQuestions.length > 0 ? testQuestions : questions;
  const currentQuestion = displayQuestions[currentQuestionIndex];
  const progress = displayQuestions.length > 0 ? (currentQuestionIndex + 1) / displayQuestions.length : 0;
  const allQuestionsAnswered = Boolean(displayQuestions.length > 0 && Object.keys(selectedAnswers).length === displayQuestions.length);

  const handleStartTest = async () => {
    setIsLoading(true);
    try {
      // Start a practice exam (not a daily quiz, so no daily limit)
      const response = await examService.startExam(PMP_CERTIFICATION_ID, TOTAL_QUESTIONS);
      setExamId(response.examId);
      setIsTestStarted(true);
      dailyActivityService.startSession();

      // Fetch random questions
      const questionsData = await questionService.getQuestions({
        certificationId: PMP_CERTIFICATION_ID,
        limit: TOTAL_QUESTIONS.toString(),
      });
      
      if (questionsData.questions && questionsData.questions.length > 0) {
        setTestQuestions(questionsData.questions);
      } else {
        // Fallback: use Redux questions
        await dispatch(fetchQuestions({ 
          certificationId: PMP_CERTIFICATION_ID, 
          limit: TOTAL_QUESTIONS.toString() 
        }) as any);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start practice test');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTest = async () => {
    if (!examId) return;

    Alert.alert(
      'Submit Test',
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
      
      // Award streak badge if not already awarded today
      try {
        await client.post('/api/badges/streak');
      } catch (error) {
        // Ignore if already awarded or other error
        console.log('Streak badge may already be awarded:', error);
      }
      
      // Navigate to review - ExamReview is in the Exam stack
      (navigation as any).navigate('Exam', {
        screen: 'ExamReview',
        params: { examId },
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit test');
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

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading question...</Text>
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
            {currentQuestion.answers?.map((answer: any, index: number) => (
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
          label={currentQuestionIndex === displayQuestions.length - 1 ? 'Submit Test' : 'Next'}
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

