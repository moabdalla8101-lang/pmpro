import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        PMP Exam Prep
      </Text>
      <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
});


