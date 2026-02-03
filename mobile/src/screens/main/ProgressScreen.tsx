import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Card, Text, ProgressBar, SegmentedButtons } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { SectionHeader, StatCard, ProgressRing } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';
import { removeProjectPrefix } from '../../utils/knowledgeAreaUtils';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchProgress, fetchPerformanceByKnowledgeArea, fetchPerformanceByDomain } from '../../store/slices/progressSlice';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const PMP_CERTIFICATION_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function ProgressScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { overallProgress, performanceByKnowledgeArea, performanceByDomain, isLoading, error } = useSelector(
    (state: RootState) => state.progress
  );

  const [timeRange, setTimeRange] = React.useState('all');

  // Fetch all progress data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchProgress(PMP_CERTIFICATION_ID));
      dispatch(fetchPerformanceByKnowledgeArea(PMP_CERTIFICATION_ID));
      dispatch(fetchPerformanceByDomain(PMP_CERTIFICATION_ID));
    }, [dispatch])
  );

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
  console.log('Progress Screen - Progress Data:', {
    accuracyValue,
    accuracy,
    totalAnswered,
    correctAnswers,
    overallProgress,
  });

  // Mock data for charts (TODO: Get from backend)
  const accuracyOverTime = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [65, 70, 75, accuracy || 80],
        color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const knowledgeAreaData = performanceByKnowledgeArea.length > 0
    ? performanceByKnowledgeArea.map((area: any, index: number) => {
        let areaAccuracy = area.accuracy || 0;
        // If accuracy is less than 1, it's a decimal (0.0-1.0), convert to percentage
        if (areaAccuracy > 0 && areaAccuracy <= 1) {
          areaAccuracy = areaAccuracy * 100;
        }
        return {
          name: removeProjectPrefix(area.knowledgeAreaName || area.knowledge_area_name || `Area ${index + 1}`).substring(0, 10),
          accuracy: areaAccuracy,
          color: Object.values(colors.knowledgeArea)[index % Object.keys(colors.knowledgeArea).length],
          legendFontColor: colors.textSecondary,
          legendFontSize: 12,
        };
      })
    : [
        { name: 'Integration', accuracy: 75, color: colors.knowledgeArea.integration, legendFontColor: colors.textSecondary, legendFontSize: 12 },
        { name: 'Scope', accuracy: 80, color: colors.knowledgeArea.scope, legendFontColor: colors.textSecondary, legendFontSize: 12 },
        { name: 'Schedule', accuracy: 70, color: colors.knowledgeArea.schedule, legendFontColor: colors.textSecondary, legendFontSize: 12 },
      ];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`,
    style: {
      borderRadius: borderRadius.md,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  // Show loading state
  if (isLoading && !overallProgress && performanceByKnowledgeArea.length === 0 && performanceByDomain.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="bodyLarge" style={styles.loadingText}>Loading progress data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error && !overallProgress && performanceByKnowledgeArea.length === 0 && performanceByDomain.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text variant="titleMedium" style={styles.errorText}>Error loading progress</Text>
          <Text variant="bodyMedium" style={styles.errorMessage}>{error}</Text>
        </View>
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
              progress={Math.max(0, Math.min(100, (!isNaN(accuracy) && typeof accuracy === 'number' ? accuracy : 0)))}
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

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          <SegmentedButtons
            value={timeRange}
            onValueChange={setTimeRange}
            buttons={[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'all', label: 'All Time' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        {/* Accuracy Over Time Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.chartTitle}>
              Accuracy Over Time
            </Text>
            <LineChart
              data={accuracyOverTime}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              withDots={true}
              withShadow={false}
            />
          </Card.Content>
        </Card>

        {/* Performance by Knowledge Area */}
        <SectionHeader title="By Knowledge Area" icon="book-open-page-variant" />
        {performanceByKnowledgeArea.length > 0 ? (
          <View style={styles.knowledgeAreas}>
            {performanceByKnowledgeArea.map((area: any) => {
              // Handle accuracy conversion (decimal to percentage)
              let areaAccuracy = area.accuracy || 0;
              if (typeof areaAccuracy === 'number') {
                areaAccuracy = !isNaN(areaAccuracy) ? areaAccuracy : 0;
              } else if (typeof areaAccuracy === 'string') {
                areaAccuracy = parseFloat(areaAccuracy) || 0;
              }
              // If accuracy is less than 1, it's a decimal (0.0-1.0), convert to percentage
              if (areaAccuracy > 0 && areaAccuracy <= 1) {
                areaAccuracy = areaAccuracy * 100;
              }
              
              const areaName = removeProjectPrefix(area.knowledgeAreaName || area.knowledge_area_name || 'Unknown');
              const totalAnswered = area.totalAnswered || area.total_answered || 0;
              const correctAnswers = area.correctAnswers || area.correct_answers || 0;
              
              return (
                <Card key={area.knowledgeAreaId || area.knowledge_area_id} style={styles.areaCard}>
                  <Card.Content style={styles.areaContent}>
                    <View style={styles.areaHeader}>
                      <Text variant="titleMedium" style={styles.areaName}>
                        {areaName}
                      </Text>
                      <View style={styles.areaStats}>
                        <Text variant="headlineSmall" style={styles.areaAccuracy}>
                          {(!isNaN(areaAccuracy) && typeof areaAccuracy === 'number' ? areaAccuracy.toFixed(1) : '0.0')}%
                        </Text>
                        <Text variant="bodySmall" style={styles.areaCount}>
                          {correctAnswers}/{totalAnswered}
                        </Text>
                      </View>
                    </View>
                    <ProgressBar
                      progress={Math.max(0, Math.min(1, (!isNaN(areaAccuracy) && typeof areaAccuracy === 'number' ? areaAccuracy : 0) / 100))}
                      color={colors.primary}
                      style={styles.areaProgressBar}
                    />
                  </Card.Content>
                </Card>
              );
            })}
          </View>
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyMedium" style={styles.emptyText}>
                No performance data yet. Start practicing to see your progress!
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Domain Performance */}
        <SectionHeader title="By Domain" subtitle="People, Process, Business" icon="chart-box" />
        <View style={styles.domainStats}>
          {(() => {
            // Get domain performance data
            const peopleDomain = performanceByDomain.find((d: any) => d.domain === 'People');
            const processDomain = performanceByDomain.find((d: any) => d.domain === 'Process');
            const businessDomain = performanceByDomain.find((d: any) => d.domain === 'Business');
            
            // Helper to get domain accuracy
            const getDomainAccuracy = (domain: any) => {
              if (!domain) return 0;
              let accValue = domain.accuracy || 0;
              if (typeof accValue === 'number') {
                accValue = !isNaN(accValue) ? accValue : 0;
              } else if (typeof accValue === 'string') {
                accValue = parseFloat(accValue) || 0;
              }
              // If accuracy is less than 1, it's a decimal (0.0-1.0), convert to percentage
              if (accValue > 0 && accValue <= 1) {
                accValue = accValue * 100;
              }
              return accValue;
            };
            
            const peopleAccuracy = getDomainAccuracy(peopleDomain);
            const processAccuracy = getDomainAccuracy(processDomain);
            const businessAccuracy = getDomainAccuracy(businessDomain);
            
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
                          {(!isNaN(peopleAccuracy) && typeof peopleAccuracy === 'number' ? peopleAccuracy.toFixed(0) : '0')}%
                        </Text>
                      </View>
                    </View>
                    <Text variant="bodySmall" style={styles.domainSubtitle}>
                      Leadership, team, stakeholders
                    </Text>
                    <ProgressBar
                      progress={Math.max(0, Math.min(1, peopleAccuracy / 100))}
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
                          {(!isNaN(processAccuracy) && typeof processAccuracy === 'number' ? processAccuracy.toFixed(0) : '0')}%
                        </Text>
                      </View>
                    </View>
                    <Text variant="bodySmall" style={styles.domainSubtitle}>
                      Project management processes
                    </Text>
                    <ProgressBar
                      progress={Math.max(0, Math.min(1, processAccuracy / 100))}
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
                          {(!isNaN(businessAccuracy) && typeof businessAccuracy === 'number' ? businessAccuracy.toFixed(0) : '0')}%
                        </Text>
                      </View>
                    </View>
                    <Text variant="bodySmall" style={styles.domainSubtitle}>
                      Business environment, value delivery
                    </Text>
                    <ProgressBar
                      progress={Math.max(0, Math.min(1, businessAccuracy / 100))}
                      color={colors.domain.business}
                      style={styles.domainProgressBar}
                    />
                  </Card.Content>
                </Card>
              </>
            );
          })()}
        </View>

        {/* Knowledge Area Distribution */}
        {knowledgeAreaData.length > 0 && (
          <Card style={styles.chartCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.chartTitle}>
                Questions by Knowledge Area
              </Text>
              <PieChart
                data={knowledgeAreaData}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                accessor="accuracy"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                style={styles.chart}
              />
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
    paddingBottom: spacing.xl,
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
  timeRangeContainer: {
    marginBottom: spacing.lg,
  },
  segmentedButtons: {
    backgroundColor: '#ffffff',
  },
  chartCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  chartTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  knowledgeAreas: {
    marginBottom: spacing.lg,
    gap: spacing.base,
  },
  areaCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    marginBottom: spacing.base,
  },
  areaContent: {
    padding: spacing.base,
  },
  areaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  areaName: {
    flex: 1,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  areaStats: {
    alignItems: 'flex-end',
  },
  areaAccuracy: {
    fontWeight: '700',
    color: colors.primary,
  },
  areaCount: {
    color: colors.textSecondary,
  },
  areaProgressBar: {
    height: 8,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  errorMessage: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
