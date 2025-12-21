import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, RadioButton, ProgressBar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { examService } from '../../services/api/examService';
import { RootState, AppDispatch } from '../../store';
import { fetchQuestions } from '../../store/slices/questionSlice';

const TOTAL_QUESTIONS = 180;
const EXAM_DURATION_MINUTES = 230;

export default function ExamStartScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { questions } = useSelector((state: RootState) => state.questions);
  
  const [examId, setExamId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION_MINUTES * 60);
  const [isExamStarted, setIsExamStarted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ExamStartScreen.tsx:26',message:'Current question check',data:{hasCurrentQuestion:!!currentQuestion,questionsLength:questions.length,currentIndex:currentQuestionIndex,questionKeys:currentQuestion?Object.keys(currentQuestion):[]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1,H3,H4'})}).catch(()=>{});
  }, [currentQuestion, questions.length, currentQuestionIndex]);
  // #endregion
  const progress = (currentQuestionIndex + 1) / TOTAL_QUESTIONS;

  useEffect(() => {
    if (isExamStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isExamStarted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = async () => {
    try {
      const certificationId = '550e8400-e29b-41d4-a716-446655440000'; // PMP
      const response = await examService.startExam(certificationId, TOTAL_QUESTIONS);
      setExamId(response.examId);
      setIsExamStarted(true);

      // Fetch questions for the exam
      await dispatch(fetchQuestions({ certificationId, limit: TOTAL_QUESTIONS.toString() }) as any);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start exam');
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    if (currentQuestion) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion.id]: answerId,
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (!examId) return;

    Alert.alert(
      'Submit Exam',
      'Are you sure you want to submit? You cannot change answers after submission.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          style: 'destructive',
          onPress: async () => {
            try {
              const answers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
                questionId,
                answerId,
              }));

              const result = await examService.submitExam(examId, answers);
              navigation.navigate('ExamReview' as never, { examId } as never);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to submit exam');
            }
          },
        },
      ]
    );
  };

  if (!isExamStarted) {
    return (
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Mock PMP Exam
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              This is a full-length PMP exam simulation with {TOTAL_QUESTIONS} questions.
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Duration: {EXAM_DURATION_MINUTES} minutes
            </Text>
            <Text variant="bodySmall" style={styles.warning}>
              ⚠️ Make sure you have enough time and a quiet environment before starting.
            </Text>
            <Button
              mode="contained"
              onPress={handleStartExam}
              style={styles.startButton}
            >
              Start Exam
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text>Loading question...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium">Time Remaining: {formatTime(timeRemaining)}</Text>
        <Text variant="bodyMedium">
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>
      <ProgressBar progress={progress} color="#6200ee" style={styles.progressBar} />

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.questionText}>
              {currentQuestion.questionText || currentQuestion.question_text || ''}
            </Text>

            <RadioButton.Group
              onValueChange={handleAnswerSelect}
              value={selectedAnswers[currentQuestion.id] || ''}
            >
              {currentQuestion.answers?.map((answer: any) => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/375d5935-5725-4cd0-9cf3-045adae340c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ExamStartScreen.tsx:175',message:'Answer field check',data:{hasAnswerText:!!answer.answerText,hasAnswer_text:!!answer.answer_text,answerKeys:Object.keys(answer)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
                // #endregion
                return (
                  <View key={answer.id} style={styles.answerOption}>
                    <RadioButton value={answer.id} />
                    <Text style={styles.answerText}>{answer.answerText || answer.answer_text}</Text>
                  </View>
                );
              })}
            </RadioButton.Group>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button
          mode="contained"
          onPress={currentQuestionIndex === questions.length - 1 ? handleSubmitExam : handleNext}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Submit Exam' : 'Next'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 15,
  },
  title: {
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    marginBottom: 10,
    textAlign: 'center',
  },
  warning: {
    marginTop: 20,
    marginBottom: 20,
    color: '#f44336',
    textAlign: 'center',
  },
  startButton: {
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressBar: {
    height: 4,
  },
  content: {
    flex: 1,
  },
  questionText: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  answerText: {
    flex: 1,
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
