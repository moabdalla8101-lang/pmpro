import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme';
import { spacing, borderRadius, shadows } from '../utils/styles';

export type ExamGridQuestionStatus = 'answered' | 'unanswered';

interface ExamQuestionReviewGridProps {
  totalQuestions: number;
  /** question index → answered? */
  isAnsweredAt: (index: number) => boolean;
  /** question index → marked/flagged? */
  isMarkedAt: (index: number) => boolean;
  currentIndex?: number;
  onSelectQuestion: (index: number) => void;
}

export default function ExamQuestionReviewGrid({
  totalQuestions,
  isAnsweredAt,
  isMarkedAt,
  currentIndex,
  onSelectQuestion,
}: ExamQuestionReviewGridProps) {
  const answeredCount = Array.from({ length: totalQuestions }, (_, i) => i).filter((i) =>
    isAnsweredAt(i)
  ).length;
  const unansweredCount = totalQuestions - answeredCount;
  const markedCount = Array.from({ length: totalQuestions }, (_, i) => i).filter((i) =>
    isMarkedAt(i)
  ).length;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="headlineSmall" style={styles.title}>
        Review Questions
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Tap any number to jump to that question. Check unanswered items before submitting.
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <View style={[styles.statDot, { backgroundColor: colors.success }]} />
          <Text variant="bodySmall" style={styles.statText}>
            Answered {answeredCount}
          </Text>
        </View>
        <View style={styles.statChip}>
          <View style={[styles.statDot, { backgroundColor: colors.gray300 }]} />
          <Text variant="bodySmall" style={styles.statText}>
            Unanswered {unansweredCount}
          </Text>
        </View>
        <View style={styles.statChip}>
          <View style={[styles.statDot, { backgroundColor: colors.warning }]} />
          <Text variant="bodySmall" style={styles.statText}>
            Marked {markedCount}
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        {Array.from({ length: totalQuestions }, (_, index) => {
          const answered = isAnsweredAt(index);
          const marked = isMarkedAt(index);
          const isCurrent = currentIndex === index;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.cell,
                answered ? styles.cellAnswered : styles.cellUnanswered,
                marked && styles.cellMarked,
                isCurrent && styles.cellCurrent,
              ]}
              onPress={() => onSelectQuestion(index)}
              activeOpacity={0.75}
              accessibilityLabel={`Question ${index + 1}${answered ? ', answered' : ', unanswered'}${
                marked ? ', marked' : ''
              }`}
            >
              <Text
                variant="labelLarge"
                style={[
                  styles.cellText,
                  answered ? styles.cellTextAnswered : styles.cellTextUnanswered,
                  marked && styles.cellTextMarked,
                ]}
              >
                {index + 1}
              </Text>
              {marked && <View style={styles.markedBadge} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.legend}>
        <Text variant="titleSmall" style={styles.legendTitle}>
          Legend
        </Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendSwatch, styles.cellAnswered]} />
          <Text variant="bodySmall" style={styles.legendLabel}>
            Answered
          </Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendSwatch, styles.cellUnanswered]} />
          <Text variant="bodySmall" style={styles.legendLabel}>
            Unanswered
          </Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendSwatch, styles.cellUnanswered, styles.cellMarked]} />
          <Text variant="bodySmall" style={styles.legendLabel}>
            Marked for review
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const CELL_SIZE = 44;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  title: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    gap: spacing.xs,
    ...shadows.sm,
  },
  statDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cellAnswered: {
    backgroundColor: `${colors.success}22`,
    borderColor: colors.success,
  },
  cellUnanswered: {
    backgroundColor: colors.gray100,
    borderColor: colors.gray300,
  },
  cellMarked: {
    borderColor: colors.warning,
    borderWidth: 3,
  },
  cellCurrent: {
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  cellText: {
    fontWeight: '700',
  },
  cellTextAnswered: {
    color: colors.success,
  },
  cellTextUnanswered: {
    color: colors.textSecondary,
  },
  cellTextMarked: {
    color: colors.warning,
  },
  markedBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.warning,
  },
  legend: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    ...shadows.sm,
  },
  legendTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  legendSwatch: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
  },
  legendLabel: {
    color: colors.textSecondary,
  },
});
