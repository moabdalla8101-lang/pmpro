import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, RadioButton, ActivityIndicator } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuestion } from '../../store/slices/questionSlice';
import { progressService } from '../../services/api/progressService';
import { RootState, AppDispatch } from '../../store';

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

  if (isLoading || !currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading question...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.questionText}>
            {currentQuestion.question_text}
          </Text>

          <RadioButton.Group
            onValueChange={setSelectedAnswer}
            value={selectedAnswer || ''}
          >
            {currentQuestion.answers?.map((answer: any) => (
              <View key={answer.id} style={styles.answerOption}>
                <RadioButton value={answer.id} />
                <Text style={styles.answerText}>{answer.answer_text}</Text>
              </View>
            ))}
          </RadioButton.Group>

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!selectedAnswer || showExplanation || submitting}
            loading={submitting}
            style={styles.submitButton}
          >
            {submitting ? 'Submitting...' : 'Submit Answer'}
          </Button>

          {showExplanation && (
            <View style={styles.explanation}>
              <Text
                variant="titleMedium"
                style={[
                  styles.resultText,
                  isCorrect ? styles.correct : styles.incorrect,
                ]}
              >
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </Text>
              {currentQuestion.explanation && (
                <Text variant="bodyMedium" style={styles.explanationText}>
                  {currentQuestion.explanation}
                </Text>
              )}
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  card: {
    margin: 15,
  },
  questionText: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  answerText: {
    flex: 1,
    marginLeft: 10,
  },
  submitButton: {
    marginTop: 20,
  },
  explanation: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  resultText: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  correct: {
    color: '#4caf50',
  },
  incorrect: {
    color: '#f44336',
  },
  explanationText: {
    color: '#666',
    lineHeight: 20,
  },
});
