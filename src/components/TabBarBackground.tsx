import { Colors, RetroColors } from '@/src/config/Colors';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

// Retro-cartoon sticker-like tab bar background
export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Paper-like gradient background */}
      <LinearGradient
        colors={isDark 
          ? [colors.card, colors.surface, colors.card]
          : [colors.card, RetroColors.warmBeige, colors.card]
        }
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Subtle paper texture overlay */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: RetroColors.paperGrain,
            opacity: isDark ? 0.08 : 0.05,
          }
        ]}
      />
      
      {/* Sticker-like border effect */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderWidth: 0,
            borderRadius: 32, // Match the tab bar border radius
            backgroundColor: 'transparent',
          }
        ]}
      />
    </View>
  );
}

export function useBottomTabOverflow() {
  return 0;
}
