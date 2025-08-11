import React, { useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polygon, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useMapView } from '../hooks/useMapView';
import { MapUseCases } from '@/src/services/useCases/mapUseCases';
import { MapLocation, Territory } from '@/src/types/domain';
import { LocationService } from '@/src/types/repositories';

interface MapViewProps {
  mapUseCases: MapUseCases;
  locationService: LocationService;
  onLocationPress?: (location: MapLocation) => void;
  onTerritoryPress?: (territory: Territory) => void;
  testID?: string;
}

export default function MapViewComponent({
  mapUseCases,
  locationService,
  onLocationPress,
  onTerritoryPress,
  testID,
}: MapViewProps) {
  const {
    locations,
    territories,
    filters,
    loading,
    error,
    userLocation,
    locationPermissionGranted,
    selectedLocation,
    selectedTerritory,
    initialRegion,
    handleLocationPress,
    handleTerritoryPress,
    handleMapPress,
    handleRegionChangeComplete,
    handleDeleteLocation,
    handleCenterOnUserLocation,
    refreshData,
    clearError,
  } = useMapView({
    mapUseCases,
    locationService,
    onLocationPress,
    onTerritoryPress,
  });

  const filteredLocations = useMemo(() => {
    return locations.filter(location => {
      if (location.type === 'territory' && !filters.showTerritories) return false;
      if (location.type === 'point_of_interest' && !filters.showPointsOfInterest) return false;
      if (location.type === 'boundary' && !filters.showBoundaries) return false;
      return true;
    });
  }, [locations, filters]);

  const filteredTerritories = useMemo(() => {
    return territories.filter(territory => {
      if (!filters.showTerritories) return false;
      return true;
    });
  }, [territories, filters]);

  if (error) {
    Alert.alert('Error', error, [
      { text: 'Dismiss', onPress: clearError },
      { text: 'Retry', onPress: refreshData },
    ]);
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
          showsUserLocation={locationPermissionGranted}
          showsMyLocationButton={false} // We'll use our custom button
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

          {/* User Location Marker (if available) */}
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Your Location"
              description="You are here"
              pinColor="purple"
            />
          )}
        </MapView>

        {/* Custom Location Button */}
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleCenterOnUserLocation}
          testID="location-button"
        >
          <Ionicons
            name={locationPermissionGranted ? "location" : "location-outline"}
            size={24}
            color={locationPermissionGranted ? "#007AFF" : "#8E8E93"}
          />
        </TouchableOpacity>
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
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
