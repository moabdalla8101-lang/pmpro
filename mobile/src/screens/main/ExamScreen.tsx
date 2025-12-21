import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActionButton, SectionHeader, EmptyState } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

export default function ExamScreen() {
  const navigation = useNavigation();

  // TODO: Fetch previous exams from backend
  const previousExams: any[] = [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Mock Exam Card */}
        <Card style={styles.examCard}>
          <Card.Content style={styles.examCardContent}>
            <View style={styles.examHeader}>
              <View style={styles.examIconContainer}>
                <Icon name="file-document-edit" size={48} color={colors.primary} />
              </View>
              <View style={styles.examInfo}>
                <Text variant="headlineSmall" style={styles.examTitle}>
                  Full Mock Exam
                </Text>
                <Text variant="bodyMedium" style={styles.examSubtitle}>
                  PMP Certification Simulation
                </Text>
              </View>
            </View>

            <View style={styles.examDetails}>
              <View style={styles.examDetailItem}>
                <Icon name="help-circle" size={20} color={colors.textSecondary} />
                <Text variant="bodyMedium" style={styles.examDetailText}>
                  180 questions
                </Text>
              </View>
              <View style={styles.examDetailItem}>
                <Icon name="clock-outline" size={20} color={colors.textSecondary} />
                <Text variant="bodyMedium" style={styles.examDetailText}>
                  230 minutes
                </Text>
              </View>
              <View style={styles.examDetailItem}>
                <Icon name="check-circle" size={20} color={colors.textSecondary} />
                <Text variant="bodyMedium" style={styles.examDetailText}>
                  Timed exam
                </Text>
              </View>
            </View>

            <View style={styles.prerequisites}>
              <Text variant="titleSmall" style={styles.prerequisitesTitle}>
                Prerequisites:
              </Text>
              <View style={styles.prerequisitesList}>
                <View style={styles.prerequisiteItem}>
                  <Icon name="check-circle" size={16} color={colors.success} />
                  <Text variant="bodySmall" style={styles.prerequisiteText}>
                    Complete at least 100 practice questions
                  </Text>
                </View>
                <View style={styles.prerequisiteItem}>
                  <Icon name="check-circle" size={16} color={colors.success} />
                  <Text variant="bodySmall" style={styles.prerequisiteText}>
                    Review all knowledge areas
                  </Text>
                </View>
              </View>
            </View>

            <ActionButton
              label="Start Mock Exam"
              onPress={() => navigation.navigate('ExamStart' as never)}
              icon="rocket-launch"
              variant="primary"
              size="large"
              fullWidth
            />
          </Card.Content>
        </Card>

        {/* Previous Exams */}
        <SectionHeader
          title="Previous Exams"
          subtitle={`${previousExams.length} completed`}
          icon="history"
        />

        {previousExams.length === 0 ? (
          <EmptyState
            icon="file-document-outline"
            title="No previous exams"
            message="Take your first mock exam to see your results here"
          />
        ) : (
          <View style={styles.examsList}>
            {previousExams.map((exam: any) => (
              <Card key={exam.id} style={styles.examResultCard}>
                <Card.Content style={styles.examResultContent}>
                  <View style={styles.examResultHeader}>
                    <View>
                      <Text variant="titleMedium" style={styles.examResultTitle}>
                        Mock Exam #{exam.id}
                      </Text>
                      <Text variant="bodySmall" style={styles.examResultDate}>
                        {new Date(exam.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.examResultScore}>
                      <Text variant="headlineSmall" style={styles.examResultScoreText}>
                        {exam.score}%
                      </Text>
                      <Text variant="bodySmall" style={styles.examResultScoreLabel}>
                        Score
                      </Text>
                    </View>
                  </View>
                  <View style={styles.examResultDetails}>
                    <View style={styles.examResultDetailItem}>
                      <Text variant="bodySmall" style={styles.examResultDetailLabel}>
                        Duration
                      </Text>
                      <Text variant="bodyMedium" style={styles.examResultDetailValue}>
                        {exam.duration}
                      </Text>
                    </View>
                    <View style={styles.examResultDetailItem}>
                      <Text variant="bodySmall" style={styles.examResultDetailLabel}>
                        Correct
                      </Text>
                      <Text variant="bodyMedium" style={styles.examResultDetailValue}>
                        {exam.correct}/{exam.total}
                      </Text>
                    </View>
                  </View>
                  <ActionButton
                    label="Review Exam"
                    onPress={() => navigation.navigate('ExamReview' as never, { examId: exam.id } as never)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Card.Content>
              </Card>
            ))}
          </View>
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
  examCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  examCardContent: {
    padding: spacing.lg,
  },
  examHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  examIconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  examInfo: {
    flex: 1,
  },
  examTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  examSubtitle: {
    color: colors.textSecondary,
  },
  examDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    paddingVertical: spacing.base,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
  },
  examDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  examDetailText: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  prerequisites: {
    marginBottom: spacing.lg,
    padding: spacing.base,
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.md,
  },
  prerequisitesTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  prerequisitesList: {
    gap: spacing.sm,
  },
  prerequisiteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  prerequisiteText: {
    color: colors.textSecondary,
  },
  examsList: {
    gap: spacing.base,
  },
  examResultCard: {
    marginBottom: spacing.base,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  examResultContent: {
    padding: spacing.base,
  },
  examResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.base,
  },
  examResultTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  examResultDate: {
    color: colors.textSecondary,
  },
  examResultScore: {
    alignItems: 'flex-end',
  },
  examResultScoreText: {
    fontWeight: '700',
    color: colors.primary,
  },
  examResultScoreLabel: {
    color: colors.textSecondary,
  },
  examResultDetails: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.base,
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderColor: colors.gray200,
  },
  examResultDetailItem: {
    flex: 1,
  },
  examResultDetailLabel: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  examResultDetailValue: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
