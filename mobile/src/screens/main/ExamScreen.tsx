import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function ExamScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Mock Exam
            </Text>
            <Text variant="bodyMedium" style={styles.cardText}>
              Take a full-length PMP exam simulation with 180 questions in 230 minutes.
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('ExamStart' as never)}
              style={styles.button}
            >
              Start Mock Exam
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Previous Exams
            </Text>
            <Text variant="bodySmall" style={styles.cardText}>
              No previous exams yet
            </Text>
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
    marginBottom: 10,
    fontWeight: 'bold',
  },
  cardText: {
    marginBottom: 15,
    color: '#666',
  },
  button: {
    marginTop: 10,
  },
});


