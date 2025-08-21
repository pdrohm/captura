import { ColorPicker } from '@/src/components/ColorPicker';
import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { Colors } from '@/src/config/Colors';
import { useFirebase } from '@/src/contexts/FirebaseContext';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { useAuthStore } from '@/src/stores/authStore';
import { useGameStore } from '@/src/stores/gameStore';
import { useAppPreferences, useGameSettings, usePrivacySettings, useSettingsStore } from '@/src/stores/settingsStore';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { auth } = useFirebase();
  const { user, updateUserColor } = useAuthStore();
  const { clearAllData } = useGameStore();
  
  // Settings hooks
  const gameSettings = useGameSettings();
  const appPreferences = useAppPreferences();
  const privacySettings = usePrivacySettings();
  const { resetToDefaults, exportSettings, importSettings } = useSettingsStore();

  const [colorPickerVisible, setColorPickerVisible] = React.useState(false);

  const handleSettingToggle = (setting: keyof typeof gameSettings | keyof typeof appPreferences | keyof typeof privacySettings) => {
    if (gameSettings.haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (setting in gameSettings) {
      gameSettings.toggleSetting(setting as any);
    } else if (setting in appPreferences) {
      appPreferences.toggleSetting(setting as any);
    } else if (setting in privacySettings) {
      privacySettings.toggleSetting(setting as any);
    }
  };

  const handleLogout = async () => {
    try {
      if (auth) {
        await auth.signOut();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear temporary data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          // Clear cache logic here
          Alert.alert('Success', 'Cache cleared successfully!');
        }}
      ]
    );
  };

  const handleExportSettings = async () => {
    try {
      const settingsJson = await exportSettings();
      // In a real app, you'd use a share dialog or save to file
      Alert.alert('Export Settings', `Settings exported:\n${settingsJson.substring(0, 100)}...`);
    } catch (error) {
      Alert.alert('Error', 'Failed to export settings.');
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

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to their default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => {
          resetToDefaults();
          Alert.alert('Success', 'Settings reset to defaults!');
        }}
      ]
    );
  };

  const handleColorSelect = async (color: string) => {
    try {
      if (auth) {
        await updateUserColor(auth, color);
        setColorPickerVisible(false);
        Alert.alert('Success', 'Your territory color has been updated!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update color. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Settings</ThemedText>
          <ThemedText style={styles.subtitle}>Customize your app experience</ThemedText>
        </View>

        {/* User Profile Section */}
        {user && (
          <ThemedView style={styles.section}>
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
            </View>

            <TouchableOpacity 
              style={styles.colorPickerButton} 
              onPress={() => setColorPickerVisible(!colorPickerVisible)}
            >
              <View style={styles.colorPickerRow}>
                <View style={styles.colorPickerInfo}>
                  <ThemedText style={styles.settingLabel}>Territory Color</ThemedText>
                  <ThemedText style={styles.settingDescription}>
                    Color used for your conquered territories
                  </ThemedText>
                </View>
                <View style={[styles.colorPreview, { backgroundColor: user.color || '#007AFF' }]} />
              </View>
            </TouchableOpacity>

            {colorPickerVisible && (
              <View style={styles.colorPickerContainer}>
                <ColorPicker
                  selectedColor={user.color || undefined}
                  onColorSelect={handleColorSelect}
                />
              </View>
            )}
          </ThemedView>
        )}

        {/* Game Settings Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>🎮 Game Settings</ThemedText>
          
          <SettingItem
            title="Sound Effects"
            description="Play audio feedback and music"
            icon="🔊"
            enabled={gameSettings.sound}
            onToggle={() => handleSettingToggle('sound')}
            colors={colors}
          />
          
          <SettingItem
            title="Haptic Feedback"
            description="Feel vibrations for interactions"
            icon="📱"
            enabled={gameSettings.haptics}
            onToggle={() => handleSettingToggle('haptics')}
            colors={colors}
          />
          
          <SettingItem
            title="Notifications"
            description="Receive game alerts and updates"
            icon="🔔"
            enabled={gameSettings.notifications}
            onToggle={() => handleSettingToggle('notifications')}
            colors={colors}
          />
          
          <SettingItem
            title="Animations"
            description="Enable smooth animations"
            icon="✨"
            enabled={gameSettings.animationsEnabled}
            onToggle={() => handleSettingToggle('animationsEnabled')}
            colors={colors}
          />
          
          <SettingItem
            title="Particle Effects"
            description="Show visual effects and particles"
            icon="🎆"
            enabled={gameSettings.particleEffects}
            onToggle={() => handleSettingToggle('particleEffects')}
            colors={colors}
          />
        </View>

        {/* App Preferences Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>📱 App Preferences</ThemedText>
          
          <SettingItem
            title="Dark Mode"
            description="Use dark theme"
            icon="🌙"
            enabled={appPreferences.darkMode}
            onToggle={() => handleSettingToggle('darkMode')}
            colors={colors}
          />
          
          <SettingItem
            title="Location Services"
            description="Allow app to access location"
            icon="📍"
            enabled={appPreferences.locationServices}
            onToggle={() => handleSettingToggle('locationServices')}
            colors={colors}
          />
          
          <SettingItem
            title="Auto Save"
            description="Automatically save progress"
            icon="💾"
            enabled={appPreferences.autoSave}
            onToggle={() => handleSettingToggle('autoSave')}
            colors={colors}
          />
          
          <SettingItem
            title="Show Tutorial"
            description="Display tutorial hints"
            icon="🎓"
            enabled={appPreferences.showTutorial}
            onToggle={() => handleSettingToggle('showTutorial')}
            colors={colors}
          />
        </View>

        {/* Privacy Settings Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>🔒 Privacy</ThemedText>
          
          <SettingItem
            title="Share Location"
            description="Share location with other players"
            icon="🗺️"
            enabled={privacySettings.shareLocation}
            onToggle={() => handleSettingToggle('shareLocation')}
            colors={colors}
          />
          
          <SettingItem
            title="Share Stats"
            description="Show your stats to friends"
            icon="📊"
            enabled={privacySettings.shareStats}
            onToggle={() => handleSettingToggle('shareStats')}
            colors={colors}
          />
          
          <SettingItem
            title="Analytics"
            description="Help improve the app"
            icon="📈"
            enabled={privacySettings.allowAnalytics}
            onToggle={() => handleSettingToggle('allowAnalytics')}
            colors={colors}
          />
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>💾 Data Management</ThemedText>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleClearCache}>
            <ThemedText style={styles.actionButtonText}>🧹 Clear Cache</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleExportSettings}>
            <ThemedText style={styles.actionButtonText}>📤 Export Settings</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleResetSettings}>
            <ThemedText style={styles.actionButtonText}>🔄 Reset Settings</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleResetAllData}>
            <ThemedText style={[styles.actionButtonText, styles.dangerButtonText]}>🗑️ Reset All Data</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          
          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleLogout}>
            <ThemedText style={[styles.actionButtonText, styles.dangerButtonText]}>Logout</ThemedText>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>App Information</ThemedText>
          
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Version</ThemedText>
            <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
          </View>
          
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Build</ThemedText>
            <ThemedText style={styles.infoValue}>2024.1</ThemedText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface SettingItemProps {
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  onToggle: () => void;
  colors: any;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  title, 
  description, 
  icon, 
  enabled, 
  onToggle, 
  colors 
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onToggle}>
    <View style={styles.settingLeft}>
      <ThemedText style={styles.settingIcon}>{icon}</ThemedText>
      <View style={styles.settingInfo}>
        <ThemedText style={styles.settingLabel}>{title}</ThemedText>
        <ThemedText style={styles.settingDescription}>{description}</ThemedText>
      </View>
    </View>
    <Switch
      value={enabled}
      onValueChange={onToggle}
      trackColor={{ false: colors.border, true: colors.tint }}
      thumbColor={enabled ? colors.background : colors.text}
    />
  </TouchableOpacity>
);

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
    fontSize: 28,
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.6,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  dangerButtonText: {
    color: '#fff',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  infoLabel: {
    fontSize: 16,
    opacity: 0.8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 16,
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
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  colorPickerButton: {
    marginBottom: 16,
  },
  colorPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  colorPickerInfo: {
    flex: 1,
    marginRight: 16,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  colorPickerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
});
