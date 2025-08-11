import { useFirebase } from '@/src/contexts/FirebaseContext';
import { useAuthStore } from '@/src/stores/authStore';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const FirebaseTest: React.FC = () => {
  const { auth, analytics } = useFirebase();
  const { user, signOut } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleAnonymousSignIn = async () => {
    try {
      setLoading(true);
      await auth.signInAnonymously();
      analytics.logEvent('anonymous_sign_in');
    } catch (error: any) {
      console.error('Anonymous sign in error:', error);
      Alert.alert('Error', 'Failed to sign in anonymously');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      analytics.logEvent('sign_out');
    } catch (error: any) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Test</Text>
      
      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.userText}>User ID: {user.uid}</Text>
          <Text style={styles.userText}>Email: {user.email || 'Anonymous'}</Text>
          <Text style={styles.userText}>Display Name: {user.displayName || 'N/A'}</Text>
          
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignOut}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing Out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.signInSection}>
          <Text style={styles.subtitle}>No user signed in</Text>
          
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAnonymousSignIn}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing In...' : 'Sign In Anonymously'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  userText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  signInSection: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
