import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PuzzleErrorBoundary } from '../../../src/components/game/sliding-puzzle/PuzzleErrorBoundary';
import { SlidingPuzzle } from '../../../src/components/game/sliding-puzzle/SlidingPuzzle';
import { IconSymbol } from '../../../src/components/IconSymbol';
import { Colors } from '../../../src/config/Colors';
import { RetroSpacing, RetroText } from '../../../src/config/retroStyles';

export default function SlidingPuzzleScreen() {
  const colors = Colors.light;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <GestureHandlerRootView style={styles.gestureContainer}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <IconSymbol name="puzzlepiece.fill" size={28} color={colors.primary} />
                <Text style={[RetroText.title, { color: colors.text }]}>
                  DOG ART PUZZLE
                </Text>
                <IconSymbol name="puzzlepiece.fill" size={28} color={colors.primary} />
              </View>
            </View>
            
            <View style={styles.content}>
              <PuzzleErrorBoundary>
                <SlidingPuzzle />
              </PuzzleErrorBoundary>
            </View>
          </SafeAreaView>
        </View>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: RetroSpacing.lg,
    paddingHorizontal: RetroSpacing.xl,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RetroSpacing.md,
  },
  content: {
    flex: 1,
    paddingBottom: Platform.select({ 
      ios: 120, // Tab bar height (85) + bottom margin (12) + extra padding (23)
      default: 110 // Tab bar height (75) + bottom margin (8) + extra padding (27)
    }),
  },
});