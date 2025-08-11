import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { MapUseCases } from '@/src/services/useCases/mapUseCases';
import { MapLocation, Territory } from '@/src/types/domain';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { useMapView } from '../hooks/useMapView';

interface MapViewProps {
  mapUseCases: MapUseCases;
  onLocationPress?: (location: MapLocation) => void;
  onTerritoryPress?: (territory: Territory) => void;
  testID?: string;
}

export default function MapViewComponent({
  mapUseCases,
  onLocationPress,
  onTerritoryPress,
  testID,
}: MapViewProps) {
  const {
    loading,
    error,
    initialRegion,
    filteredLocations,
    filteredTerritories,
    handleLocationPress,
    handleTerritoryPress,
    handleMapPress,
    handleRegionChangeComplete,
    refreshData,
    clearError,
  } = useMapView({
    mapUseCases,
    onLocationPress,
    onTerritoryPress,
  });

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer} testID={`${testID}-loading`}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading map data...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer} testID={`${testID}-error`}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearErrorButton} onPress={clearError}>
          <ThemedText style={styles.clearErrorButtonText}>Clear Error</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          onPress={handleMapPress}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
          testID="map-view"
        >
          {/* Plot Locations as Markers */}
          {filteredLocations.map(location => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={location.title}
              description={location.description}
              onPress={() => handleLocationPress(location)}
              pinColor={
                location.type === 'territory' ? 'blue' :
                location.type === 'point_of_interest' ? 'red' : 'green'
              }
            />
          ))}

          {/* Plot Territories as Polygons */}
          {filteredTerritories.map(territory => (
            <Polygon
              key={territory.id}
              coordinates={territory.boundaries.map(boundary => ({
                latitude: boundary.latitude,
                longitude: boundary.longitude,
              }))}
              fillColor="rgba(0, 122, 255, 0.2)"
              strokeColor="rgba(0, 122, 255, 0.8)"
              strokeWidth={2}
              onPress={() => handleTerritoryPress(territory)}
            />
          ))}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#FF3B30',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  clearErrorButton: {
    backgroundColor: '#8E8E93',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearErrorButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});
