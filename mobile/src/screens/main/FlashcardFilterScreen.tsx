import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { useNavigation } from '@react-navigation/native';
import { fetchKnowledgeAreas } from '../../store/slices/flashcardSlice';
import { ActionButton, SectionHeader } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { removeProjectPrefix } from '../../utils/knowledgeAreaUtils';

// Icon mapping for knowledge areas
const KNOWLEDGE_AREA_ICONS: { [key: string]: string } = {
  'Project Integration Management': 'link-variant',
  'Project Scope Management': 'target',
  'Project Schedule Management': 'calendar-clock',
  'Project Cost Management': 'currency-usd',
  'Project Quality Management': 'quality-high',
  'Project Resource Management': 'account-group',
  'Project Communications Management': 'message-text',
  'Project Risk Management': 'alert-circle',
  'Project Procurement Management': 'cart',
  'Project Stakeholder Management': 'account-multiple',
};

export default function FlashcardFilterScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { knowledgeAreas, isLoading, error } = useSelector((state: RootState) => state.flashcards);
  
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]); // Store knowledge area IDs

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

  const toggleKnowledgeArea = (areaId: string) => {
    setSelectedAreas((prev) => {
      if (prev.includes(areaId)) {
        return prev.filter((a) => a !== areaId);
      } else {
        return [...prev, areaId];
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
            // Sort knowledge areas by id (as requested by user)
            [...knowledgeAreas]
              .sort((a: any, b: any) => {
                const aId = (a.id || a || '').toString();
                const bId = (b.id || b || '').toString();
                return aId.localeCompare(bId);
              })
              .map((area: any) => {
                const areaId = area.id || area;
                const rawAreaName = area.name || area;
                const areaName = typeof rawAreaName === 'string' ? removeProjectPrefix(rawAreaName) : String(rawAreaName);
                const isSelected = selectedAreas.includes(areaId);
                const iconName = KNOWLEDGE_AREA_ICONS[rawAreaName] || 'book-open-variant';
                const areaColor = colors.primary;
                
                return (
                  <TouchableOpacity
                    key={areaId}
                    onPress={() => toggleKnowledgeArea(areaId)}
                    activeOpacity={0.7}
                  >
                    <Card
                      style={[
                        styles.areaCard,
                        isSelected && { borderColor: areaColor, borderWidth: 2 },
                      ]}
                    >
                      <Card.Content style={styles.areaCardContent}>
                        <View style={styles.areaContent}>
                          <View style={styles.areaLeft}>
                            <View
                              style={[
                                styles.areaIconCircle,
                                { backgroundColor: isSelected ? areaColor : `${areaColor}20` },
                              ]}
                            >
                              <Icon
                                name={iconName}
                                size={24}
                                color={isSelected ? '#FFFFFF' : areaColor}
                              />
                            </View>
                            <View style={styles.areaTextContainer}>
                              <Text variant="titleLarge" style={styles.areaName}>
                                {areaName}
                              </Text>
                              <Text variant="bodySmall" style={styles.areaSubtitle}>
                                Knowledge Area
                              </Text>
                            </View>
                          </View>
                          {isSelected && (
                            <Icon name="check-circle" size={28} color={areaColor} />
                          )}
                        </View>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                );
              })
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
    marginBottom: spacing.base,
  },
  areaCardContent: {
    padding: spacing.base,
  },
  areaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  areaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  areaIconCircle: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  areaTextContainer: {
    flex: 1,
  },
  areaName: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  areaSubtitle: {
    color: colors.textSecondary,
  },
  startButton: {
    marginTop: spacing.base,
  },
});

