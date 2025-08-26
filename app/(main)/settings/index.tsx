import { RetroButton } from '@/src/components/RetroButton';
import { ThemedText } from '@/src/components/ThemedText';
import { Colors, RetroColors } from '@/src/config/Colors';
import { RetroBorders, RetroRadius, RetroShadows, RetroText } from '@/src/config/retroStyles';
import { useFirebase } from '@/src/contexts/FirebaseContext';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { useAuthStore } from '@/src/stores/authStore';
import { useGameStore } from '@/src/stores/gameStore';
import { useAppPreferences, useGameSettings, usePrivacySettings, useSettingsStore } from '@/src/stores/settingsStore';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingsCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
  badge?: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  onPress, 
  badge 
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          backgroundColor: colors.card,
          borderColor: color,
          borderLeftColor: color 
        }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <ThemedText style={styles.cardIcon}>{icon}</ThemedText>
          </View>
          <View style={styles.cardText}>
            <ThemedText style={[styles.cardTitle, { color: colors.text }]}>{title}</ThemedText>
            <ThemedText style={[styles.cardDescription, { color: colors.textSecondary }]}>{description}</ThemedText>
          </View>
        </View>
        <View style={styles.cardRight}>
          {badge && (
            <View style={[styles.badge, { backgroundColor: color }]}>
              <ThemedText style={styles.badgeText}>{badge}</ThemedText>
            </View>
          )}
          <ThemedText style={[styles.chevron, { color: colors.textMuted }]}>›</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { auth } = useFirebase();
  const { user } = useAuthStore();
  const { clearAllData } = useGameStore();

  const gameSettings = useGameSettings();
  const appPreferences = useAppPreferences();
  const privacySettings = usePrivacySettings();
  const { resetToDefaults } = useSettingsStore();

  const handleLogout = async () => {
    try {
      if (auth) {
        await auth.signOut();
      }
    } catch {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleResetAllData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your progress, settings, and achievements. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset Everything', style: 'destructive', onPress: () => {
          clearAllData();
          resetToDefaults();
          Alert.alert('Success', 'All data has been reset.');
        }}
      ]
    );
  };

  const getActiveSettingsCount = (settings: Record<string, boolean>) => {
    return Object.values(settings).filter(Boolean).length;
  };

  const gameSettingsCount = getActiveSettingsCount({
    sound: gameSettings.sound,
    haptics: gameSettings.haptics,
    notifications: gameSettings.notifications,
    animationsEnabled: gameSettings.animationsEnabled,
    particleEffects: gameSettings.particleEffects,
  });

  const appSettingsCount = getActiveSettingsCount({
    darkMode: appPreferences.darkMode,
    locationServices: appPreferences.locationServices,
    autoSave: appPreferences.autoSave,
    showTutorial: appPreferences.showTutorial,
  });

  const privacySettingsCount = getActiveSettingsCount({
    shareLocation: privacySettings.shareLocation,
    shareStats: privacySettings.shareStats,
    allowAnalytics: privacySettings.allowAnalytics,
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {}
        <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ThemedText style={[RetroText.gameTitle, { color: colors.text }]}>DOG SETTINGS</ThemedText>
          <ThemedText style={[RetroText.body, { color: colors.textSecondary, textAlign: 'center' }]}>Customize your pup&apos;s experience!</ThemedText>
        </View>

        {}
        {user && (
          <View style={styles.section}>
            <ThemedText style={[RetroText.title, { color: colors.text, textAlign: 'center', marginBottom: 16 }]}>🐕 MY DOG PROFILE</ThemedText>
            
            <View style={[
              styles.profileCard, 
              { 
                backgroundColor: colors.card,
                borderColor: colors.border 
              }
            ]}>
              <View style={[styles.userAvatar, { backgroundColor: user.color || RetroColors.dogBrown }]}>
                <ThemedText style={styles.avatarText}>
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || '🐕'}
                </ThemedText>
              </View>
              <View style={styles.userInfo}>
                <ThemedText style={[RetroText.heading, { color: colors.text }]}>
                  {user.displayName || 'Good Boy'}
                </ThemedText>
                <ThemedText style={[RetroText.caption, { color: colors.textSecondary }]}>{user.email}</ThemedText>
              </View>
              <RetroButton
                title="EDIT"
                onPress={() => router.push('/(main)/settings/profile')}
                variant="outline"
                size="small"
              />
            </View>
          </View>
        )}

        {}
        <View style={styles.section}>
          <ThemedText style={[RetroText.title, { color: colors.text, textAlign: 'center', marginBottom: 16 }]}>🎮 GAME SETTINGS</ThemedText>
          
          <SettingsCard
            title="🎮 GAME CONTROLS"
            description="Sound, bark effects & paw haptics"
            icon="🔊"
            color={RetroColors.orangeAccent}
            badge={`${gameSettingsCount}/5`}
            onPress={() => router.push('/(main)/settings/game')}
          />
          
          <SettingsCard
            title="📱 DOG APP"
            description="Theme, location & auto-save"
            icon="📲"
            color={RetroColors.mintGreen}
            badge={`${appSettingsCount}/4`}
            onPress={() => router.push('/(main)/settings/app')}
          />
          
          <SettingsCard
            title="🔒 PRIVACY FENCE"
            description="Location sharing & treat analytics"
            icon="🛡️"
            color={RetroColors.softPurple}
            badge={`${privacySettingsCount}/3`}
            onPress={() => router.push('/(main)/settings/privacy')}
          />
        </View>

        {}
        <View style={styles.section}>
          <ThemedText style={[RetroText.title, { color: colors.text, textAlign: 'center', marginBottom: 16 }]}>💾 DATA KENNEL</ThemedText>
          
          <SettingsCard
            title="💾 BACKUP TREATS"
            description="Export & import your dog data"
            icon="🗂️"
            color={RetroColors.yellowAccent}
            onPress={() => router.push('/(main)/settings/data')}
          />
          
          <SettingsCard
            title="🧹 CLEAN KENNEL"
            description="Clear cache & free up space"
            icon="🏠"
            color={RetroColors.parkGreen}
            onPress={() => {
              Alert.alert(
                '🧹 Clean Kennel',
                'This will clear temporary doggy data. Continue?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clean!', style: 'destructive', onPress: () => {
                    Alert.alert('🎉 Success!', 'Kennel cleaned successfully!');
                  }}
                ]
              );
            }}
          />
        </View>

        {}
        <View style={styles.section}>
          <ThemedText style={[RetroText.title, { color: colors.text, textAlign: 'center', marginBottom: 16 }]}>🚨 DANGER ZONE</ThemedText>
          
          <TouchableOpacity 
            style={[
              styles.dangerCard, 
              { 
                backgroundColor: colors.card,
                borderColor: RetroColors.collarRed,
                borderLeftColor: RetroColors.collarRed 
              }
            ]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: RetroColors.collarRed }]}>
                  <ThemedText style={styles.cardIcon}>🚪</ThemedText>
                </View>
                <View style={styles.cardText}>
                  <ThemedText style={[styles.cardTitle, { color: colors.text }]}>🏃 WALK AWAY</ThemedText>
                  <ThemedText style={[styles.cardDescription, { color: colors.textSecondary }]}>Leave the dog park (logout)</ThemedText>
                </View>
              </View>
              <ThemedText style={[styles.chevron, { color: colors.textMuted }]}>›</ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.dangerCard, 
              { 
                backgroundColor: colors.card,
                borderColor: RetroColors.orangeAccent,
                borderLeftColor: RetroColors.orangeAccent 
              }
            ]}
            onPress={handleResetAllData}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: RetroColors.orangeAccent }]}>
                  <ThemedText style={styles.cardIcon}>🧽</ThemedText>
                </View>
                <View style={styles.cardText}>
                  <ThemedText style={[styles.cardTitle, { color: colors.text }]}>🧽 WASH ALL PAWS</ThemedText>
                  <ThemedText style={[styles.cardDescription, { color: colors.textSecondary }]}>Reset everything to puppy state</ThemedText>
                </View>
              </View>
              <ThemedText style={[styles.chevron, { color: colors.textMuted }]}>›</ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.section}>
          <ThemedText style={[RetroText.title, { color: colors.text, textAlign: 'center', marginBottom: 16 }]}>ℹ️ DOG TAG INFO</ThemedText>
          
          <View style={[
            styles.infoCard, 
            { 
              backgroundColor: colors.card,
              borderColor: colors.border 
            }
          ]}>
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: colors.text }]}>Version</ThemedText>
              <ThemedText style={[styles.infoValue, { color: colors.text }]}>1.0.0</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: colors.text }]}>Build</ThemedText>
              <ThemedText style={[styles.infoValue, { color: colors.text }]}>2024.1</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: colors.text }]}>Platform</ThemedText>
              <ThemedText style={[styles.infoValue, { color: colors.text }]}>React Native</ThemedText>
            </View>
          </View>
        </View>

        {}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 16,
    padding: 20,
    ...RetroBorders.bold,
    borderRadius: RetroRadius.xxl,
    backgroundColor: 'transparent',
    ...RetroShadows.soft,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
    ...RetroBorders.sticker,
    borderRadius: RetroRadius.xl,
    marginBottom: 12,
    borderLeftWidth: 4,
    ...RetroShadows.soft,
  },
  dangerCard: {
    ...RetroBorders.sticker,
    borderRadius: RetroRadius.xl,
    marginBottom: 12,
    borderLeftWidth: 4,
    ...RetroShadows.soft,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#000000',
    borderRadius: RetroRadius.sm,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000000',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 18,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    ...RetroBorders.sticker,
    borderRadius: RetroRadius.xl,
    ...RetroShadows.soft,
  },
  userAvatar: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#000000',
    borderRadius: RetroRadius.md,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  infoCard: {
    ...RetroBorders.sticker,
    borderRadius: RetroRadius.xl,
    padding: 16,
    ...RetroShadows.soft,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 20,
  },
});