import { Colors, RetroColors } from '@/src/config/Colors';
import { RetroBorders, RetroRadius, RetroShadows, RetroSpacing, RetroText } from '@/src/config/retroStyles';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
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
  
  const colors = Colors.light;
  
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
    if (!minigame.isUnlocked) {
      return colors.borderMuted;
    }
    
    switch (difficulty) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      default: return colors.info;
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
      style={[
        styles.container, 
        animatedStyle, 
        { 
          borderColor: getDifficultyColor(minigame.difficulty),
          backgroundColor: minigame.isUnlocked ? colors.surface : colors.borderMuted,
        },
        !minigame.isUnlocked && styles.locked
      ]}
      onPress={minigame.isUnlocked ? onPress : undefined}
      onPressIn={minigame.isUnlocked ? handlePressIn : undefined}
      onPressOut={minigame.isUnlocked ? handlePressOut : undefined}
      activeOpacity={1}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{minigame.icon}</Text>
          <View style={[
            styles.difficultyBadge, 
            { 
              backgroundColor: getDifficultyColor(minigame.difficulty),
              borderColor: colors.border 
            }
          ]}>
            <Text style={[
              styles.difficultyText,
              { color: minigame.isUnlocked ? colors.buttonText : colors.textMuted }
            ]}>
              {minigame.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text 
          style={[
            styles.title, 
            { color: minigame.isUnlocked ? colors.text : colors.textMuted },
            !minigame.isUnlocked && styles.lockedText
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {minigame.name}
        </Text>
        
        <Text 
          style={[
            styles.description, 
            { color: minigame.isUnlocked ? colors.textSecondary : colors.textMuted },
            !minigame.isUnlocked && styles.lockedText
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {minigame.description}
        </Text>

        <View style={[
          styles.rewardContainer, 
          { 
            backgroundColor: colors.card,
            borderColor: colors.border 
          }
        ]}>
          <Text style={[
            styles.rewardText, 
            { color: minigame.isUnlocked ? colors.text : colors.textMuted },
            !minigame.isUnlocked && styles.lockedText
          ]}>
            🎁 {getRewardText(minigame.reward)}
          </Text>
        </View>

        {!minigame.isUnlocked && (
          <View style={[
            styles.lockOverlay, 
            { backgroundColor: colors.background }
          ]}>
            <Text style={styles.lockEmoji}>🔒</Text>
            <Text style={[
              styles.lockText, 
              { color: colors.textMuted }
            ]}>LOCKED</Text>
          </View>
        )}
      </View>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '47%',
    aspectRatio: 0.8, 
    marginBottom: RetroSpacing.lg,
    ...RetroBorders.sticker, 
    borderRadius: RetroRadius.xxl,
    ...RetroShadows.soft,
  },
  locked: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
    padding: RetroSpacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  emoji: {
    fontSize: 44, 
  },
  difficultyBadge: {
    ...RetroBorders.sticker, 
    paddingHorizontal: RetroSpacing.md,
    paddingVertical: RetroSpacing.sm,
    borderRadius: RetroRadius.pill,
    borderColor: RetroColors.outlineBlack,
    ...RetroShadows.subtle,
  },
  difficultyText: {
    ...RetroText.label,
    fontSize: 10,
    color: '#FFFFFF', 
  },
  title: {
    ...RetroText.heading,
    textAlign: 'center',
    marginVertical: RetroSpacing.sm,
    fontSize: 16, 
    textTransform: 'uppercase' as const,
    letterSpacing: 0.6,
    numberOfLines: 2, 
  },
  description: {
    ...RetroText.caption,
    textAlign: 'center',
    marginBottom: RetroSpacing.md,
    fontSize: 12, 
    lineHeight: 16, 
    numberOfLines: 2, 
  },
  rewardContainer: {
    ...RetroBorders.thin, 
    paddingVertical: RetroSpacing.md,
    paddingHorizontal: RetroSpacing.lg,
    alignSelf: 'center',
    borderRadius: RetroRadius.xl,
    borderColor: RetroColors.outlineLight,
    ...RetroShadows.subtle,
  },
  rewardText: {
    ...RetroText.caption,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.4,
    fontSize: 11, 
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...RetroBorders.thick, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RetroRadius.xxl,
    borderColor: RetroColors.outlineBrown,
    backgroundColor: 'rgba(254, 249, 239, 0.95)', 
  },
  lockEmoji: {
    fontSize: 36,
    marginBottom: RetroSpacing.sm,
  },
  lockText: {
    ...RetroText.label,
    fontSize: 14,
    color: RetroColors.warmBrown,
  },
  lockedText: {
    opacity: 0.6,
  },
});