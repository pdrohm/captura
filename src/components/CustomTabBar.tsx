import { Colors, RetroColors } from '@/src/config/Colors';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './IconSymbol';

/**
 * Custom Retro-Cartoon Tab Bar
 * Beautiful paper-like floating sticker design
 */
export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colors = Colors.light;

  const getTabIcon = (routeName: string, focused: boolean) => {
    const size = focused ? 28 : 24;
    const color = focused ? colors.tabIconSelected : colors.tabIconDefault;

    switch (routeName) {
      case 'minigames':
        return (
          <IconSymbol 
            size={size} 
            name={focused ? "gamecontroller.fill" : "gamecontroller"} 
            color={color}
          />
        );
      case 'map':
        return (
          <IconSymbol 
            size={size} 
            name={focused ? "map.fill" : "map"} 
            color={color}
          />
        );
      case 'profile':
        return (
          <IconSymbol 
            size={size} 
            name={focused ? "person.crop.circle.fill" : "person.crop.circle"} 
            color={color}
          />
        );
      case 'settings':
        return (
          <IconSymbol 
            size={size} 
            name={focused ? "gearshape.fill" : "gearshape"} 
            color={color}
          />
        );
      default:
        return null;
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'minigames':
        return 'Games';
      case 'map':
        return 'Territory';
      case 'profile':
        return 'Profile';
      case 'settings':
        return 'Settings';
      default:
        return routeName;
    }
  };

  return (
    <View style={styles.container}>
      {/* Paper-like background with gradient */}
      <LinearGradient
        colors={[colors.card, RetroColors.warmBeige, colors.card]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Subtle paper texture */}
      <View style={[StyleSheet.absoluteFill, styles.paperTexture]} />
      
      {/* Tab buttons */}
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={[
                styles.tabButton,
                isFocused && styles.tabButtonFocused
              ]}
              activeOpacity={0.7}
            >
              {/* Icon */}
              <View style={[
                styles.iconContainer,
                isFocused && styles.iconContainerFocused
              ]}>
                {getTabIcon(route.name, isFocused)}
              </View>
              
              {/* Label */}
              <Text style={[
                styles.tabLabel,
                isFocused ? styles.tabLabelFocused : styles.tabLabelInactive
              ]}>
                {getTabLabel(route.name)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.select({ ios: 12, default: 8 }),
    left: 16,
    right: 16,
    height: Platform.select({ ios: 85, default: 75 }),
    borderRadius: 32,
    borderWidth: 3,
    borderColor: Colors.light.border,
    shadowColor: Colors.light.border,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  
  paperTexture: {
    backgroundColor: RetroColors.paperGrain,
    opacity: 0.05,
  },
  
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: 20, default: 8 }),
  },
  
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    minHeight: 50,
  },
  
  tabButtonFocused: {
    backgroundColor: 'rgba(191, 162, 219, 0.1)', // Very subtle purple background
  },
  
  iconContainer: {
    marginBottom: 4,
    transform: [{ scale: 1 }],
  },
  
  iconContainerFocused: {
    transform: [{ scale: 1.1 }],
  },
  
  tabLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
    }),
  },
  
  tabLabelFocused: {
    color: Colors.light.tabIconSelected, // Purple
  },
  
  tabLabelInactive: {
    color: Colors.light.tabIconDefault, // Muted brown
  },
});
