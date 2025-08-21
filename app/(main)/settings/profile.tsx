import { ColorPicker } from '@/src/components/ColorPicker';
import { ThemedText } from '@/src/components/ThemedText';
import { Colors } from '@/src/config/Colors';
import { useFirebase } from '@/src/contexts/FirebaseContext';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { useAuthStore } from '@/src/stores/authStore';
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

export default function ProfileSettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { auth } = useFirebase();
  const { user, updateUserColor } = useAuthStore();
  const [colorPickerVisible, setColorPickerVisible] = React.useState(false);
  const [userColorPickerVisible, setUserColorPickerVisible] = React.useState(false);

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

  const handleUserColorSelect = async (color: string) => {
    try {
      if (auth) {
        await updateUserColor(auth, color);
        setUserColorPickerVisible(false);
        Alert.alert('Success', 'Your player color has been updated!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update player color. Please try again.');
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing functionality would be implemented here');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change functionality would be implemented here');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Account', style: 'destructive', onPress: () => {
          Alert.alert('Account Deleted', 'Your account has been deleted.');
        }}
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ThemedText style={styles.backButtonText}>‹ Back</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.title}>Profile</ThemedText>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContent}>
          <ThemedText style={styles.errorText}>User not found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>‹ Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>Profile Settings</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Profile Information</ThemedText>
          
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
              <ThemedText style={styles.userId}>ID: {user.uid}</ThemedText>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account Settings</ThemedText>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleEditProfile}
          >
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>👤</ThemedText>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingLabel}>Edit Profile</ThemedText>
                <ThemedText style={styles.settingDescription}>Change your display name and photo</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.chevron}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleChangePassword}
          >
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>🔐</ThemedText>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingLabel}>Change Password</ThemedText>
                <ThemedText style={styles.settingDescription}>Update your account password</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.chevron}>›</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Game Settings */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Game Settings</ThemedText>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setColorPickerVisible(!colorPickerVisible)}
          >
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>🎨</ThemedText>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingLabel}>Territory Color</ThemedText>
                <ThemedText style={styles.settingDescription}>Color used for your conquered territories</ThemedText>
              </View>
            </View>
            <View style={styles.colorPreview}>
              <View style={[styles.colorCircle, { backgroundColor: user.color || '#007AFF' }]} />
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

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setUserColorPickerVisible(!userColorPickerVisible)}
          >
            <View style={styles.settingLeft}>
              <ThemedText style={styles.settingIcon}>👤</ThemedText>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingLabel}>Player Color</ThemedText>
                <ThemedText style={styles.settingDescription}>Your personal color for territories</ThemedText>
              </View>
            </View>
            <View style={styles.colorPreview}>
              <View style={[styles.colorCircle, { backgroundColor: user.color || '#007AFF' }]} />
            </View>
          </TouchableOpacity>

          {userColorPickerVisible && (
            <View style={styles.colorPickerContainer}>
              <ColorPicker
                selectedColor={user.color || undefined}
                onColorSelect={handleUserColorSelect}
              />
            </View>
          )}
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account Actions</ThemedText>
          
          <TouchableOpacity 
            style={[styles.dangerCard, { borderLeftColor: '#FF3B30' }]}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FF3B30' }]}>
                  <ThemedText style={styles.cardIcon}>🗑️</ThemedText>
                </View>
                <View style={styles.cardText}>
                  <ThemedText style={styles.cardTitle}>Delete Account</ThemedText>
                  <ThemedText style={styles.cardDescription}>Permanently delete your account</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.chevron}>›</ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <ThemedText style={styles.infoTitle}>📋 Account Information</ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Account Created:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {user.metadata?.creationTime ? 
                  new Date(user.metadata.creationTime).toLocaleDateString() : 
                  'Unknown'
                }
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Last Sign In:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {user.metadata?.lastSignInTime ? 
                  new Date(user.metadata.lastSignInTime).toLocaleDateString() : 
                  'Unknown'
                }
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Email Verified:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {user.emailVerified ? 'Yes' : 'No'}
              </ThemedText>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
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
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    color: '#11181C',
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 4,
    color: '#687076',
  },
  userId: {
    fontSize: 12,
    opacity: 0.5,
    color: '#687076',
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
  colorPreview: {
    marginRight: 8,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  chevron: {
    fontSize: 18,
    opacity: 0.5,
  },
  colorPickerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  dangerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    marginBottom: 12,
    color: '#11181C',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#687076',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#11181C',
  },
  bottomSpacing: {
    height: 20,
  },
});
