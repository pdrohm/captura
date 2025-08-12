import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  testID?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  testID,
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
});

