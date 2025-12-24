import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';
import { spacing, borderRadius, shadows } from '../utils/styles';
import ActionButton from './ActionButton';
import { examService } from '../services/api/examService';
import client from '../services/api/client';

interface DailyQuizStreakCardProps {
  certificationId: string;
  onStartQuiz: () => void;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

interface WeeklyCompletion {
  date: string;
  completed: boolean;
}

export default function DailyQuizStreakCard({ certificationId, onStartQuiz }: DailyQuizStreakCardProps) {
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, lastActivityDate: null });
  const [weeklyCompletions, setWeeklyCompletions] = useState<WeeklyCompletion[]>([]);
  const [dailyQuizStatus, setDailyQuizStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, [certificationId]);

  useFocusEffect(
    React.useCallback(() => {
      // Only refetch if component was mounted more than 2 seconds ago to avoid rate limiting
      const timeoutId = setTimeout(() => {
        fetchData();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }, [certificationId])
  );

  const fetchData = async () => {
    // Prevent too frequent API calls (rate limiting protection)
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime;
    const MIN_FETCH_INTERVAL = 3000; // 3 seconds minimum between fetches
    
    if (timeSinceLastFetch < MIN_FETCH_INTERVAL && lastFetchTime > 0) {
      console.log('Skipping fetch - too soon since last fetch');
      return;
    }
    
    setLastFetchTime(now);
    
    try {
      setIsLoading(true);
      
      // Fetch all data in parallel but with error handling for each
      const [streakResponse, status, completionResponse] = await Promise.allSettled([
        client.get('/api/badges/streak'),
        examService.getDailyQuizStatus(certificationId),
        (async () => {
          const today = new Date();
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
          sevenDaysAgo.setHours(0, 0, 0, 0);
          try {
            return await client.get(
              `/api/exams/daily-quiz/weekly?certificationId=${certificationId}&startDate=${sevenDaysAgo.toISOString()}`
            );
          } catch (error) {
            return null; // Return null if endpoint fails
          }
        })(),
      ]);

      // Handle streak data
      if (streakResponse.status === 'fulfilled') {
        setStreak(streakResponse.value.data);
      }

      // Handle daily quiz status
      if (status.status === 'fulfilled') {
        setDailyQuizStatus(status.value);
      } else {
        console.warn('Failed to fetch daily quiz status:', status.reason);
        // Set default status if fetch fails
        setDailyQuizStatus({ hasTakenToday: false, canTake: true });
      }

      // Handle weekly completions
      const today = new Date();
      if (completionResponse.status === 'fulfilled' && completionResponse.value) {
        const completionDates = (completionResponse.value.data?.completions || []).map((c: any) => c.date);
        const completions: WeeklyCompletion[] = [];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          const dateStr = date.toISOString().split('T')[0];
          const completed = completionDates.includes(dateStr);
          completions.push({ date: dateStr, completed });
        }
        setWeeklyCompletions(completions);
      } else {
        // Create empty completions if fetch fails
        const completions: WeeklyCompletion[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          const dateStr = date.toISOString().split('T')[0];
          completions.push({ date: dateStr, completed: false });
        }
        setWeeklyCompletions(completions);
      }
    } catch (error) {
      console.error('Failed to fetch streak data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDayLabel = (index: number) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return days[index];
  };

  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getDay();
  };

  const isToday = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCompleted = dailyQuizStatus?.completedAt !== null && dailyQuizStatus?.completedAt !== undefined;
  const hasTakenToday = dailyQuizStatus?.hasTakenToday || false;

  // Update today's completion status
  const updatedCompletions = weeklyCompletions.map((completion) => {
    if (isToday(completion.date)) {
      return { ...completion, completed: isCompleted };
    }
    return completion;
  });

  const getMotivationalMessage = () => {
    if (isCompleted) {
      if (streak.currentStreak === 0 || streak.currentStreak === 1) {
        return "Great job! You've started your streak! Come back tomorrow to keep it going.";
      } else if (streak.currentStreak < 7) {
        return `Great job! You're on a ${streak.currentStreak}-day streak! Come back tomorrow to keep it going.`;
      } else {
        return `Amazing! ${streak.currentStreak} days strong! Come back tomorrow to continue your streak.`;
      }
    } else {
      if (streak.currentStreak === 0) {
        return "Your streak starts now. Take Today's Quiz to begin.";
      } else {
        return `Keep your ${streak.currentStreak}-day streak alive! Complete today's quiz.`;
      }
    }
  };

  if (isLoading) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <ActivityIndicator size="small" color={colors.primary} />
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {/* Streak Header */}
        <View style={styles.streakHeader}>
          <Text variant="headlineSmall" style={styles.streakText}>
            {streak.currentStreak === 0 
              ? 'Start your streak' 
              : `${streak.currentStreak} ${streak.currentStreak === 1 ? 'day' : 'days'} in a row`}
          </Text>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarRow}>
            {updatedCompletions.map((completion, index) => {
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
                        size={16}
                        color={today ? colors.textPrimary : '#ffffff'}
                        style={styles.checkIcon}
                      />
                    )}
                    {!completed && (
                      <Text
                        style={[
                          styles.dayLabel,
                          today && styles.todayLabel,
                          completed && styles.completedLabel,
                        ]}
                      >
                        {dayLabel}
                      </Text>
                    )}
                  </View>
                  {index < updatedCompletions.length - 1 && (
                    <View style={styles.connectorLine} />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Motivational Message */}
        <View style={styles.messageContainer}>
          <View style={styles.badgeContainer}>
            <LinearGradient
              colors={['#1e3a8a', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.badge}
            >
              <Icon name="fire" size={24} color="#ff9800" />
            </LinearGradient>
          </View>
          <View style={styles.messageTextContainer}>
            <Text variant="bodyLarge" style={styles.messageText}>
              {getMotivationalMessage()}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        {!isCompleted && (
          <ActionButton
            label={hasTakenToday ? 'Continue Quiz' : 'Start Daily Quiz'}
            onPress={onStartQuiz}
            icon="rocket-launch"
            variant="primary"
            size="large"
            fullWidth
            style={styles.actionButton}
          />
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  cardContent: {
    padding: spacing.lg,
  },
  streakHeader: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  streakText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  calendarContainer: {
    marginBottom: spacing.lg,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  todayCircle: {
    backgroundColor: '#FFC107',
    borderColor: '#2196F3',
  },
  completedCircle: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  incompleteCircle: {
    backgroundColor: '#E3F2FD',
    borderColor: '#BBDEFB',
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  todayLabel: {
    color: colors.textPrimary,
  },
  completedLabel: {
    color: '#ffffff',
  },
  checkIcon: {
    // Icon styling
  },
  connectorLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.gray300,
    marginHorizontal: spacing.xs,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing.base,
  },
  badgeContainer: {
    marginRight: spacing.base,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFC107',
  },
  messageTextContainer: {
    flex: 1,
  },
  messageText: {
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  actionButton: {
    marginTop: spacing.sm,
  },
});

