import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function ProgressScreen() {
  const { overallProgress, performanceByKnowledgeArea } = useSelector(
    (state: RootState) => state.progress
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Overall Progress
            </Text>
            {overallProgress ? (
              <View>
                <Text variant="bodyLarge">
                  Accuracy: {overallProgress.accuracy?.toFixed(1)}%
                </Text>
                <Text variant="bodyMedium">
                  Questions Answered: {overallProgress.total_questions_answered}
                </Text>
                <Text variant="bodyMedium">
                  Correct Answers: {overallProgress.correct_answers}
                </Text>
              </View>
            ) : (
              <Text variant="bodyMedium">No progress data yet</Text>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Performance by Knowledge Area
            </Text>
            {performanceByKnowledgeArea.length > 0 ? (
              performanceByKnowledgeArea.map((area: any) => (
                <View key={area.knowledge_area_id} style={styles.areaItem}>
                  <Text variant="bodyMedium">{area.knowledge_area_name}</Text>
                  <Text variant="bodySmall">
                    {area.accuracy?.toFixed(1)}% ({area.correct_answers}/{area.total_answered})
                  </Text>
                </View>
              ))
            ) : (
              <Text variant="bodyMedium">No performance data yet</Text>
            )}
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
  card: {
    marginBottom: 15,
  },
  cardTitle: {
    marginBottom: 15,
    fontWeight: 'bold',
  },
  areaItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});


