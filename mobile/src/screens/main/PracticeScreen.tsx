import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions } from '../../store/slices/questionSlice';
import { RootState, AppDispatch } from '../../store';
import { useNavigation } from '@react-navigation/native';

export default function PracticeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { questions, isLoading } = useSelector((state: RootState) => state.questions);

  useEffect(() => {
    // TODO: Get certification ID from user preferences or default to PMP
    const certificationId = '550e8400-e29b-41d4-a716-446655440000';
    dispatch(fetchQuestions({ certificationId }));
  }, [dispatch]);

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
        </View>
        <Text variant="bodyMedium" numberOfLines={3} style={styles.questionText}>
          {item.question_text}
        </Text>
        <Text variant="bodySmall" style={styles.answerCount}>
          {item.answers?.length || 0} answers
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={() => {
          const certificationId = '550e8400-e29b-41d4-a716-446655440000';
          dispatch(fetchQuestions({ certificationId }));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
});


