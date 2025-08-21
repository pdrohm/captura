import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../../../src/stores/gameStore';
import { MinigameCard } from '../../../src/components/game/MinigameCard';
import { PlayerStatsCard } from '../../../src/components/game/PlayerStatsCard';
import * as Haptics from 'expo-haptics';

export default function MinigamesScreen() {
  const { minigames, player, completeMinigame } = useGameStore();

  const handleMinigamePress = (minigameId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Simulate minigame completion for now
    // In a real app, this would navigate to the actual minigame
    completeMinigame(minigameId);
    
    // Show success feedback
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 200);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <Text style={styles.title}>🎮 Mini Games</Text>
              <Text style={styles.subtitle}>
                Play games to improve your doggy skills!
              </Text>
            </View>

            <PlayerStatsCard stats={player} />

            <View style={styles.gamesSection}>
              <Text style={styles.sectionTitle}>Available Games</Text>
              <View style={styles.gamesGrid}>
                {minigames.map((minigame) => (
                  <MinigameCard
                    key={minigame.id}
                    minigame={minigame}
                    onPress={() => handleMinigamePress(minigame.id)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>🎯 How it Works</Text>
                <Text style={styles.infoText}>
                  • Complete minigames to earn rewards{'\n'}
                  • Unlock new games by leveling up{'\n'}
                  • Improve your territory marking abilities{'\n'}
                  • Collect coins for the shop
                </Text>
              </View>
            </View>

            {/* Bottom spacing for tab bar */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
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
  gamesSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    backdropFilter: 'blur(10px)',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
});