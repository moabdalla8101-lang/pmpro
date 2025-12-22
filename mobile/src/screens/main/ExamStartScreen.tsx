import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, ProgressBar, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { examService } from '../../services/api/examService';
import { RootState, AppDispatch } from '../../store';
import { fetchQuestions } from '../../store/slices/questionSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActionButton } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

const TOTAL_QUESTIONS = 180;
const EXAM_DURATION_MINUTES = 230;

export default function ExamStartScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { questions } = useSelector((state: RootState) => state.questions);
  
  const [examId, setExamId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION_MINUTES * 60);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / TOTAL_QUESTIONS;

  useEffect(() => {
    if (isExamStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isExamStarted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = async () => {
    setIsLoading(true);
    try {
      const certificationId = '550e8400-e29b-41d4-a716-446655440000'; // PMP
      const response = await examService.startExam(certificationId, TOTAL_QUESTIONS);
      setExamId(response.examId);
      setIsExamStarted(true);

      // Fetch questions for the exam
      await dispatch(fetchQuestions({ certificationId, limit: TOTAL_QUESTIONS.toString() }) as any);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start exam');
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

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (!examId) return;

    Alert.alert(
      'Submit Exam',
      'Are you sure you want to submit? You cannot change answers after submission.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          style: 'destructive',
          onPress: async () => {
            try {
              const answers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
                questionId,
                answerId,
              }));

              await examService.submitExam(examId, answers);
              navigation.navigate('ExamReview' as never, { examId } as never);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to submit exam');
            }
          },
        },
      ]
    );
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

  // Pre-exam screen
  if (!isExamStarted) {
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
  if (!currentQuestion && questions.length === 0) {
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
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
          </View>
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

      {/* Footer with navigation */}
      <View style={styles.footer}>
        <ActionButton
          label="Previous"
          onPress={handlePrevious}
          icon="arrow-left"
          variant="outlined"
          size="medium"
          disabled={currentQuestionIndex === 0}
        />
        <ActionButton
          label={currentQuestionIndex === questions.length - 1 ? 'Submit Exam' : 'Next'}
          onPress={currentQuestionIndex === questions.length - 1 ? handleSubmitExam : handleNext}
          icon={currentQuestionIndex === questions.length - 1 ? 'check-circle' : 'arrow-right'}
          variant="primary"
          size="medium"
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
