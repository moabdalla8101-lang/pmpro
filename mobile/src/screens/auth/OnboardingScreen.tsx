import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function OnboardingScreen() {
  const [difficulty, setDifficulty] = useState('intermediate');
  const [studyGoals, setStudyGoals] = useState<string[]>([]);
  const navigation = useNavigation();

  const handleComplete = () => {
    // TODO: Save preferences to backend
    // For now, just navigate to main app
    navigation.navigate('Main' as never);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome to PMP Exam Prep!
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Let's personalize your learning experience
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Preferred Difficulty Level
        </Text>
        <SegmentedButtons
          value={difficulty}
          onValueChange={setDifficulty}
          buttons={[
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' },
          ]}
          style={styles.segmentedButtons}
        />

        <Button
          mode="contained"
          onPress={handleComplete}
          style={styles.button}
        >
          Get Started
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  segmentedButtons: {
    marginBottom: 30,
  },
  button: {
    marginTop: 30,
    paddingVertical: 5,
  },
});


