import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AchievementCard } from '../../../src/components/game/AchievementCard';
import { PlayerStatsCard } from '../../../src/components/game/PlayerStatsCard';
import { Colors } from '../../../src/config/Colors';
import { RetroBorders, RetroRadius, RetroShadows, RetroText } from '../../../src/config/retroStyles';
import { useColorScheme } from '../../../src/hooks/useColorScheme';
import { useGameStore } from '../../../src/stores/gameStore';

export default function ProfileScreen() {
  const { player, achievements } = useGameStore();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[RetroText.gameTitle, { color: colors.text }]}>🏅 MY PAWS 🐾</Text>
            <Text style={[RetroText.body, { color: colors.textSecondary, textAlign: 'center' }]}>
              Check your doggy progress & stats!
            </Text>
          </View>

          <PlayerStatsCard stats={player} />

          <View style={styles.section}>
            <Text style={[RetroText.title, { color: colors.text, textAlign: 'center', marginBottom: 16 }]}>🏆 TROPHIES</Text>
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
              />
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[RetroText.title, { color: colors.text, textAlign: 'center', marginBottom: 16 }]}>🏪 PET SHOP</Text>
            <View style={[styles.gameCard, { 
              backgroundColor: colors.surface,
              borderColor: colors.border 
            }]}>
              <Text style={[RetroText.heading, { color: colors.text, textAlign: 'center', marginBottom: 12 }]}>🎮 COMING SOON! 🎮</Text>
              <Text style={[RetroText.body, { color: colors.textSecondary, textAlign: 'center' }]}>
                🎨 Dog skins & customization{'\n'}
                🏠 Territory colors & patterns{'\n'}
                ⚡ Special power-ups{'\n'}
                🏅 Exclusive badges & collars
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[RetroText.title, { color: colors.text, textAlign: 'center', marginBottom: 16 }]}>🎯 DOG PACK</Text>
            <View style={[styles.gameCard, { 
              backgroundColor: colors.surface,
              borderColor: colors.border 
            }]}>
              <Text style={[RetroText.heading, { color: colors.text, textAlign: 'center', marginBottom: 12 }]}>🐕‍🦺 JOIN A PACK! 🐕‍🦺</Text>
              <Text style={[RetroText.body, { color: colors.textSecondary, textAlign: 'center' }]}>
                👫 Team up with other dogs{'\n'}
                🏆 Compete for territory control{'\n'}
                🎖️ Share achievements{'\n'}
                📅 Weekly pack challenges
              </Text>
            </View>
          </View>

          {/* Bottom spacing for tab bar */}
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
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  gameCard: {
    ...RetroBorders.sticker,
    borderRadius: RetroRadius.xxl,
    padding: 24,
    alignItems: 'center',
    ...RetroShadows.soft,
  },
  bottomSpacing: {
    height: 100,
  },
});