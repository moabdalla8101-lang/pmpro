import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import DragAndMatch from './DragAndMatch';
import { colors } from '../theme';
import { spacing, borderRadius } from '../utils/styles';

export type ExamAnswerValue = {
  answerId?: string;
  answerIds?: string[];
  /** leftId -> rightId */
  dragMatches?: { [leftId: string]: string };
};

type DragItem = { id: string; label: string };

type Props = {
  question: any;
  value?: ExamAnswerValue;
  onChange: (value: ExamAnswerValue) => void;
  disabled?: boolean;
};

function getQuestionType(question: any): string {
  return question?.questionType || question?.question_type || 'select_one';
}

function extractDragItems(question: any): { leftItems: DragItem[]; rightItems: DragItem[]; usable: boolean } {
  let metadata = question?.questionMetadata || question?.question_metadata;
  if (typeof metadata === 'string') {
    try {
      metadata = JSON.parse(metadata);
    } catch {
      metadata = null;
    }
  }
  const leftRaw = metadata?.leftItems || metadata?.left_items || [];
  const rightRaw = metadata?.rightItems || metadata?.right_items || [];

  const coerce = (raw: any, fallbackId: string): DragItem | null => {
    if (raw == null) return null;
    if (typeof raw === 'object' && raw.id != null && raw.label != null) {
      return { id: String(raw.id), label: String(raw.label) };
    }
    if (typeof raw === 'string' || typeof raw === 'number') {
      return { id: String(raw), label: String(raw) };
    }
    if (typeof raw === 'object') {
      const label = raw.text ?? raw.label ?? raw.name;
      const id = raw.id ?? raw.letter ?? raw.index ?? label;
      if (label == null || id == null) return null;
      return { id: String(id), label: String(label) };
    }
    return { id: fallbackId, label: String(raw) };
  };

  const leftItems = leftRaw
    .map((item: any, i: number) => coerce(item, `L${i}`))
    .filter(Boolean) as DragItem[];
  const rightItems = rightRaw
    .map((item: any, i: number) => coerce(item, `R${i}`))
    .filter(Boolean) as DragItem[];

  return {
    leftItems,
    rightItems,
    usable: leftItems.length > 0 && rightItems.length > 0 && !metadata?.dragUnusable,
  };
}

export function isExamAnswerComplete(question: any, value?: ExamAnswerValue): boolean {
  const type = getQuestionType(question);
  if (type === 'drag_and_match') {
    const { leftItems, usable } = extractDragItems(question);
    if (!usable || leftItems.length === 0) return false;
    return leftItems.every((left) => Boolean(value?.dragMatches?.[left.id]));
  }
  if (type === 'select_multiple') {
    return (value?.answerIds || []).length > 0;
  }
  return Boolean(value?.answerId);
}

export function toExamSubmitAnswer(questionId: string, value?: ExamAnswerValue) {
  const payload: {
    questionId: string;
    answerId?: string;
    answerIds?: string[];
    dragMatches?: { [leftId: string]: string };
  } = { questionId };

  if (!value) return payload;

  if (value.dragMatches && Object.keys(value.dragMatches).length > 0) {
    payload.dragMatches = value.dragMatches;
  } else if (value.answerIds && value.answerIds.length > 0) {
    payload.answerIds = value.answerIds;
    if (value.answerIds.length === 1) {
      payload.answerId = value.answerIds[0];
    }
  } else if (value.answerId) {
    payload.answerId = value.answerId;
  }

  return payload;
}

