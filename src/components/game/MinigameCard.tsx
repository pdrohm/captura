import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import type { Minigame } from '../../types/game';

interface MinigameCardProps {
  minigame: Minigame;
  onPress: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const MinigameCard: React.FC<MinigameCardProps> = ({
  minigame,
  onPress,
}) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        scale: interpolate(pressed.value, [0, 1], [1, 0.96]) 
      }
    ],
    opacity: interpolate(pressed.value, [0, 1], [1, 0.8]),
  }));

  const handlePressIn = () => {
    pressed.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, { damping: 15, stiffness: 300 });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return ['#4ECDC4', '#44A08D'];
      case 'medium': return ['#FFB347', '#FFAA5C'];
      case 'hard': return ['#FF6B6B', '#EE5A52'];
      default: return ['#4ECDC4', '#44A08D'];
    }
  };

  const getRewardText = (reward: Minigame['reward']) => {
    switch (reward.type) {
      case 'urinations': return `+${reward.amount} Daily Pees`;
      case 'radius': return `+${reward.amount}m Territory`;
      case 'coins': return `+${reward.amount} Coins`;
    }
  };

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, animatedStyle, !minigame.isUnlocked && styles.locked]}
      onPress={minigame.isUnlocked ? onPress : undefined}
      onPressIn={minigame.isUnlocked ? handlePressIn : undefined}
      onPressOut={minigame.isUnlocked ? handlePressOut : undefined}
      activeOpacity={1}
    >
      <LinearGradient
        colors={minigame.isUnlocked ? getDifficultyColor(minigame.difficulty) : ['#CCCCCC', '#999999']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>{minigame.icon}</Text>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              {minigame.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={[styles.title, !minigame.isUnlocked && styles.lockedText]}>
          {minigame.name}
        </Text>
        
        <Text style={[styles.description, !minigame.isUnlocked && styles.lockedText]}>
          {minigame.description}
        </Text>

        <View style={styles.rewardContainer}>
          <Text style={[styles.rewardText, !minigame.isUnlocked && styles.lockedText]}>
            🎁 {getRewardText(minigame.reward)}
          </Text>
        </View>

        {!minigame.isUnlocked && (
          <View style={styles.lockOverlay}>
            <Text style={styles.lockEmoji}>🔒</Text>
            <Text style={styles.lockText}>LOCKED</Text>
          </View>
        )}
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '47%',
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  locked: {
    opacity: 0.7,
  },
  gradient: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  emoji: {
    fontSize: 32,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 4,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 16,
    marginBottom: 8,
  },
  rewardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'center',
  },
  rewardText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  lockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  lockedText: {
    opacity: 0.6,
  },
});