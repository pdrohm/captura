
import { ThemedText } from '@/src/components/ThemedText';
import { useAuthStore } from '@/src/stores/authStore';
import { StyleSheet, View } from 'react-native';
import AuthScreen from './AuthScreen';

interface AuthNavigatorProps {
  children: React.ReactNode;
}

export default function AuthNavigator({ children }: AuthNavigatorProps) {
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
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
