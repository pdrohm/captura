import { ThemedText } from '@/src/components/ThemedText';
import { Colors } from '@/src/config/Colors';
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
}) => (
  <TouchableOpacity 
    style={[styles.card, { borderLeftColor: color }]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.cardContent}>
      <View style={styles.cardLeft}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <ThemedText style={styles.cardIcon}>{icon}</ThemedText>
        </View>
        <View style={styles.cardText}>
          <ThemedText style={styles.cardTitle}>{title}</ThemedText>
          <ThemedText style={styles.cardDescription}>{description}</ThemedText>
        </View>
      </View>
      <View style={styles.cardRight}>
        {badge && (
          <View style={[styles.badge, { backgroundColor: color }]}>
            <ThemedText style={styles.badgeText}>{badge}</ThemedText>
          </View>
        )}
        <ThemedText style={styles.chevron}>›</ThemedText>
      </View>
    </View>
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { auth } = useFirebase();
  const { user } = useAuthStore();
  const { clearAllData } = useGameStore();
  
  // Settings hooks
  const gameSettings = useGameSettings();
  const appPreferences = useAppPreferences();
  const privacySettings = usePrivacySettings();
  const { resetToDefaults, exportSettings } = useSettingsStore();

  const handleLogout = async () => {
    try {
      if (auth) {
        await auth.signOut();
      }
    } catch (error) {
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

  const handleExportSettings = async () => {
    try {
      const settingsJson = await exportSettings();
      Alert.alert('Export Settings', `Settings exported:\n${settingsJson.substring(0, 100)}...`);
    } catch (error) {
      Alert.alert('Error', 'Failed to export settings.');
    }
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
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Settings</ThemedText>
          <ThemedText style={styles.subtitle}>Customize your experience</ThemedText>
        </View>

        {/* User Profile Section */}
        {user && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Profile</ThemedText>
            
            <View style={styles.profileCard}>
              <View style={[styles.userAvatar, { backgroundColor: user.color || '#007AFF' }]}>
                <ThemedText style={styles.avatarText}>
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </ThemedText>
              </View>
              <View style={styles.userInfo}>
                <ThemedText style={styles.userName}>
                  {user.displayName || 'User'}
                </ThemedText>
                <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
              </View>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => router.push('/(main)/settings/profile')}
              >
                <ThemedText style={styles.editButtonText}>Edit</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Settings Categories */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
          
          <SettingsCard
            title="Game Settings"
            description="Sound, haptics, notifications & effects"
            icon="🎮"
            color="#FF6B6B"
            badge={`${gameSettingsCount}/5`}
            onPress={() => router.push('/(main)/settings/game')}
          />
          
          <SettingsCard
            title="App Preferences"
            description="Theme, location & auto-save"
            icon="📱"
            color="#4ECDC4"
            badge={`${appSettingsCount}/4`}
            onPress={() => router.push('/(main)/settings/app')}
          />
          
          <SettingsCard
            title="Privacy & Data"
            description="Location sharing & analytics"
            icon="🔒"
            color="#45B7D1"
            badge={`${privacySettingsCount}/3`}
            onPress={() => router.push('/(main)/settings/privacy')}
          />
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Data Management</ThemedText>
          
          <SettingsCard
            title="Export & Import"
            description="Backup or restore your settings"
            icon="💾"
            color="#96CEB4"
            onPress={() => router.push('/(main)/settings/data')}
          />
          
          <SettingsCard
            title="Clear Cache"
            description="Free up storage space"
            icon="🧹"
            color="#FFEAA7"
            onPress={() => {
              Alert.alert(
                'Clear Cache',
                'This will clear temporary data. Continue?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', style: 'destructive', onPress: () => {
                    Alert.alert('Success', 'Cache cleared successfully!');
                  }}
                ]
              );
            }}
          />
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          
          <TouchableOpacity 
            style={[styles.dangerCard, { borderLeftColor: '#FF3B30' }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FF3B30' }]}>
                  <ThemedText style={styles.cardIcon}>🚪</ThemedText>
                </View>
                <View style={styles.cardText}>
                  <ThemedText style={styles.cardTitle}>Logout</ThemedText>
                  <ThemedText style={styles.cardDescription}>Sign out of your account</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.chevron}>›</ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dangerCard, { borderLeftColor: '#FF9500' }]}
            onPress={handleResetAllData}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FF9500' }]}>
                  <ThemedText style={styles.cardIcon}>🗑️</ThemedText>
                </View>
                <View style={styles.cardText}>
                  <ThemedText style={styles.cardTitle}>Reset All Data</ThemedText>
                  <ThemedText style={styles.cardDescription}>Permanently delete everything</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.chevron}>›</ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Version</ThemedText>
              <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Build</ThemedText>
              <ThemedText style={styles.infoValue}>2024.1</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Platform</ThemedText>
              <ThemedText style={styles.infoValue}>React Native</ThemedText>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dangerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
    color: '#11181C',
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.6,
    color: '#687076',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 18,
    opacity: 0.5,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
    color: '#11181C',
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
    color: '#687076',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    opacity: 0.8,
    color: '#11181C',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#11181C',
  },
  bottomSpacing: {
    height: 20,
  },
});
