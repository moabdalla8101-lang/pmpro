import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { SectionHeader } from '../../components';
import { colors } from '../../theme';
import { borderRadius, shadows, spacing } from '../../utils/styles';
import {
  LEARNING_CATEGORIES,
  getTopicsByCategory,
  LearningCategory,
} from '../../data/learningTopics';
import { FLOATING_TAB_BAR_CONTENT_INSET } from '../../navigation/tabBarLayout';

export default function LearningTopicsScreen() {
  const navigation = useNavigation();
  const [category, setCategory] = useState<LearningCategory | 'all'>('all');

  const topics = useMemo(() => getTopicsByCategory(category), [category]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          icon="book-education"
          title="Exam Cheat Sheet"
          subtitle={`2026 Edition · ${topics.length} structured guides`}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {LEARNING_CATEGORIES.map((chip) => {
            const selected = category === chip.id;
            return (
              <TouchableOpacity
                key={chip.id}
                onPress={() => setCategory(chip.id)}
                style={[styles.chip, selected && styles.chipSelected]}
                activeOpacity={0.8}
              >
                <Text
                  variant="labelLarge"
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.list}>
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              activeOpacity={0.85}
              onPress={() =>
                (navigation as any).navigate('LearningTopicDetail', {
                  topicId: topic.id,
                })
              }
            >
              <Card style={styles.topicCard}>
                <Card.Content style={styles.topicRow}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: `${topic.color}18` },
                    ]}
                  >
                    <Icon
                      name={topic.icon as any}
                      size={24}
                      color={topic.color}
                    />
                  </View>
                  <View style={styles.topicText}>
                    <Text variant="titleMedium" style={styles.topicTitle}>
                      {topic.title}
                    </Text>
                    <Text variant="bodySmall" style={styles.topicSubtitle}>
                      {topic.subtitle}
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={22} color={colors.gray400} />
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
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
    paddingBottom: FLOATING_TAB_BAR_CONTENT_INSET,
  },
  chipsRow: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: colors.white,
  },
  list: {
    gap: spacing.sm,
  },
  topicCard: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicText: {
    flex: 1,
  },
  topicTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  topicSubtitle: {
    color: colors.textSecondary,
  },
});
