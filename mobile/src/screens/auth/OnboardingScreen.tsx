import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, SegmentedButtons, Checkbox, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActionButton } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

const studyGoals = [
  { id: 'first-attempt', label: 'Pass PMP exam on first attempt', icon: 'trophy' },
  { id: 'improve-skills', label: 'Improve project management skills', icon: 'chart-line' },
  { id: 'career-advance', label: 'Prepare for career advancement', icon: 'trending-up' },
  { id: 'maintain-cert', label: 'Maintain PMP certification', icon: 'certificate' },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [difficulty, setDifficulty] = useState('intermediate');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((g) => g !== goalId)
        : [...prev, goalId]
    );
  };

  const handleComplete = async () => {
    try {
      // Save preferences to backend
      if (user?.id) {
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
      navigation.navigate('Main' as never);
    }
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        <View style={[styles.step, step >= 1 && styles.stepActive]} />
        <View style={[styles.step, step >= 2 && styles.stepActive]} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {renderStepIndicator()}
          
          <View style={styles.header}>
            <Text variant="displaySmall" style={styles.title}>
              Welcome to PMP Exam Prep! 🎓
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Let's personalize your learning experience
            </Text>
          </View>

          {step === 1 && (
            <View style={styles.section}>
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="titleLarge" style={styles.sectionTitle}>
                    Preferred Difficulty Level
                  </Text>
                  <Text variant="bodyMedium" style={styles.sectionDescription}>
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
                  <ActionButton
                    label="Next"
                    onPress={() => setStep(2)}
                    variant="primary"
                    size="large"
                    fullWidth
                    icon="arrow-right"
                  />
                </Card.Content>
              </Card>
            </View>
          )}

          {step === 2 && (
            <View style={styles.section}>
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="titleLarge" style={styles.sectionTitle}>
                    Study Goals
                  </Text>
                  <Text variant="bodyMedium" style={styles.sectionDescription}>
                    Select your goals to help us tailor your study plan
                  </Text>
                  <View style={styles.goalsContainer}>
                    {studyGoals.map((goal) => {
                      const isSelected = selectedGoals.includes(goal.id);
                      return (
                        <TouchableOpacity
                          key={goal.id}
                          style={[
                            styles.goalItem,
                            isSelected && styles.goalItemSelected,
                          ]}
                          onPress={() => toggleGoal(goal.id)}
                          activeOpacity={0.7}
                        >
                          <View style={[
                            styles.goalIconContainer,
                            isSelected && { backgroundColor: `${colors.primary}15` },
                          ]}>
                            <Icon
                              name={goal.icon}
                              size={24}
                              color={isSelected ? colors.primary : colors.textSecondary}
                            />
                          </View>
                          <View style={styles.goalContent}>
                            <Text variant="bodyLarge" style={[
                              styles.goalText,
                              isSelected && styles.goalTextSelected,
                            ]}>
                              {goal.label}
                            </Text>
                          </View>
                          <Checkbox
                            status={isSelected ? 'checked' : 'unchecked'}
                            onPress={() => toggleGoal(goal.id)}
                            color={colors.primary}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <View style={styles.buttonsContainer}>
                    <ActionButton
                      label="Back"
                      onPress={() => setStep(1)}
                      variant="outlined"
                      size="medium"
                      fullWidth
                      icon="arrow-left"
                    />
                    <ActionButton
                      label="Get Started"
                      onPress={handleComplete}
                      variant="primary"
                      size="large"
                      fullWidth
                      icon="rocket-launch"
                      disabled={selectedGoals.length === 0}
                    />
                  </View>
                </Card.Content>
              </Card>
            </View>
          )}

          <ActionButton
            label="Skip for now"
            onPress={() => navigation.navigate('Main' as never)}
            variant="text"
            size="small"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.base,
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  step: {
    width: 40,
    height: 4,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray300,
  },
  stepActive: {
    backgroundColor: colors.primary,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  section: {
    marginBottom: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionDescription: {
    marginBottom: spacing.lg,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  segmentedButtons: {
    marginBottom: spacing.lg,
  },
  goalsContainer: {
    gap: spacing.base,
    marginBottom: spacing.lg,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalItemSelected: {
    backgroundColor: `${colors.primary}05`,
    borderColor: colors.primary,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  goalContent: {
    flex: 1,
  },
  goalText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  goalTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
  buttonsContainer: {
    gap: spacing.base,
  },
});
