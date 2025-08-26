import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors } from '../../../config/Colors';
import { RetroText, RetroSpacing, RetroRadius, RetroBorders, RetroShadows } from '../../../config/retroStyles';

interface PuzzleStatsProps {
  moves: number;
  startTime: number;
  endTime?: number;
  isPlaying: boolean;
  isComplete: boolean;
  bestMoves?: number;
  bestTime?: number;
}

export const PuzzleStats: React.FC<PuzzleStatsProps> = ({
  moves,
  startTime,
  endTime,
  isPlaying,
  isComplete,
  bestMoves,
  bestTime,
}) => {
  const colors = Colors.light;
  const [currentTime, setCurrentTime] = useState(0);
  const pulseScale = useSharedValue(1);
  const progressValue = useSharedValue(0);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateCurrentTime = useCallback((): number => {
    if (endTime) {
      return Math.floor((endTime - startTime) / 1000);
    }
    if (isPlaying && startTime) {
      return Math.floor((Date.now() - startTime) / 1000);
    }
    return 0;
  }, [endTime, startTime, isPlaying]);

  useEffect(() => {
    if (isPlaying && !isComplete) {
      const interval = setInterval(() => {
        setCurrentTime(calculateCurrentTime());
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCurrentTime(calculateCurrentTime());
    }
  }, [isPlaying, isComplete, startTime, endTime, calculateCurrentTime]);

  useEffect(() => {
    if (isComplete) {
      pulseScale.value = withSpring(1.1, { damping: 15, stiffness: 150 });
      progressValue.value = withSpring(1, { damping: 15, stiffness: 100 });
    } else {
      pulseScale.value = withSpring(1, { damping: 15, stiffness: 150 });
      progressValue.value = withSpring(0, { damping: 15, stiffness: 100 });
    }
  }, [isComplete, pulseScale, progressValue]);

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progressValue.value,
      [0, 1],
      [colors.surface, colors.success]
    );

    return {
      backgroundColor,
    };
  });

  const getMovesColor = (): string => {
    if (isComplete && bestMoves && moves <= bestMoves) {
      return colors.success;
    }
    if (bestMoves && moves > bestMoves * 1.5) {
      return colors.warning;
    }
    return colors.text;
  };

  const getTimeColor = (): string => {
    if (isComplete && bestTime && currentTime <= bestTime) {
      return colors.success;
    }
    if (bestTime && currentTime > bestTime * 1.5) {
      return colors.warning;
    }
    return colors.text;
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
        progressAnimatedStyle,
      ]}
    >
      <View style={styles.statsRow}>
        <Animated.View style={[styles.statCard, pulseAnimatedStyle]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            MOVES
          </Text>
          <Text style={[styles.statValue, { color: getMovesColor() }]}>
            {moves}
          </Text>
          {bestMoves && (
            <Text style={[styles.bestValue, { color: colors.textMuted }]}>
              Best: {bestMoves}
            </Text>
          )}
        </Animated.View>

        <View style={[styles.divider, { backgroundColor: colors.borderMuted }]} />

        <Animated.View style={[styles.statCard, pulseAnimatedStyle]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            TIME
          </Text>
          <Text style={[styles.statValue, { color: getTimeColor() }]}>
            {formatTime(currentTime)}
          </Text>
          {bestTime && (
            <Text style={[styles.bestValue, { color: colors.textMuted }]}>
              Best: {formatTime(bestTime)}
            </Text>
          )}
        </Animated.View>
      </View>

      {isComplete && (
        <View style={styles.completionRow}>
          <Text style={[styles.completionText, { color: colors.success }]}>
            🎉 PUZZLE COMPLETE! 🎉
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...RetroBorders.sticker,
    borderRadius: RetroRadius.xl,
    marginHorizontal: RetroSpacing.lg,
    marginVertical: RetroSpacing.md,
    ...RetroShadows.soft,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: RetroSpacing.lg,
    paddingHorizontal: RetroSpacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    ...RetroText.label,
    marginBottom: RetroSpacing.xs,
  },
  statValue: {
    ...RetroText.score,
    fontSize: 28,
    lineHeight: 32,
  },
  bestValue: {
    ...RetroText.caption,
    fontSize: 12,
    marginTop: RetroSpacing.xs,
  },
  divider: {
    width: 2,
    height: 60,
    marginHorizontal: RetroSpacing.md,
    borderRadius: 1,
  },
  completionRow: {
    alignItems: 'center',
    paddingBottom: RetroSpacing.lg,
    paddingHorizontal: RetroSpacing.lg,
  },
  completionText: {
    ...RetroText.heading,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '800',
  },
});