export default function ExamAnswerPanel({ question, value, onChange, disabled }: Props) {
  const questionType = getQuestionType(question);
  const isMultiple = questionType === 'select_multiple';
  const isDrag = questionType === 'drag_and_match';
  const { leftItems, rightItems, usable } = useMemo(() => extractDragItems(question), [question]);

  if (isDrag && usable) {
    const leftLabels = leftItems.map((i) => i.label);
    const rightLabels = rightItems.map((i) => i.label);
    const labelToLeftId = new Map(leftItems.map((i) => [i.label, i.id]));
    const labelToRightId = new Map(rightItems.map((i) => [i.label, i.id]));
    const leftIdToLabel = new Map(leftItems.map((i) => [i.id, i.label]));
    const rightIdToLabel = new Map(rightItems.map((i) => [i.id, i.label]));

    const userMatchesByLabel: { [label: string]: string } = {};
    for (const [leftId, rightId] of Object.entries(value?.dragMatches || {})) {
      const leftLabel = leftIdToLabel.get(leftId);
      const rightLabel = rightIdToLabel.get(rightId);
      if (leftLabel && rightLabel) {
        userMatchesByLabel[leftLabel] = rightLabel;
      }
    }

    return (
      <DragAndMatch
        leftItems={leftLabels}
        rightItems={rightLabels}
        correctMatches={{}}
        userMatches={userMatchesByLabel}
        showExplanation={false}
        onMatchChange={(labelMatches) => {
          if (disabled) return;
          const byId: { [leftId: string]: string } = {};
          for (const [leftLabel, rightLabel] of Object.entries(labelMatches)) {
            const leftId = labelToLeftId.get(leftLabel);
            const rightId = labelToRightId.get(rightLabel);
            if (leftId && rightId) {
              byId[leftId] = rightId;
            }
          }
          onChange({ dragMatches: byId });
        }}
      />
    );
  }

  if (isDrag && !usable) {
    return (
      <Text variant="bodyMedium" style={styles.unusable}>
        This matching question cannot be answered (content incomplete). It will be marked incorrect if
        submitted.
      </Text>
    );
  }

  const answers = question?.answers || [];
  const selectedIds = new Set(
    isMultiple ? value?.answerIds || [] : value?.answerId ? [value.answerId] : []
  );

  return (
    <View style={styles.list}>
      {isMultiple && (
        <Text variant="bodySmall" style={styles.hint}>
          Select all that apply
        </Text>
      )}
      {answers.map((answer: any, index: number) => {
        const selected = selectedIds.has(answer.id);
        const letter = String.fromCharCode(65 + index);
        return (
          <TouchableOpacity
            key={answer.id}
            style={[styles.answerOption, selected && styles.answerOptionSelected]}
            disabled={disabled}
            onPress={() => {
              if (disabled) return;
              if (isMultiple) {
                const current = new Set(value?.answerIds || []);
                if (current.has(answer.id)) {
                  current.delete(answer.id);
                } else {
                  current.add(answer.id);
                }
                onChange({ answerIds: Array.from(current) });
              } else {
                onChange({ answerId: answer.id });
              }
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.answerLetter, selected && styles.answerLetterSelected]}>
              <Text
                variant="labelLarge"
                style={[styles.answerLetterText, selected && styles.answerLetterTextSelected]}
              >
                {letter}
              </Text>
            </View>
            <Text
              variant="bodyLarge"
              style={[styles.answerText, selected && styles.answerTextSelected]}
            >
              {answer.answerText || answer.answer_text}
            </Text>
            <Icon
              name={
                isMultiple
                  ? selected
                    ? 'checkbox-marked'
                    : 'checkbox-blank-outline'
                  : selected
                    ? 'radiobox-marked'
                    : 'radiobox-blank'
              }
              size={24}
              color={selected ? colors.primary : colors.gray400}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  hint: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  unusable: {
    color: colors.error,
    marginVertical: spacing.md,
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    backgroundColor: '#ffffff',
  },
  answerOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  answerLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  answerLetterSelected: {
    backgroundColor: colors.primary,
  },
  answerLetterText: {
    fontWeight: '700',
    color: colors.textSecondary,
  },
  answerLetterTextSelected: {
    color: '#ffffff',
  },
  answerText: {
    flex: 1,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  answerTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
