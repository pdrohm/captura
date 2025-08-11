import { useMapState } from '@/src/hooks/useMapState';
import { MapUseCases } from '@/src/services/useCases/mapUseCases';
import { MapLocation, MapViewport, Territory } from '@/src/types/domain';
import { LocationService } from '@/src/types/repositories';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { Region } from 'react-native-maps';

interface UseMapViewProps {
  mapUseCases: MapUseCases;
  locationService: LocationService;
  onLocationPress?: (location: MapLocation) => void;
  onTerritoryPress?: (territory: Territory) => void;
}

export const useMapView = ({
  mapUseCases,
  locationService,
  onLocationPress,
  onTerritoryPress,
}: UseMapViewProps) => {
  const {
    locations,
    territories,
    viewport,
    filters,
    loading,
    error,
    userLocation,
    locationPermissionGranted,
    setViewport,
    addLocation,
    deleteLocation,
    refreshData,
    clearError,
    centerOnUserLocation,
    requestLocationPermission,
    setError,
  } = useMapState(mapUseCases, locationService);

  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);

  const initialRegion: Region = userLocation ? {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : {
    latitude: viewport.latitude,
    longitude: viewport.longitude,
    latitudeDelta: viewport.latitudeDelta,
    longitudeDelta: viewport.longitudeDelta,
  };

  
  const handleLocationPress = useCallback((location: MapLocation) => {
    setSelectedLocation(location);
    setSelectedTerritory(null);
    onLocationPress?.(location);
  }, [onLocationPress]);

  const handleTerritoryPress = useCallback((territory: Territory) => {
    setSelectedTerritory(territory);
    setSelectedLocation(null);
    onTerritoryPress?.(territory);
  }, [onTerritoryPress]);

  const handleMapPress = useCallback((event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation(null);
    setSelectedTerritory(null);
    
    Alert.alert(
      'Add Location',
      'Would you like to add a new location here?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: async () => {
            try {
              const newLocation: Omit<MapLocation, 'id' | 'createdAt' | 'updatedAt'> = {
                latitude,
                longitude,
                title: 'New Location',
                description: 'Tap to edit',
                type: 'point_of_interest',
                metadata: {},
              };
              await addLocation(newLocation);
            } catch (err) {
              Alert.alert('Error', 'Failed to add location');
            }
          },
        },
      ]
    );
  }, [addLocation]);

  const handleRegionChangeComplete = useCallback((region: Region) => {
    const newViewport: MapViewport = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };
    setViewport(newViewport);
  }, [setViewport]);

  const handleDeleteLocation = useCallback(async (id: string) => {
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteLocation(id);
              setSelectedLocation(null);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete location');
            }
          },
        },
      ]
    );
  }, [deleteLocation]);

  const handleCenterOnUserLocation = useCallback(async () => {
    if (!locationPermissionGranted) {
      Alert.alert(
        'Location Permission Required',
        'This app needs location permission to center on your location. Would you like to grant permission?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Grant Permission',
            onPress: requestLocationPermission,
          },
        ]
      );
    } else {
      await centerOnUserLocation();
    }
  }, [locationPermissionGranted, centerOnUserLocation, requestLocationPermission]);

  return {
    // State
    locations,
    territories,
    viewport,
    filters,
    loading,
    error,
    userLocation,
    locationPermissionGranted,
    selectedLocation,
    selectedTerritory,
    initialRegion,
    
    // Actions
    handleLocationPress,
    handleTerritoryPress,
    handleMapPress,
    handleRegionChangeComplete,
    handleDeleteLocation,
    handleCenterOnUserLocation,
    refreshData,
    clearError,
    setError,
    forceRefreshFromUserLocation: centerOnUserLocation,
  };
};
