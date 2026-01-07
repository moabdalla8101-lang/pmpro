import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';
import { spacing, borderRadius, shadows } from '../utils/styles';
import ActionButton from './ActionButton';

interface WeeklyCompletion {
  date: string;
  completed: boolean;
}

interface DailyGoalsHeroProps {
  dailyQuestionsGoal: number;
  dailyMinutesGoal: number;
  todayQuestions: number;
  todayMinutes: number;
  currentStreak: number;
  weeklyCompletions?: WeeklyCompletion[];
  examCountdown?: number;
  onStartPracticeTest: () => void;
  onViewDetails?: () => void;
}

export default function DailyGoalsHero({
  dailyQuestionsGoal,
  dailyMinutesGoal,
  todayQuestions,
  todayMinutes,
  currentStreak,
  weeklyCompletions = [],
  examCountdown,
  onStartPracticeTest,
  onViewDetails,
}: DailyGoalsHeroProps) {
  const questionsProgress = Math.min((todayQuestions / dailyQuestionsGoal) * 100, 100);
  const minutesProgress = Math.min((todayMinutes / dailyMinutesGoal) * 100, 100);

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return colors.success;
    if (progress >= 50) return colors.warning;
    return colors.error;
  };

  const questionsColor = getProgressColor(questionsProgress);
  const minutesColor = getProgressColor(minutesProgress);

  const isQuestionsComplete = todayQuestions >= dailyQuestionsGoal;
  const isMinutesComplete = todayMinutes >= dailyMinutesGoal;
  const allGoalsComplete = isQuestionsComplete && isMinutesComplete;

  const getMotivationalMessage = () => {
    if (allGoalsComplete) {
      return "Great job! You've completed today's goals! 🎉";
    }
    if (isQuestionsComplete || isMinutesComplete) {
      return "You're making great progress! Keep it up! 💪";
    }
    if (questionsProgress >= 50 || minutesProgress >= 50) {
      return "You're halfway there! Keep practicing! 📚";
    }
    return "Today's streak is waiting for you! Let's get started! 🔥";
  };

  return (
    <Card style={styles.card}>
      <View style={styles.gradientWrapper}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Card.Content style={styles.content}>
          {/* Optional Countdown */}
          {examCountdown !== undefined && examCountdown > 0 && (
            <View style={styles.countdownContainer}>
              <Icon name="calendar-clock" size={20} color="#FFFFFF" />
              <Text variant="bodySmall" style={styles.countdownText}>
                {examCountdown} Days until exam
              </Text>
            </View>
          )}

          {/* Title */}
          <Text variant="titleLarge" style={styles.title}>
            Today's Progress
          </Text>

          {/* Questions Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <View style={styles.progressLabelContainer}>
                <Icon name="help-circle" size={20} color="#FFFFFF" style={styles.progressIcon} />
                <Text variant="bodyMedium" style={styles.progressLabel}>
                  Today's Questions
                </Text>
              </View>
              <View style={styles.progressValueContainer}>
                <Text variant="headlineSmall" style={styles.progressValue}>
                  {todayQuestions}/{dailyQuestionsGoal}
                </Text>
                {isQuestionsComplete && (
                  <Icon name="check-circle" size={20} color={colors.success} style={styles.checkIcon} />
                )}
              </View>
            </View>
            <ProgressBar
              progress={questionsProgress / 100}
              color={questionsColor}
              style={styles.progressBar}
            />
          </View>

          {/* Minutes Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <View style={styles.progressLabelContainer}>
                <Icon name="clock-outline" size={20} color="#FFFFFF" style={styles.progressIcon} />
                <Text variant="bodyMedium" style={styles.progressLabel}>
                  Today's Practice Minutes
                </Text>
              </View>
              <View style={styles.progressValueContainer}>
                <Text variant="headlineSmall" style={styles.progressValue}>
                  {todayMinutes}/{dailyMinutesGoal}
                </Text>
                {isMinutesComplete && (
                  <Icon name="check-circle" size={20} color={colors.success} style={styles.checkIcon} />
                )}
              </View>
            </View>
            <ProgressBar
              progress={minutesProgress / 100}
              color={minutesColor}
              style={styles.progressBar}
            />
          </View>

          {/* Weekly Calendar */}
          {weeklyCompletions.length > 0 && (
            <View style={styles.calendarSection}>
              <Text variant="bodyMedium" style={styles.calendarTitle}>
                {currentStreak === 0
                  ? "Start your streak"
                  : `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'} in a row`}
              </Text>
              <View style={styles.calendarContainer}>
                <View style={styles.calendarRow}>
                  {weeklyCompletions.map((completion, index) => {
                    const dayLabel = getDayLabel(getDayOfWeek(completion.date));
                    const today = isToday(completion.date);
                    const completed = completion.completed;

                    return (
                      <View key={index} style={styles.dayContainer}>
                        <View
                          style={[
                            styles.dayCircle,
                            today && styles.todayCircle,
                            completed && !today && styles.completedCircle,
                            !completed && !today && styles.incompleteCircle,
                          ]}
                        >
                          {completed && (
                            <Icon
                              name="check"
                              size={14}
                              color={today ? colors.textPrimary : '#ffffff'}
                              style={styles.checkIcon}
                            />
                          )}
                          {!completed && (
                            <Text
                              style={[
                                styles.dayLabel,
                                today && styles.todayLabel,
                              ]}
                            >
                              {dayLabel}
                            </Text>
                          )}
                        </View>
                        {index < weeklyCompletions.length - 1 && (
                          <View style={styles.connectorLine} />
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {/* Motivational Message */}
          {allGoalsComplete && (
            <View style={styles.messageContainer}>
              <Text variant="bodyMedium" style={styles.messageText}>
                {getMotivationalMessage()}
              </Text>
            </View>
          )}

          {/* Action Button */}
          <ActionButton
            label="Start Today's Practice"
            onPress={onStartPracticeTest}
            icon="rocket-launch"
            variant="secondary"
            size="large"
            fullWidth
            style={styles.actionButton}
          />
          </Card.Content>
        </LinearGradient>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  gradientWrapper: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: borderRadius.lg,
  },
  content: {
    padding: spacing.lg,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    alignSelf: 'flex-start',
    marginBottom: spacing.base,
  },
  countdownText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  title: {
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.lg,
  },
  progressSection: {
    marginBottom: spacing.base,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressIcon: {
    marginRight: spacing.xs,
  },
  progressLabel: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  progressValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressValue: {
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: spacing.xs,
  },
  checkIcon: {
    marginLeft: spacing.xs,
  },
  progressBar: {
    height: 10,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.base,
    marginBottom: spacing.sm,
  },
  streakText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.base,
  },
  messageText: {
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  actionButton: {
    marginTop: spacing.base,
  },
  calendarSection: {
    marginTop: spacing.base,
    marginBottom: spacing.sm,
  },
  calendarTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  calendarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  todayCircle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.warning,
  },
  completedCircle: {
    backgroundColor: colors.success,
  },
  incompleteCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  todayLabel: {
    color: colors.textPrimary,
  },
  checkIcon: {
    // Icon styling handled inline
  },
  connectorLine: {
    width: 8,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: spacing.xs,
  },
});

// Helper functions
function getDayLabel(dayOfWeek: number): string {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return days[dayOfWeek];
}

function getDayOfWeek(dateStr: string): number {
  const date = new Date(dateStr);
  return date.getDay();
}

function isToday(dateStr: string): boolean {
  const today = new Date();
  const date = new Date(dateStr);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

