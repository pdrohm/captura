import { IconSymbol } from '@/src/components/IconSymbol';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MinigameCard } from '../../../src/components/game/MinigameCard';
import { PlayerStatsCard } from '../../../src/components/game/PlayerStatsCard';
import { Colors } from '../../../src/config/Colors';
import { RetroBorders, RetroRadius, RetroShadows, RetroText } from '../../../src/config/retroStyles';
import { useGameStore } from '../../../src/stores/gameStore';

export default function MinigamesScreen() {
  const { minigames, player, completeMinigame } = useGameStore();
  
  const colors = Colors.light;

  const handleMinigamePress = (minigameId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (minigameId === 'roulette') {
      router.push('/minigames/roulette');
    } else if (minigameId === 'sliding-puzzle') {
      router.push('/minigames/sliding-puzzle');
    } else {
      completeMinigame(minigameId);

      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 200);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.titleContainer}>
              <IconSymbol name="gamecontroller.fill" size={32} color={colors.primary} />
              <Text style={[RetroText.gameTitle, { color: colors.text }]}>DOG GAMES</Text>
              <IconSymbol name="gamecontroller.fill" size={32} color={colors.primary} />
            </View>
            <Text style={[RetroText.body, { color: colors.textSecondary, textAlign: 'center' }]}>
              Train your pup with fun mini-games!
            </Text>
          </View>

          <PlayerStatsCard stats={player} />

          <View style={styles.gamesSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Games</Text>
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
            <View style={[styles.infoCard, { 
              backgroundColor: colors.surface,
              borderColor: colors.border 
            }]}>
              <View style={styles.infoTitleContainer}>
                <IconSymbol name="target" size={24} color={colors.accent} />
                <Text style={[styles.infoTitle, { color: colors.text }]}>How it Works</Text>
              </View>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                • Complete minigames to earn rewards{'\n'}
                • Unlock new games by leveling up{'\n'}
                • Improve your territory marking abilities{'\n'}
                • Collect coins for the shop
              </Text>
            </View>
          </View>

          {}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    paddingVertical: 28,
    paddingHorizontal: 24,
    margin: 20,
    ...RetroBorders.bold, 
    borderRadius: RetroRadius.xxl,
    ...RetroShadows.soft,
  },
  
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  gamesSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    ...RetroText.subtitle,
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
    ...RetroBorders.sticker, 
    padding: 28,
    borderRadius: RetroRadius.xxl,
    ...RetroShadows.soft,
  },
  infoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  
  infoTitle: {
    ...RetroText.heading,
  },
  infoText: {
    ...RetroText.body,
  },
  bottomSpacing: {
    height: 100,
  },
});