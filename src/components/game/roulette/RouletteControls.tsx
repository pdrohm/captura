import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../../config/Colors';
import type { RouletteStats } from '../../../types/roulette';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface RouletteControlsProps {
  isSpinning: boolean;
  canSpin: boolean;
  spinCost: number;
  stats: RouletteStats;
  onSpin: () => void;
}

export const RouletteControls: React.FC<RouletteControlsProps> = ({
  isSpinning,
  canSpin,
  spinCost,
  stats,
  onSpin,
}) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(pressed.value, [0, 1], [1, 0.95]),
      },
    ],
    opacity: interpolate(pressed.value, [0, 1], [1, 0.8]),
  }));

  const handlePressIn = () => {
    if (canSpin && !isSpinning) {
      pressed.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, { damping: 15, stiffness: 300 });
  };

  const getSpinButtonText = () => {
    if (isSpinning) return 'SPINNING...';
    if (spinCost === 0) return 'FREE SPIN!';
    return `SPIN (${spinCost})`;
  };

  const getSpinButtonColors = () => {
    if (isSpinning) return ['#95A5A6', '#7F8C8D'];
    if (spinCost === 0) return ['#27AE60', '#2ECC71'];
    if (canSpin) return ['#E74C3C', '#C0392B'];
    return ['#95A5A6', '#7F8C8D'];
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Spins</Text>
          <Text style={styles.statValue}>{stats.totalSpins}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Best Win</Text>
          <View style={styles.bestWinContainer}>
            <Text style={styles.statValue}>{stats.bestWin.amount}</Text>
            {stats.bestWin.type === 'coins' ? (
              <FontAwesome6 name="coins" size={12} color="white" />
            ) : (
              <Text style={styles.statValue}>⭐</Text>
            )}
          </View>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Free Spins</Text>
          <Text style={styles.statValue}>{stats.freeSpinsRemaining}</Text>
        </View>
      </View>

      {}
      <AnimatedTouchableOpacity
        style={[styles.spinButton, animatedStyle]}
        onPress={canSpin && !isSpinning ? onSpin : undefined}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={!canSpin || isSpinning}
      >
        <LinearGradient
          colors={getSpinButtonColors()}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.spinButtonContent}>
            <Text style={styles.spinButtonText}>{getSpinButtonText()}</Text>
            {spinCost > 0 && <FontAwesome6 name="coins" size={16} color="white" />}
          </View>
        </LinearGradient>
      </AnimatedTouchableOpacity>

      {}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {spinCost === 0
            ? '🎉 You have a free spin!'
            : `💡 Get free spins daily at midnight`}
        </Text>
        <Text style={styles.infoText}>
          🎯 Consecutive wins: {stats.consecutiveWins}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    opacity: 0.8,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
  },
  spinButton: {
    borderRadius: 25,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spinButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.buttonText,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bestWinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 4,
  },
});