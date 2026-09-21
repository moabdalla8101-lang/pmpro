import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions, clearQuestions } from '../../store/slices/questionSlice';
import { RootState, AppDispatch } from '../../store';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { dailyActivityService } from '../../services/dailyActivityService';
import { progressService } from '../../services/api/progressService';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { CategoryBadge, SectionHeader, EmptyState } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';
import { removeProjectPrefix } from '../../utils/knowledgeAreaUtils';
import { useRequireAuth } from '../../utils/requireAuth';

const PMP_CERTIFICATION_ID = '550e8400-e29b-41d4-a716-446655440000';
const PRACTICE_PAGE_SIZE = 25;

export default function PracticeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute();
  const requireAuth = useRequireAuth();
  const { questions, isLoading, isLoadingMore, total, hasMore, offset } = useSelector(
    (state: RootState) => state.questions
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [selectedQuestionFilter, setSelectedQuestionFilter] = useState<'all' | 'unanswered'>('all');
  const [selectedKnowledgeArea, setSelectedKnowledgeArea] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set());
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    const params = route.params as any;
    if (params?.knowledgeAreaId) {
      setSelectedKnowledgeArea(params.knowledgeAreaId);
    }
    if (params?.domain) {
      setSelectedDomain(params.domain);
    }
  }, [route.params]);

  const buildFilters = useCallback(
    (pageOffset: number, append: boolean) => {
      const params = route.params as any;
      const knowledgeAreaId = selectedKnowledgeArea || params?.knowledgeAreaId;
      const domain = selectedDomain || params?.domain;

      const filters: any = {
        certificationId: PMP_CERTIFICATION_ID,
        limit: PRACTICE_PAGE_SIZE,
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
    [route.params, selectedKnowledgeArea, selectedDomain]
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

  const loadQuestions = useCallback(async () => {
    dispatch(fetchQuestions(buildFilters(0, false)));
    await loadAnsweredIds();
  }, [dispatch, buildFilters, loadAnsweredIds]);

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
      dispatch(clearQuestions());
      const params = route.params as any;
      if (params?.knowledgeAreaId && !selectedKnowledgeArea) {
        setSelectedKnowledgeArea(params.knowledgeAreaId);
      }
      if (params?.domain && !selectedDomain) {
        setSelectedDomain(params.domain);
      }
      loadQuestions();
      dailyActivityService.startSession();
      return () => {
        dailyActivityService.endSession();
      };
    }, [dispatch, selectedKnowledgeArea, selectedDomain, route.params, loadQuestions])
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

  const hasActiveFilters = selectedQuestionFilter !== 'all' || selectedKnowledgeArea || selectedDomain;
  const subtitleCount = selectedQuestionFilter === 'unanswered'
    ? filteredQuestions.length
    : total || filteredQuestions.length;

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
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <SectionHeader
          title="Practice Questions"
          subtitle={`${subtitleCount} questions available`}
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
        ]}
        refreshing={isLoading && !isLoadingMore}
        onRefresh={loadQuestions}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
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
