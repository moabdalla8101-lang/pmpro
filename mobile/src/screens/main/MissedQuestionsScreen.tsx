import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { useNavigation } from '@react-navigation/native';
import { fetchMissedQuestions, markAsReviewed } from '../../store/slices/missedQuestionsSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CategoryBadge, SectionHeader, EmptyState, ActionButton } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

export default function MissedQuestionsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { missedQuestions, isLoading } = useSelector((state: RootState) => state.missedQuestions);
  
  const [selectedKnowledgeArea, setSelectedKnowledgeArea] = useState<string | null>(null);
  const [showReviewed, setShowReviewed] = useState(false);

  useEffect(() => {
    // When showReviewed is false, we want to show only non-reviewed (reviewed: false)
    // When showReviewed is true, we want to show only reviewed (reviewed: true)
    dispatch(
      fetchMissedQuestions({
        knowledgeAreaId: selectedKnowledgeArea || undefined,
        reviewed: showReviewed ? true : false,
      }) as any
    );
  }, [selectedKnowledgeArea, showReviewed, dispatch]);

  const handleQuestionPress = (questionId: string) => {
    navigation.navigate('QuestionDetail' as never, { questionId } as never);
  };

  const handleMarkAsReviewed = async (questionId: string) => {
    await dispatch(markAsReviewed(questionId) as any);
    // Refresh missed questions after marking as reviewed
    dispatch(
      fetchMissedQuestions({
        knowledgeAreaId: selectedKnowledgeArea || undefined,
        reviewed: showReviewed ? true : false,
      }) as any
    );
  };

  // Get unique knowledge areas from missed questions
  const knowledgeAreas = Array.from(
    new Set(
      missedQuestions
        .map((mq) => mq.question?.knowledgeAreaName || mq.question?.knowledge_area_name)
        .filter(Boolean)
    )
  );

  const filteredQuestions = selectedKnowledgeArea
    ? missedQuestions.filter(
        (mq) =>
          mq.question?.knowledgeAreaId === selectedKnowledgeArea ||
          mq.question?.knowledge_area_id === selectedKnowledgeArea
      )
    : missedQuestions;

  const renderQuestion = ({ item }: any) => {
    const question = item.question;
    if (!question) return null;

    const knowledgeArea = question.knowledgeAreaName || question.knowledge_area_name;
    const difficulty = question.difficulty || 'medium';

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleQuestionPress(question.id)}
      >
        <Card style={[styles.card, item.isReviewed && styles.cardReviewed]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.questionHeader}>
              <View style={styles.questionHeaderLeft}>
                {knowledgeArea && (
                  <CategoryBadge
                    label={knowledgeArea}
                    variant="outlined"
                  />
                )}
                <CategoryBadge
                  label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  color={
                    difficulty === 'easy' ? colors.success :
                    difficulty === 'medium' ? colors.warning :
                    colors.error
                  }
                  variant="pill"
                />
                {item.isReviewed && (
                  <View style={styles.reviewedBadge}>
                    <Icon name="check-circle" size={16} color={colors.success} />
                    <Text variant="bodySmall" style={styles.reviewedText}>
                      Reviewed
                    </Text>
                  </View>
                )}
              </View>
              {!item.isReviewed && (
                <TouchableOpacity
                  onPress={() => handleMarkAsReviewed(question.id)}
                  style={styles.reviewButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon name="check-circle-outline" size={20} color={colors.success} />
                </TouchableOpacity>
              )}
            </View>
            <Text variant="bodyLarge" numberOfLines={3} style={styles.questionText}>
              {question.questionText || question.question_text || 'No question text'}
            </Text>
            <View style={styles.questionFooter}>
              <View style={styles.footerItem}>
                <Icon name="clock-outline" size={16} color={colors.textSecondary} />
                <Text variant="bodySmall" style={styles.footerText}>
                  {new Date(item.answeredAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.footerItem}>
                <Icon name="chevron-right" size={20} color={colors.primary} />
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  if (isLoading && missedQuestions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading missed questions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SectionHeader
          title="Missed Questions"
          subtitle={`${filteredQuestions.length} questions`}
          icon="alert-circle"
        />
      </View>

      {/* Filter Section */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
          style={styles.filterScrollView}
        >
          <CategoryBadge
            label="All"
            onPress={() => setSelectedKnowledgeArea(null)}
            selected={!selectedKnowledgeArea}
            variant="pill"
          />
          {knowledgeAreas.map((area) => {
            const missedQ = missedQuestions.find(
              (mq) =>
                mq.question?.knowledgeAreaName === area ||
                mq.question?.knowledge_area_name === area
            );
            const areaId =
              missedQ?.question?.knowledgeAreaId ||
              missedQ?.question?.knowledge_area_id;

            return (
              <CategoryBadge
                key={area}
                label={area}
                onPress={() =>
                  setSelectedKnowledgeArea(
                    selectedKnowledgeArea === areaId ? null : areaId || null
                  )
                }
                selected={selectedKnowledgeArea === areaId}
                variant="pill"
              />
            );
          })}
        </ScrollView>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, showReviewed && styles.toggleButtonActive]}
            onPress={() => setShowReviewed(!showReviewed)}
          >
            <Icon
              name={showReviewed ? 'eye' : 'eye-off'}
              size={16}
              color={showReviewed ? '#ffffff' : colors.textSecondary}
            />
            <Text
              variant="bodySmall"
              style={[
                styles.toggleText,
                showReviewed && styles.toggleTextActive,
              ]}
            >
              {showReviewed ? 'Show Reviewed' : 'Hide Reviewed'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredQuestions}
        renderItem={({ item }) => renderQuestion({ item })}
        keyExtractor={(item) => item.questionId}
        contentContainerStyle={[
          styles.list,
          filteredQuestions.length === 0 && styles.emptyList,
        ]}
        refreshing={isLoading}
        onRefresh={() =>
          dispatch(
            fetchMissedQuestions({
              knowledgeAreaId: selectedKnowledgeArea || undefined,
              reviewed: showReviewed || undefined,
            }) as any
          )
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="check-circle-outline"
            title="No missed questions"
            message={
              selectedKnowledgeArea
                ? 'No missed questions in this knowledge area'
                : showReviewed
                ? 'No reviewed questions'
                : 'Great job! You haven\'t missed any questions yet'
            }
            actionLabel={selectedKnowledgeArea ? 'Clear Filter' : undefined}
            onActionPress={
              selectedKnowledgeArea
                ? () => setSelectedKnowledgeArea(null)
                : undefined
            }
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray50,
  },
  loadingText: {
    marginTop: spacing.base,
    color: colors.textSecondary,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    ...shadows.sm,
  },
  filterWrapper: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  filterScrollView: {
    flexGrow: 0,
  },
  filterContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: 56,
  },
  toggleContainer: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.gray100,
    gap: spacing.xs,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  toggleTextActive: {
    color: '#ffffff',
  },
  list: {
    padding: spacing.base,
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    marginBottom: spacing.base,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  cardReviewed: {
    opacity: 0.7,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  cardContent: {
    padding: spacing.base,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  questionHeaderLeft: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: spacing.sm,
    alignItems: 'center',
  },
  reviewedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    backgroundColor: `${colors.success}15`,
    gap: spacing.xs,
  },
  reviewedText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '600',
  },
  reviewButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  questionText: {
    marginBottom: spacing.md,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: spacing.xs,
    color: colors.textSecondary,
  },
});

