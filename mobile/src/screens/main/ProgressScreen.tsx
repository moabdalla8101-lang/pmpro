import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { EmptyState, SectionHeader, StatCard, ProgressRing } from '../../components';
import { getKnowledgeAreaColor } from '../../components/CategoryBadge';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';
import { removeProjectPrefix } from '../../utils/knowledgeAreaUtils';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchProgress, fetchPerformanceByKnowledgeArea, fetchPerformanceByDomain } from '../../store/slices/progressSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { userHasActivePremium } from '../../utils/subscriptionUtils';
import { useRequireAuth } from '../../utils/requireAuth';
import { FLOATING_TAB_BAR_CONTENT_INSET } from '../../navigation/tabBarLayout';

const PMP_CERTIFICATION_ID = '550e8400-e29b-41d4-a716-446655440000';
const FOCUS_THRESHOLD = 70;

/** Normalize API accuracy values to a 0–100 percentage. */
function toAccuracyPercent(value: unknown): number {
  let accuracy = 0;
  if (typeof value === 'number') {
    accuracy = !isNaN(value) ? value : 0;
  } else if (typeof value === 'string') {
    accuracy = parseFloat(value) || 0;
  }
  // Decimal ratios (0–1) → percentage
  if (accuracy > 0 && accuracy <= 1) {
    accuracy = accuracy * 100;
  }
  return Math.max(0, Math.min(100, accuracy));
}

function getAccuracyTone(accuracy: number): string {
  if (accuracy >= FOCUS_THRESHOLD) return colors.success;
  if (accuracy >= 50) return colors.warning;
  return colors.error;
}

