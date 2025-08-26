import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RetroButton } from '../../RetroButton';
import { Colors } from '../../../config/Colors';
import { RetroText, RetroSpacing, RetroComponents } from '../../../config/retroStyles';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class PuzzleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.log('Puzzle Error:', error);
    console.log('Error Info:', errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const colors = Colors.light;

      return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[styles.errorCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.errorIcon, { color: colors.error }]}>🧩💥</Text>
            <Text style={[styles.errorTitle, { color: colors.text }]}>
              PUZZLE ERROR
            </Text>
            <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
              Something went wrong with the puzzle game. Don&apos;t worry, we can fix this!
            </Text>
            
            <RetroButton
              title="🔄 TRY AGAIN"
              onPress={this.handleRetry}
              variant="primary"
              style={styles.retryButton}
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: RetroSpacing.xl,
  },
  errorCard: {
    ...RetroComponents.card,
    alignItems: 'center',
    maxWidth: 300,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: RetroSpacing.lg,
  },
  errorTitle: {
    ...RetroText.title,
    fontSize: 24,
    marginBottom: RetroSpacing.md,
    textAlign: 'center',
  },
  errorMessage: {
    ...RetroText.body,
    textAlign: 'center',
    marginBottom: RetroSpacing.xl,
    lineHeight: 22,
  },
  retryButton: {
    minWidth: 150,
  },
});