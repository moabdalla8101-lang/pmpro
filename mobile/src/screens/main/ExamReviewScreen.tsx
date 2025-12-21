import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { examService } from '../../services/api/examService';

export default function ExamReviewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { examId } = route.params as { examId: string };
  
  const [examData, setExamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExamReview();
  }, []);

  const loadExamReview = async () => {
    try {
      const data = await examService.getExamReview(examId);
      setExamData(data);
    } catch (error: any) {
      console.error('Failed to load exam review:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading exam review...</Text>
      </View>
    );
  }

  if (!examData) {
    return (
      <View style={styles.container}>
        <Text>Failed to load exam review</Text>
      </View>
    );
  }

  const { exam, answers } = examData;
  const score = exam?.score || 0;
  const correctCount = exam?.correct_answers || 0;
  const totalQuestions = exam?.total_questions || 0;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.summaryTitle}>
            Exam Results
          </Text>
          <View style={styles.scoreContainer}>
            <Text variant="displaySmall" style={styles.score}>
              {score.toFixed(1)}%
            </Text>
            <Text variant="bodyMedium" style={styles.scoreDetails}>
              {correctCount} out of {totalQuestions} correct
            </Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text variant="titleMedium">{correctCount}</Text>
              <Text variant="bodySmall">Correct</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="titleMedium">{totalQuestions - correctCount}</Text>
              <Text variant="bodySmall">Incorrect</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="titleMedium">{totalQuestions}</Text>
              <Text variant="bodySmall">Total</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.answersContainer}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Review Answers
        </Text>
        {answers?.map((item: any, index: number) => (
          <Card key={item.id || index} style={styles.answerCard}>
            <Card.Content>
              <View style={styles.questionHeader}>
                <Text variant="titleMedium">Question {index + 1}</Text>
                <Chip
                  style={[
                    styles.chip,
                    item.is_correct ? styles.correctChip : styles.incorrectChip,
                  ]}
                >
                  {item.is_correct ? 'Correct' : 'Incorrect'}
                </Chip>
              </View>
              <Text variant="bodyLarge" style={styles.questionText}>
                {item.question_text}
              </Text>
              <View style={styles.answerSection}>
                <Text variant="bodySmall" style={styles.answerLabel}>
                  Your Answer:
                </Text>
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.answerText,
                    !item.is_correct && styles.incorrectAnswer,
                  ]}
                >
                  {item.answer_text}
                </Text>
              </View>
              {item.explanation && (
                <View style={styles.explanationSection}>
                  <Text variant="bodySmall" style={styles.explanationLabel}>
                    Explanation:
                  </Text>
                  <Text variant="bodyMedium" style={styles.explanationText}>
                    {item.explanation}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ExamList' as never)}
          style={styles.button}
        >
          Back to Exams
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    margin: 15,
    backgroundColor: '#6200ee',
  },
  summaryTitle: {
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  score: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scoreDetails: {
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  answersContainer: {
    padding: 15,
  },
  sectionTitle: {
    marginBottom: 15,
    fontWeight: 'bold',
  },
  answerCard: {
    marginBottom: 15,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chip: {
    marginLeft: 10,
  },
  correctChip: {
    backgroundColor: '#4caf50',
  },
  incorrectChip: {
    backgroundColor: '#f44336',
  },
  questionText: {
    marginBottom: 15,
    fontWeight: '500',
  },
  answerSection: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  answerLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  answerText: {
    color: '#333',
  },
  incorrectAnswer: {
    color: '#f44336',
  },
  explanationSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  explanationLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1976d2',
  },
  explanationText: {
    color: '#333',
  },
  actions: {
    padding: 15,
  },
  button: {
    marginBottom: 10,
  },
});
