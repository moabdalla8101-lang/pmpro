import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../../store/slices/questionSlice';
import { RootState, AppDispatch } from '../../store';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CategoryBadge, SectionHeader, EmptyState } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

const PMP_CERTIFICATION_ID = '550e8400-e29b-41d4-a716-446655440000';

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function PracticeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { questions, isLoading } = useSelector((state: RootState) => state.questions);
  
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedKnowledgeArea, setSelectedKnowledgeArea] = useState<string | null>(null);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PracticeScreen.tsx:20',message:'PracticeScreen useEffect triggered',data:{selectedDifficulty,selectedKnowledgeArea},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    loadQuestions();
  }, [selectedDifficulty, selectedKnowledgeArea]);

  const loadQuestions = () => {
    const filters: any = {
      certificationId: PMP_CERTIFICATION_ID,
    };
    
    if (selectedDifficulty) {
      filters.difficulty = selectedDifficulty;
    }
    
    if (selectedKnowledgeArea) {
      filters.knowledgeAreaId = selectedKnowledgeArea;
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PracticeScreen.tsx:37',message:'Dispatching fetchQuestions',data:{filters},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1,H3'})}).catch(()=>{});
    // #endregion
    dispatch(fetchQuestions(filters));
  };

  const handleQuestionPress = (questionId: string) => {
    navigation.navigate('QuestionDetail' as never, { questionId } as never);
  };

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty);
  };

  const hasActiveFilters = selectedDifficulty || selectedKnowledgeArea;

  const renderQuestion = ({ item }: any) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PracticeScreen.tsx:44',message:'Rendering question item',data:{itemId:item.id,hasQuestionText:!!item.questionText,hasQuestion_text:!!item.question_text,hasAnswers:!!item.answers,answersLength:item.answers?.length||0,itemKeys:Object.keys(item)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1,H4'})}).catch(()=>{});
    // #endregion
    const knowledgeArea = item.knowledgeAreaName || item.knowledge_area_name;
    const difficulty = item.difficulty || 'medium';
    
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleQuestionPress(item.id)}
      >
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.questionHeader}>
              <CategoryBadge
                label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                color={difficulty === 'easy' ? colors.success : difficulty === 'medium' ? colors.warning : colors.error}
                variant="pill"
              />
              {knowledgeArea && (
                <CategoryBadge
                  label={knowledgeArea}
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

  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PracticeScreen.tsx:67',message:'PracticeScreen render state',data:{isLoading,questionsLength:questions.length,questionsCount:questions?.length||0,firstQuestionId:questions[0]?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3,H5'})}).catch(()=>{});
  }, [isLoading, questions.length]);
  // #endregion

  if (isLoading && questions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SectionHeader
          title="Practice Questions"
          subtitle={`${questions.length} questions available`}
          icon="book-open-variant"
        />
      </View>
      
      {/* Filter Section */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
        style={styles.filterScrollView}
      >
        <CategoryBadge
          label="All"
          onPress={() => {
            setSelectedDifficulty(null);
            setSelectedKnowledgeArea(null);
          }}
          selected={!hasActiveFilters}
          variant="pill"
        />
        {DIFFICULTIES.map((difficulty) => (
          <CategoryBadge
            key={difficulty}
            label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            onPress={() => toggleDifficulty(difficulty)}
            selected={selectedDifficulty === difficulty}
            color={
              difficulty === 'easy' ? colors.success :
              difficulty === 'medium' ? colors.warning :
              colors.error
            }
            variant="pill"
          />
        ))}
        {hasActiveFilters && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSelectedDifficulty(null);
              setSelectedKnowledgeArea(null);
            }}
          >
            <Icon name="close-circle" size={20} color={colors.textSecondary} />
            <Text variant="bodySmall" style={styles.clearButtonText}>
              Clear
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          questions.length === 0 && styles.emptyList,
        ]}
        refreshing={isLoading}
        onRefresh={loadQuestions}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="book-outline"
            title="No questions found"
            message="Try adjusting your filters to see more questions"
            actionLabel="Clear Filters"
            onActionPress={() => {
              setSelectedDifficulty(null);
              setSelectedKnowledgeArea(null);
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
  header: {
    backgroundColor: '#ffffff',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    ...shadows.sm,
  },
  filterScrollView: {
    maxHeight: 60,
  },
  filterContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
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
