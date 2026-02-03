import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchKnowledgeAreas } from '../../store/slices/flashcardSlice';
import { SectionHeader, ActionButton } from '../../components';
import { colors } from '../../theme';
import { spacing, borderRadius, shadows } from '../../utils/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { removeProjectPrefix } from '../../utils/knowledgeAreaUtils';

// Icon mapping for knowledge areas
const getKnowledgeAreaIcon = (name: string): string => {
  const normalizedName = name.toLowerCase();
  if (normalizedName.includes('integration')) return 'link-variant';
  if (normalizedName.includes('scope')) return 'target';
  if (normalizedName.includes('schedule')) return 'calendar-clock';
  if (normalizedName.includes('cost')) return 'currency-usd';
  if (normalizedName.includes('quality')) return 'quality-high';
  if (normalizedName.includes('resource')) return 'account-group';
  if (normalizedName.includes('communication')) return 'message-text';
  if (normalizedName.includes('risk')) return 'alert-circle';
  if (normalizedName.includes('procurement')) return 'cart';
  if (normalizedName.includes('stakeholder')) return 'account-multiple';
  return 'book-open-variant'; // Default icon
};

export default function KnowledgeAreaFilterScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute();
  const { knowledgeAreas, isLoading } = useSelector((state: RootState) => state.flashcards);

  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchKnowledgeAreas() as any);
  }, [dispatch]);

  const handleSelectArea = (areaId: string) => {
    setSelectedArea(selectedArea === areaId ? null : areaId);
  };

  const handleStartPractice = () => {
    if (selectedArea) {
      (navigation as any).navigate('Practice', {
        screen: 'PracticeList',
        params: { knowledgeAreaId: selectedArea },
      });
    }
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
          title="Select Knowledge Area"
          subtitle="Choose a knowledge area to practice"
          icon="book-open-variant"
        />

        <View style={styles.areasContainer}>
          {knowledgeAreas && knowledgeAreas.length > 0 ? (
            // Sort knowledge areas by id (as requested by user)
            [...knowledgeAreas]
              .sort((a: any, b: any) => {
                // Sort by id field
                const aId = (a.id || a || '').toString();
                const bId = (b.id || b || '').toString();
                return aId.localeCompare(bId);
              })
              .map((area: any) => {
              const areaId = area.id || area;
              const areaName = area.name || area;
              const displayName = removeProjectPrefix(areaName);
              const isSelected = selectedArea === areaId;
              const iconName = getKnowledgeAreaIcon(areaName);

              return (
                <TouchableOpacity
                  key={areaId}
                  onPress={() => handleSelectArea(areaId)}
                  activeOpacity={0.7}
                >
                  <Card
                    style={[
                      styles.areaCard,
                      isSelected && { borderColor: colors.primary, borderWidth: 2 },
                    ]}
                  >
                    <Card.Content style={styles.areaCardContent}>
                      <View style={styles.areaContent}>
                        <View style={styles.areaLeft}>
                          <View
                            style={[
                              styles.areaIconCircle,
                              { backgroundColor: isSelected ? colors.primary : `${colors.primary}20` },
                            ]}
                          >
                            <Icon
                              name={iconName}
                              size={24}
                              color={isSelected ? '#FFFFFF' : colors.primary}
                            />
                          </View>
                          <View style={styles.areaTextContainer}>
                            <Text variant="titleLarge" style={styles.areaName}>
                              {displayName}
                            </Text>
                            <Text variant="bodySmall" style={styles.areaSubtitle}>
                              Knowledge Area
                            </Text>
                          </View>
                        </View>
                        {isSelected && (
                          <Icon name="check-circle" size={28} color={colors.primary} />
                        )}
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              );
            })
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  No knowledge areas available
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>

        <ActionButton
          label="Start Practice"
          onPress={handleStartPractice}
          disabled={!selectedArea}
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
  areasContainer: {
    gap: spacing.base,
    marginBottom: spacing.lg,
  },
  areaCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
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
  emptyCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    marginTop: spacing.base,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.base,
  },
  startButton: {
    marginTop: spacing.base,
  },
});

