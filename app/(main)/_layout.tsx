import { Tabs } from 'expo-router';
import React from 'react';

import { CustomTabBar } from '@/src/components/CustomTabBar';

export default function MainTabLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="minigames"
        options={{
          title: 'Games',
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Territory',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
