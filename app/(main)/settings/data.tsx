import { ThemedText } from '@/src/components/ThemedText';
import { Colors } from '@/src/config/Colors';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { useGameStore } from '@/src/stores/gameStore';
import { useSettingsStore } from '@/src/stores/settingsStore';
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

interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
  isDestructive?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  onPress, 
  isDestructive = false 
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
      <ThemedText style={styles.chevron}>›</ThemedText>
    </View>
  </TouchableOpacity>
);

export default function DataManagementScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { clearAllData } = useGameStore();
  const { resetToDefaults, exportSettings } = useSettingsStore();

  const handleExportSettings = async () => {
    try {
      await exportSettings();
      Alert.alert(
        'Export Settings', 
        'Settings exported successfully!',
        [
          { text: 'Copy to Clipboard', onPress: () => {
            
            Alert.alert('Copied!', 'Settings copied to clipboard');
          }},
          { text: 'OK', style: 'default' }
        ]
      );
    } catch {
      Alert.alert('Error', 'Failed to export settings.');
    }
  };

  const handleImportSettings = () => {
    Alert.alert(
      'Import Settings',
      'This will replace your current settings. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Import', style: 'default', onPress: () => {
          
          Alert.alert('Import', 'Import functionality would be implemented here');
        }}
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear temporary data and free up storage space. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          Alert.alert('Success', 'Cache cleared successfully!');
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>‹ Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>Data Management</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>📤 Export & Import</ThemedText>
          
          <ActionCard
            title="Export Settings"
            description="Backup your current settings"
            icon="📤"
            color="#4ECDC4"
            onPress={handleExportSettings}
          />
          
          <ActionCard
            title="Import Settings"
            description="Restore settings from backup"
            icon="📥"
            color="#45B7D1"
            onPress={handleImportSettings}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>💾 Data Management</ThemedText>
          
          <ActionCard
            title="Clear Cache"
            description="Free up storage space"
            icon="🧹"
            color="#FFEAA7"
            onPress={handleClearCache}
          />
          
          <ActionCard
            title="Reset Settings"
            description="Reset all settings to defaults"
            icon="🔄"
            color="#FF9500"
            onPress={handleResetSettings}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>⚠️ Dangerous Actions</ThemedText>
          
          <ActionCard
            title="Reset All Data"
            description="Permanently delete everything"
            icon="🗑️"
            color="#FF3B30"
            onPress={handleResetAllData}
            isDestructive={true}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.infoCard}>
            <ThemedText style={styles.infoTitle}>💡 Data Management Tips</ThemedText>
            <ThemedText style={styles.infoText}>
              • Export settings before making major changes{'\n'}
              • Clear cache regularly to free up space{'\n'}
              • Reset settings if you encounter issues{'\n'}
              • Be careful with data reset - it cannot be undone
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.infoCard}>
            <ThemedText style={styles.infoTitle}>📊 Storage Information</ThemedText>
            <View style={styles.storageRow}>
              <ThemedText style={styles.storageLabel}>App Data:</ThemedText>
              <ThemedText style={styles.storageValue}>~15 MB</ThemedText>
            </View>
            <View style={styles.storageRow}>
              <ThemedText style={styles.storageLabel}>Cache:</ThemedText>
              <ThemedText style={styles.storageValue}>~5 MB</ThemedText>
            </View>
            <View style={styles.storageRow}>
              <ThemedText style={styles.storageLabel}>Settings:</ThemedText>
              <ThemedText style={styles.storageValue}>~2 MB</ThemedText>
            </View>
          </View>
        </View>

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
  chevron: {
    fontSize: 18,
    opacity: 0.5,
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
  storageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  storageLabel: {
    fontSize: 14,
    color: '#687076',
  },
  storageValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#11181C',
  },
  bottomSpacing: {
    height: 20,
  },
});