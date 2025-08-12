import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
  onDismiss: () => void;
  testID?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  testID,
}) => {
  if (!error || error.trim() === '') return null;

  return (
    <View style={styles.errorContainer} testID={testID}>
      <Text style={styles.errorText}>{error}</Text>
      <View style={styles.errorButtons}>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearErrorButton} onPress={onDismiss}>
          <Text style={styles.clearErrorButtonText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#FF3B30',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  clearErrorButton: {
    backgroundColor: '#8E8E93',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearErrorButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorButtons: {
    flexDirection: 'row',
    gap: 10,
  },
});
