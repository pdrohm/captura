import { FirebaseTest } from '@/components/FirebaseTest';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useAuthStore } from '@/stores/authStore';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const { user, signOut } = useAuthStore();
  const { auth } = useFirebase();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={require('@/assets/images/partial-react-logo.png')}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.userContainer}>
        <ThemedText type="title">Hello, {user?.displayName || user?.email || 'User'}!</ThemedText>
        <ThemedText>You are signed in with UID: {user?.uid}</ThemedText>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <ThemedText style={styles.signOutButtonText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <FirebaseTest />

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="title">Open up the code for this screen:</ThemedText>
        <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>

        <ThemedText type="title">Change any of the text, save the file, and the app will automatically reload.</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  userContainer: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  signOutButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
