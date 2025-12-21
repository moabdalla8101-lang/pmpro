import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, SegmentedButtons, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserPreferences } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';

const studyGoals = [
  'Pass PMP exam on first attempt',
  'Improve project management skills',
  'Prepare for career advancement',
  'Maintain PMP certification',
];

export default function OnboardingScreen() {
  const [difficulty, setDifficulty] = useState('intermediate');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal)
        ? prev.filter((g) => g !== goal)
        : [...prev, goal]
    );
  };

  const handleComplete = async () => {
    try {
      // Save preferences to backend
      if (user?.id) {
        // This would call an API to save preferences
        // For now, we'll just navigate
        const preferences = {
          difficultyLevel: difficulty,
          studyGoals: selectedGoals,
          notificationsEnabled: true,
        };
        
        // TODO: Implement API call to save preferences
        // await dispatch(updateUserPreferences(preferences));
      }
      
      navigation.navigate('Main' as never);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      // Still navigate even if save fails
      navigation.navigate('Main' as never);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome to PMP Exam Prep! 🎓
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Let's personalize your learning experience
        </Text>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Preferred Difficulty Level
          </Text>
          <Text variant="bodySmall" style={styles.sectionDescription}>
            We'll adjust question difficulty based on your preference
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
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Study Goals
          </Text>
          <Text variant="bodySmall" style={styles.sectionDescription}>
            Select your goals to help us tailor your study plan
          </Text>
          {studyGoals.map((goal) => (
            <View key={goal} style={styles.goalItem}>
              <Checkbox
                status={selectedGoals.includes(goal) ? 'checked' : 'unchecked'}
                onPress={() => toggleGoal(goal)}
              />
              <Text
                style={styles.goalText}
                onPress={() => toggleGoal(goal)}
              >
                {goal}
              </Text>
            </View>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleComplete}
          style={styles.button}
          disabled={selectedGoals.length === 0}
        >
          Get Started
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Main' as never)}
          style={styles.skipButton}
        >
          Skip for now
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  sectionDescription: {
    marginBottom: 15,
    color: '#666',
  },
  segmentedButtons: {
    marginBottom: 30,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  goalText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 30,
    paddingVertical: 5,
  },
  skipButton: {
    marginTop: 10,
  },
});
