import { Colors } from '@/src/config/Colors';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { FontAwesome6 } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import type { PlayerStats } from '../../types/game';

interface PlayerStatsCardProps {
  stats: PlayerStats;
}

export const PlayerStatsCard: React.FC<PlayerStatsCardProps> = ({
  stats,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const xpProgress = useSharedValue(0);
  const dailyProgress = useSharedValue(0);

  useEffect(() => {
    xpProgress.value = withSpring(stats.experience / stats.experienceToNextLevel, {
      damping: 15,
      stiffness: 100,
    });
  }, [stats.experience, stats.experienceToNextLevel, xpProgress]);

  useEffect(() => {
    dailyProgress.value = withSpring(stats.dailyUrinations / stats.maxDailyUrinations, {
      damping: 15,
      stiffness: 100,
    });
  }, [stats.dailyUrinations, stats.maxDailyUrinations, dailyProgress]);

  const xpProgressStyle = useAnimatedStyle(() => ({
    width: `${xpProgress.value * 100}%`,
  }));

  const dailyProgressStyle = useAnimatedStyle(() => ({
    width: `${dailyProgress.value * 100}%`,
  }));

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.surface,
        borderColor: colors.border 
      }
    ]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[
            styles.levelBadge, 
            { 
              backgroundColor: colors.primary,
              borderColor: colors.border 
            }
          ]}>
            <Text style={[
              styles.levelText, 
              { color: colors.buttonText }
            ]}>LVL {stats.level}</Text>
          </View>
          <View style={[
            styles.coinsContainer, 
            { 
              backgroundColor: colors.secondary,
              borderColor: colors.border 
            }
          ]}>
            <FontAwesome6 
              name="coins" 
              size={24} 
              color={colors.buttonText} 
            />
            <Text style={[
              styles.coinsText, 
              { color: colors.buttonText }
            ]}>{stats.coins}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={[
            styles.progressLabel, 
            { color: colors.text }
          ]}>Experience</Text>
          <View style={[
            styles.progressBar, 
            { 
              backgroundColor: colors.borderMuted,
              borderColor: colors.border 
            }
          ]}>
            <Animated.View style={[
              styles.progressFill, 
              xpProgressStyle, 
              { backgroundColor: colors.warning }
            ]} />
          </View>
          <Text style={[
            styles.progressText, 
            { color: colors.textSecondary }
          ]}>
            {stats.experience} / {stats.experienceToNextLevel} XP
          </Text>
        </View>

        <View style={styles.progressSection}>
          <Text style={[
            styles.progressLabel, 
            { color: colors.text }
          ]}>Daily Territory Marks</Text>
          <View style={[
            styles.progressBar, 
            { 
              backgroundColor: colors.borderMuted,
              borderColor: colors.border 
            }
          ]}>
            <Animated.View style={[
              styles.dailyProgressFill, 
              dailyProgressStyle, 
              { backgroundColor: colors.error }
            ]} />
          </View>
          <Text style={[
            styles.progressText, 
            { color: colors.textSecondary }
          ]}>
            {stats.dailyUrinations} / {stats.maxDailyUrinations} used
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[
              styles.statValue, 
              { color: colors.text }
            ]}>{stats.totalTerritory}</Text>
            <Text style={[
              styles.statLabel, 
              { color: colors.textSecondary }
            ]}>Total Territory</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[
              styles.statValue, 
              { color: colors.text }
            ]}>{stats.territoryRadius}m</Text>
            <Text style={[
              styles.statLabel, 
              { color: colors.textSecondary }
            ]}>Territory Range</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderWidth: 3,
    borderStyle: 'solid',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelBadge: {
    borderWidth: 2,
    borderStyle: 'solid',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  coinsContainer: {
    borderWidth: 2,
    borderStyle: 'solid',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinsText: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  dailyProgressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
});