import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AchievementCard } from '../../../src/components/game/AchievementCard';
import { PlayerStatsCard } from '../../../src/components/game/PlayerStatsCard';
import { useGameStore } from '../../../src/stores/gameStore';

export default function ProfileScreen() {
  const { player, achievements } = useGameStore();

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
              <Text style={styles.title}>🐕 Profile</Text>
              <Text style={styles.subtitle}>
                Your doggy stats and achievements!
              </Text>
            </View>

            <PlayerStatsCard stats={player} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏆 Achievements</Text>
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </View>



            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏪 Shop</Text>
              <View style={styles.shopCard}>
                <Text style={styles.shopTitle}>Coming Soon!</Text>
                <Text style={styles.shopDescription}>
                  • Dog skins and customization{'\n'}
                  • Territory colors and patterns{'\n'}
                  • Special power-ups{'\n'}
                  • Exclusive badges
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎯 Clan System</Text>
              <View style={styles.clanCard}>
                <Text style={styles.clanTitle}>Join a Pack!</Text>
                <Text style={styles.clanDescription}>
                  • Team up with other dogs{'\n'}
                  • Compete for territory control{'\n'}
                  • Share achievements{'\n'}
                  • Weekly challenges
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
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },

  shopCard: {
    backgroundColor: 'rgba(255, 184, 77, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  shopTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  shopDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
    textAlign: 'left',
  },
  clanCard: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  clanTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  clanDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
    textAlign: 'left',
  },

  bottomSpacing: {
    height: 100,
  },
});