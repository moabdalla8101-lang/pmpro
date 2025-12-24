import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchMarkedFlashcards } from '../../store/slices/flashcardSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SectionHeader } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';
import { LinearGradient } from 'expo-linear-gradient';

const PMP_CERTIFICATION_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function LearnScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { markedFlashcards } = useSelector((state: RootState) => state.flashcards);

  const [flashcardStats, setFlashcardStats] = useState({
    totalStudied: 0,
    formulasMastered: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadLearnData();
    }, [dispatch])
  );

  useEffect(() => {
    loadLearnData();
  }, [dispatch]);

  const loadLearnData = async () => {
    setIsLoading(true);
    dispatch(fetchMarkedFlashcards() as any);
    // TODO: Fetch flashcard progress stats when API is available
    // For now, use marked flashcards count as a proxy
    setFlashcardStats({
      totalStudied: markedFlashcards?.length || 0,
      formulasMastered: 0, // Placeholder for future implementation
    });
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
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
        {/* Hero Banner - Learning Stats */}
        <Card style={styles.heroCard}>
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <Card.Content style={styles.heroContent}>
              <View style={styles.heroHeader}>
                <Icon name="school" size={32} color="#FFFFFF" style={styles.heroIcon} />
                <Text variant="titleLarge" style={styles.heroTitle}>
                  Keep Learning
                </Text>
              </View>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={styles.statValue}>
                    {flashcardStats.totalStudied}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Flashcards Studied
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={styles.statValue}>
                    {flashcardStats.formulasMastered}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Formulas Mastered
                  </Text>
                </View>
              </View>
            </Card.Content>
          </LinearGradient>
        </Card>

        {/* Study Materials Section */}
        <SectionHeader
          title="Study Materials"
          subtitle="Enhance your PMP knowledge"
          icon="book-open-variant"
        />

        <View style={styles.quickActionsGrid}>
          {/* Flashcards Card */}
          <View style={styles.quickActionCard}>
            <Card
              style={[styles.actionCard, { backgroundColor: `${colors.primary}10` }]}
              onPress={() => {
                (navigation as any).navigate('Learn', { screen: 'FlashcardFilter' });
              }}
            >
              <Card.Content style={styles.actionCardContent}>
                <View style={[styles.actionIconCircle, { backgroundColor: colors.primary }]}>
                  <Icon name="cards" size={28} color="#ffffff" />
                </View>
                <Text variant="titleMedium" style={styles.actionTitle}>
                  Flashcards
                </Text>
                <Text variant="bodySmall" style={styles.actionSubtitle}>
                  Study terms & concepts
                </Text>
              </Card.Content>
            </Card>
          </View>

          {/* Bookmarked Flashcards Card */}
          {markedFlashcards && markedFlashcards.length > 0 && (
            <View style={styles.quickActionCard}>
              <Card
                style={[styles.actionCard, { backgroundColor: `${colors.warning}10` }]}
                onPress={() => {
                  (navigation as any).navigate('Learn', { screen: 'MarkedFlashcards' });
                }}
              >
                <Card.Content style={styles.actionCardContent}>
                  <View style={[styles.actionIconCircle, { backgroundColor: colors.warning }]}>
                    <Icon name="bookmark" size={28} color="#ffffff" />
                  </View>
                  <Text variant="titleMedium" style={styles.actionTitle}>
                    Bookmarked
                  </Text>
                  <Text variant="bodySmall" style={styles.actionSubtitle}>
                    {markedFlashcards.length} cards
                  </Text>
                </Card.Content>
              </Card>
            </View>
          )}

          {/* Formulas Card */}
          <View style={styles.quickActionCard}>
            <Card
              style={[styles.actionCard, { backgroundColor: `${colors.secondary}10` }]}
              onPress={() => {
                (navigation as any).navigate('Learn', { screen: 'Formulas' });
              }}
            >
              <Card.Content style={styles.actionCardContent}>
                <View style={[styles.actionIconCircle, { backgroundColor: colors.secondary }]}>
                  <Icon name="calculator-variant" size={28} color="#ffffff" />
                </View>
                <Text variant="titleMedium" style={styles.actionTitle}>
                  Formulas
                </Text>
                <Text variant="bodySmall" style={styles.actionSubtitle}>
                  PMP formulas & equations
                </Text>
              </Card.Content>
            </Card>
          </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  heroCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  heroGradient: {
    borderRadius: borderRadius.lg,
  },
  heroContent: {
    padding: spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  heroIcon: {
    marginRight: spacing.sm,
  },
  heroTitle: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: spacing.base,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.base,
    marginBottom: spacing.lg,
  },
  quickActionCard: {
    width: '47%',
    maxWidth: '47%',
  },
  actionCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    width: '100%',
  },
  actionCardContent: {
    alignItems: 'center',
    padding: spacing.base,
  },
  actionIconCircle: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  actionSubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

