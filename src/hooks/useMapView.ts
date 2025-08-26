import { useMapStoreSync } from '@/src/hooks/useMapStoreSync';
import { MapUseCases } from '@/src/services/useCases/mapUseCases';
import { MapLocation, Territory } from '@/src/types/domain';
import { LocationService } from '@/src/types/repositories';
import { useCallback, useMemo } from 'react';
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
    viewport,
    currentRegion,
    hasUserInteracted,
    locations,
    territories,
    filters,
    userLocation,
    locationPermissionGranted,
    conquestStatus,
    trackedPoints,
    loading,
    error,
    selectedLocation,
    selectedTerritory,
    
    setSelectedLocation,
    setSelectedTerritory,
    handleRegionChangeComplete,
    handleAddLocation,
    handleUpdateLocation,
    handleDeleteLocation,
    centerOnUserLocationPreservingZoom,
    requestLocationPermission,
    loadInitialData,
    clearError,
    
    startConquest,
    pauseConquest,
    resumeConquest,
    stopConquest,
    cancelConquest,
    addManualPoint, // Add this for debugging
  } = useMapStoreSync({ mapUseCases, locationService });

  // Compute initial region for map
  const initialRegion: Region = useMemo(() => {
    if (currentRegion) {
      return currentRegion;
    }
    
    if (userLocation) {
      return {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    
    return {
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      latitudeDelta: viewport.latitudeDelta,
      longitudeDelta: viewport.longitudeDelta,
    };
  }, [currentRegion, userLocation, viewport]);

  // Filtered data computations
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

  // Conquest mode button handlers
  const getConquestButtonIcon = useCallback((conquestStatus: string) => {
    switch (conquestStatus) {
      case 'idle':
      case 'completed':
        return 'play-circle';
      case 'tracking':
        return 'pause-circle';
      case 'paused':
        return 'play-circle';
      default:
        return 'play-circle';
    }
  }, []);

  const getConquestButtonColor = useCallback((conquestStatus: string) => {
    switch (conquestStatus) {
      case 'idle':
      case 'completed':
        return '#007AFF';
      case 'tracking':
        return '#FF9500';
      case 'paused':
        return '#34C759';
      default:
        return '#007AFF';
    }
  }, []);

  const getConquestButtonBackground = useCallback(() => {
    return '#fff';
  }, []);

  // Enhanced location press handler
  const handleLocationPress = useCallback((location: MapLocation) => {
    setSelectedLocation(location);
    setSelectedTerritory(null);
    onLocationPress?.(location);
  }, [setSelectedLocation, setSelectedTerritory, onLocationPress]);

  // Enhanced territory press handler
  const handleTerritoryPress = useCallback((territory: Territory) => {
    setSelectedTerritory(territory);
    setSelectedLocation(null);
    onTerritoryPress?.(territory);
  }, [setSelectedTerritory, setSelectedLocation, onTerritoryPress]);

  // Enhanced region change handler that preserves zoom levels
  const handleRegionChangeCompleteEnhanced = useCallback((region: Region) => {
    handleRegionChangeComplete(region);
  }, [handleRegionChangeComplete]);

  return {
    // State
    filteredLocations,
    filteredTerritories,
    loading,
    error,
    userLocation,
    locationPermissionGranted,
    initialRegion,
    currentRegion,
    hasUserInteracted,
    conquestStatus,
    trackedPoints,
    selectedLocation,
    selectedTerritory,
    
    // Actions
    handleLocationPress,
    handleTerritoryPress,
    handleRegionChangeComplete: handleRegionChangeCompleteEnhanced,
    handleAddLocation,
    handleUpdateLocation,
    handleDeleteLocation,
    centerOnUserLocation: centerOnUserLocationPreservingZoom,
    requestLocationPermission,
    refreshData: loadInitialData,
    clearError,
    
    // Conquest actions
    startConquest,
    pauseConquest,
    resumeConquest,
    stopConquest,
    cancelConquest,
    addManualPoint, // Add this for debugging
    
    // Conquest mode helpers
    getConquestButtonIcon,
    getConquestButtonColor,
    getConquestButtonBackground,
  };
};
