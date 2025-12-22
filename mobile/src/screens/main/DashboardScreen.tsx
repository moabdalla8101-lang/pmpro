import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Text, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchProgress } from '../../store/slices/progressSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ActionButton,
  SectionHeader,
  StreakBadge,
} from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

const PMP_CERTIFICATION_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { overallProgress, isLoading } = useSelector((state: RootState) => state.progress);

  // Fetch progress when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardScreen.tsx:18',message:'Dashboard focused, fetching progress',data:{certificationId:PMP_CERTIFICATION_ID},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'progress-refresh'})}).catch(()=>{});
      // #endregion
      dispatch(fetchProgress(PMP_CERTIFICATION_ID));
    }, [dispatch])
  );

  // Also fetch on initial mount
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardScreen.tsx:25',message:'Dashboard mounted, fetching progress',data:{certificationId:PMP_CERTIFICATION_ID},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'progress-refresh'})}).catch(()=>{});
    // #endregion
    dispatch(fetchProgress(PMP_CERTIFICATION_ID));
  }, [dispatch]);

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
  const streakDays = 7; // TODO: Get from backend
  
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
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.greetingContainer}>
            <Text variant="headlineMedium" style={styles.greeting}>
              Welcome back, {user?.firstName || 'User'}! 👋
            </Text>
            <Text variant="bodyMedium" style={styles.greetingSubtext}>
              Let's continue your PMP journey
            </Text>
          </View>
          <StreakBadge days={streakDays} size="medium" />
        </View>

        {/* Progress Overview - Redesigned */}
        <SectionHeader title="Your Progress" icon="chart-line" />
        <Card style={styles.progressCard}>
          <Card.Content style={styles.progressCardContent}>
            {/* Main Accuracy Display */}
            <View style={styles.accuracySection}>
              <View style={styles.accuracyHeader}>
                <Text variant="titleMedium" style={styles.accuracyLabel}>
                  Overall Accuracy
                </Text>
                <Text variant="displaySmall" style={styles.accuracyValue}>
                  {accuracy.toFixed(0)}%
                </Text>
              </View>
              <ProgressBar
                progress={accuracy / 100}
                color={colors.primary}
                style={styles.accuracyProgressBar}
              />
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: `${colors.info}15` }]}>
                  <Icon name="book-open-variant" size={28} color={colors.info} />
                </View>
                <View style={styles.statTextContainer}>
                  <Text variant="headlineSmall" style={styles.statValue}>
                    {totalAnswered}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Questions
                  </Text>
                </View>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: `${colors.success}15` }]}>
                  <Icon name="check-circle" size={28} color={colors.success} />
                </View>
                <View style={styles.statTextContainer}>
                  <Text variant="headlineSmall" style={styles.statValue}>
                    {correctAnswers}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Correct
                  </Text>
                </View>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: `${colors.warning}15` }]}>
                  <Icon name="target" size={28} color={colors.warning} />
                </View>
                <View style={styles.statTextContainer}>
                  <Text variant="headlineSmall" style={styles.statValue}>
                    {totalAnswered > 0 ? ((correctAnswers / totalAnswered) * 100).toFixed(0) : 0}%
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Success Rate
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Today's Quiz */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.quizHeader}>
              <View style={styles.quizTextContainer}>
                <Text variant="titleLarge" style={styles.cardTitle}>
                  Today's Quiz
                </Text>
                <Text variant="bodyMedium" style={styles.cardText}>
                  Complete 10 questions to maintain your streak!
                </Text>
              </View>
              <View style={styles.quizBadge}>
                <Text variant="labelLarge" style={styles.quizBadgeText}>
                  Daily
                </Text>
              </View>
            </View>
            <ActionButton
              label="Start Daily Quiz"
              onPress={() => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardScreen.tsx:54',message:'Start Daily Quiz button pressed',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
                // #endregion
                navigation.navigate('Practice' as never);
              }}
              icon="rocket-launch"
              variant="primary"
              size="large"
              fullWidth
            />
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" icon="lightning-bolt" />
        <View style={styles.quickActions}>
          <View style={styles.quickActionCard}>
            <Card
              style={[styles.actionCard, { backgroundColor: `${colors.primary}10` }]}
              onPress={() => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardScreen.tsx:66',message:'Practice button pressed',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
                // #endregion
                navigation.navigate('Practice' as never);
              }}
            >
              <Card.Content style={styles.actionCardContent}>
                <View style={[styles.actionIconCircle, { backgroundColor: colors.primary }]}>
                  <Text style={styles.actionIcon}>📚</Text>
                </View>
                <Text variant="titleMedium" style={styles.actionTitle}>
                  Practice
                </Text>
                <Text variant="bodySmall" style={styles.actionSubtitle}>
                  Study questions
                </Text>
              </Card.Content>
            </Card>
          </View>
          <View style={styles.quickActionCard}>
            <Card
              style={[styles.actionCard, { backgroundColor: `${colors.error}10` }]}
              onPress={() => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardScreen.tsx:73',message:'Mock Exam button pressed',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
                // #endregion
                navigation.navigate('Exam' as never);
              }}
            >
              <Card.Content style={styles.actionCardContent}>
                <View style={[styles.actionIconCircle, { backgroundColor: colors.error }]}>
                  <Text style={styles.actionIcon}>📝</Text>
                </View>
                <Text variant="titleMedium" style={styles.actionTitle}>
                  Mock Exam
                </Text>
                <Text variant="bodySmall" style={styles.actionSubtitle}>
                  Full simulation
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        <View style={styles.quickActions}>
          <View style={styles.quickActionCard}>
            <Card
              style={[styles.actionCard, { backgroundColor: `${colors.warning}10` }]}
              onPress={() => {
                navigation.navigate('BookmarkedQuestions' as never);
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
          <View style={styles.quickActionCard}>
            <Card
              style={[styles.actionCard, { backgroundColor: `${colors.info}10` }]}
              onPress={() => {
                navigation.navigate('MissedQuestions' as never);
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

        {/* Knowledge Area Performance Preview */}
        <SectionHeader
          title="Performance by Domain"
          subtitle="People, Process, Business"
          icon="chart-box"
        />
        <View style={styles.domainStats}>
          <Card style={[styles.domainCard, { borderLeftColor: colors.domain.people }]}>
            <Card.Content style={styles.domainContent}>
              <Text variant="titleMedium" style={styles.domainTitle}>
                People
              </Text>
              <Text variant="headlineSmall" style={[styles.domainValue, { color: colors.domain.people }]}>
                {accuracy.toFixed(0)}%
              </Text>
            </Card.Content>
          </Card>
          <Card style={[styles.domainCard, { borderLeftColor: colors.domain.process }]}>
            <Card.Content style={styles.domainContent}>
              <Text variant="titleMedium" style={styles.domainTitle}>
                Process
              </Text>
              <Text variant="headlineSmall" style={[styles.domainValue, { color: colors.domain.process }]}>
                {accuracy.toFixed(0)}%
              </Text>
            </Card.Content>
          </Card>
          <Card style={[styles.domainCard, { borderLeftColor: colors.domain.business }]}>
            <Card.Content style={styles.domainContent}>
              <Text variant="titleMedium" style={styles.domainTitle}>
                Business
              </Text>
              <Text variant="headlineSmall" style={[styles.domainValue, { color: colors.domain.business }]}>
                {accuracy.toFixed(0)}%
              </Text>
            </Card.Content>
          </Card>
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
  quickActions: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.lg,
  },
  quickActionCard: {
    flex: 1,
  },
  actionCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
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
});
