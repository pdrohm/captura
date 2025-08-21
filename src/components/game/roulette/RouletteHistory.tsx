import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RouletteGame } from '../../../types/roulette';

interface RouletteHistoryProps {
  history: RouletteGame[];
  getRewardText: (reward: any) => string;
}

export const RouletteHistory: React.FC<RouletteHistoryProps> = ({
  history,
  getRewardText,
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getResultColor = (reward: any) => {
    if (reward.type === 'jackpot') return '#FFD700';
    if (reward.amount >= 50) return '#27AE60';
    if (reward.amount >= 25) return '#F39C12';
    return '#3498DB';
  };

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No spins yet!</Text>
        <Text style={styles.emptySubtext}>Spin the wheel to see your history</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Spins</Text>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {history.map((game, index) => (
          <View key={game.id} style={styles.historyItem}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTime}>
                {formatTime(game.timestamp)}
              </Text>
              <View style={styles.historyCost}>
                {game.cost === 0 ? (
                  <Text style={styles.historyCostText}>FREE</Text>
                ) : (
                  <View style={styles.costContainer}>
                    <FontAwesome6 name="coins" size={12} color="white" />
                    <Text style={styles.historyCostText}>{game.cost}</Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.historyContent}>
              <View style={styles.rewardContainer}>
                <Text style={[
                  styles.rewardText,
                  { color: getResultColor(game.result.reward) }
                ]}>
                  {getRewardText(game.result.reward)}
                </Text>
              </View>
              
              <View style={styles.statsContainer}>
                <Text style={styles.statText}>
                  Win #{game.consecutiveWins}
                </Text>
                <Text style={styles.statText}>
                  +{game.totalWinnings} value
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.5,
    textAlign: 'center',
  },
  historyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTime: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  historyCost: {
    alignItems: 'center',
  },
  historyCostText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
    fontWeight: 'bold',
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardContainer: {
    flex: 1,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  statText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 2,
  },
});
