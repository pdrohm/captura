import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { Colors, RetroColors } from '@/src/config/Colors';

export default function BlurTabBarBackground() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  return (
    <View 
      style={[
        StyleSheet.absoluteFill, 
        { 
          backgroundColor: colorScheme === 'light' 
            ? RetroColors.paperBackground 
            : colors.surface,
        }
      ]} 
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
