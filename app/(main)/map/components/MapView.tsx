import { useConquestMode } from '@/src/hooks/useConquestMode';
import { useMapView } from '@/src/hooks/useMapView';
import { MapUseCases } from '@/src/services/useCases/mapUseCases';
import { MapLocation, Territory } from '@/src/types/domain';
import { LocationService } from '@/src/types/repositories';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { ConquestStatus } from './ConquestStatus';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { MapControls } from './MapControls';
import { MapMarkers } from './MapMarkers';

interface MapViewProps {
  mapUseCases: MapUseCases;
  locationService: LocationService;
  onLocationPress?: (location: MapLocation) => void;
  onTerritoryPress?: (territory: Territory) => void;
  testID?: string;
  userId?: string;
}

export default function MapViewComponent({
  mapUseCases,
  locationService,
  onLocationPress,
  onTerritoryPress,
  testID,
  userId = 'default-user',
}: MapViewProps) {
  const {
    filteredLocations,
    filteredTerritories,
    loading,
    error,
    userLocation,
    locationPermissionGranted,
    initialRegion,
    handleLocationPress,
    handleTerritoryPress,
    handleRegionChangeComplete,
    refreshData,
    clearError,
    handleCenterOnUserLocation,
    getConquestButtonIcon,
    getConquestButtonColor,
    getConquestButtonBackground,
  } = useMapView({
    mapUseCases,
    locationService,
    onLocationPress,
    onTerritoryPress,
  });

  // Conquest mode hook
  const {
    status: conquestStatus,
    trackedPoints,
    totalDistance,
    totalArea,
    startConquest,
    pauseConquest,
    resumeConquest,
    stopConquest,
    cancelConquest,
  } = useConquestMode({
    locationService,
    userId,
  });

  // Conquest mode button handler
  const handleConquestButtonPress = () => {
    if (conquestStatus === 'idle') {
      startConquest();
    } else if (conquestStatus === 'tracking') {
      pauseConquest();
    } else if (conquestStatus === 'paused') {
      resumeConquest();
    }
  };

  if (loading) {
    return (
      <LoadingSpinner
        message="Loading map data..."
        testID={`${testID}-loading`}
      />
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      {/* Error Message Display */}
      <ErrorDisplay
        error={error || ''}
        onRetry={refreshData}
        onDismiss={clearError}
        testID={`${testID}-error`}
      />

      {/* Conquest Status Display */}
      <ConquestStatus
        status={conquestStatus}
        trackedPoints={trackedPoints}
        totalDistance={totalDistance}
        totalArea={totalArea}
        onPause={pauseConquest}
        onResume={resumeConquest}
        onStop={stopConquest}
        onCancel={cancelConquest}
        testID={`${testID}-conquest-status`}
      />

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
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation={locationPermissionGranted}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          testID="map-view"
        >
          <MapMarkers
            filteredLocations={filteredLocations}
            filteredTerritories={filteredTerritories}
            trackedPoints={trackedPoints}
            userLocation={userLocation}
            onLocationPress={handleLocationPress}
            onTerritoryPress={handleTerritoryPress}
          />
        </MapView>

        {/* Map Controls */}
        <MapControls
          conquestStatus={conquestStatus}
          locationPermissionGranted={locationPermissionGranted}
          onConquestPress={handleConquestButtonPress}
          onLocationPress={handleCenterOnUserLocation}
          getConquestButtonIcon={getConquestButtonIcon}
          getConquestButtonColor={getConquestButtonColor}
          getConquestButtonBackground={getConquestButtonBackground}
          testID={`${testID}-controls`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});
