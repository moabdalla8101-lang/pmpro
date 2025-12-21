import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, RadioButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { fetchQuestion } from '../../store/slices/questionSlice';
import { recordAnswer } from '../../store/slices/progressSlice';
import { AppDispatch } from '../../store';

export default function QuestionDetailScreen() {
  const route = useRoute();
  const { questionId } = route.params as { questionId: string };
  const dispatch = useDispatch<AppDispatch>();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // TODO: Get question from store or fetch
  const question = {
    id: questionId,
    questionText: 'Sample question text',
    explanation: 'Sample explanation',
    answers: [
      { id: '1', answerText: 'Answer 1', isCorrect: true },
      { id: '2', answerText: 'Answer 2', isCorrect: false },
    ],
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) return;

    const answer = question.answers.find((a) => a.id === selectedAnswer);
    const correct = answer?.isCorrect || false;
    setIsCorrect(correct);
    setShowExplanation(true);

    // Record answer
    // await dispatch(recordAnswer({ questionId, answerId: selectedAnswer }));
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.questionText}>
            {question.questionText}
          </Text>

          <RadioButton.Group
            onValueChange={setSelectedAnswer}
            value={selectedAnswer || ''}
          >
            {question.answers.map((answer) => (
              <View key={answer.id} style={styles.answerOption}>
                <RadioButton value={answer.id} />
                <Text style={styles.answerText}>{answer.answerText}</Text>
              </View>
            ))}
          </RadioButton.Group>

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!selectedAnswer || showExplanation}
            style={styles.submitButton}
          >
            Submit Answer
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
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </Text>
              <Text variant="bodyMedium" style={styles.explanationText}>
                {question.explanation}
              </Text>
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
  },
});