export default function ProgressScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const requireAuth = useRequireAuth();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { overallProgress, performanceByKnowledgeArea, performanceByDomain } = useSelector(
    (state: RootState) => state.progress
  );

  // Fetch all progress data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (!isAuthenticated) return;
      dispatch(fetchProgress(PMP_CERTIFICATION_ID));
      dispatch(fetchPerformanceByKnowledgeArea(PMP_CERTIFICATION_ID));
      dispatch(fetchPerformanceByDomain(PMP_CERTIFICATION_ID));
    }, [dispatch, isAuthenticated])
  );

  const accuracy = toAccuracyPercent(overallProgress?.accuracy);
  const totalAnswered = overallProgress?.totalQuestionsAnswered || overallProgress?.total_questions_answered || 0;
  const correctAnswers = overallProgress?.correctAnswers || overallProgress?.correct_answers || 0;

  // Ranked comparison: weakest → strongest so the chart highlights where to study next.
  const knowledgeAreaComparison = useMemo(() => {
    return performanceByKnowledgeArea
      .map((area: any, index: number) => {
        const name = removeProjectPrefix(
          area.knowledgeAreaName || area.knowledge_area_name || `Area ${index + 1}`
        );
        const areaAccuracy = toAccuracyPercent(area.accuracy);
        const answered = area.totalAnswered || area.total_answered || 0;
        const correct = area.correctAnswers || area.correct_answers || 0;
        return {
          id: area.knowledgeAreaId || area.knowledge_area_id || `area-${index}`,
          name,
          accuracy: areaAccuracy,
          answered,
          correct,
          color: getKnowledgeAreaColor(name),
        };
      })
      .sort((a, b) => a.accuracy - b.accuracy || a.name.localeCompare(b.name));
  }, [performanceByKnowledgeArea]);

  const weakAreaCount = knowledgeAreaComparison.filter((area) => area.accuracy < FOCUS_THRESHOLD).length;

  // Never blank the Progress tab on focus — show auth/paywall/content immediately.
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="chart-line"
          title="Sign in to track progress"
          message="Create an account to save answers, streaks, and performance analytics."
          actionLabel="Sign In"
          onActionPress={() => requireAuth('progress')}
        />
      </SafeAreaView>
    );
  }

  if (!userHasActivePremium(user)) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="chart-line"
          title="Unlock Advanced Analytics"
          message="Upgrade to Premium to track performance trends by domain and knowledge area."
          actionLabel="View Premium Plans"
          onActionPress={() =>
            (navigation as any).navigate('Paywall', {
              feature: 'advanced_analytics',
            })
          }
        />
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
        {/* Overview Stats */}
        <SectionHeader title="Overview" icon="chart-line-variant" />
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <ProgressRing
              progress={accuracy}
              size={120}
              strokeWidth={12}
              color={colors.primary}
              showPercentage
              label="Accuracy"
            />
          </View>
          <View style={styles.statsColumn}>
            <StatCard
              title="Questions"
              value={totalAnswered}
              icon="book-open-variant"
              iconColor={colors.info}
            />
            <StatCard
              title="Correct"
              value={correctAnswers}
              icon="check-circle"
              iconColor={colors.success}
            />
          </View>
        </View>

        {/* Accuracy history requires completed practice activity. */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.chartTitle}>
              Accuracy Over Time
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Complete practice questions to build your accuracy history.
            </Text>
          </Card.Content>
        </Card>

        {/* Domain Performance */}
        <SectionHeader title="By Domain" subtitle="People, Process, Business" icon="chart-box" />
        <View style={styles.domainStats}>
          {(() => {
            const peopleDomain = performanceByDomain.find((d: any) => d.domain === 'People');
            const processDomain = performanceByDomain.find((d: any) => d.domain === 'Process');
            const businessDomain = performanceByDomain.find((d: any) => d.domain === 'Business');

            const peopleAccuracy = toAccuracyPercent(peopleDomain?.accuracy);
            const processAccuracy = toAccuracyPercent(processDomain?.accuracy);
            const businessAccuracy = toAccuracyPercent(businessDomain?.accuracy);

            return (
              <>
                <Card style={[styles.domainCard, { borderLeftColor: colors.domain.people }]}>
                  <Card.Content style={styles.domainContent}>
                    <View style={styles.domainHeader}>
                      <Text variant="titleLarge" style={styles.domainTitle}>
                        People
                      </Text>
                      <View style={[styles.domainBadge, { backgroundColor: `${colors.domain.people}20` }]}>
                        <Text style={[styles.domainBadgeText, { color: colors.domain.people }]}>
                          {peopleAccuracy.toFixed(0)}%
                        </Text>
                      </View>
                    </View>
                    <Text variant="bodySmall" style={styles.domainSubtitle}>
                      Leadership, team, stakeholders
                    </Text>
                    <ProgressBar
                      progress={peopleAccuracy / 100}
                      color={colors.domain.people}
                      style={styles.domainProgressBar}
                    />
                  </Card.Content>
                </Card>

                <Card style={[styles.domainCard, { borderLeftColor: colors.domain.process }]}>
                  <Card.Content style={styles.domainContent}>
                    <View style={styles.domainHeader}>
                      <Text variant="titleLarge" style={styles.domainTitle}>
                        Process
                      </Text>
                      <View style={[styles.domainBadge, { backgroundColor: `${colors.domain.process}20` }]}>
                        <Text style={[styles.domainBadgeText, { color: colors.domain.process }]}>
                          {processAccuracy.toFixed(0)}%
                        </Text>
                      </View>
                    </View>
                    <Text variant="bodySmall" style={styles.domainSubtitle}>
                      Project management processes
                    </Text>
                    <ProgressBar
                      progress={processAccuracy / 100}
                      color={colors.domain.process}
                      style={styles.domainProgressBar}
                    />
                  </Card.Content>
                </Card>

                <Card style={[styles.domainCard, { borderLeftColor: colors.domain.business }]}>
                  <Card.Content style={styles.domainContent}>
                    <View style={styles.domainHeader}>
                      <Text variant="titleLarge" style={styles.domainTitle}>
                        Business
                      </Text>
                      <View style={[styles.domainBadge, { backgroundColor: `${colors.domain.business}20` }]}>
                        <Text style={[styles.domainBadgeText, { color: colors.domain.business }]}>
                          {businessAccuracy.toFixed(0)}%
                        </Text>
                      </View>
                    </View>
                    <Text variant="bodySmall" style={styles.domainSubtitle}>
                      Business environment, value delivery
                    </Text>
                    <ProgressBar
                      progress={businessAccuracy / 100}
                      color={colors.domain.business}
                      style={styles.domainProgressBar}
                    />
                  </Card.Content>
                </Card>
              </>
            );
          })()}
        </View>

        {/* Accuracy comparison by knowledge area — ranked weakest → strongest */}
        <SectionHeader
          title="By Knowledge Area"
          subtitle={
            knowledgeAreaComparison.length > 0
              ? weakAreaCount > 0
                ? `${weakAreaCount} area${weakAreaCount === 1 ? '' : 's'} below ${FOCUS_THRESHOLD}% — focus here first`
                : `All areas at or above ${FOCUS_THRESHOLD}%`
              : undefined
          }
          icon="book-open-page-variant"
        />
        {knowledgeAreaComparison.length > 0 ? (
          <Card style={styles.chartCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.chartTitle}>
                Accuracy Comparison
              </Text>
              <Text variant="bodySmall" style={styles.chartSubtitle}>
                Sorted weakest to strongest
              </Text>
              <View style={styles.comparisonList}>
                {knowledgeAreaComparison.map((area) => {
                  const tone = getAccuracyTone(area.accuracy);
                  return (
                    <View key={area.id} style={styles.comparisonRow}>
                      <View style={styles.comparisonLabelRow}>
                        <View style={[styles.comparisonSwatch, { backgroundColor: area.color }]} />
                        <Text variant="bodyMedium" style={styles.comparisonName} numberOfLines={2}>
                          {area.name}
                        </Text>
                        <Text variant="titleSmall" style={[styles.comparisonPercent, { color: tone }]}>
                          {Math.round(area.accuracy)}%
                        </Text>
                      </View>
                      <View style={styles.comparisonBarTrack}>
                        <View
                          style={[
                            styles.comparisonBarFill,
                            {
                              width: `${Math.max(area.accuracy, area.answered > 0 ? 2 : 0)}%`,
                              backgroundColor: area.color,
                            },
                          ]}
                        />
                      </View>
                      <Text variant="bodySmall" style={styles.comparisonMeta}>
                        {area.correct}/{area.answered} correct
                        {area.accuracy < FOCUS_THRESHOLD ? ' · Needs practice' : ''}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
                  <Text variant="labelSmall" style={styles.legendText}>{'<50%'}</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
                  <Text variant="labelSmall" style={styles.legendText}>50–69%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
                  <Text variant="labelSmall" style={styles.legendText}>{`${FOCUS_THRESHOLD}%+`}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyMedium" style={styles.emptyText}>
                No performance data yet. Start practicing to see your progress!
              </Text>
            </Card.Content>
          </Card>
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
    paddingBottom: FLOATING_TAB_BAR_CONTENT_INSET,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.base,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsColumn: {
    flex: 1,
    gap: spacing.base,
  },
  chartCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  chartTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  chartSubtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.base,
  },
  comparisonList: {
    gap: spacing.md,
  },
  comparisonRow: {
    gap: spacing.xs,
  },
  comparisonLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  comparisonSwatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  comparisonName: {
    flex: 1,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  comparisonPercent: {
    fontWeight: '700',
    minWidth: 44,
    textAlign: 'right',
  },
  comparisonBarTrack: {
    height: 10,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray200,
    overflow: 'hidden',
  },
  comparisonBarFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  comparisonMeta: {
    color: colors.textSecondary,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray300,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: colors.textSecondary,
  },
  emptyCard: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.base,
  },
  domainStats: {
    gap: spacing.base,
    marginBottom: spacing.lg,
  },
  domainCard: {
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    ...shadows.sm,
    marginBottom: spacing.base,
  },
  domainContent: {
    padding: spacing.base,
  },
  domainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  domainTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  domainBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  domainBadgeText: {
    fontWeight: '700',
    fontSize: 14,
  },
  domainSubtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  domainProgressBar: {
    height: 8,
    borderRadius: borderRadius.sm,
  },
});
