import { ThemedText } from '@/src/components/ThemedText';
import { Colors } from '@/src/config/Colors';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { useGameSettings } from '@/src/stores/settingsStore';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function GameSettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const gameSettings = useGameSettings();

  const handleSettingToggle = (setting: keyof typeof gameSettings) => {
    if (gameSettings.haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    gameSettings.toggleSetting(setting);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>‹ Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>Game Settings</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>🔊 Audio</ThemedText>
          
          <SettingItem
            title="Sound Effects"
            description="Play audio feedback for game actions"
            icon="🔊"
            enabled={gameSettings.sound}
            onToggle={() => handleSettingToggle('sound')}
            colors={colors}
          />
        </View>

        {}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>📱 Feedback</ThemedText>
          
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
        </View>

        {}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>✨ Visual Effects</ThemedText>
          
          <SettingItem
            title="Animations"
            description="Enable smooth animations and transitions"
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

        {}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <ThemedText style={styles.infoTitle}>💡 Tips</ThemedText>
            <ThemedText style={styles.infoText}>
              • Disable animations if you experience performance issues{'\n'}
              • Haptic feedback works best on newer devices{'\n'}
              • Sound effects enhance the gaming experience
            </ThemedText>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
    padding: 16,
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
    color: '#11181C',
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.6,
    color: '#687076',
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
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#11181C',
  },
  infoText: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
    color: '#687076',
  },
  bottomSpacing: {
    height: 20,
  },
});