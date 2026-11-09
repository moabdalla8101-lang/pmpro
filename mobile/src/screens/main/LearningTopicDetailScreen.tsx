import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme';
import { borderRadius, shadows, spacing } from '../../utils/styles';
import { getLearningTopic } from '../../data/learningTopics';

export default function LearningTopicDetailScreen() {
  const route = useRoute();
  const topicId = (route.params as { topicId?: string } | undefined)?.topicId;
  const topic = useMemo(
    () => (topicId ? getLearningTopic(topicId) : undefined),
    [topicId]
  );

  if (!topic) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.missing}>
          <Text variant="titleMedium">Topic not found</Text>
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
        <View style={[styles.hero, { backgroundColor: `${topic.color}14` }]}>
          <View
            style={[styles.heroIcon, { backgroundColor: topic.color }]}
          >
            <Icon name={topic.icon as any} size={28} color="#fff" />
          </View>
          <Text variant="headlineSmall" style={styles.heroTitle}>
            {topic.title}
          </Text>
          <Text variant="bodyMedium" style={styles.heroSubtitle}>
            {topic.subtitle}
          </Text>
        </View>

        {topic.sections.map((section) => (
          <Card key={section.title} style={styles.sectionCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                {section.title}
              </Text>
              {section.body ? (
                <Text variant="bodyMedium" style={styles.sectionBody}>
                  {section.body}
                </Text>
              ) : null}
              {section.bullets?.map((bullet) => (
                <View key={bullet} style={styles.bulletRow}>
                  <Icon
                    name="check-circle"
                    size={16}
                    color={topic.color}
                    style={styles.bulletIcon}
                  />
                  <Text variant="bodyMedium" style={styles.bulletText}>
                    {bullet}
                  </Text>
                </View>
              ))}
              {section.tip ? (
                <View style={styles.tipBox}>
                  <Icon name="lightbulb-on" size={18} color={colors.warning} />
                  <Text variant="bodySmall" style={styles.tipText}>
                    {section.tip}
                  </Text>
                </View>
              ) : null}
            </Card.Content>
          </Card>
        ))}
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
    gap: spacing.md,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    color: colors.textSecondary,
  },
  sectionCard: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  sectionTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionBody: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  bulletIcon: {
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  tipBox: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: `${colors.warning}14`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  tipText: {
    flex: 1,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});
