import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, ProgressBar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function DashboardScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { overallProgress } = useSelector((state: RootState) => state.progress);

  const accuracy = overallProgress?.accuracy || 0;
  const totalAnswered = overallProgress?.total_questions_answered || 0;
  const correctAnswers = overallProgress?.correct_answers || 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.greeting}>
          Welcome back, {user?.firstName || 'User'}!
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Your Progress
            </Text>
            <View style={styles.progressRow}>
              <View style={styles.progressItem}>
                <Text variant="headlineMedium" style={styles.progressNumber}>
                  {totalAnswered}
                </Text>
                <Text variant="bodySmall">Questions Answered</Text>
              </View>
              <View style={styles.progressItem}>
                <Text variant="headlineMedium" style={styles.progressNumber}>
                  {accuracy.toFixed(1)}%
                </Text>
                <Text variant="bodySmall">Accuracy</Text>
              </View>
            </View>
            <ProgressBar progress={accuracy / 100} color="#6200ee" style={styles.progressBar} />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Today's Quiz
            </Text>
            <Text variant="bodyMedium" style={styles.cardText}>
              Complete 10 questions to maintain your streak!
            </Text>
            <Button mode="contained" style={styles.actionButton}>
              Start Daily Quiz
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Quick Actions
            </Text>
            <View style={styles.quickActions}>
              <Button
                mode="outlined"
                icon="book-open-variant"
                style={styles.quickActionButton}
              >
                Practice
              </Button>
              <Button
                mode="outlined"
                icon="file-document-edit"
                style={styles.quickActionButton}
              >
                Mock Exam
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  greeting: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 15,
  },
  cardTitle: {
    marginBottom: 15,
    fontWeight: 'bold',
  },
  cardText: {
    marginBottom: 15,
    color: '#666',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginTop: 10,
  },
  actionButton: {
    marginTop: 10,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});


