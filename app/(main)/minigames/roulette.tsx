import { IconSymbol } from '@/src/components/IconSymbol';
import React, { useEffect } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PaperBackground } from '../../../src/components/PaperBackground';
import { RouletteControls } from '../../../src/components/game/roulette/RouletteControls';
import { RouletteHistory } from '../../../src/components/game/roulette/RouletteHistory';
import { RouletteWheel } from '../../../src/components/game/roulette/RouletteWheel';
import { Colors, RetroColors } from '../../../src/config/Colors';
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
  
  // Always use light theme colors
  const colors = Colors.light;

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
    <PaperBackground intensity="normal" style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
      

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Retro Typography */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <IconSymbol name="gamecontroller.fill" size={36} color={colors.primary} />
              <Text style={styles.title}>Lucky Roulette</Text>
            </View>
            <Text style={styles.subtitle}>
              Spin the wheel for amazing rewards!
            </Text>
          </View>

          {/* Player Stats Card */}
          <View style={styles.playerStatsCard}>
            <View style={styles.playerStatsContent}>
              <View style={styles.coinIcon}>
                <IconSymbol name="coin" size={18} color={colors.text} />
              </View>
              <Text style={styles.playerStatsText}>
                {player.coins} Coins
              </Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>LV {player.level}</Text>
              </View>
            </View>
          </View>

          {/* Roulette Wheel Container */}
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
          
          {/* Bottom spacing for tab bar */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </PaperBackground>
  );
}

// Create styles function to access colors
const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
  },
  
  safeArea: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  scrollContent: {
    paddingBottom: 20, // Extra padding at bottom
  },
  
  // Retro Sticker Back Button
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: Colors.light.primary, // Soft purple
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: Colors.light.border,
    shadowColor: Colors.light.border,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  
  backButtonText: {
    color: Colors.light.buttonText, // White text
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  // Header Styling
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginTop: 60,
  },
  
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.light.text, // Soft black
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(45, 45, 45, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  subtitle: {
    fontSize: 18,
    color: Colors.light.textSecondary, // Warm brown
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  
  // Player Stats Sticker Card
  playerStatsCard: {
    backgroundColor: Colors.light.card, // Paper background
    marginHorizontal: 4,
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 32, // Very rounded like sticker
    borderWidth: 3,
    borderColor: Colors.light.border,
    alignItems: 'center',
    shadowColor: Colors.light.border,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  
  playerStatsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  coinIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: RetroColors.yellowAccent,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  coinEmoji: {
    fontSize: 16,
  },
  
  playerStatsText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: 0.5,
  },
  
  levelBadge: {
    backgroundColor: Colors.light.primary, // Purple badge
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  
  levelText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.text, // Dark text for better visibility
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  
  // Wheel Container
  wheelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 350, // Fixed height instead of flex
    paddingVertical: 20,
  },
  
  // History Container
  historyContainer: {
    height: 200, // Fixed height instead of flex
    marginTop: 16,
  },
  
  // Bottom spacing for custom tab bar
  bottomSpacing: {
    height: 100, // Account for custom tab bar height + margins
  },
});

// Create styles instance
const styles = createStyles();
