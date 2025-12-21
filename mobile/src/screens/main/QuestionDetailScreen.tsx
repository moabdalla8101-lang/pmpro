import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuestion } from '../../store/slices/questionSlice';
import { progressService } from '../../services/api/progressService';
import { RootState, AppDispatch } from '../../store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CategoryBadge, ActionButton } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

export default function QuestionDetailScreen() {
  const route = useRoute();
  const { questionId } = route.params as { questionId: string };
  const dispatch = useDispatch<AppDispatch>();
  const { currentQuestion, isLoading } = useSelector((state: RootState) => state.questions);
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (questionId && !currentQuestion) {
      dispatch(fetchQuestion(questionId));
    }
  }, [questionId, dispatch]);

  useEffect(() => {
    if (currentQuestion && currentQuestion.id === questionId) {
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCorrect(null);
    }
  }, [currentQuestion, questionId]);

  const handleSubmit = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    setSubmitting(true);
    try {
      const result = await progressService.recordAnswer(questionId, selectedAnswer);
      setIsCorrect(result.isCorrect);
      setShowExplanation(true);
    } catch (error: any) {
      console.error('Failed to record answer:', error);
      // Still show explanation based on selected answer
      const answer = currentQuestion.answers?.find((a: any) => a.id === selectedAnswer);
      setIsCorrect(answer?.isCorrect || false);
      setShowExplanation(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getAnswerStyle = (answerId: string) => {
    if (!showExplanation || selectedAnswer !== answerId) {
      return selectedAnswer === answerId
        ? [styles.answerOption, styles.answerOptionSelected]
        : styles.answerOption;
    }
    
    const answer = currentQuestion?.answers?.find((a: any) => a.id === answerId);
    if (answer?.isCorrect) {
      return [styles.answerOption, styles.answerOptionCorrect];
    }
    if (selectedAnswer === answerId && !answer?.isCorrect) {
      return [styles.answerOption, styles.answerOptionIncorrect];
    }
    return styles.answerOption;
  };

  const getAnswerIcon = (answerId: string) => {
    if (!showExplanation) {
      return selectedAnswer === answerId ? 'radiobox-marked' : 'radiobox-blank';
    }
    
    const answer = currentQuestion?.answers?.find((a: any) => a.id === answerId);
    if (answer?.isCorrect) {
      return 'check-circle';
    }
    if (selectedAnswer === answerId && !answer?.isCorrect) {
      return 'close-circle';
    }
    return 'circle-outline';
  };

  const getAnswerIconColor = (answerId: string) => {
    if (!showExplanation) {
      return selectedAnswer === answerId ? colors.primary : colors.gray400;
    }
    
    const answer = currentQuestion?.answers?.find((a: any) => a.id === answerId);
    if (answer?.isCorrect) {
      return colors.success;
    }
    if (selectedAnswer === answerId && !answer?.isCorrect) {
      return colors.error;
    }
    return colors.gray400;
  };

  if (isLoading || !currentQuestion) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading question...</Text>
      </SafeAreaView>
    );
  }

  const difficulty = currentQuestion.difficulty || 'medium';
  const knowledgeArea = currentQuestion.knowledgeAreaName || currentQuestion.knowledge_area_name;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Header */}
        <View style={styles.header}>
          {knowledgeArea && (
            <CategoryBadge
              label={knowledgeArea}
              variant="outlined"
            />
          )}
          <CategoryBadge
            label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            color={
              difficulty === 'easy' ? colors.success :
              difficulty === 'medium' ? colors.warning :
              colors.error
            }
            variant="pill"
          />
        </View>

        {/* Question Text */}
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
              onPress={() => !showExplanation && setSelectedAnswer(answer.id)}
              disabled={showExplanation}
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
                  color={getAnswerIconColor(answer.id)}
                  style={styles.answerIcon}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        {!showExplanation && (
          <View style={styles.buttonContainer}>
            <ActionButton
              label="Submit Answer"
              onPress={handleSubmit}
              icon="send"
              variant="primary"
              size="large"
              loading={submitting}
              disabled={!selectedAnswer || submitting}
              fullWidth
            />
          </View>
        )}

        {/* Explanation */}
        {showExplanation && (
          <View style={[
            styles.explanation,
            isCorrect ? styles.explanationCorrect : styles.explanationIncorrect,
          ]}>
            <View style={styles.resultHeader}>
              <Icon
                name={isCorrect ? 'check-circle' : 'close-circle'}
                size={32}
                color={isCorrect ? colors.success : colors.error}
              />
              <Text
                variant="titleLarge"
                style={[
                  styles.resultText,
                  isCorrect ? styles.resultTextCorrect : styles.resultTextIncorrect,
                ]}
              >
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </Text>
            </View>
            {currentQuestion.explanation && (
              <View style={styles.explanationContent}>
                <Text variant="bodyLarge" style={styles.explanationLabel}>
                  Explanation:
                </Text>
                <Text variant="bodyMedium" style={styles.explanationText}>
                  {currentQuestion.explanation}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Continue Button */}
        {showExplanation && (
          <View style={styles.buttonContainer}>
            <ActionButton
              label="Continue"
              onPress={() => {
                // Navigate back or to next question
                // For now, just reset
                setSelectedAnswer(null);
                setShowExplanation(false);
                setIsCorrect(null);
              }}
              icon="arrow-right"
              variant="primary"
              size="large"
              fullWidth
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
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
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.base,
    gap: spacing.sm,
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
  answerOptionCorrect: {
    borderColor: colors.success,
    backgroundColor: `${colors.success}10`,
  },
  answerOptionIncorrect: {
    borderColor: colors.error,
    backgroundColor: `${colors.error}10`,
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
  buttonContainer: {
    marginTop: spacing.base,
    marginBottom: spacing.base,
  },
  explanation: {
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginTop: spacing.base,
    marginBottom: spacing.base,
  },
  explanationCorrect: {
    backgroundColor: `${colors.success}10`,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  explanationIncorrect: {
    backgroundColor: `${colors.error}10`,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultText: {
    marginLeft: spacing.sm,
    fontWeight: '700',
  },
  resultTextCorrect: {
    color: colors.success,
  },
  resultTextIncorrect: {
    color: colors.error,
  },
  explanationContent: {
    marginTop: spacing.sm,
  },
  explanationLabel: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  explanationText: {
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
