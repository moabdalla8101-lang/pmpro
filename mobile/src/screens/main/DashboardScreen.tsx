import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchProgress, fetchPerformanceByDomain } from '../../store/slices/progressSlice';
import { loadSettings } from '../../store/slices/settingsSlice';
import { examService } from '../../services/api/examService';
import { dailyActivityService } from '../../services/dailyActivityService';
import client from '../../services/api/client';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SectionHeader,
  DailyGoalsHero,
} from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

const PMP_CERTIFICATION_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { overallProgress, performanceByDomain, isLoading } = useSelector((state: RootState) => state.progress);
  
  // Debug: Log performanceByDomain to see what we're getting
  useEffect(() => {
    console.log('Performance by Domain:', performanceByDomain);
    console.log('Performance by Domain length:', performanceByDomain?.length);
    if (performanceByDomain && performanceByDomain.length > 0) {
      performanceByDomain.forEach((domain: any, index: number) => {
        console.log(`Domain ${index}:`, domain);
      });
    }
  }, [performanceByDomain]);
  const { dailyQuestionsGoal, dailyMinutesGoal } = useSelector((state: RootState) => state.settings);
  const [todayActivity, setTodayActivity] = useState({ questionsAnswered: 0, practiceMinutes: 0 });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [weeklyCompletions, setWeeklyCompletions] = useState<Array<{ date: string; completed: boolean }>>([]);

  // Fetch data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [dispatch])
  );

  // Also fetch on initial mount
  useEffect(() => {
    loadDashboardData();
  }, [dispatch]);

  const loadDashboardData = async () => {
    dispatch(loadSettings() as any);
    dispatch(fetchProgress(PMP_CERTIFICATION_ID));
    
    // Stagger API calls to avoid rate limiting
    // Start with the most important ones first
    fetchTodayActivity();
    fetchStreak();
    
    // Add small delays for less critical requests
    setTimeout(() => {
      dispatch(fetchPerformanceByDomain(PMP_CERTIFICATION_ID));
    }, 100);
    
    setTimeout(() => {
      fetchWeeklyCompletions();
    }, 200);
  };

  const fetchTodayActivity = async () => {
    try {
      setLoadingActivity(true);
      const activity = await dailyActivityService.getTodayActivity();
      setTodayActivity(activity);
    } catch (error) {
      console.error('Failed to fetch today activity:', error);
    } finally {
      setLoadingActivity(false);
    }
  };

  const fetchStreak = async () => {
    // Only fetch streak if user is authenticated
    if (!user || !user.id) {
      setCurrentStreak(0);
      return;
    }

    try {
      const response = await client.get('/api/badges/streak');
      setCurrentStreak(response.data.currentStreak || 0);
    } catch (error: any) {
      // Handle rate limiting gracefully
      if (error?.response?.status === 429) {
        console.warn('Rate limited on streak fetch, will retry later');
        // Don't set to 0, keep previous value
        return;
      }
      // Handle 401 (unauthorized) gracefully - user not logged in
      if (error?.response?.status === 401) {
        console.warn('User not authenticated, skipping streak fetch');
        setCurrentStreak(0);
        return;
      }
      console.error('Failed to fetch streak:', error);
      setCurrentStreak(0);
    }
  };

  const fetchWeeklyCompletions = async () => {
    try {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      
      try {
        const response = await client.get(
          `/api/exams/daily-quiz/weekly?certificationId=${PMP_CERTIFICATION_ID}&startDate=${sevenDaysAgo.toISOString()}`
        );
        const completionDates = (response.data?.completions || []).map((c: any) => c.date);
        const completions: Array<{ date: string; completed: boolean }> = [];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          const dateStr = date.toISOString().split('T')[0];
          const completed = completionDates.includes(dateStr);
          completions.push({ date: dateStr, completed });
        }
        setWeeklyCompletions(completions);
      } catch (error) {
        // If endpoint fails, create empty completions
        const completions: Array<{ date: string; completed: boolean }> = [];
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
      console.error('Failed to fetch weekly completions:', error);
    }
  };

  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardScreen.tsx:32',message:'Progress state check',data:{hasOverallProgress:!!overallProgress,accuracy:overallProgress?.accuracy,totalAnswered:overallProgress?.total_questions_answered,correctAnswers:overallProgress?.correct_answers,isLoading},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'progress-refresh'})}).catch(()=>{});
  }, [overallProgress, isLoading]);
  // #endregion

  // Ensure accuracy is always a number (0-100 percentage)
  const accuracyValue = overallProgress?.accuracy;
  let accuracy = 0;
  if (accuracyValue !== null && accuracyValue !== undefined) {
    if (typeof accuracyValue === 'number') {
      accuracy = !isNaN(accuracyValue) ? accuracyValue : 0;
    } else if (typeof accuracyValue === 'string') {
      accuracy = parseFloat(accuracyValue) || 0;
    }
    // If accuracy is less than 1, it's a decimal (0.0-1.0), convert to percentage
    if (accuracy > 0 && accuracy <= 1) {
      accuracy = accuracy * 100;
    }
  }
  const totalAnswered = overallProgress?.totalQuestionsAnswered || overallProgress?.total_questions_answered || 0;
  const correctAnswers = overallProgress?.correctAnswers || overallProgress?.correct_answers || 0;
  
  // Debug log
  console.log('Dashboard - Progress Data:', {
    accuracyValue,
    accuracy,
    totalAnswered,
    correctAnswers,
    overallProgress,
  });

  if (isLoading && !overallProgress) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section - Greeting */}
        <View style={styles.heroSection}>
          <View style={styles.greetingContainer}>
            <Text variant="headlineMedium" style={styles.greeting}>
              Welcome back, {user?.firstName || 'User'}! 👋
            </Text>
            <Text variant="bodyMedium" style={styles.greetingSubtext}>
              Let's continue your PMP journey
            </Text>
          </View>
        </View>

        {/* Daily Goals Hero Banner */}
        {!loadingActivity && (
          <DailyGoalsHero
            dailyQuestionsGoal={dailyQuestionsGoal}
            dailyMinutesGoal={dailyMinutesGoal}
            todayQuestions={todayActivity.questionsAnswered}
            todayMinutes={todayActivity.practiceMinutes}
            currentStreak={currentStreak}
            weeklyCompletions={weeklyCompletions}
            onStartPracticeTest={() => {
              (navigation as any).navigate('PracticeTest');
            }}
          />
        )}

        {/* Quick Actions Grid */}
        <SectionHeader title="Quick Actions" icon="lightning-bolt" />
        <View style={styles.quickActionsGrid}>
          {/* Knowledge Area Practice */}
          <View style={styles.quickActionCard}>
            <Card
              style={[styles.actionCard, { backgroundColor: `${colors.primary}10` }]}
              onPress={() => {
                (navigation as any).navigate('Practice', {
                  screen: 'KnowledgeAreaFilter',
                });
              }}
            >
              <Card.Content style={styles.actionCardContent}>
                <View style={[styles.actionIconCircle, { backgroundColor: colors.primary }]}>
                  <Icon name="book-open-variant" size={28} color="#ffffff" />
                </View>
                <Text variant="titleMedium" style={styles.actionTitle}>
                  Knowledge Area
                </Text>
                <Text variant="bodySmall" style={styles.actionSubtitle}>
                  Practice by area
                </Text>
              </Card.Content>
            </Card>
          </View>

          {/* Domain Practice */}
          <View style={styles.quickActionCard}>
            <Card
              style={[styles.actionCard, { backgroundColor: `${colors.secondary}10` }]}
              onPress={() => {
                (navigation as any).navigate('Practice', {
                  screen: 'DomainFilter',
                });
              }}
            >
              <Card.Content style={styles.actionCardContent}>
                <View style={[styles.actionIconCircle, { backgroundColor: colors.secondary }]}>
                  <Icon name="view-grid" size={28} color="#ffffff" />
                </View>
                <Text variant="titleMedium" style={styles.actionTitle}>
                  Domain Practice
                </Text>
                <Text variant="bodySmall" style={styles.actionSubtitle}>
                  Practice by domain
                </Text>
              </Card.Content>
            </Card>
          </View>

          {/* Bookmarked Questions */}
          <View style={styles.quickActionCard}>
            <Card
              style={[styles.actionCard, { backgroundColor: `${colors.warning}10` }]}
              onPress={() => {
                (navigation as any).navigate('Practice', {
                  screen: 'BookmarkedQuestions',
                });
              }}
            >
              <Card.Content style={styles.actionCardContent}>
                <View style={[styles.actionIconCircle, { backgroundColor: colors.warning }]}>
                  <Icon name="bookmark" size={28} color="#ffffff" />
                </View>
                <Text variant="titleMedium" style={styles.actionTitle}>
                  Bookmarked
                </Text>
                <Text variant="bodySmall" style={styles.actionSubtitle}>
                  Review saved
                </Text>
              </Card.Content>
            </Card>
          </View>

          {/* Missed Questions */}
          <View style={styles.quickActionCard}>
            <Card
              style={[styles.actionCard, { backgroundColor: `${colors.info}10` }]}
              onPress={() => {
                (navigation as any).navigate('Practice', {
                  screen: 'MissedQuestions',
                });
              }}
            >
              <Card.Content style={styles.actionCardContent}>
                <View style={[styles.actionIconCircle, { backgroundColor: colors.info }]}>
                  <Icon name="alert-circle" size={28} color="#ffffff" />
                </View>
                <Text variant="titleMedium" style={styles.actionTitle}>
                  Missed
                </Text>
                <Text variant="bodySmall" style={styles.actionSubtitle}>
                  Review incorrect
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Performance by Domain (People, Process, Business) */}
        <SectionHeader
          title="Performance by Domain"
          subtitle="Your progress in People, Process, and Business"
          icon="chart-bar"
        />
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: spacing.lg }} />
        ) : performanceByDomain && performanceByDomain.length > 0 ? (
          <View style={styles.processProgressContainer}>
            {performanceByDomain.map((domain: any, index: number) => {
                const totalAnswered = domain.totalAnswered || domain.total_answered || 0;
                const correct = domain.correctAnswers || domain.correct_answers || 0;
                const incorrect = totalAnswered - correct;
                const totalQuestions = domain.totalQuestions || domain.total_questions || 0;
                const unanswered = totalQuestions - totalAnswered;
                
                const correctPercent = totalQuestions > 0 ? (correct / totalQuestions) : 0;
                const incorrectPercent = totalQuestions > 0 ? (incorrect / totalQuestions) : 0;
                const unansweredPercent = totalQuestions > 0 ? (unanswered / totalQuestions) : 0;
                
                // Get domain color
                const domainName = domain.domain || '';
                const domainColor = domainName === 'People' ? colors.domain.people :
                                  domainName === 'Process' ? colors.domain.process :
                                  domainName === 'Business' ? colors.domain.business :
                                  colors.primary;
                
                return (
                  <Card key={domain.domain || index} style={[styles.processCard, { borderLeftWidth: 4, borderLeftColor: domainColor }]}>
                    <Card.Content style={styles.processContent}>
                      <View style={styles.processHeader}>
                        <Text variant="titleMedium" style={[styles.processTitle, { color: domainColor }]}>
                          {domain.domain || 'Unknown'}
                        </Text>
                        <Text variant="bodySmall" style={styles.processTotal}>
                          {totalAnswered} / {totalQuestions} answered
                        </Text>
                      </View>
                      
                      {/* Segmented Progress Bar */}
                      <View style={styles.progressBarContainer}>
                        <View style={styles.progressBarWrapper}>
                          {correct > 0 && (
                            <View
                              style={[
                                styles.progressSegment,
                                styles.progressSegmentCorrect,
                                { width: `${correctPercent * 100}%` },
                              ]}
                            />
                          )}
                          {incorrect > 0 && (
                            <View
                              style={[
                                styles.progressSegment,
                                styles.progressSegmentIncorrect,
                                { width: `${incorrectPercent * 100}%` },
                              ]}
                            />
                          )}
                          {unanswered > 0 && (
                            <View
                              style={[
                                styles.progressSegment,
                                styles.progressSegmentUnanswered,
                                { width: `${unansweredPercent * 100}%` },
                              ]}
                            />
                          )}
                        </View>
                      </View>
                      
                      <View style={styles.processStats}>
                        <View style={styles.processStatItem}>
                          <View style={[styles.processStatDot, { backgroundColor: colors.success }]} />
                          <Text variant="bodySmall" style={styles.processStatText}>
                            {correct} correct
                          </Text>
                        </View>
                        <View style={styles.processStatItem}>
                          <View style={[styles.processStatDot, { backgroundColor: colors.error }]} />
                          <Text variant="bodySmall" style={styles.processStatText}>
                            {incorrect} incorrect
                          </Text>
                        </View>
                        {unanswered > 0 && (
                          <View style={styles.processStatItem}>
                            <View style={[styles.processStatDot, { backgroundColor: colors.gray300 }]} />
                            <Text variant="bodySmall" style={styles.processStatText}>
                              {unanswered} unanswered
                            </Text>
                          </View>
                        )}
                      </View>
                    </Card.Content>
                  </Card>
                );
              })}
            </View>
        ) : (
          <Text variant="bodyMedium" style={{ textAlign: 'center', color: colors.textSecondary, padding: spacing.lg }}>
            No domain performance data available
          </Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray50,
  },
  heroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  greetingSubtext: {
    color: colors.textSecondary,
  },
  progressCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  progressCardContent: {
    padding: spacing.lg,
  },
  accuracySection: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  accuracyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  accuracyLabel: {
    fontWeight: '600',
    color: colors.textSecondary,
  },
  accuracyValue: {
    fontWeight: '700',
    color: colors.primary,
  },
  accuracyProgressBar: {
    height: 12,
    borderRadius: borderRadius.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.gray200,
    marginHorizontal: spacing.sm,
  },
  card: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  cardContent: {
    padding: spacing.base,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.base,
  },
  quizTextContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  cardTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardText: {
    color: colors.textSecondary,
  },
  quizBadge: {
    backgroundColor: `${colors.warning}20`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  quizBadgeText: {
    color: colors.warning,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
    marginBottom: spacing.lg,
    justifyContent: 'space-between',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.base,
  },
  quickActionCard: {
    width: '47%', // 2 columns with gap - using 47% to account for gap
    maxWidth: '47%',
  },
  actionCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    width: '100%',
  },
  actionCardContent: {
    alignItems: 'center',
    padding: spacing.base,
  },
  actionIconCircle: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  actionSubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  domainStats: {
    gap: spacing.base,
  },
  domainCard: {
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    ...shadows.sm,
    marginBottom: spacing.base,
  },
  domainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
  },
  domainTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  domainValue: {
    fontWeight: '700',
  },
  markedFlashcardsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  markedFlashcardsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  markedFlashcardsText: {
    marginLeft: spacing.base,
    flex: 1,
  },
  markedFlashcardsTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  markedFlashcardsSubtitle: {
    color: colors.textSecondary,
  },
  processProgressContainer: {
    gap: spacing.base,
    marginBottom: spacing.lg,
  },
  processCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    marginBottom: spacing.base,
  },
  processContent: {
    padding: spacing.base,
  },
  processHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  processTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  processTotal: {
    color: colors.textSecondary,
  },
  progressBarContainer: {
    marginBottom: spacing.sm,
  },
  progressBarWrapper: {
    height: 12,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray200,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressSegment: {
    height: '100%',
  },
  progressSegmentCorrect: {
    backgroundColor: colors.success,
  },
  progressSegmentIncorrect: {
    backgroundColor: colors.error,
  },
  progressSegmentUnanswered: {
    backgroundColor: colors.gray300,
  },
  processStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  processStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  processStatDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.round,
  },
  processStatText: {
    color: colors.textSecondary,
  },
});
