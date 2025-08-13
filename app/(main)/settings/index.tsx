import { ColorPicker } from '@/src/components/ColorPicker';
import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { Colors } from '@/src/config/Colors';
import { useFirebase } from '@/src/contexts/FirebaseContext';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { useAuthStore } from '@/src/stores/authStore';
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

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationServicesEnabled, setLocationServicesEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(colorScheme === 'dark');
  const [colorPickerVisible, setColorPickerVisible] = React.useState(false);

  const handleLogout = async () => {
    try {
      if (auth) {
        await auth.signOut();
      }
    } catch (error) {
      // Handle logout error
    }
  };

  const handleClearCache = () => {
    // Handle clear cache
  };

  const handleExportData = () => {
    // Handle export data
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

        {/* Preferences Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingLabel}>Notifications</ThemedText>
              <ThemedText style={styles.settingDescription}>Receive alerts and updates</ThemedText>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor={notificationsEnabled ? colors.background : colors.text}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingLabel}>Location Services</ThemedText>
              <ThemedText style={styles.settingDescription}>Allow app to access location</ThemedText>
            </View>
            <Switch
              value={locationServicesEnabled}
              onValueChange={setLocationServicesEnabled}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor={locationServicesEnabled ? colors.background : colors.text}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingLabel}>Dark Mode</ThemedText>
              <ThemedText style={styles.settingDescription}>Use dark theme</ThemedText>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor={darkModeEnabled ? colors.background : colors.text}
            />
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Data Management</ThemedText>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleClearCache}>
            <ThemedText style={styles.actionButtonText}>Clear Cache</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            <ThemedText style={styles.actionButtonText}>Export Data</ThemedText>
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
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
