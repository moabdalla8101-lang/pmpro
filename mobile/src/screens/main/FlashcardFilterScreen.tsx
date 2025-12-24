import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Text, ActivityIndicator, Checkbox } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { useNavigation } from '@react-navigation/native';
import { fetchKnowledgeAreas } from '../../store/slices/flashcardSlice';
import { ActionButton, SectionHeader } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';

export default function FlashcardFilterScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { knowledgeAreas, isLoading, error } = useSelector((state: RootState) => state.flashcards);
  
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchKnowledgeAreas() as any);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching knowledge areas:', error);
    }
    if (knowledgeAreas) {
      console.log('Knowledge areas loaded:', knowledgeAreas.length);
    }
  }, [error, knowledgeAreas]);

  const toggleKnowledgeArea = (area: string) => {
    setSelectedAreas((prev) => {
      if (prev.includes(area)) {
        return prev.filter((a) => a !== area);
      } else {
        return [...prev, area];
      }
    });
  };

  const handleStartStudy = () => {
    (navigation as any).navigate('FlashcardStudy', {
      knowledgeAreaIds: selectedAreas.length > 0 ? selectedAreas : undefined,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading knowledge areas...</Text>
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
        <SectionHeader
          title="Study Flashcards"
          subtitle="Select knowledge areas to study"
          icon="cards"
        />

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.infoText}>
              Select one or more knowledge areas to study. Leave all unchecked to study all flashcards.
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.knowledgeAreasContainer}>
          {knowledgeAreas && knowledgeAreas.length > 0 ? (
            knowledgeAreas.map((area) => (
              <Card
                key={area}
                style={[
                  styles.areaCard,
                  selectedAreas.includes(area) && styles.areaCardSelected,
                ]}
                onPress={() => toggleKnowledgeArea(area)}
              >
                <Card.Content style={styles.areaCardContent}>
                  <Checkbox
                    status={selectedAreas.includes(area) ? 'checked' : 'unchecked'}
                    onPress={() => toggleKnowledgeArea(area)}
                    color={colors.primary}
                  />
                  <Text
                    variant="titleMedium"
                    style={[
                      styles.areaText,
                      selectedAreas.includes(area) && styles.areaTextSelected,
                    ]}
                  >
                    {area}
                  </Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Card style={styles.infoCard}>
              <Card.Content>
                <Text variant="bodyMedium" style={styles.infoText}>
                  No knowledge areas found. Please make sure flashcards are imported into the database.
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>

        <ActionButton
          label={selectedAreas.length > 0 ? `Start Study (${selectedAreas.length} areas)` : 'Start Study (All Areas)'}
          onPress={handleStartStudy}
          icon="play"
          variant="primary"
          size="large"
          fullWidth
          style={styles.startButton}
        />
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  infoCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  infoText: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  knowledgeAreasContainer: {
    gap: spacing.base,
    marginBottom: spacing.lg,
  },
  areaCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  areaCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  areaCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },
  areaText: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.textPrimary,
  },
  areaTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
  startButton: {
    marginTop: spacing.base,
  },
});

