import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { useNavigation } from '@react-navigation/native';
import { fetchBookmarks, removeBookmark } from '../../store/slices/bookmarkSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CategoryBadge, SectionHeader, EmptyState } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

export default function BookmarkedQuestionsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { bookmarks, isLoading } = useSelector((state: RootState) => state.bookmarks);
  
  const [selectedKnowledgeArea, setSelectedKnowledgeArea] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchBookmarks(selectedKnowledgeArea || undefined) as any);
  }, [selectedKnowledgeArea, dispatch]);

  const handleQuestionPress = (questionId: string) => {
    navigation.navigate('QuestionDetail' as never, { questionId } as never);
  };

  const handleToggleBookmark = async (questionId: string) => {
    await dispatch(removeBookmark(questionId) as any);
    // Refresh bookmarks after removal
    dispatch(fetchBookmarks(selectedKnowledgeArea || undefined) as any);
  };

  // Get unique knowledge areas from bookmarks
  const knowledgeAreas = Array.from(
    new Set(
      bookmarks
        .map((b) => b.question?.knowledgeAreaName || b.question?.knowledge_area_name)
        .filter(Boolean)
    )
  );

  const filteredBookmarks = selectedKnowledgeArea
    ? bookmarks.filter(
        (b) =>
          b.question?.knowledgeAreaId === selectedKnowledgeArea ||
          b.question?.knowledge_area_id === selectedKnowledgeArea
      )
    : bookmarks;

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
        <Card style={styles.card}>
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
              </View>
              <TouchableOpacity
                onPress={() => handleToggleBookmark(question.id)}
                style={styles.bookmarkButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon
                  name="bookmark"
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
            <Text variant="bodyLarge" numberOfLines={3} style={styles.questionText}>
              {question.questionText || question.question_text || 'No question text'}
            </Text>
            <View style={styles.questionFooter}>
              <View style={styles.footerItem}>
                <Icon name="format-list-bulleted" size={16} color={colors.textSecondary} />
                <Text variant="bodySmall" style={styles.footerText}>
                  {question.answers?.length || 0} options
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

  if (isLoading && bookmarks.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading bookmarks...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SectionHeader
          title="Bookmarked Questions"
          subtitle={`${filteredBookmarks.length} bookmarked`}
          icon="bookmark"
        />
      </View>

      {/* Filter Section */}
      {knowledgeAreas.length > 0 && (
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
              const bookmark = bookmarks.find(
                (b) =>
                  b.question?.knowledgeAreaName === area ||
                  b.question?.knowledge_area_name === area
              );
              const areaId =
                bookmark?.question?.knowledgeAreaId ||
                bookmark?.question?.knowledge_area_id;

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
        </View>
      )}

      <FlatList
        data={filteredBookmarks}
        renderItem={({ item }) => renderQuestion({ item })}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          filteredBookmarks.length === 0 && styles.emptyList,
        ]}
        refreshing={isLoading}
        onRefresh={() => dispatch(fetchBookmarks(selectedKnowledgeArea || undefined) as any)}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            title="No bookmarked questions"
            message={
              selectedKnowledgeArea
                ? 'No bookmarks in this knowledge area'
                : 'Start bookmarking questions to review them later'
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
  },
  bookmarkButton: {
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

