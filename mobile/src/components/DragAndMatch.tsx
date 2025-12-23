import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';
import { spacing, borderRadius, shadows } from '../utils/styles';

interface DragAndMatchProps {
  leftItems: string[];
  rightItems: string[];
  correctMatches: { [leftItem: string]: string };
  onMatchChange: (matches: { [leftItem: string]: string }) => void;
  showExplanation?: boolean;
  userMatches?: { [leftItem: string]: string };
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_SMALL_SCREEN = SCREEN_WIDTH < 375;

export default function DragAndMatch({
  leftItems,
  rightItems,
  correctMatches,
  onMatchChange,
  showExplanation = false,
  userMatches = {}
}: DragAndMatchProps) {
  const [matches, setMatches] = useState<{ [leftItem: string]: string }>(userMatches);
  const [selectedRightItem, setSelectedRightItem] = useState<string | null>(null);

  useEffect(() => {
    setMatches(userMatches);
  }, [userMatches]);

  const handleRightItemPress = (rightItem: string) => {
    if (showExplanation) return;
    
    if (selectedRightItem === rightItem) {
      // Deselect if already selected
      setSelectedRightItem(null);
    } else {
      // Select this item
      setSelectedRightItem(rightItem);
    }
  };

  const handleLeftItemPress = (leftItem: string) => {
    if (showExplanation) return;
    
    if (selectedRightItem) {
      // Match the selected right item to this left item
      const newMatches = { ...matches, [leftItem]: selectedRightItem };
      setMatches(newMatches);
      onMatchChange(newMatches);
      setSelectedRightItem(null);
    } else if (matches[leftItem]) {
      // Remove existing match
      const newMatches = { ...matches };
      delete newMatches[leftItem];
      setMatches(newMatches);
      onMatchChange(newMatches);
    }
  };

  const getLeftItemStyle = (leftItem: string) => {
    const hasMatch = !!matches[leftItem];
    const isCorrect = showExplanation && correctMatches[leftItem] === matches[leftItem];
    const isIncorrect = showExplanation && hasMatch && correctMatches[leftItem] !== matches[leftItem];
    
    if (showExplanation) {
      if (isCorrect) {
        return [styles.leftItem, styles.leftItemCorrect];
      }
      if (isIncorrect) {
        return [styles.leftItem, styles.leftItemIncorrect];
      }
    }
    
    return [styles.leftItem, hasMatch && styles.leftItemMatched];
  };

  const getRightItemStyle = (rightItem: string) => {
    const isSelected = selectedRightItem === rightItem;
    const isMatched = Object.values(matches).includes(rightItem);
    const isCorrect = showExplanation && Object.entries(correctMatches).some(
      ([left, right]) => right === rightItem && matches[left] === rightItem
    );
    
    if (showExplanation && isCorrect) {
      return [styles.rightItem, styles.rightItemCorrect];
    }
    
    if (isSelected) {
      return [styles.rightItem, styles.rightItemSelected];
    }
    
    if (isMatched && !showExplanation) {
      return [styles.rightItem, styles.rightItemMatched];
    }
    
    return styles.rightItem;
  };

  const getMatchedRightItem = (leftItem: string) => {
    return matches[leftItem] || null;
  };

  const isRightItemAvailable = (rightItem: string) => {
    if (showExplanation) return true;
    return !Object.values(matches).includes(rightItem) || selectedRightItem === rightItem;
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.instruction}>
        {showExplanation ? 'Correct Answer:' : 'Tap an option, then tap a statement to match'}
      </Text>
      
      {/* Selected Item Indicator */}
      {selectedRightItem && !showExplanation && (
        <View style={styles.selectedIndicator}>
          <Icon name="arrow-down" size={20} color={colors.primary} />
          <Text style={styles.selectedIndicatorText}>
            Selected: <Text style={styles.selectedItemText}>{selectedRightItem}</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedRightItem(null)}
            style={styles.clearSelectionButton}
          >
            <Icon name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Left Items - Statements to Match */}
        <View style={styles.leftItemsContainer}>
          <Text variant="labelLarge" style={styles.sectionHeader}>
            Statements (Tap to match):
          </Text>
          {leftItems.map((leftItem, index) => {
            const matchedRightItem = getMatchedRightItem(leftItem);
            const isCorrect = showExplanation && correctMatches[leftItem] === matchedRightItem;
            const isIncorrect = showExplanation && matchedRightItem && correctMatches[leftItem] !== matchedRightItem;
            
            return (
              <TouchableOpacity
                key={index}
                style={getLeftItemStyle(leftItem)}
                onPress={() => handleLeftItemPress(leftItem)}
                disabled={showExplanation}
                activeOpacity={0.7}
              >
                <View style={styles.leftItemHeader}>
                  <View style={styles.leftItemNumber}>
                    <Text style={styles.leftItemNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.leftItemText} numberOfLines={3}>
                    {leftItem}
                  </Text>
                </View>
                
                {matchedRightItem && (
                  <View style={[
                    styles.matchedContainer,
                    isCorrect && styles.matchedContainerCorrect,
                    isIncorrect && styles.matchedContainerIncorrect
                  ]}>
                    <View style={styles.matchedContent}>
                      <Icon
                        name="arrow-right"
                        size={16}
                        color={isCorrect ? colors.success : isIncorrect ? colors.error : colors.primary}
                        style={styles.matchArrow}
                      />
                      <Text style={[
                        styles.matchedText,
                        isCorrect && styles.matchedTextCorrect,
                        isIncorrect && styles.matchedTextIncorrect
                      ]} numberOfLines={2}>
                        {matchedRightItem}
                      </Text>
                      {showExplanation && (
                        <Icon
                          name={isCorrect ? 'check-circle' : 'close-circle'}
                          size={20}
                          color={isCorrect ? colors.success : colors.error}
                          style={styles.matchIcon}
                        />
                      )}
                    </View>
                  </View>
                )}
                
                {!matchedRightItem && !showExplanation && (
                  <View style={styles.emptyMatchContainer}>
                    <Text style={styles.emptyMatchText}>Tap to match</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Right Items - Options to Select */}
        <View style={styles.rightItemsContainer}>
          <Text variant="labelLarge" style={styles.sectionHeader}>
            Options (Tap to select):
          </Text>
          <View style={styles.rightItemsGrid}>
            {rightItems.map((rightItem, index) => {
              const isAvailable = isRightItemAvailable(rightItem);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={getRightItemStyle(rightItem)}
                  onPress={() => handleRightItemPress(rightItem)}
                  disabled={showExplanation || !isAvailable}
                  activeOpacity={0.7}
                >
                  <View style={styles.rightItemContent}>
                    {selectedRightItem === rightItem && (
                      <Icon
                        name="check-circle"
                        size={20}
                        color={colors.primary}
                        style={styles.selectedIcon}
                      />
                    )}
                    <Text 
                      style={[
                        styles.rightItemText,
                        !isAvailable && !showExplanation && styles.rightItemTextDisabled
                      ]}
                      numberOfLines={2}
                    >
                      {rightItem}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {!showExplanation && (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            setMatches({});
            onMatchChange({});
            setSelectedRightItem(null);
          }}
        >
          <Icon name="refresh" size={20} color={colors.primary} />
          <Text style={styles.resetButtonText}>Reset All Matches</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    flex: 1,
  },
  instruction: {
    marginBottom: spacing.md,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
    fontSize: IS_SMALL_SCREEN ? 14 : 16,
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  selectedIndicatorText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.text,
  },
  selectedItemText: {
    fontWeight: '700',
    color: colors.primary,
  },
  clearSelectionButton: {
    marginLeft: spacing.xs,
  },
  scrollContainer: {
    flex: 1,
  },
  leftItemsContainer: {
    marginBottom: spacing.lg,
  },
  rightItemsContainer: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    marginBottom: spacing.md,
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: IS_SMALL_SCREEN ? 14 : 16,
  },
  leftItem: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray300,
    ...shadows.small,
  },
  leftItemMatched: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  leftItemCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  leftItemIncorrect: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  leftItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  leftItemNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    flexShrink: 0,
  },
  leftItemNumberText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  leftItemText: {
    flex: 1,
    fontSize: IS_SMALL_SCREEN ? 13 : 15,
    color: colors.text,
    lineHeight: IS_SMALL_SCREEN ? 18 : 22,
    fontWeight: '500',
  },
  matchedContainer: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  matchedContainerCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  matchedContainerIncorrect: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  matchedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchArrow: {
    marginRight: spacing.xs,
  },
  matchedText: {
    flex: 1,
    fontSize: IS_SMALL_SCREEN ? 12 : 14,
    color: colors.primary,
    fontWeight: '600',
  },
  matchedTextCorrect: {
    color: colors.success,
  },
  matchedTextIncorrect: {
    color: colors.error,
  },
  matchIcon: {
    marginLeft: spacing.xs,
  },
  emptyMatchContainer: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderStyle: 'dashed',
  },
  emptyMatchText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  rightItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  rightItem: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.gray300,
    minWidth: (SCREEN_WIDTH - spacing.md * 4) / 2 - spacing.sm,
    maxWidth: (SCREEN_WIDTH - spacing.md * 4) / 2 - spacing.sm,
    ...shadows.small,
  },
  rightItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    borderWidth: 3,
  },
  rightItemMatched: {
    opacity: 0.5,
    borderColor: colors.gray400,
  },
  rightItemCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  rightItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightItemText: {
    flex: 1,
    fontSize: IS_SMALL_SCREEN ? 12 : 14,
    color: colors.text,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  rightItemTextDisabled: {
    opacity: 0.5,
  },
  selectedIcon: {
    marginRight: spacing.xs,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
  },
  resetButtonText: {
    marginLeft: spacing.xs,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
