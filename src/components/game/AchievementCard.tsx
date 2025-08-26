import { Colors } from '@/src/config/Colors';
import { useColorScheme } from '@/src/hooks/useColorScheme';
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
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(achievement.progress / achievement.maxProgress, {
      damping: 15,
      stiffness: 100,
    });
  }, [achievement.progress, achievement.maxProgress, progress]);

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
    <View style={[
      styles.container, 
      { 
        backgroundColor: achievement.isUnlocked ? colors.surface : colors.borderMuted,
        borderColor: achievement.isUnlocked ? colors.warning : colors.borderMuted
      }
    ]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[
            styles.icon, 
            { 
              opacity: achievement.isUnlocked ? 1 : 0.6,
              color: colors.text 
            }
          ]}>
            {achievement.icon}
          </Text>
          <View style={styles.info}>
            <Text style={[
              styles.title, 
              { color: achievement.isUnlocked ? colors.text : colors.textMuted }
            ]}>
              {achievement.name}
            </Text>
            <Text style={[
              styles.description, 
              { color: achievement.isUnlocked ? colors.textSecondary : colors.textMuted }
            ]}>
              {achievement.description}
            </Text>
          </View>
          {achievement.isUnlocked && (
            <Text style={styles.checkmark}>✅</Text>
          )}
        </View>

        <View style={styles.progressContainer}>
          <View style={[
            styles.progressBar, 
            { 
              backgroundColor: colors.borderMuted,
              borderColor: colors.border 
            }
          ]}>
            <Animated.View style={[
              styles.progressFill, 
              progressStyle, 
              { backgroundColor: colors.success }
            ]} />
          </View>
          <Text style={[
            styles.progressText, 
            { color: achievement.isUnlocked ? colors.text : colors.textMuted }
          ]}>
            {achievement.progress}/{achievement.maxProgress}
          </Text>
        </View>

        <View style={[
          styles.rewardContainer, 
          { 
            backgroundColor: colors.card,
            borderColor: colors.border 
          }
        ]}>
          <Text style={[
            styles.rewardLabel, 
            { color: achievement.isUnlocked ? colors.text : colors.textMuted }
          ]}>
            Reward:
          </Text>
          <Text style={[
            styles.rewardText, 
            { color: colors.success }
          ]}>
            🎁 {getRewardText(achievement.reward)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderStyle: 'solid',
  },
  content: {
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
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
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
    borderWidth: 1,
    borderStyle: 'solid',
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  rewardLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginRight: 8,
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '700',
  },
});