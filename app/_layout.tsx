import { AuthNavigator } from '@/components/auth/AuthNavigator';
import { FirebaseProvider } from '@/contexts/FirebaseContext';
import { useAuthListener } from '@/hooks/useAuthListener';
import { useColorScheme } from '@/hooks/useColorScheme';
import { analyticsService, authService, firestoreService, storageService } from '@/services/firebase';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Import themes
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <FirebaseProvider
      auth={authService}
      firestore={firestoreService}
      storage={storageService}
      analytics={analyticsService}
    >
      <AuthListener />
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthNavigator>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </AuthNavigator>
      </ThemeProvider>
    </FirebaseProvider>
  );
}

// Separate component to use the auth listener hook
function AuthListener() {
  useAuthListener();
  return null;
}
