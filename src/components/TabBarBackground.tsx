import { Colors, RetroColors } from '@/src/config/Colors';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={StyleSheet.absoluteFill}>
      {}
      <LinearGradient
        colors={isDark 
          ? [colors.card, colors.surface, colors.card]
          : [colors.card, RetroColors.warmBeige, colors.card]
        }
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      
      {}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: RetroColors.paperGrain,
            opacity: isDark ? 0.08 : 0.05,
          }
        ]}
      />
      
      {}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderWidth: 0,
            borderRadius: 32, 
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