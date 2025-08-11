
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Import themes
import { FirebaseProvider } from '@/src/contexts/FirebaseContext';
import { useAuthListener } from '@/src/hooks/useAuthListener';
import { analyticsService, authService, firestoreService, storageService } from '@/src/services/firebase';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import AuthNavigator from './(auth)/AuthNavigator';

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
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </AuthNavigator>
      </ThemeProvider>
    </FirebaseProvider>
  );
}

function AuthListener() {
  useAuthListener();
  return null;
}
