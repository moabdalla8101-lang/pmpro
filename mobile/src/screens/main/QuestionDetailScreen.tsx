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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CategoryBadge, ActionButton, DragAndMatch } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';
import { getApiUrl } from '../../utils/getApiUrl';

export default function QuestionDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { questionId } = (route.params as { questionId?: string }) || {};
  
  // Safety check - if questionId is missing, return early
  if (!questionId) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading question...</Text>
      </SafeAreaView>
    );
  }
  const dispatch = useDispatch<AppDispatch>();
  const { currentQuestion, questions, isLoading } = useSelector((state: RootState) => state.questions);
  const { bookmarkedQuestionIds } = useSelector((state: RootState) => state.bookmarks);
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]); // For multiple selection
  const [dragMatches, setDragMatches] = useState<{ [leftItem: string]: string }>({}); // For drag_and_match
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
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
  const leftItems = dragMetadata?.leftItems || dragMetadata?.left_items || [];
  const rightItems = dragMetadata?.rightItems || dragMetadata?.right_items || [];
  const correctMatches = dragMetadata?.matches || {};
  
  // Get question and explanation images
  const questionImages = currentQuestion?.questionImages || currentQuestion?.question_images || null;
  const explanationImages = currentQuestion?.explanationImages || currentQuestion?.explanation_images || null;
  
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
  
  // Debug logging
  React.useEffect(() => {
    if (currentQuestion) {
      console.log('Question Detail Debug:', {
        questionId: currentQuestion.id,
        questionType: currentQuestion.questionType || currentQuestion.question_type,
        isDragAndMatch,
        hasDragMetadata: !!dragMetadata,
        dragMetadata,
        hasAnswers: !!currentQuestion.answers,
        answersCount: currentQuestion.answers?.length || 0,
        leftItemsCount: leftItems.length,
        rightItemsCount: rightItems.length,
      });
    }
  }, [currentQuestion, isDragAndMatch, dragMetadata, leftItems.length, rightItems.length]);

  // Track previous questionId to detect when it actually changes
  const prevQuestionIdRef = React.useRef<string | undefined>(questionId);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuestionDetailScreen.tsx:28',message:'QuestionDetailScreen useEffect - questionId changed',data:{questionId,prevQuestionId:prevQuestionIdRef.current,currentQuestionId:currentQuestion?.id,shouldFetch:questionId && currentQuestion?.id !== questionId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1,H2'})}).catch(()=>{});
    // #endregion
    // Always fetch if questionId changes or if currentQuestion doesn't match questionId
    if (questionId && (currentQuestion?.id !== questionId)) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuestionDetailScreen.tsx:32',message:'Dispatching fetchQuestion',data:{questionId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      dispatch(fetchQuestion(questionId));
      // Reset local state when question changes to a DIFFERENT question
      if (prevQuestionIdRef.current && prevQuestionIdRef.current !== questionId) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuestionDetailScreen.tsx:40',message:'Resetting state - question changed',data:{prevQuestionId:prevQuestionIdRef.current,newQuestionId:questionId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
        // #endregion
        setSelectedAnswer(null);
        setSelectedAnswers([]);
        setDragMatches({});
        setShowExplanation(false);
        setIsCorrect(null);
      }
      prevQuestionIdRef.current = questionId;
    }
  }, [questionId, currentQuestion?.id, dispatch]);

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuestionDetailScreen.tsx:48',message:'Render state check',data:{isLoading,hasCurrentQuestion:!!currentQuestion,currentQuestionId:currentQuestion?.id,questionId,matches:currentQuestion?.id === questionId,showExplanation},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2,H3'})}).catch(()=>{});
  }, [isLoading, currentQuestion, questionId, showExplanation]);
  // #endregion

  useEffect(() => {
    if (questionId) {
      dispatch(checkBookmark(questionId) as any);
    }
  }, [questionId, dispatch]);

  useEffect(() => {
    setIsBookmarked(bookmarkedQuestionIds.includes(questionId));
  }, [bookmarkedQuestionIds, questionId]);

  const handleToggleBookmark = async () => {
    if (isBookmarked) {
      await dispatch(removeBookmark(questionId) as any);
    } else {
      await dispatch(addBookmark(questionId) as any);
    }
  };

  const handleSubmit = async () => {
    if (!currentQuestion) return;
    
    // For drag_and_match, check if all left items are matched
    if (isDragAndMatch) {
      const allMatched = leftItems.every(leftItem => dragMatches[leftItem]);
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
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuestionDetailScreen.tsx:88',message:'handleSubmit called',data:{questionId,selectedAnswer,selectedAnswers,isMultipleSelection,hasCurrentQuestion:!!currentQuestion},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
      
      if (isDragAndMatch) {
        // For drag_and_match, check if all matches are correct
        let allCorrect = true;
        for (const leftItem of leftItems) {
          const userMatch = dragMatches[leftItem];
          const correctMatch = correctMatches[leftItem];
          if (userMatch !== correctMatch) {
            allCorrect = false;
            break;
          }
        }
        setIsCorrect(allCorrect);
        
        // Record matches as answers (we'll need to find the answer IDs)
        // For now, we'll just mark it as correct/incorrect
        // TODO: Update backend to handle drag_and_match submissions properly
      } else if (isMultipleSelection) {
        // For multiple selection, record all answers and check if all are correct
        let allCorrect = true;
        let correctCount = 0;
        let totalCorrectAnswers = 0;
        
        // Count total correct answers for this question
        currentQuestion.answers?.forEach((a: any) => {
          if (a.isCorrect || a.is_correct) {
            totalCorrectAnswers++;
          }
        });
        
        // Record each selected answer
        for (const answerId of selectedAnswers) {
          const result = await progressService.recordAnswer(questionId, answerId);
          const answer = currentQuestion.answers?.find((a: any) => a.id === answerId);
          const isAnswerCorrect = answer?.isCorrect || answer?.is_correct || false;
          
          if (isAnswerCorrect) {
            correctCount++;
          } else {
            allCorrect = false;
          }
        }
        
        // For multiple selection, all selected must be correct AND all correct must be selected
        const allCorrectSelected = allCorrect && correctCount === totalCorrectAnswers && selectedAnswers.length === totalCorrectAnswers;
        setIsCorrect(allCorrectSelected);
      } else {
        // Single selection
        const result = await progressService.recordAnswer(questionId, selectedAnswer!);
        setIsCorrect(result.isCorrect);
      }
      
      // Track question answered for daily goals
      await dailyActivityService.incrementQuestions(1);
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuestionDetailScreen.tsx:120',message:'Answer recorded, setting explanation',data:{isCorrect},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
      
      setShowExplanation(true);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuestionDetailScreen.tsx:124',message:'Explanation state set to true',data:{isCorrect},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
    } catch (error: any) {
      console.error('Failed to record answer:', error);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuestionDetailScreen.tsx:127',message:'Error recording answer, showing explanation anyway',data:{error:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
      // Still show explanation based on selected answer(s)
      if (isDragAndMatch) {
        // Check if all matches are correct
        let allCorrect = true;
        for (const leftItem of leftItems) {
          const userMatch = dragMatches[leftItem];
          const correctMatch = correctMatches[leftItem];
          if (userMatch !== correctMatch) {
            allCorrect = false;
            break;
          }
        }
        setIsCorrect(allCorrect);
      } else if (isMultipleSelection) {
        // Check if all selected are correct and all correct are selected
        const correctAnswers = currentQuestion.answers?.filter((a: any) => a.isCorrect || a.is_correct) || [];
        const selectedCorrect = selectedAnswers.filter(id => {
          const answer = currentQuestion.answers?.find((a: any) => a.id === id);
          return answer?.isCorrect || answer?.is_correct;
        });
        setIsCorrect(selectedCorrect.length === correctAnswers.length && selectedAnswers.length === correctAnswers.length);
      } else {
        const answer = currentQuestion.answers?.find((a: any) => a.id === selectedAnswer);
        setIsCorrect(answer?.isCorrect || answer?.is_correct || false);
      }
      setShowExplanation(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getAnswerStyle = (answerId: string) => {
    const isSelected = isMultipleSelection 
      ? selectedAnswers.includes(answerId)
      : selectedAnswer === answerId;
    
    if (!showExplanation) {
      return isSelected
        ? [styles.answerOption, styles.answerOptionSelected]
        : styles.answerOption;
    }
    
    // Show explanation styles
    const answer = currentQuestion?.answers?.find((a: any) => a.id === answerId);
    const isAnswerCorrect = answer?.isCorrect || answer?.is_correct || false;
    
    if (isAnswerCorrect) {
      return [styles.answerOption, styles.answerOptionCorrect];
    }
    if (isSelected && !isAnswerCorrect) {
      return [styles.answerOption, styles.answerOptionIncorrect];
    }
    return styles.answerOption;
  };

  const getAnswerIcon = (answerId: string) => {
    const isSelected = isMultipleSelection 
      ? selectedAnswers.includes(answerId)
      : selectedAnswer === answerId;
    
    if (!showExplanation) {
      if (isMultipleSelection) {
        return isSelected ? 'checkbox-marked' : 'checkbox-blank-outline';
      } else {
        return isSelected ? 'radiobox-marked' : 'radiobox-blank';
      }
    }
    
    // Show explanation icons
    const answer = currentQuestion?.answers?.find((a: any) => a.id === answerId);
    const isAnswerCorrect = answer?.isCorrect || answer?.is_correct || false;
    
    if (isAnswerCorrect) {
      return 'check-circle';
    }
    if (isSelected && !isAnswerCorrect) {
      return 'close-circle';
    }
    return isMultipleSelection ? 'checkbox-blank-outline' : 'circle-outline';
  };

  const getAnswerIconColor = (answerId: string) => {
    const isSelected = isMultipleSelection 
      ? selectedAnswers.includes(answerId)
      : selectedAnswer === answerId;
    
    if (!showExplanation) {
      return isSelected ? colors.primary : colors.gray400;
    }
    
    // Show explanation colors
    const answer = currentQuestion?.answers?.find((a: any) => a.id === answerId);
    const isAnswerCorrect = answer?.isCorrect || answer?.is_correct || false;
    
    if (isAnswerCorrect) {
      return colors.success;
    }
    if (isSelected && !isAnswerCorrect) {
      return colors.error;
    }
    return colors.gray400;
  };

  // Show loading if fetching or if current question doesn't match route questionId
  if (isLoading || !currentQuestion || currentQuestion.id !== questionId) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuestionDetailScreen.tsx:144',message:'Render check - showing loading',data:{isLoading,hasCurrentQuestion:!!currentQuestion,currentQuestionId:currentQuestion?.id,questionId,matches:currentQuestion?.id === questionId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2,H3'})}).catch(()=>{});
    // #endregion
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
          <View style={styles.headerLeft}>
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
              disabled={(isDragAndMatch ? !leftItems.every(leftItem => dragMatches[leftItem]) : 
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
            {currentQuestion.explanation && (
              <View style={styles.explanationContent}>
                <Text variant="bodyLarge" style={styles.explanationLabel}>
                  Explanation:
                </Text>
                <Text variant="bodyMedium" style={styles.explanationText}>
                  {currentQuestion.explanation}
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
                  navigation.navigate('QuestionDetail' as never, { questionId: nextQuestion.id } as never);
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
