import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, Chip, Menu, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../../store/slices/questionSlice';
import { RootState, AppDispatch } from '../../store';
import { useNavigation } from '@react-navigation/native';

const PMP_CERTIFICATION_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function PracticeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { questions, isLoading } = useSelector((state: RootState) => state.questions);
  
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedKnowledgeArea, setSelectedKnowledgeArea] = useState<string | null>(null);

  useEffect(() => {
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

    dispatch(fetchQuestions(filters));
  };

  const handleQuestionPress = (questionId: string) => {
    navigation.navigate('QuestionDetail' as never, { questionId } as never);
  };

  const renderQuestion = ({ item }: any) => (
    <Card style={styles.card} onPress={() => handleQuestionPress(item.id)}>
      <Card.Content>
        <View style={styles.questionHeader}>
          <Chip mode="outlined" style={styles.chip}>
            {item.difficulty}
          </Chip>
          {item.knowledge_area_name && (
            <Chip mode="outlined" style={styles.chip}>
              {item.knowledge_area_name}
            </Chip>
          )}
        </View>
        <Text variant="bodyMedium" numberOfLines={3} style={styles.questionText}>
          {item.question_text}
        </Text>
        <Text variant="bodySmall" style={styles.answerCount}>
          {item.answers?.length || 0} answer options
        </Text>
      </Card.Content>
    </Card>
  );

  if (isLoading && questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setFilterMenuVisible(true)}
              icon="filter"
              style={styles.filterButton}
            >
              Filters
            </Button>
          }
        >
          <Menu.Item
            onPress={() => {
              setSelectedDifficulty(null);
              setFilterMenuVisible(false);
            }}
            title="All Difficulties"
          />
          <Menu.Item
            onPress={() => {
              setSelectedDifficulty('easy');
              setFilterMenuVisible(false);
            }}
            title="Easy"
          />
          <Menu.Item
            onPress={() => {
              setSelectedDifficulty('medium');
              setFilterMenuVisible(false);
            }}
            title="Medium"
          />
          <Menu.Item
            onPress={() => {
              setSelectedDifficulty('hard');
              setFilterMenuVisible(false);
            }}
            title="Hard"
          />
        </Menu>
        {(selectedDifficulty || selectedKnowledgeArea) && (
          <Button
            mode="text"
            onPress={() => {
              setSelectedDifficulty(null);
              setSelectedKnowledgeArea(null);
            }}
          >
            Clear Filters
          </Button>
        )}
      </View>

      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={loadQuestions}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge">No questions found</Text>
            <Text variant="bodySmall" style={styles.emptyText}>
              Try adjusting your filters
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  filters: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    marginRight: 10,
  },
  list: {
    padding: 15,
  },
  card: {
    marginBottom: 15,
  },
  questionHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chip: {
    marginRight: 10,
  },
  questionText: {
    marginBottom: 10,
  },
  answerCount: {
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
  },
});
