import { useMapView } from '@/src/hooks/useMapView';
import { MapUseCases } from '@/src/services/useCases/mapUseCases';
import { MapLocation, Territory } from '@/src/types/domain';
import { LocationService } from '@/src/types/repositories';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';

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
    forceRefreshFromUserLocation,
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

  const handleDebugLocation = async () => {
    try {
      const status = await locationService.getLocationProviderStatus();
      const message = `Location Status:
• Services Enabled: ${status.locationServicesEnabled ? '✅' : '❌'}
• Permission: ${status.permissionStatus}
• Accuracy: ${status.accuracy}

Current User Location: ${userLocation ? 
  `\n• Lat: ${userLocation.latitude.toFixed(6)}
• Lng: ${userLocation.longitude.toFixed(6)}` : 
  '❌ Not available'}

Permission Granted: ${locationPermissionGranted ? '✅' : '❌'}`;

      Alert.alert('Location Debug Info', message, [
        { text: 'OK' },
        { 
          text: 'Test Location', 
          onPress: async () => {
            try {
              const location = await locationService.getCurrentLocation();
              Alert.alert('Location Test', 
                `Success! Your device coordinates:\nLat: ${location.latitude.toFixed(6)}\nLng: ${location.longitude.toFixed(6)}`);
            } catch (err) {
              Alert.alert('Location Test Failed', 
                `Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
          }
        },
        {
          text: 'Reset Location',
          style: 'destructive',
          onPress: async () => {
            try {
              await mapUseCases.clearViewport();
              Alert.alert('Reset Complete', 'Saved location has been cleared. The app will now request fresh GPS coordinates.');
              setTimeout(() => {
                forceRefreshFromUserLocation();
              }, 1000);
            } catch (err) {
              Alert.alert('Reset Failed', `Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
          }
        }
      ]);
    } catch (err) {
      Alert.alert('Debug Error', `Failed to get debug info: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  React.useEffect(() => {
    if (userLocation && locationPermissionGranted) {
      // Auto-center map on user location when it becomes available
    }
  }, [userLocation, locationPermissionGranted]);

  return (
    <View style={styles.container} testID={testID}>
      {/* Error Message Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <View style={styles.errorButtons}>
            <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearErrorButton} onPress={clearError}>
              <Text style={styles.clearErrorButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          key={userLocation ? `map-${userLocation.latitude}-${userLocation.longitude}` : 'map-default'}
          style={styles.map}
          initialRegion={initialRegion}
          region={userLocation ? {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          } : undefined}
          onPress={handleMapPress}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation={locationPermissionGranted}
          showsMyLocationButton={false}
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

        {/* Debug Button */}
        <TouchableOpacity
          style={styles.debugButton}
          onPress={handleDebugLocation}
          testID="debug-button"
        >
          <Ionicons name="bug" size={20} color="#FF9500" />
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
  errorButtons: {
    flexDirection: 'row',
    gap: 10,
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
  debugButton: {
    position: 'absolute',
    top: 20,
    left: 20,
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
