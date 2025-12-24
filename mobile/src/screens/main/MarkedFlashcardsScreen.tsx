import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchMarkedFlashcards } from '../../store/slices/flashcardSlice';
import { ActionButton, EmptyState, SectionHeader } from '../../components';
import { colors } from '../../theme';
import { spacing } from '../../utils/styles';

export default function MarkedFlashcardsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { markedFlashcards, isLoading } = useSelector((state: RootState) => state.flashcards);

  useEffect(() => {
    dispatch(fetchMarkedFlashcards(true) as any); // Random order
  }, [dispatch]);

  const handleStartReview = () => {
    dispatch(fetchMarkedFlashcardsForStudy(true) as any);
    navigation.navigate('FlashcardStudy' as never, {
      knowledgeAreaIds: undefined,
      markedOnly: true,
    } as never);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading marked flashcards...</Text>
      </SafeAreaView>
    );
  }

  if (markedFlashcards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <SectionHeader
          title="Marked Flashcards"
          subtitle="Review your saved flashcards"
          icon="bookmark"
        />
        <EmptyState
          icon="bookmark-outline"
          title="No marked flashcards"
          message="Mark flashcards while studying to review them here later"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader
        title="Marked Flashcards"
        subtitle={`${markedFlashcards.length} flashcards to review`}
        icon="bookmark"
      />
      <View style={styles.content}>
        <ActionButton
          label={`Review ${markedFlashcards.length} Marked Cards`}
          onPress={handleStartReview}
          icon="play"
          variant="primary"
          size="large"
          fullWidth
        />
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
  content: {
    padding: spacing.base,
  },
});

