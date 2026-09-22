import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuestion } from '../../store/slices/questionSlice';
import { progressService } from '../../services/api/progressService';
import { addBookmark, removeBookmark, checkBookmark } from '../../store/slices/bookmarkSlice';
import { dailyActivityService } from '../../services/dailyActivityService';
import { RootState, AppDispatch } from '../../store';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { CategoryBadge, ActionButton, DragAndMatch } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';
import { getApiUrl } from '../../utils/getApiUrl';
import { removeProjectPrefix } from '../../utils/knowledgeAreaUtils';
import {
  hasPremiumAccess,
  hasReachedFreeLimit,
} from '../../utils/subscriptionUtils';
import { useRequireAuth } from '../../utils/requireAuth';
import { AnsweredQuestionFeedback } from '../../types/question';

export default function QuestionDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const questionId = ((route.params as { questionId?: string }) || {}).questionId || '';
  const dispatch = useDispatch<AppDispatch>();
  const requireAuth = useRequireAuth();
  const { currentQuestion, questions, isLoading, error } = useSelector((state: RootState) => state.questions);
  const { bookmarkedQuestionIds } = useSelector((state: RootState) => state.bookmarks);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { overallProgress } = useSelector((state: RootState) => state.progress);
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]); // For multiple selection
  const [dragMatches, setDragMatches] = useState<{ [leftItem: string]: string }>({}); // For drag_and_match
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<AnsweredQuestionFeedback | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Determine if question supports multiple selection
  const isMultipleSelection = currentQuestion?.questionType === 'select_multiple' || 
                              currentQuestion?.question_type === 'select_multiple';
  
  // Determine if question is drag_and_match
  const isDragAndMatch = currentQuestion?.questionType === 'drag_and_match' || 
                          currentQuestion?.question_type === 'drag_and_match';
  
  // Get drag_and_match metadata
  const dragMetadata = currentQuestion?.questionMetadata || currentQuestion?.question_metadata || null;
  
  // Normalize leftItems and rightItems - extract text if they're objects
  const rawLeftItems = dragMetadata?.leftItems || dragMetadata?.left_items || [];
  const rawRightItems = dragMetadata?.rightItems || dragMetadata?.right_items || [];
  
  const leftItems = rawLeftItems.map((item: any) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') return item.text || item.letter || String(item);
    return String(item);
  });
  
  const rightItems = rawRightItems.map((item: any) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') return item.text || String(item.index) || String(item);
    return String(item);
  });

  // Correct matches come only from post-submit feedback (never preloaded)
  const correctMatches: { [key: string]: string } = answerFeedback?.correctMatches || {};
  
  // Get question images (explanation images only after feedback)
  const questionImages = currentQuestion?.questionImages || currentQuestion?.question_images || null;
  const explanationImages = answerFeedback?.explanationImages || null;
  
  // Helper to get full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, construct URL from API base URL
    const apiUrl = getApiUrl();
    // Remove trailing slash from apiUrl if present
    const baseUrl = apiUrl.replace(/\/$/, '');
    // Ensure imagePath starts with /
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseUrl}${path}`;
  };
  
  // Helper to get image src from image object or string
  const getImageSrc = (image: any): string | null => {
    if (!image) return null;
    if (typeof image === 'string') {
      return getImageUrl(image);
    }
    if (image.src) {
      return getImageUrl(image.src);
    }
    return null;
  };
  
  // Track previous questionId to detect when it actually changes
  const prevQuestionIdRef = React.useRef<string | undefined>(questionId);

  useEffect(() => {
    // Always fetch if questionId changes or if currentQuestion doesn't match questionId
    if (questionId && (currentQuestion?.id !== questionId)) {
      dispatch(fetchQuestion(questionId));
      // Reset local state when question changes to a DIFFERENT question
      if (prevQuestionIdRef.current && prevQuestionIdRef.current !== questionId) {
        setSelectedAnswer(null);
        setSelectedAnswers([]);
        setDragMatches({});
        setShowExplanation(false);
        setIsCorrect(null);
        setAnswerFeedback(null);
      }
      prevQuestionIdRef.current = questionId;
    }
  }, [questionId, currentQuestion?.id, dispatch]);

  useEffect(() => {
    if (questionId && isAuthenticated) {
      dispatch(checkBookmark(questionId) as any);
    }
  }, [questionId, dispatch, isAuthenticated]);

  useEffect(() => {
    setIsBookmarked(bookmarkedQuestionIds.includes(questionId));
  }, [bookmarkedQuestionIds, questionId]);

  const handleToggleBookmark = async () => {
    if (!requireAuth('bookmarks')) return;

    if (!hasPremiumAccess(user?.subscriptionTier)) {
      (navigation as any).navigate('Paywall', { feature: 'bookmarks' });
      return;
    }

    if (isBookmarked) {
      await dispatch(removeBookmark(questionId) as any);
    } else {
      await dispatch(addBookmark(questionId) as any);
    }
  };

  const handleSubmit = async () => {
    if (!currentQuestion) return;
    if (!requireAuth('submit_answer')) return;

    const questionsAnswered =
      overallProgress?.totalQuestionsAnswered ||
      overallProgress?.total_questions_answered ||
      0;
    if (
      hasReachedFreeLimit(
        'MAX_PRACTICE_QUESTIONS',
        questionsAnswered,
        user?.subscriptionTier
      )
    ) {
      (navigation as any).navigate('Paywall', {
        feature: 'unlimited_questions',
      });
      return;
    }
    
    // For drag_and_match, check if all left items are matched
    if (isDragAndMatch) {
      const allMatched = leftItems.every((leftItem: string) => dragMatches[leftItem]);
      if (!allMatched) {
        return;
      }
    }
    
    // For multiple selection, check if at least one answer is selected
    if (isMultipleSelection && selectedAnswers.length === 0) {
      return;
    }
    
    // For single selection, check if an answer is selected
    if (!isMultipleSelection && !isDragAndMatch && !selectedAnswer) {
      return;
    }

    setSubmitting(true);
    const idempotencyKey = `practice:${questionId}:${Date.now()}:${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    const certificationId =
      currentQuestion?.certificationId ||
      currentQuestion?.certification_id ||
      '550e8400-e29b-41d4-a716-446655440000';
    try {
      let feedback: AnsweredQuestionFeedback;

      if (isDragAndMatch) {
        feedback = await progressService.recordAnswer(questionId, undefined, {
          dragMatches,
          idempotencyKey,
          certificationId,
        });
      } else if (isMultipleSelection) {
        feedback = await progressService.recordAnswer(questionId, undefined, {
          answerIds: selectedAnswers,
          idempotencyKey,
          certificationId,
        });
      } else {
        feedback = await progressService.recordAnswer(questionId, selectedAnswer!, {
          idempotencyKey,
          certificationId,
        });
      }

      setAnswerFeedback(feedback);
      setIsCorrect(feedback.isCorrect);
      await dailyActivityService.incrementQuestions(1);
      setShowExplanation(true);
    } catch (error: any) {
      console.error('Failed to record answer:', error);
      // Do not reveal correctness without a successful server-validated submission
    } finally {
      setSubmitting(false);
    }
  };

  const isAnswerMarkedCorrect = (answerId: string) => {
    if (!answerFeedback) return false;
    return (
      answerFeedback.correctAnswerIds?.includes(answerId) ||
      answerFeedback.answers?.some((a) => a.id === answerId && a.isCorrect)
    );
  };

  const getAnswerStyle = (answerId: string) => {
    const isSelected = isMultipleSelection 
      ? selectedAnswers.includes(answerId)
      : selectedAnswer === answerId;
    
    if (!showExplanation || !answerFeedback) {
      return isSelected
        ? [styles.answerOption, styles.answerOptionSelected]
        : styles.answerOption;
    }
    
    if (isAnswerMarkedCorrect(answerId)) {
      return [styles.answerOption, styles.answerOptionCorrect];
    }
    if (isSelected && !isAnswerMarkedCorrect(answerId)) {
      return [styles.answerOption, styles.answerOptionIncorrect];
    }
    return styles.answerOption;
  };

  const getAnswerIcon = (answerId: string) => {
    const isSelected = isMultipleSelection 
      ? selectedAnswers.includes(answerId)
      : selectedAnswer === answerId;
    
    if (!showExplanation || !answerFeedback) {
      if (isMultipleSelection) {
        return isSelected ? 'checkbox-marked' : 'checkbox-blank-outline';
      } else {
        return isSelected ? 'radiobox-marked' : 'radiobox-blank';
      }
    }
    
    if (isAnswerMarkedCorrect(answerId)) {
      return 'check-circle';
    }
    if (isSelected && !isAnswerMarkedCorrect(answerId)) {
      return 'close-circle';
    }
    return isMultipleSelection ? 'checkbox-blank-outline' : 'circle-outline';
  };

  const getAnswerIconColor = (answerId: string) => {
    const isSelected = isMultipleSelection 
      ? selectedAnswers.includes(answerId)
      : selectedAnswer === answerId;
    
    if (!showExplanation || !answerFeedback) {
      return isSelected ? colors.primary : colors.gray400;
    }
    
    if (isAnswerMarkedCorrect(answerId)) {
      return colors.success;
    }
    if (isSelected && !isAnswerMarkedCorrect(answerId)) {
      return colors.error;
    }
    return colors.gray400;
  };

  if (!questionId) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Icon name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={styles.loadingText}>Question not found.</Text>
        <ActionButton label="Go Back" onPress={() => navigation.goBack()} variant="outlined" />
      </SafeAreaView>
    );
  }

  if (error && !isLoading && (!currentQuestion || currentQuestion.id !== questionId)) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Icon name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={styles.loadingText}>{error}</Text>
        <ActionButton
          label="Try Again"
          onPress={() => dispatch(fetchQuestion(questionId))}
          variant="outlined"
        />
      </SafeAreaView>
    );
  }

  // Show loading if fetching or if current question doesn't match route questionId
  if (isLoading || !currentQuestion || currentQuestion.id !== questionId) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading question...</Text>
      </SafeAreaView>
    );
  }

  const difficulty = currentQuestion.difficulty || 'medium';
  const knowledgeArea = currentQuestion.knowledgeAreaName || currentQuestion.knowledge_area_name;
  const displayKnowledgeArea = knowledgeArea ? removeProjectPrefix(knowledgeArea) : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {displayKnowledgeArea && (
              <CategoryBadge
                label={displayKnowledgeArea}
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
          <TouchableOpacity
            onPress={handleToggleBookmark}
            style={styles.bookmarkButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isBookmarked ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Question Text */}
        <View style={styles.questionCard}>
          <Text variant="headlineSmall" style={styles.questionText}>
            {currentQuestion.questionText || currentQuestion.question_text}
          </Text>
          
          {/* Question Images */}
          {questionImages && Array.isArray(questionImages) && questionImages.length > 0 && (
            <View style={styles.imagesContainer}>
              {questionImages.map((img: any, index: number) => {
                const imageSrc = getImageSrc(img);
                if (!imageSrc) return null;
                
                return (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: imageSrc }}
                      style={styles.questionImage}
                      resizeMode="contain"
                    />
                    {img && typeof img === 'object' && img.alt && (
                      <Text style={styles.imageCaption}>{img.alt}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Drag and Match Component */}
        {isDragAndMatch && dragMetadata && leftItems.length > 0 && rightItems.length > 0 ? (
          <DragAndMatch
            leftItems={leftItems}
            rightItems={rightItems}
            correctMatches={correctMatches}
            onMatchChange={setDragMatches}
            showExplanation={showExplanation}
            userMatches={dragMatches}
          />
        ) : isDragAndMatch ? (
          <View style={styles.answersContainer}>
            <Text variant="bodyMedium" style={{ color: colors.error, textAlign: 'center', padding: spacing.md }}>
              Drag and match data not available. Please check the question metadata.
            </Text>
            <Text variant="bodySmall" style={{ color: colors.textSecondary, textAlign: 'center', padding: spacing.sm }}>
              Debug: isDragAndMatch={String(isDragAndMatch)}, hasMetadata={String(!!dragMetadata)}, leftItems={leftItems.length}, rightItems={rightItems.length}
            </Text>
          </View>
        ) : null}

        {/* Answer Options - for select_one and select_multiple */}
        {!isDragAndMatch && currentQuestion.answers && currentQuestion.answers.length > 0 && (
          <View style={styles.answersContainer}>
            <Text variant="titleMedium" style={styles.answersTitle}>
              {isMultipleSelection ? 'Select all that apply:' : 'Select your answer:'}
            </Text>
            {currentQuestion.answers.map((answer: any, index: number) => {
              const handleAnswerPress = () => {
                if (showExplanation) return;
                
                if (isMultipleSelection) {
                  // Toggle answer in selectedAnswers array
                  setSelectedAnswers(prev => {
                    if (prev.includes(answer.id)) {
                      return prev.filter(id => id !== answer.id);
                    } else {
                      return [...prev, answer.id];
                    }
                  });
                } else {
                  // Single selection
                  setSelectedAnswer(answer.id);
                }
              };
              
              return (
                <TouchableOpacity
                  key={answer.id}
                  style={getAnswerStyle(answer.id)}
                  onPress={handleAnswerPress}
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
              );
            })}
          </View>
        )}

        {/* Show message if no answers available */}
        {!isDragAndMatch && (!currentQuestion.answers || currentQuestion.answers.length === 0) && (
          <View style={styles.answersContainer}>
            <Text variant="bodyMedium" style={{ color: colors.error, textAlign: 'center', padding: spacing.md }}>
              No answer options available for this question.
            </Text>
            <Text variant="bodySmall" style={{ color: colors.textSecondary, textAlign: 'center', padding: spacing.sm }}>
              Debug: questionType={currentQuestion.questionType || currentQuestion.question_type || 'unknown'}, answers={currentQuestion.answers ? currentQuestion.answers.length : 'null'}
            </Text>
          </View>
        )}

        {/* Fallback: Show answers if drag_and_match metadata is missing */}
        {isDragAndMatch && (!dragMetadata || leftItems.length === 0 || rightItems.length === 0) && currentQuestion.answers && currentQuestion.answers.length > 0 && (
          <View style={styles.answersContainer}>
            <Text variant="titleMedium" style={styles.answersTitle}>
              Select your answer:
            </Text>
            {currentQuestion.answers.map((answer: any, index: number) => (
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
        )}

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
              disabled={(isDragAndMatch ? !leftItems.every((leftItem: string) => dragMatches[leftItem]) :
                        isMultipleSelection ? selectedAnswers.length === 0 : !selectedAnswer) || submitting}
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
            {answerFeedback?.explanation && (
              <View style={styles.explanationContent}>
                <Text variant="bodyLarge" style={styles.explanationLabel}>
                  Explanation:
                </Text>
                <Text variant="bodyMedium" style={styles.explanationText}>
                  {answerFeedback.explanation}
                </Text>
                
                {/* Explanation Images */}
                {explanationImages && Array.isArray(explanationImages) && explanationImages.length > 0 && (
                  <View style={styles.imagesContainer}>
                    {explanationImages.map((img: any, index: number) => {
                      const imageSrc = getImageSrc(img);
                      if (!imageSrc) return null;
                      
                      return (
                        <View key={index} style={styles.imageWrapper}>
                          <Image
                            source={{ uri: imageSrc }}
                            style={styles.questionImage}
                            resizeMode="contain"
                          />
                          {img && typeof img === 'object' && img.alt && (
                            <Text style={styles.imageCaption}>{img.alt}</Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}
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
                // Find current question index in the questions list
                const currentIndex = questions.findIndex(q => q.id === questionId);
                const nextIndex = currentIndex + 1;
                
                if (nextIndex < questions.length) {
                  // Navigate to next question
                  const nextQuestion = questions[nextIndex];
                  (navigation as any).navigate('QuestionDetail', { questionId: nextQuestion.id });
                } else {
                  // No more questions, go back to practice screen
                  navigation.goBack();
                }
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.base,
  },
  headerLeft: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: spacing.sm,
  },
  bookmarkButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
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
    marginBottom: spacing.sm,
  },
  imagesContainer: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  imageWrapper: {
    marginBottom: spacing.sm,
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray100,
  },
  imageCaption: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
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
