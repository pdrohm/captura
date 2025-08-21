import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  const xpProgress = useSharedValue(0);
  const dailyProgress = useSharedValue(0);

  useEffect(() => {
    xpProgress.value = withSpring(stats.experience / stats.experienceToNextLevel, {
      damping: 15,
      stiffness: 100,
    });
  }, [stats.experience, stats.experienceToNextLevel]);

  useEffect(() => {
    dailyProgress.value = withSpring(stats.dailyUrinations / stats.maxDailyUrinations, {
      damping: 15,
      stiffness: 100,
    });
  }, [stats.dailyUrinations, stats.maxDailyUrinations]);

  const xpProgressStyle = useAnimatedStyle(() => ({
    width: `${xpProgress.value * 100}%`,
  }));

  const dailyProgressStyle = useAnimatedStyle(() => ({
    width: `${dailyProgress.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>LVL {stats.level}</Text>
          </View>
          <View style={styles.coinsContainer}>
            <FontAwesome6 name="coins" size={24} color="white" />
            <Text style={styles.coinsText}>{stats.coins}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Experience</Text>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, xpProgressStyle]} />
          </View>
          <Text style={styles.progressText}>
            {stats.experience} / {stats.experienceToNextLevel} XP
          </Text>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Daily Territory Marks</Text>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.dailyProgressFill, dailyProgressStyle]} />
          </View>
          <Text style={styles.progressText}>
            {stats.dailyUrinations} / {stats.maxDailyUrinations} used
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalTerritory}</Text>
            <Text style={styles.statLabel}>Total Territory</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.territoryRadius}m</Text>
            <Text style={styles.statLabel}>Territory Range</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  gradient: {
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  coinsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  coinsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.9,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  dailyProgressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.8,
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
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.8,
    textAlign: 'center',
  },
});