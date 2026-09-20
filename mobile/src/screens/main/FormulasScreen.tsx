import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { SectionHeader } from '../../components';
import { colors } from '../../theme';
import { borderRadius, shadows, spacing } from '../../utils/styles';

const FORMULAS = [
  { name: 'Cost Variance', formula: 'CV = EV − AC', note: 'Positive is under budget.' },
  { name: 'Schedule Variance', formula: 'SV = EV − PV', note: 'Positive is ahead of schedule.' },
  { name: 'Cost Performance Index', formula: 'CPI = EV ÷ AC', note: 'Above 1.0 is favorable.' },
  { name: 'Schedule Performance Index', formula: 'SPI = EV ÷ PV', note: 'Above 1.0 is favorable.' },
  { name: 'Estimate at Completion', formula: 'EAC = BAC ÷ CPI', note: 'Use when current cost performance is expected to continue.' },
  { name: 'Estimate to Complete', formula: 'ETC = EAC − AC', note: 'Expected remaining cost.' },
  { name: 'Variance at Completion', formula: 'VAC = BAC − EAC', note: 'Positive is favorable.' },
  { name: 'To-Complete Performance Index', formula: 'TCPI = (BAC − EV) ÷ (BAC − AC)', note: 'Efficiency needed to meet BAC.' },
  { name: 'Communication Channels', formula: 'n(n − 1) ÷ 2', note: 'n is the number of stakeholders.' },
  { name: 'PERT Estimate', formula: '(O + 4M + P) ÷ 6', note: 'O optimistic, M most likely, P pessimistic.' },
];

export default function FormulasScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          icon="calculator-variant"
          title="PMP Formulas"
          subtitle="Core equations to memorize for the exam"
        />
        <View style={styles.formulaList}>
          {FORMULAS.map((item) => (
            <Card key={item.name} style={styles.formulaCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.formulaName}>
                  {item.name}
                </Text>
                <Text variant="headlineSmall" style={styles.formula}>
                  {item.formula}
                </Text>
                <Text variant="bodySmall" style={styles.note}>
                  {item.note}
                </Text>
              </Card.Content>
            </Card>
          ))}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  formulaList: {
    gap: spacing.md,
  },
  formulaCard: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  formulaName: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  formula: {
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  note: {
    color: colors.textSecondary,
  },
});



