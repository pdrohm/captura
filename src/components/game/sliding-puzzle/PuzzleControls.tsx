import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RetroButton } from '../../RetroButton';
import { PuzzleDifficulty } from '../../../types/slidingPuzzle';
import { RetroSpacing, RetroLayout } from '../../../config/retroStyles';

interface PuzzleControlsProps {
  onShuffle: () => void;
  onReset: () => void;
  onNewGame: () => void;
  onChangeDifficulty: () => void;
  currentDifficulty: PuzzleDifficulty;
  isPlaying: boolean;
  isComplete: boolean;
  disabled?: boolean;
}

export const PuzzleControls: React.FC<PuzzleControlsProps> = ({
  onShuffle,
  onReset,
  onNewGame,
  onChangeDifficulty,
  currentDifficulty,
  isPlaying,
  isComplete,
  disabled = false,
}) => {

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <RetroButton
          title={`${currentDifficulty.icon} ${currentDifficulty.name}`}
          onPress={onChangeDifficulty}
          variant="outline"
          size="small"
          disabled={disabled || isPlaying}
          style={styles.difficultyButton}
        />
      </View>
      
      <View style={styles.bottomRow}>
        {isComplete ? (
          <RetroButton
            title="🎉 NEW GAME"
            onPress={onNewGame}
            variant="primary"
            size="medium"
            disabled={disabled}
            style={styles.newGameButton}
          />
        ) : (
          <>
            <RetroButton
              title="🔀 SHUFFLE"
              onPress={onShuffle}
              variant="secondary"
              size="small"
              disabled={disabled || isPlaying}
              style={styles.controlButton}
            />
            
            <RetroButton
              title="🔄 RESET"
              onPress={onReset}
              variant="outline"
              size="small"
              disabled={disabled || !isPlaying}
              style={styles.controlButton}
            />
            
            <RetroButton
              title="✨ NEW"
              onPress={onNewGame}
              variant="primary"
              size="small"
              disabled={disabled}
              style={styles.controlButton}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: RetroSpacing.lg,
    paddingHorizontal: RetroSpacing.md,
  },
  topRow: {
    ...RetroLayout.row,
    ...RetroLayout.center,
    marginBottom: RetroSpacing.lg,
  },
  bottomRow: {
    ...RetroLayout.row,
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: RetroSpacing.sm,
  },
  difficultyButton: {
    minWidth: 140,
  },
  controlButton: {
    flex: 1,
    maxWidth: 100,
  },
  newGameButton: {
    flex: 1,
    minHeight: 56,
  },
});