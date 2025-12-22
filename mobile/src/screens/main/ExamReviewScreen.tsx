import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card, Text, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { examService } from '../../services/api/examService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActionButton, CategoryBadge, SectionHeader } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

export default function ExamReviewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { examId } = route.params as { examId: string };
  
  const [examData, setExamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadExamReview();
  }, []);

  const loadExamReview = async () => {
    try {
      const data = await examService.getExamReview(examId);
      setExamData(data);
    } catch (error: any) {
      console.error('Failed to load exam review:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading exam review...</Text>
      </SafeAreaView>
    );
  }

  if (!examData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color={colors.error} />
          <Text variant="titleLarge" style={styles.errorText}>
            Failed to load exam review
          </Text>
          <ActionButton
            label="Go Back"
            onPress={() => navigation.goBack()}
            variant="primary"
            size="medium"
          />
        </View>
      </SafeAreaView>
    );
  }

  const { exam, answers } = examData;
  const score = typeof exam?.score === 'number' && !isNaN(exam.score) 
    ? exam.score 
    : (typeof exam?.score === 'string' ? parseFloat(exam.score) || 0 : 0);
  const correctCount = exam?.correct_answers || 0;
  const totalQuestions = exam?.total_questions || 0;
  const incorrectCount = totalQuestions - correctCount;
  const passThreshold = 61; // PMP passing score
  const hasPassed = score >= passThreshold;

  // Calculate performance by knowledge area
  const knowledgeAreaStats: { [key: string]: { correct: number; total: number } } = {};
  answers?.forEach((item: any) => {
    const area = item.knowledgeAreaName || item.knowledge_area_name || 'Other';
    if (!knowledgeAreaStats[area]) {
      knowledgeAreaStats[area] = { correct: 0, total: 0 };
    }
    knowledgeAreaStats[area].total++;
    if (item.isCorrect || item.is_correct) {
      knowledgeAreaStats[area].correct++;
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Score Section */}
        <LinearGradient
          colors={hasPassed ? [colors.success, colors.successLight] : [colors.error, colors.errorLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.scoreHero}
        >
          <View style={styles.scoreContent}>
            <View style={styles.scoreIconContainer}>
              <Icon
                name={hasPassed ? 'trophy' : 'alert-circle'}
                size={48}
                color="#ffffff"
              />
            </View>
            <Text variant="displaySmall" style={styles.scoreText}>
              {score.toFixed(1)}%
            </Text>
            <Text variant="titleLarge" style={styles.scoreLabel}>
              {hasPassed ? 'Congratulations! You Passed!' : 'Keep Practicing'}
            </Text>
            <Text variant="bodyLarge" style={styles.scoreSubtext}>
              {correctCount} out of {totalQuestions} questions correct
            </Text>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <Card style={[styles.statCard, { borderLeftColor: colors.success }]}>
            <Card.Content style={styles.statCardContent}>
              <View style={[styles.statIconCircle, { backgroundColor: `${colors.success}15` }]}>
                <Icon name="check-circle" size={24} color={colors.success} />
              </View>
              <View style={styles.statTextContainer}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {correctCount}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Correct
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { borderLeftColor: colors.error }]}>
            <Card.Content style={styles.statCardContent}>
              <View style={[styles.statIconCircle, { backgroundColor: `${colors.error}15` }]}>
                <Icon name="close-circle" size={24} color={colors.error} />
              </View>
              <View style={styles.statTextContainer}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {incorrectCount}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Incorrect
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { borderLeftColor: colors.primary }]}>
            <Card.Content style={styles.statCardContent}>
              <View style={[styles.statIconCircle, { backgroundColor: `${colors.primary}15` }]}>
                <Icon name="help-circle" size={24} color={colors.primary} />
              </View>
              <View style={styles.statTextContainer}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {totalQuestions}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Total
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Performance by Knowledge Area */}
        {Object.keys(knowledgeAreaStats).length > 0 && (
          <>
            <SectionHeader
              title="Performance by Knowledge Area"
              icon="chart-box"
            />
            <View style={styles.knowledgeAreaContainer}>
              {Object.entries(knowledgeAreaStats).map(([area, stats]) => {
                const areaAccuracy = (stats.correct / stats.total) * 100;
                return (
                  <Card key={area} style={styles.areaCard}>
                    <Card.Content style={styles.areaContent}>
                      <View style={styles.areaHeader}>
                        <Text variant="titleMedium" style={styles.areaName}>
                          {area}
                        </Text>
                        <Text variant="headlineSmall" style={[
                          styles.areaScore,
                          { color: areaAccuracy >= 70 ? colors.success : areaAccuracy >= 50 ? colors.warning : colors.error }
                        ]}>
                          {areaAccuracy.toFixed(0)}%
                        </Text>
                      </View>
                      <ProgressBar
                        progress={areaAccuracy / 100}
                        color={areaAccuracy >= 70 ? colors.success : areaAccuracy >= 50 ? colors.warning : colors.error}
                        style={styles.areaProgressBar}
                      />
                      <Text variant="bodySmall" style={styles.areaDetails}>
                        {stats.correct} / {stats.total} correct
                      </Text>
                    </Card.Content>
                  </Card>
                );
              })}
            </View>
          </>
        )}

        {/* Answer Review Section */}
        <SectionHeader
          title="Review Answers"
          subtitle={`${answers?.length || 0} questions`}
          icon="file-document-edit"
        />

        {answers?.map((item: any, index: number) => {
          const isCorrect = item.isCorrect || item.is_correct;
          const isExpanded = expandedQuestions.has(index);
          const knowledgeArea = item.knowledgeAreaName || item.knowledge_area_name;
          const difficulty = item.difficulty || 'medium';

          return (
            <Card
              key={item.id || index}
              style={[
                styles.answerCard,
                isCorrect ? styles.answerCardCorrect : styles.answerCardIncorrect,
              ]}
            >
              <TouchableOpacity
                onPress={() => toggleQuestion(index)}
                activeOpacity={0.7}
              >
                <Card.Content style={styles.answerCardHeader}>
                  <View style={styles.questionNumberContainer}>
                    <View style={[
                      styles.questionNumber,
                      isCorrect ? styles.questionNumberCorrect : styles.questionNumberIncorrect,
                    ]}>
                      <Text style={styles.questionNumberText}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={styles.questionHeaderText}>
                      <Text variant="titleMedium" style={styles.questionTitle}>
                        Question {index + 1}
                      </Text>
                      <View style={styles.questionBadges}>
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
                    </View>
                  </View>
                  <View style={[
                    styles.resultBadge,
                    isCorrect ? styles.resultBadgeCorrect : styles.resultBadgeIncorrect,
                  ]}>
                    <Icon
                      name={isCorrect ? 'check-circle' : 'close-circle'}
                      size={24}
                      color="#ffffff"
                    />
                    <Text style={styles.resultBadgeText}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </Text>
                  </View>
                </Card.Content>
              </TouchableOpacity>

              {isExpanded && (
                <Card.Content style={styles.answerCardExpanded}>
                  <View style={styles.questionTextContainer}>
                    <Text variant="bodyLarge" style={styles.questionText}>
                      {item.questionText || item.question_text || 'No question text'}
                    </Text>
                  </View>

                  <View style={[
                    styles.answerSection,
                    !isCorrect && styles.answerSectionIncorrect,
                  ]}>
                    <View style={styles.answerSectionHeader}>
                      <Icon
                        name="account-circle"
                        size={20}
                        color={isCorrect ? colors.success : colors.error}
                      />
                      <Text variant="titleSmall" style={styles.answerSectionLabel}>
                        Your Answer:
                      </Text>
                    </View>
                    <Text variant="bodyMedium" style={[
                      styles.answerText,
                      !isCorrect && styles.answerTextIncorrect,
                    ]}>
                      {item.answerText || item.answer_text || 'No answer'}
                    </Text>
                  </View>

                  {item.explanation && (
                    <View style={styles.explanationSection}>
                      <View style={styles.explanationHeader}>
                        <Icon name="lightbulb" size={20} color={colors.info} />
                        <Text variant="titleSmall" style={styles.explanationLabel}>
                          Explanation:
                        </Text>
                      </View>
                      <Text variant="bodyMedium" style={styles.explanationText}>
                        {item.explanation}
                      </Text>
                    </View>
                  )}
                </Card.Content>
              )}
            </Card>
          );
        })}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <ActionButton
            label="Back to Exams"
            onPress={() => navigation.navigate('ExamList' as never)}
            icon="arrow-left"
            variant="outlined"
            size="large"
            fullWidth
          />
          <ActionButton
            label="Take Another Exam"
            onPress={() => navigation.navigate('ExamList' as never)}
            icon="refresh"
            variant="primary"
            size="large"
            fullWidth
          />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  scoreHero: {
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  scoreContent: {
    alignItems: 'center',
  },
  scoreIconContainer: {
    marginBottom: spacing.base,
  },
  scoreText: {
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: spacing.sm,
  },
  scoreLabel: {
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  scoreSubtext: {
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.lg,
    gap: spacing.base,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    ...shadows.sm,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },
  statIconCircle: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: colors.textSecondary,
  },
  knowledgeAreaContainer: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.lg,
    gap: spacing.base,
  },
  areaCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    marginBottom: spacing.base,
  },
  areaContent: {
    padding: spacing.base,
  },
  areaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  areaName: {
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  areaScore: {
    fontWeight: '700',
  },
  areaProgressBar: {
    height: 8,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  areaDetails: {
    color: colors.textSecondary,
  },
  answerCard: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  answerCardCorrect: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  answerCardIncorrect: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  answerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
  },
  questionNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  questionNumber: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  questionNumberCorrect: {
    backgroundColor: `${colors.success}15`,
  },
  questionNumberIncorrect: {
    backgroundColor: `${colors.error}15`,
  },
  questionNumberText: {
    fontWeight: '700',
    fontSize: 16,
    color: colors.textPrimary,
  },
  questionHeaderText: {
    flex: 1,
  },
  questionTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  questionBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    gap: spacing.xs,
  },
  resultBadgeCorrect: {
    backgroundColor: colors.success,
  },
  resultBadgeIncorrect: {
    backgroundColor: colors.error,
  },
  resultBadgeText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  answerCardExpanded: {
    paddingTop: 0,
    padding: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  questionTextContainer: {
    marginBottom: spacing.base,
    padding: spacing.base,
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.md,
  },
  questionText: {
    color: colors.textPrimary,
    lineHeight: 24,
  },
  answerSection: {
    marginBottom: spacing.base,
    padding: spacing.base,
    backgroundColor: `${colors.success}10`,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  answerSectionIncorrect: {
    backgroundColor: `${colors.error}10`,
    borderLeftColor: colors.error,
  },
  answerSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  answerSectionLabel: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  answerText: {
    color: colors.textPrimary,
    lineHeight: 22,
  },
  answerTextIncorrect: {
    color: colors.error,
  },
  explanationSection: {
    padding: spacing.base,
    backgroundColor: `${colors.info}10`,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  explanationLabel: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  explanationText: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    padding: spacing.base,
    gap: spacing.base,
    marginTop: spacing.base,
  },
});
