import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import { EmptyState } from '../../components';
import { colors } from '../../theme';
import { spacing } from '../../utils/styles';

export default function FormulasScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <EmptyState
          icon="calculator-variant"
          title="Formulas Coming Soon"
          message="PMP formulas and equations will be available here. Content will be added soon."
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
});

