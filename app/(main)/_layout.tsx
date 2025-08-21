import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/src/components/HapticTab';
import { IconSymbol } from '@/src/components/IconSymbol';
import TabBarBackground from '@/src/components/TabBarBackground';
import { useColorScheme } from '@/src/hooks/useColorScheme';

export default function MainTabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            height: 85,
            paddingBottom: 20,
            paddingTop: 10,
          },
          default: {
            backgroundColor: '#FFFFFF',
            height: 65,
            paddingVertical: 8,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        tabBarInactiveTintColor: '#A0A0A0',
      }}>
      <Tabs.Screen
        name="minigames"
        options={{
          title: 'Games',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 28 : 24} 
              name={focused ? "gamecontroller.fill" : "gamecontroller"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Territory',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 32 : 28} 
              name={focused ? "map.fill" : "map"} 
              color={color} 
              style={focused ? { transform: [{ scale: 1.1 }] } : undefined}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 28 : 24} 
              name={focused ? "person.crop.circle.fill" : "person.crop.circle"} 
              color={color} 
            />
          ),
        }}
      />
       <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 28 : 24} 
              name={focused ? "gearshape.fill" : "gearshape"} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
