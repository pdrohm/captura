import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../../config/Colors';
import { RetroBorders, RetroRadius, RetroShadows, RetroSpacing } from '../../../config/retroStyles';
import { Position, PuzzleState } from '../../../types/slidingPuzzle';
import { PuzzleTile } from './PuzzleTile';

const { width } = Dimensions.get('window');
const GRID_PADDING = 20;
const GRID_SIZE = width - (GRID_PADDING * 2);

interface PuzzleGridProps {
  puzzleState: PuzzleState;
  onTileMove: (tileId: string, newPosition: Position) => void;
  onPuzzleComplete: () => void;
  imageSource?: string;
  disabled?: boolean;
}

export const PuzzleGrid: React.FC<PuzzleGridProps> = ({
  puzzleState,
  onTileMove,
  onPuzzleComplete,
  imageSource,
  disabled = false,
}) => {
  const colors = Colors.light;
  const completionScale = useSharedValue(1);
  const hasTriggeredCompletion = useRef(false);
  
  const { size, tiles, blankPosition, isComplete } = puzzleState;

  const canMoveTile = useCallback((position: Position): boolean => {
    const { row, col } = position;
    const { row: blankRow, col: blankCol } = blankPosition;
    
    // Check if tile is adjacent to blank position
    return (
      (Math.abs(row - blankRow) === 1 && col === blankCol) ||
      (Math.abs(col - blankCol) === 1 && row === blankRow)
    );
  }, [blankPosition]);

  const handleTilePress = useCallback((tileId: string) => {
    if (disabled) return;

    const tile = tiles.find(t => t.id === tileId);
    if (!tile || tile.isBlank) return;

    if (canMoveTile(tile.currentPosition)) {
      onTileMove(tileId, blankPosition);
    }
  }, [tiles, canMoveTile, onTileMove, disabled, blankPosition]);

  const handlePuzzleComplete = useCallback(() => {
    if (hasTriggeredCompletion.current) return; // Prevent multiple calls
    
    hasTriggeredCompletion.current = true;
    completionScale.value = withSequence(
      withSpring(1.1, { damping: 15, stiffness: 150 }),
      withSpring(1, { damping: 15, stiffness: 150 }),
    );
    setTimeout(() => {
      runOnJS(onPuzzleComplete)();
    }, 500);
  }, [onPuzzleComplete, completionScale]);

  useEffect(() => {
    if (isComplete && !hasTriggeredCompletion.current) {
      handlePuzzleComplete();
    } else if (!isComplete) {
      hasTriggeredCompletion.current = false; // Reset when puzzle is no longer complete
    }
  }, [isComplete, handlePuzzleComplete]);

  const sortedTiles = useMemo(() => {
    return [...tiles].sort((a, b) => a.value - b.value);
  }, [tiles]);

  const gridAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: completionScale.value }],
    };
  });

  const tileSize = (GRID_SIZE - (size + 1) * 8) / size;

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.grid,
          {
            width: GRID_SIZE,
            height: GRID_SIZE,
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          gridAnimatedStyle,
        ]}
      >
        {sortedTiles.map((tile) => (
          <PuzzleTile
            key={tile.id}
            tile={tile}
            gridSize={size}
            tileSize={tileSize}
            imageSource={imageSource}
            onTilePress={handleTilePress}
            canMove={canMoveTile(tile.currentPosition)}
            disabled={disabled || isComplete}
          />
        ))}
        
        {isComplete && (
          <View style={[styles.completionOverlay, { backgroundColor: `${colors.success}20` }]}>
            <View style={[styles.completionBadge, { backgroundColor: colors.success }]}>
              <View style={styles.completionBadgeInner} />
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: RetroSpacing.lg,
  },
  grid: {
    position: 'relative',
    ...RetroBorders.sticker,
    borderRadius: RetroRadius.xl,
    ...RetroShadows.soft,
    overflow: 'hidden',
  },
  completionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RetroRadius.xl,
  },
  completionBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...RetroBorders.bold,
    borderColor: '#FFFFFF',
    ...RetroShadows.floating,
  },
  completionBadgeInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
  },
});