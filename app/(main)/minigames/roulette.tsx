import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouletteControls } from '../../../src/components/game/roulette/RouletteControls';
import { RouletteHistory } from '../../../src/components/game/roulette/RouletteHistory';
import { RouletteWheel } from '../../../src/components/game/roulette/RouletteWheel';
import { useRoulette } from '../../../src/hooks/useRoulette';
import { authService } from '../../../src/services/firebase';
import { useGameStore } from '../../../src/stores/gameStore';

export default function RouletteScreen() {
  const {
    isSpinning,
    stats,
    history,
    canSpin,
    spinCost,
    lastResult,
    handleSpin,
    resetSpinning,
    getRewardText,
  } = useRoulette();

  const { player } = useGameStore();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to play roulette');
      return;
    }
  }, []);

  const handleSpinComplete = () => {
    resetSpinning();
    
    if (lastResult) {
      const rewardText = getRewardText(lastResult.reward);
      Alert.alert(
        '🎉 Congratulations!',
        `You won: ${rewardText}`,
        [{ text: 'Awesome!', style: 'default' }]
      );
    }
  };

  const handleSpinPress = async () => {
    if (!canSpin) {
      Alert.alert(
        'Cannot Spin',
        spinCost === 0 
          ? 'You have no free spins remaining. Come back tomorrow!'
          : `You need ${spinCost} coins to spin. Earn coins by marking territories!`
      );
      return;
    }

    const result = await handleSpin();
    if (!result) {
      Alert.alert('Error', 'Failed to spin the wheel. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>🎰 Lucky Roulette</Text>
            <Text style={styles.subtitle}>
              Spin the wheel for amazing rewards!
            </Text>
          </View>

          {/* Player Stats */}
          <View style={styles.playerStats}>
            <View style={styles.playerStatsContent}>
              <FontAwesome6 name="coins" size={16} color="white" />
              <Text style={styles.playerStatsText}>
                {player.coins} Coins | ⭐ Level {player.level}
              </Text>
            </View>
          </View>

          {/* Roulette Wheel */}
          <View style={styles.wheelContainer}>
            <RouletteWheel
              isSpinning={isSpinning}
              finalAngle={lastResult?.finalAngle}
              spinDuration={lastResult?.spinDuration}
              onSpinComplete={handleSpinComplete}
            />
          </View>

          {/* Controls */}
          <RouletteControls
            isSpinning={isSpinning}
            canSpin={canSpin}
            spinCost={spinCost}
            stats={stats}
            onSpin={handleSpinPress}
          />

          {/* History */}
          <View style={styles.historyContainer}>
            <RouletteHistory
              history={history}
              getRewardText={getRewardText}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  playerStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  playerStatsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerStatsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  wheelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 350,
  },
  historyContainer: {
    flex: 1,
    maxHeight: 200,
    marginTop: 20,
  },
});
