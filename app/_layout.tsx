import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { FirebaseProvider } from '@/src/contexts/FirebaseContext';
import { useAuthListener } from '@/src/hooks/useAuthListener';
import { useDailyReset } from '@/src/hooks/useDailyReset';
import { analyticsService, authService, firestoreService, storageService } from '@/src/services/firebase';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import AuthNavigator from './(auth)/AuthNavigator';

export default function RootLayout() {
  return (
    <FirebaseProvider
      auth={authService}
      firestore={firestoreService}
      storage={storageService}
      analytics={analyticsService}
    >
      <AuthListener />
      <ThemeProvider value={DefaultTheme}>
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
  useDailyReset(); 
  return null;
}