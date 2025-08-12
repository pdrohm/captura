import MapViewComponent from '@/app/(main)/map/components/MapView';
import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { useFirebase } from '@/src/contexts/FirebaseContext';
import { LocationService } from '@/src/services/locationService';
import { MockMapRepository } from '@/src/services/mockMapRepository';
import { MapUseCasesImpl } from '@/src/services/useCases/mapUseCases';
import { useAuthStore } from '@/src/stores/authStore';
import { MapLocation, Territory } from '@/src/types/domain';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function MapScreen() {
  const { user, signOut } = useAuthStore();
  const { auth } = useFirebase();

  console.log('user', user);

  // Initialize map services (in a real app, this would come from dependency injection)
  const mapRepository = new MockMapRepository();
  const mapUseCases = new MapUseCasesImpl(mapRepository);
  const locationService = new LocationService();

  const handleLocationPress = (location: MapLocation) => {
    // Handle location press
  };

  const handleTerritoryPress = (territory: Territory) => {
    // Handle territory press
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.title}>Captura!!!</ThemedText>
          <ThemedText style={styles.subtitle}>
            Welcome, {user?.displayName || user?.email || 'User'}!
          </ThemedText>
        </View>
      </View>

      {/* Map View */}
      <MapViewComponent
        mapUseCases={mapUseCases}
        locationService={locationService}
        onLocationPress={handleLocationPress}
        onTerritoryPress={handleTerritoryPress}
        testID="map-view"
        userId={user?.uid || 'default-user'}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 122, 255, 0.2)',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  signOutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
