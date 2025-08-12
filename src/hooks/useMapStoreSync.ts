import { MapUseCases } from '@/src/services/useCases/mapUseCases';
import { useAuthStore } from '@/src/stores/authStore';
import { useMapStore } from '@/src/stores/mapStore';
import { ConquestPoint, MapLocation, MapViewport } from '@/src/types/domain';
import { LocationService } from '@/src/types/repositories';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

interface UseMapStoreSyncProps {
  mapUseCases: MapUseCases;
  locationService: LocationService;
}

export const useMapStoreSync = ({ mapUseCases, locationService }: UseMapStoreSyncProps) => {
  const { user } = useAuthStore();
  
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
    
    setViewport,
    setCurrentRegion,
    setUserInteracted,
    setLocations,
    setTerritories,
    addLocation,
    updateLocation,
    deleteLocation,
    setFilters,
    setUserLocation,
    setLocationPermission,
    setConquestStatus,
    addTrackedPoint,
    clearTrackedPoints,
    setTotalDistance,
    setTotalArea,
    setLoading,
    setError,
    setSelectedLocation,
    setSelectedTerritory,
    centerOnUserLocation,
    clearError,
  } = useMapStore();

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mapUseCases.loadMapData(filters);
      setLocations(data.locations);
      setTerritories(data.territories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load map data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [mapUseCases, filters, setLoading, setError, setLocations, setTerritories]);

  // Load initial viewport
  const loadInitialViewport = useCallback(async () => {
    try {
      const hasPermission = await locationService.hasLocationPermission();
      
      if (hasPermission) {
        const location = await locationService.getCurrentLocation();
        
        if (location) {
          const userViewport: MapViewport = {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          setViewport(userViewport);
          setCurrentRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          await mapUseCases.saveViewport(userViewport);
          return;
        }
      }

      const savedViewport = await mapUseCases.getCurrentViewport();
      setViewport(savedViewport);
      setCurrentRegion({
        latitude: savedViewport.latitude,
        longitude: savedViewport.longitude,
        latitudeDelta: savedViewport.latitudeDelta,
        longitudeDelta: savedViewport.longitudeDelta,
      });
    } catch (err) {
      console.warn('Failed to load initial viewport:', err);
    }
  }, [locationService, mapUseCases, setViewport, setCurrentRegion]);

  // Check location permission
  const checkLocationPermission = useCallback(async () => {
    try {
      const hasPermission = await locationService.hasLocationPermission();
      setLocationPermission(hasPermission);
      
      if (hasPermission) {
        await loadInitialViewport();
      } else {
        const granted = await locationService.requestLocationPermission();
        setLocationPermission(granted);
        
        if (granted) {
          await loadInitialViewport();
        }
      }
    } catch (err) {
      console.error('Failed to check location permission:', err);
      setError('Failed to access location. Please check your device settings.');
    }
  }, [locationService, setLocationPermission, setError, loadInitialViewport]);

  // Request location permission
  const requestLocationPermission = useCallback(async () => {
    try {
      const granted = await locationService.requestLocationPermission();
      setLocationPermission(granted);
      
      if (granted) {
        await loadInitialViewport();
      }
    } catch (err) {
      console.error('Failed to request location permission:', err);
      setError('Failed to request location permission.');
    }
  }, [locationService, setLocationPermission, setError, loadInitialViewport]);

  // Enhanced center on user location
  const centerOnUserLocationPreservingZoom = useCallback(async () => {
    if (!userLocation) return;
    
    const newRegion = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: currentRegion?.latitudeDelta || 0.01,
      longitudeDelta: currentRegion?.longitudeDelta || 0.01,
    };
    
    setCurrentRegion(newRegion);
    setUserInteracted(false);
    
    const newViewport: MapViewport = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: newRegion.latitudeDelta,
      longitudeDelta: newRegion.longitudeDelta,
    };
    
    setViewport(newViewport);
    await mapUseCases.saveViewport(newViewport);
  }, [userLocation, currentRegion, setCurrentRegion, setUserInteracted, setViewport, mapUseCases]);

  // Enhanced region change handler
  const handleRegionChangeComplete = useCallback(async (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => {
    setCurrentRegion(region);
    setUserInteracted(true);
    
    const newViewport: MapViewport = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };
    
    setViewport(newViewport);
    await mapUseCases.saveViewport(newViewport);
  }, [setCurrentRegion, setUserInteracted, setViewport, mapUseCases]);

  // Conquest mode actions
  const startConquest = useCallback(() => {
    setConquestStatus('tracking');
    clearTrackedPoints();
  }, [setConquestStatus, clearTrackedPoints]);

  const pauseConquest = useCallback(() => {
    setConquestStatus('paused');
  }, [setConquestStatus]);

  const resumeConquest = useCallback(() => {
    setConquestStatus('tracking');
  }, [setConquestStatus]);

  const stopConquest = useCallback(async () => {
    if (trackedPoints.length < 3) {
      Alert.alert(
        'Insufficient Points', 
        'You need at least 3 points to create a territory. Your conquest has been cancelled.',
        [
          { text: 'OK', onPress: () => cancelConquest() }
        ]
      );
      return;
    }

    setConquestStatus('completed');
    
    try {
      // Calculate center point
      const centerLat = trackedPoints.reduce((sum, point) => sum + (point.latitude || 0), 0) / trackedPoints.length;
      const centerLng = trackedPoints.reduce((sum, point) => sum + (point.longitude || 0), 0) / trackedPoints.length;

      // Calculate total distance
      let totalDistance = 0;
      for (let i = 1; i < trackedPoints.length; i++) {
        const prevPoint = trackedPoints[i - 1];
        const currentPoint = trackedPoints[i];
        
        if (prevPoint.latitude && prevPoint.longitude && currentPoint.latitude && currentPoint.longitude) {
          totalDistance += locationService.calculateDistance(
            prevPoint.latitude,
            prevPoint.longitude,
            currentPoint.latitude,
            currentPoint.longitude
          );
        }
      }

      // Calculate area
      const coordinates = trackedPoints
        .filter(point => point.latitude && point.longitude)
        .map(point => ({
          latitude: point.latitude,
          longitude: point.longitude,
        }));
      const totalArea = coordinates.length >= 3 ? locationService.calculatePolygonArea(coordinates) : 0;

      // Filter valid points
      const validPoints = trackedPoints.filter(point => point.latitude && point.longitude);
      
      if (validPoints.length < 3) {
        Alert.alert(
          'Insufficient Valid Points', 
          'You need at least 3 valid points to create a territory. Your conquest has been cancelled.',
          [
            { text: 'OK', onPress: () => cancelConquest() }
          ]
        );
        return;
      }

      // Create territory data
      const territoryData = {
        name: `Territory ${new Date().toLocaleDateString()}`,
        description: `Conquered territory with ${validPoints.length} points`,
        boundaries: validPoints.map((point, index) => ({
          id: `boundary_${index}`,
          latitude: point.latitude,
          longitude: point.longitude,
          title: `Boundary Point ${index + 1}`,
          description: `Boundary point ${index + 1} of conquered territory`,
          type: 'boundary' as const,
          metadata: {
            pointIndex: index,
            timestamp: point.timestamp || new Date(),
            accuracy: point.accuracy || 0,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        center: {
          latitude: centerLat,
          longitude: centerLng,
        },
        area: totalArea || 0,
        status: 'active' as const,
        assignedTo: user?.uid || 'default-user',
      };

      // Import territory repository
      const { territoryRepository } = await import('@/src/services/territoryRepository');
      
      // Save to Firestore
      await territoryRepository.createTerritory(territoryData);

      Alert.alert(
        'Territory Saved!', 
        `Your conquered territory has been saved!\n\nPoints: ${validPoints.length}\nDistance: ${(totalDistance / 1000).toFixed(2)} km\nArea: ${(totalArea / 10000).toFixed(2)} hectares`,
        [
          { text: 'OK', onPress: () => {
            setConquestStatus('idle');
            clearTrackedPoints();
          }}
        ]
      );
    } catch (error) {
      console.error('Failed to save territory:', error);
      Alert.alert('Error', 'Failed to save territory. Please try again.');
      setConquestStatus('idle');
      clearTrackedPoints();
    }
  }, [setConquestStatus, trackedPoints, locationService, clearTrackedPoints]);

  const cancelConquest = useCallback(() => {
    setConquestStatus('idle');
    clearTrackedPoints();
  }, [setConquestStatus, clearTrackedPoints]);

  // Debug function to manually add points by tapping
  const addManualPoint = useCallback((latitude: number, longitude: number) => {
    if (conquestStatus !== 'tracking') {
      console.log('Cannot add manual point: conquest not in tracking mode');
      return;
    }

    addTrackedPoint({
      id: `point_${Date.now()}`,
      sessionId: `session_${Date.now()}`,
      latitude,
      longitude,
      timestamp: new Date(),
      accuracy: 5,
      speed: 0,
      heading: 0,
    });
  }, [conquestStatus, addTrackedPoint]);

  // Location actions
  const handleAddLocation = useCallback(async (location: Omit<MapLocation, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newLocation = await mapUseCases.saveLocation(location);
      addLocation(newLocation);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add location';
      setError(errorMessage);
      throw err;
    }
  }, [mapUseCases, setError, addLocation]);

  const handleUpdateLocation = useCallback(async (id: string, updates: Partial<MapLocation>) => {
    try {
      setError(null);
      const updatedLocation = await mapUseCases.updateLocation(id, updates);
      updateLocation(id, updatedLocation);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update location';
      setError(errorMessage);
      throw err;
    }
  }, [mapUseCases, setError, updateLocation]);

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
              setError(null);
              await mapUseCases.deleteLocation(id);
              deleteLocation(id);
              setSelectedLocation(null);
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Failed to delete location';
              setError(errorMessage);
            }
          },
        },
      ]
    );
  }, [mapUseCases, setError, deleteLocation, setSelectedLocation]);

  // Effects
  useEffect(() => {
    loadInitialData();
    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (locationPermissionGranted) {
      const cleanup = locationService.watchLocation((location) => {
        setUserLocation(location);
        setError(null);
      });

      return cleanup;
    }
  }, [locationPermissionGranted, locationService, setUserLocation, setError]);

  useEffect(() => {
    if (conquestStatus === 'tracking' && userLocation) {
      const newPoint: ConquestPoint = {
        id: `point-${Date.now()}`,
        sessionId: 'current-session',
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        timestamp: new Date(),
      };
      addTrackedPoint(newPoint);
    }
  }, [conquestStatus, userLocation, addTrackedPoint]);

  return {
    // State
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
    
    // Actions
    setFilters,
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
    
    // Conquest actions
    startConquest,
    pauseConquest,
    resumeConquest,
    stopConquest,
    cancelConquest,
    addManualPoint, // Add this for debugging
  };
};
