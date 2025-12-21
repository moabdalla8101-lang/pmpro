import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchProgress } from '../../store/slices/progressSlice';
import {
  StatCard,
  ProgressRing,
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

  // Ensure accuracy is always a number
  const accuracyValue = overallProgress?.accuracy;
  const accuracy = typeof accuracyValue === 'number' ? accuracyValue : (typeof accuracyValue === 'string' ? parseFloat(accuracyValue) : 0);
  const totalAnswered = overallProgress?.totalQuestionsAnswered || overallProgress?.total_questions_answered || 0;
  const correctAnswers = overallProgress?.correctAnswers || overallProgress?.correct_answers || 0;
  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DashboardScreen.tsx:45',message:'Accuracy value check',data:{accuracyValue,accuracy,accuracyType:typeof accuracy,isNaN:isNaN(accuracy),totalAnswered,correctAnswers},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'accuracy-error'})}).catch(()=>{});
  }, [accuracyValue, accuracy, totalAnswered, correctAnswers]);
  // #endregion
  const streakDays = 7; // TODO: Get from backend

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

        {/* Progress Overview */}
        <SectionHeader title="Your Progress" icon="chart-line" />
        <View style={styles.progressContainer}>
          <View style={styles.progressRingContainer}>
            <ProgressRing
              progress={(!isNaN(accuracy) && typeof accuracy === 'number' ? accuracy : 0)}
              size={140}
              strokeWidth={14}
              color={colors.primary}
              label="Overall Accuracy"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Questions"
              value={totalAnswered}
              icon="book-open-variant"
              iconColor={colors.info}
              subtitle="Total answered"
            />
            <StatCard
              title="Correct"
              value={correctAnswers}
              icon="check-circle"
              iconColor={colors.success}
              subtitle="Right answers"
            />
          </View>
        </View>

        {/* Today's Quiz */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.quizHeader}>
              <View>
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
                {(!isNaN(accuracy) && typeof accuracy === 'number' ? accuracy.toFixed(0) : '0')}%
              </Text>
            </Card.Content>
          </Card>
          <Card style={[styles.domainCard, { borderLeftColor: colors.domain.process }]}>
            <Card.Content style={styles.domainContent}>
              <Text variant="titleMedium" style={styles.domainTitle}>
                Process
              </Text>
              <Text variant="headlineSmall" style={[styles.domainValue, { color: colors.domain.process }]}>
                {(!isNaN(accuracy) && typeof accuracy === 'number' ? accuracy.toFixed(0) : '0')}%
              </Text>
            </Card.Content>
          </Card>
          <Card style={[styles.domainCard, { borderLeftColor: colors.domain.business }]}>
            <Card.Content style={styles.domainContent}>
              <Text variant="titleMedium" style={styles.domainTitle}>
                Business
              </Text>
              <Text variant="headlineSmall" style={[styles.domainValue, { color: colors.domain.business }]}>
                {(!isNaN(accuracy) && typeof accuracy === 'number' ? accuracy.toFixed(0) : '0')}%
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
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressRingContainer: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.base,
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
