import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions, clearQuestions } from '../../store/slices/questionSlice';
import { RootState, AppDispatch } from '../../store';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { dailyActivityService } from '../../services/dailyActivityService';
import { progressService } from '../../services/api/progressService';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { CategoryBadge, SectionHeader, EmptyState, LoadingSpinner } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';
import { removeProjectPrefix } from '../../utils/knowledgeAreaUtils';
import { useRequireAuth } from '../../utils/requireAuth';
import { userHasActivePremium } from '../../utils/subscriptionUtils';

const PMP_CERTIFICATION_ID = '550e8400-e29b-41d4-a716-446655440000';
const PRACTICE_PAGE_SIZE = 25;

export default function PracticeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute();
  const requireAuth = useRequireAuth();
  const {
    questions,
    isLoading,
    isLoadingMore,
    total,
    hasMore,
    offset,
    promptUpgrade,
    freeLimitPerKnowledgeArea,
    freeAccessibleTotal,
    freeFullTotal,
  } = useSelector((state: RootState) => state.questions);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const isPremium = userHasActivePremium(user);

  const routeParams = (route.params || {}) as {
    knowledgeAreaId?: string;
    domain?: string;
  };

  const [selectedQuestionFilter, setSelectedQuestionFilter] = useState<'all' | 'unanswered'>('all');
  const [selectedKnowledgeArea, setSelectedKnowledgeArea] = useState<string | null>(
    routeParams.knowledgeAreaId || null
  );
  const [selectedDomain, setSelectedDomain] = useState<string | null>(
    routeParams.domain || null
  );
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set());
  const loadingMoreRef = useRef(false);

  // Prefer route params so the first load is never unfiltered (avoids ~100 = 10×KAs).
  const activeKnowledgeArea =
    routeParams.knowledgeAreaId || selectedKnowledgeArea || null;
  const activeDomain = routeParams.domain || selectedDomain || null;

  useEffect(() => {
    if (routeParams.knowledgeAreaId) {
      setSelectedKnowledgeArea(routeParams.knowledgeAreaId);
    }
    if (routeParams.domain) {
      setSelectedDomain(routeParams.domain);
    }
  }, [routeParams.knowledgeAreaId, routeParams.domain]);

  const buildFilters = useCallback(
    (
      pageOffset: number,
      append: boolean,
      override?: { knowledgeAreaId?: string | null; domain?: string | null }
    ) => {
      const knowledgeAreaId =
        override && 'knowledgeAreaId' in override
          ? override.knowledgeAreaId
          : activeKnowledgeArea;
      const domain =
        override && 'domain' in override ? override.domain : activeDomain;

      const filters: any = {
        certificationId: PMP_CERTIFICATION_ID,
        // Free users only get 10 per knowledge area — fetch that page in one go.
        limit: !isPremium && knowledgeAreaId ? 10 : PRACTICE_PAGE_SIZE,
        offset: pageOffset,
        append,
      };

      if (knowledgeAreaId) {
        filters.knowledgeAreaId = knowledgeAreaId;
      }
      if (domain) {
        filters.domain = domain;
      }

      return filters;
    },
    [activeKnowledgeArea, activeDomain, isPremium]
  );

  const loadAnsweredIds = useCallback(async () => {
    if (!isAuthenticated) {
      setAnsweredQuestionIds(new Set());
      return;
    }
    try {
      const answeredData = await progressService.getAnsweredQuestionIds(PMP_CERTIFICATION_ID);
      setAnsweredQuestionIds(new Set<string>(answeredData.questionIds || []));
    } catch (error) {
      console.error('Failed to fetch answered question IDs:', error);
    }
  }, [isAuthenticated]);

  const loadQuestions = useCallback(
    async (override?: { knowledgeAreaId?: string | null; domain?: string | null }) => {
      await dispatch(fetchQuestions(buildFilters(0, false, override)));
      await loadAnsweredIds();
    },
    [dispatch, buildFilters, loadAnsweredIds]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading || isLoadingMore || loadingMoreRef.current) {
      return;
    }
    loadingMoreRef.current = true;
    try {
      await dispatch(fetchQuestions(buildFilters(offset, true)));
    } finally {
      loadingMoreRef.current = false;
    }
  }, [dispatch, buildFilters, hasMore, isLoading, isLoadingMore, offset]);

  const filteredQuestions = React.useMemo(() => {
    if (selectedQuestionFilter !== 'unanswered') {
      return questions;
    }
    return questions.filter((q: any) => {
      const questionId = q.id || q.question_id;
      return !answeredQuestionIds.has(questionId);
    });
  }, [questions, selectedQuestionFilter, answeredQuestionIds]);

  useFocusEffect(
    React.useCallback(() => {
      // Read params synchronously and pass into the fetch — never wait on setState.
      const knowledgeAreaId = routeParams.knowledgeAreaId || null;
      const domain = routeParams.domain || null;

      // Domain practice is premium-only.
      if (domain && !isPremium) {
        (navigation as any).replace('Paywall', { feature: 'domain_practice' });
        return;
      }

      if (knowledgeAreaId) {
        setSelectedKnowledgeArea(knowledgeAreaId);
      }
      if (domain) {
        setSelectedDomain(domain);
      }
      dispatch(clearQuestions());
      loadQuestions({ knowledgeAreaId, domain });
      dailyActivityService.startSession();
      return () => {
        dailyActivityService.endSession();
      };
    }, [
      dispatch,
      navigation,
      isPremium,
      routeParams.knowledgeAreaId,
      routeParams.domain,
      loadQuestions,
    ])
  );

  const handleQuestionPress = (questionId: string) => {
    (navigation as any).navigate('QuestionDetail', { questionId });
  };

  const toggleQuestionFilter = (filter: 'all' | 'unanswered') => {
    if (filter === 'unanswered' && !requireAuth('progress')) {
      return;
    }
    setSelectedQuestionFilter(filter);
  };

  const hasActiveFilters =
    selectedQuestionFilter !== 'all' || !!activeKnowledgeArea || !!activeDomain;

  // Free KA: always prefer API freeAccess (accessibleTotal/fullTotal). Never use the
  // free limit (10) as the denominator — that produced "100 of 10" / "10 of 10".
  const accessibleCount = !isPremium
    ? freeAccessibleTotal ??
      (activeKnowledgeArea
        ? Math.min(filteredQuestions.length || total || 0, freeLimitPerKnowledgeArea || 10)
        : filteredQuestions.length || total || 0)
    : selectedQuestionFilter === 'unanswered'
      ? filteredQuestions.length
      : total || filteredQuestions.length;
  const fullCount = !isPremium ? freeFullTotal : null;

  const subtitleText = (() => {
    if (isLoading && filteredQuestions.length === 0) {
      return 'Loading questions…';
    }
    if (selectedQuestionFilter === 'unanswered') {
      return `${filteredQuestions.length} unanswered`;
    }
    if (!isPremium && fullCount != null) {
      return `${accessibleCount}/${fullCount} questions available`;
    }
    if (!isPremium && activeKnowledgeArea) {
      return `${accessibleCount} free questions available`;
    }
    return `${accessibleCount} questions available`;
  })();

  // Show upgrade whenever free KA list is fully loaded (not only after answering).
  const showUpgradePrompt =
    !isPremium &&
    !!activeKnowledgeArea &&
    !isLoading &&
    filteredQuestions.length > 0 &&
    (promptUpgrade || !hasMore || (fullCount != null && accessibleCount < fullCount));

  const renderQuestion = ({ item }: any) => {
    const knowledgeArea = item.knowledgeAreaName || item.knowledge_area_name;
    const displayKnowledgeArea = knowledgeArea ? removeProjectPrefix(knowledgeArea) : null;
    const questionId = item.id || item.question_id;
    const isAnswered = answeredQuestionIds.has(questionId);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleQuestionPress(item.id)}
      >
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.questionHeader}>
              {isAnswered && (
                <CategoryBadge
                  label="Answered"
                  color={colors.success}
                  variant="pill"
                />
              )}
              {displayKnowledgeArea && (
                <CategoryBadge
                  label={displayKnowledgeArea}
                  variant="outlined"
                />
              )}
            </View>
            <Text variant="bodyLarge" numberOfLines={3} style={styles.questionText}>
              {item.questionText || item.question_text || 'No question text'}
            </Text>
            <View style={styles.questionFooter}>
              <View style={styles.footerItem}>
                <Icon name="format-list-bulleted" size={16} color={colors.textSecondary} />
                <Text variant="bodySmall" style={styles.footerText}>
                  {item.answers?.length || 0} options
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

  if (isLoading && filteredQuestions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LoadingSpinner label="Loading questions..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <SectionHeader
          title="Practice Questions"
          subtitle={subtitleText}
          icon="book-open-variant"
        />
      </View>

      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
          style={styles.filterScrollView}
        >
          <CategoryBadge
            label="All"
            onPress={() => toggleQuestionFilter('all')}
            selected={selectedQuestionFilter === 'all'}
            variant="pill"
          />
          <CategoryBadge
            label="Unanswered"
            onPress={() => toggleQuestionFilter('unanswered')}
            selected={selectedQuestionFilter === 'unanswered'}
            variant="pill"
          />
          {hasActiveFilters && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSelectedQuestionFilter('all');
                setSelectedKnowledgeArea(null);
                setSelectedDomain(null);
                (navigation as any).setParams?.({
                  knowledgeAreaId: undefined,
                  domain: undefined,
                });
              }}
            >
              <Icon name="close-circle" size={20} color={colors.textSecondary} />
              <Text variant="bodySmall" style={styles.clearButtonText}>
                Clear
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      <FlatList
        data={filteredQuestions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          filteredQuestions.length === 0 && styles.emptyList,
          showUpgradePrompt && styles.listWithUpgrade,
        ]}
        refreshing={isLoading && !isLoadingMore}
        onRefresh={loadQuestions}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {isLoadingMore ? (
              <View style={styles.footerLoader}>
                <LoadingSpinner size="small" />
              </View>
            ) : null}
            {showUpgradePrompt ? (
              <Card style={styles.upgradeCard}>
                <Card.Content style={styles.upgradeContent}>
                  <Icon name="crown" size={28} color={colors.primary} />
                  <Text variant="titleMedium" style={styles.upgradeTitle}>
                    Want more questions?
                  </Text>
                  <Text variant="bodyMedium" style={styles.upgradeBody}>
                    You’re viewing {accessibleCount} of {fullCount ?? 'many'}{' '}
                    questions
                    {freeLimitPerKnowledgeArea
                      ? ` (free limit: ${freeLimitPerKnowledgeArea} per knowledge area)`
                      : ''}
                    . Upgrade to Premium to unlock the rest.
                  </Text>
                  <TouchableOpacity
                    style={styles.upgradeButton}
                    onPress={() =>
                      (navigation as any).navigate('Paywall', {
                        feature: 'unlimited_questions',
                      })
                    }
                    activeOpacity={0.85}
                  >
                    <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
                  </TouchableOpacity>
                </Card.Content>
              </Card>
            ) : null}
          </>
        }
        ListEmptyComponent={
          <EmptyState
            icon="book-outline"
            title="No questions found"
            message="Try adjusting your filters to see more questions"
            actionLabel="Clear Filters"
            onActionPress={() => {
              setSelectedQuestionFilter('all');
              setSelectedKnowledgeArea(null);
              setSelectedDomain(null);
              (navigation as any).setParams?.({
                knowledgeAreaId: undefined,
                domain: undefined,
              });
            }}
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
  listWithUpgrade: {
    paddingBottom: spacing.xl,
  },
  upgradeCard: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}08`,
    ...shadows.sm,
  },
  upgradeContent: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  upgradeTitle: {
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  upgradeBody: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  upgradeButton: {
    marginTop: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
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
  headerContainer: {
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.gray100,
  },
  clearButtonText: {
    marginLeft: spacing.xs,
    color: colors.textSecondary,
  },
  list: {
    padding: spacing.base,
  },
  emptyList: {
    flexGrow: 1,
  },
  footerLoader: {
    paddingVertical: spacing.base,
    alignItems: 'center',
  },
  card: {
    marginBottom: spacing.base,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  cardContent: {
    padding: spacing.base,
  },
  questionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
    alignItems: 'center',
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
