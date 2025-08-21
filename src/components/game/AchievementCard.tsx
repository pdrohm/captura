import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import type { Achievement } from '../../types/game';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(achievement.progress / achievement.maxProgress, {
      damping: 15,
      stiffness: 100,
    });
  }, [achievement.progress, achievement.maxProgress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const getRewardText = (reward: Achievement['reward']) => {
    switch (reward.type) {
      case 'coins': return `${reward.amount} coins`;
      case 'experience': return `${reward.amount} XP`;
      case 'urinations': return `+${reward.amount} daily pees`;
    }
  };

  return (
    <View style={[styles.container, achievement.isUnlocked && styles.unlockedContainer]}>
      <LinearGradient
        colors={achievement.isUnlocked ? ['#FFD700', '#FFA500'] : ['#F0F0F0', '#E0E0E0']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={[styles.icon, achievement.isUnlocked && styles.unlockedIcon]}>
            {achievement.icon}
          </Text>
          <View style={styles.info}>
            <Text style={[styles.title, achievement.isUnlocked && styles.unlockedText]}>
              {achievement.name}
            </Text>
            <Text style={[styles.description, achievement.isUnlocked && styles.unlockedDescription]}>
              {achievement.description}
            </Text>
          </View>
          {achievement.isUnlocked && (
            <Text style={styles.checkmark}>✅</Text>
          )}
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
          <Text style={[styles.progressText, achievement.isUnlocked && styles.unlockedText]}>
            {achievement.progress}/{achievement.maxProgress}
          </Text>
        </View>

        <View style={styles.rewardContainer}>
          <Text style={[styles.rewardLabel, achievement.isUnlocked && styles.unlockedText]}>
            Reward:
          </Text>
          <Text style={[styles.rewardText, achievement.isUnlocked && styles.unlockedText]}>
            🎁 {getRewardText(achievement.reward)}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  unlockedContainer: {
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
  },
  gradient: {
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
    opacity: 0.6,
  },
  unlockedIcon: {
    opacity: 1,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
    marginBottom: 2,
  },
  unlockedText: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
  },
  unlockedDescription: {
    color: '#FFFFFFCC',
  },
  checkmark: {
    fontSize: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    minWidth: 40,
    textAlign: 'right',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  rewardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4ECDC4',
  },
});