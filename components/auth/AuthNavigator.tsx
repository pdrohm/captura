import { ThemedText } from '@/components/ThemedText';
import { useAuthStore } from '@/stores/authStore';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthScreen } from './AuthScreen';

interface AuthNavigatorProps {
  children: React.ReactNode;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText type="title">Loading...</ThemedText>
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
