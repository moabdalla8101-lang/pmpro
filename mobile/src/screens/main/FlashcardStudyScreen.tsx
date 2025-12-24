import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchFlashcards,
  fetchMarkedFlashcardsForStudy,
  toggleMarkFlashcard,
  recordReview,
  nextCard,
  previousCard,
  setCurrentCardIndex,
} from '../../store/slices/flashcardSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActionButton } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FlashcardStudyScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { flashcards, currentCardIndex, isLoading } = useSelector(
    (state: RootState) => state.flashcards
  );

  const { knowledgeAreaIds, markedOnly } = (route.params as any) || {};
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));
  const [random] = useState(true); // Always random

  useEffect(() => {
    if (markedOnly) {
      dispatch(fetchMarkedFlashcardsForStudy(random) as any);
    } else {
      dispatch(fetchFlashcards({ knowledgeAreaIds, random }) as any);
    }
  }, [dispatch, knowledgeAreaIds, random, markedOnly]);

  const currentCard = flashcards[currentCardIndex];

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnimation, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  const handleKnow = async () => {
    if (currentCard) {
      await dispatch(recordReview({ flashcardId: currentCard.id, isCorrect: true }) as any);
      handleNext();
    }
  };

  const handleDontKnow = async () => {
    if (currentCard) {
      await dispatch(recordReview({ flashcardId: currentCard.id, isCorrect: false }) as any);
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      dispatch(nextCard());
      setIsFlipped(false);
      flipAnimation.setValue(0);
    } else {
      // End of flashcards
      navigation.goBack();
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      dispatch(previousCard());
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  const handleToggleMark = async () => {
    if (currentCard) {
      await dispatch(
        toggleMarkFlashcard({
          flashcardId: currentCard.id,
          isMarked: !currentCard.isMarked,
        }) as any
      );
    }
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 90],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [90, 180],
    outputRange: [0, 1],
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading flashcards...</Text>
      </SafeAreaView>
    );
  }

  if (flashcards.length === 0 && !isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon name="cards-outline" size={64} color={colors.textSecondary} />
          <Text variant="headlineSmall" style={styles.emptyText}>
            No flashcards found
          </Text>
          <Text variant="bodyMedium" style={styles.emptySubtext}>
            {knowledgeAreaIds && knowledgeAreaIds.length > 0
              ? 'No flashcards found for the selected knowledge areas.'
              : 'No flashcards available. Please import flashcards first.'}
          </Text>
          <ActionButton
            label="Go Back"
            onPress={() => navigation.goBack()}
            variant="outlined"
            size="medium"
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!currentCard && flashcards.length > 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>Loading card...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Icon name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text variant="titleMedium" style={styles.headerText}>
            {currentCardIndex + 1} of {flashcards.length}
          </Text>
          {currentCard.knowledgeArea && (
            <Text variant="bodySmall" style={styles.headerSubtext}>
              {currentCard.knowledgeArea}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={handleToggleMark} style={styles.headerButton}>
          <Icon
            name={currentCard.isMarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={currentCard.isMarked ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Card Container */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={flipCard}
          style={styles.cardTouchable}
        >
          {/* Front Face */}
          <Animated.View
            style={[
              styles.card,
              styles.cardFront,
              {
                opacity: frontOpacity,
                transform: [{ rotateY: frontInterpolate }],
              },
            ]}
          >
            <View style={styles.cardContent}>
              <Text variant="headlineMedium" style={styles.cardText}>
                {currentCard.frontFace}
              </Text>
              <View style={styles.tapHint}>
                <Icon name="gesture-tap" size={20} color={colors.textSecondary} />
                <Text variant="bodySmall" style={styles.tapHintText}>
                  Tap to flip
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Back Face */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              {
                opacity: backOpacity,
                transform: [{ rotateY: backInterpolate }],
              },
            ]}
          >
            <View style={styles.cardContent}>
              <Text variant="bodyLarge" style={[styles.cardText, styles.backCardText]}>
                {currentCard.backFace}
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Action Buttons (only show when flipped) */}
      {isFlipped && (
        <View style={styles.actionButtons}>
          <ActionButton
            label="I Know This"
            onPress={handleKnow}
            icon="check-circle"
            variant="primary"
            size="large"
            style={[styles.actionButton, styles.knowButton]}
          />
          <ActionButton
            label="I Don't Know"
            onPress={handleDontKnow}
            icon="close-circle"
            variant="outlined"
            size="large"
            style={[styles.actionButton, styles.dontKnowButton]}
          />
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentCardIndex === 0}
          style={[
            styles.navButton,
            currentCardIndex === 0 && styles.navButtonDisabled,
          ]}
        >
          <Icon
            name="chevron-left"
            size={24}
            color={currentCardIndex === 0 ? colors.gray400 : colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          disabled={currentCardIndex === flashcards.length - 1}
          style={[
            styles.navButton,
            currentCardIndex === flashcards.length - 1 && styles.navButtonDisabled,
          ]}
        >
          <Icon
            name="chevron-right"
            size={24}
            color={
              currentCardIndex === flashcards.length - 1 ? colors.gray400 : colors.primary
            }
          />
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
    backgroundColor: '#ffffff',
    ...shadows.sm,
  },
  headerButton: {
    padding: spacing.xs,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerSubtext: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.base,
  },
  cardTouchable: {
    width: SCREEN_WIDTH - spacing.base * 2,
    height: 400,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.xl,
    backgroundColor: '#ffffff',
    ...shadows.lg,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBack: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  cardContent: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cardText: {
    textAlign: 'center',
    color: colors.textPrimary,
    lineHeight: 32,
  },
  backCardText: {
    color: '#ffffff',
  },
  tapHint: {
    position: 'absolute',
    bottom: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tapHintText: {
    color: colors.textSecondary,
  },
  actionButtons: {
    padding: spacing.base,
    gap: spacing.base,
  },
  actionButton: {
    marginBottom: 0,
  },
  knowButton: {
    backgroundColor: colors.success,
  },
  dontKnowButton: {
    borderColor: colors.error,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.base,
    paddingBottom: spacing.lg,
  },
  navButton: {
    padding: spacing.base,
    borderRadius: borderRadius.round,
    backgroundColor: '#ffffff',
    ...shadows.sm,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.base,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptySubtext: {
    marginBottom: spacing.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.base,
  },
  backButton: {
    marginTop: spacing.base,
  },
});

