import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, Checkbox, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
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
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const navigation = useNavigation();
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
      if (user?.id) {
        const preferences = {
          studyGoals: selectedGoals,
          notificationsEnabled: true,
        };
        // TODO: Implement API call to save preferences
        void preferences;
      }

      navigation.navigate('Main' as never);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      navigation.navigate('Main' as never);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="displaySmall" style={styles.title}>
              Welcome to PMP Exam Prep! 🎓
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Let's personalize your learning experience
            </Text>
          </View>

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
                            name={goal.icon as any}
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
                <ActionButton
                  label="Get Started"
                  onPress={handleComplete}
                  variant="primary"
                  size="large"
                  fullWidth
                  icon="rocket-launch"
                  disabled={selectedGoals.length === 0}
                />
              </Card.Content>
            </Card>
          </View>

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
});
