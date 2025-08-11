import { MAP_CONSTANTS } from '@/src/config/mapConstants';
import { MapUseCases } from '@/src/services/useCases/mapUseCases';
import { MapFilters, MapLocation, MapViewport, Territory } from '@/src/types/domain';
import { LocationService } from '@/src/types/repositories';
import { useCallback, useEffect, useState } from 'react';

interface UseMapStateReturn {
  // State
  locations: MapLocation[];
  territories: Territory[];
  viewport: MapViewport;
  filters: MapFilters;
  loading: boolean;
  error: string | null;
  userLocation: { latitude: number; longitude: number } | null;
  locationPermissionGranted: boolean;
  
  // Actions
  setViewport: (viewport: MapViewport) => void;
  setFilters: (filters: MapFilters) => void;
  addLocation: (location: Omit<MapLocation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLocation: (id: string, updates: Partial<MapLocation>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
  centerOnUserLocation: () => Promise<void>;
  requestLocationPermission: () => Promise<void>;
  forceRefreshFromUserLocation: () => Promise<void>;
  clearSavedViewport: () => Promise<void>;
  debugViewportState: () => void;
}

export function useMapState(
  mapUseCases: MapUseCases, 
  locationService: LocationService
): UseMapStateReturn {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [viewport, setViewportState] = useState<MapViewport>(MAP_CONSTANTS.DEFAULT_VIEWPORT);
  const [filters, setFiltersState] = useState<MapFilters>({
    showTerritories: true,
    showPointsOfInterest: true,
    showBoundaries: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  const centerOnUserLocation = useCallback(async () => {
    try {
      setError(null);
      console.log('Centering on user location...');
      const location = await locationService.getCurrentLocation();
      console.log('Current user location:', location);
      setUserLocation(location);
      
      // Update viewport to center on user location
      const newViewport: MapViewport = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.latitudeDelta,
        longitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.longitudeDelta,
      };
      
      console.log('Setting new viewport to user location:', newViewport);
      setViewportState(newViewport);
      
      // Always save the new viewport to override any old saved coordinates
      await mapUseCases.saveViewport(newViewport);
      console.log('Viewport saved successfully');
      
      // Debug the current state
      console.log('=== AFTER CENTERING ON USER LOCATION ===');
      console.log('Viewport state:', newViewport);
      console.log('User location:', location);
      console.log('=====================================');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user location';
      console.error('Error centering on user location:', err);
      setError(errorMessage);
    }
  }, [locationService, mapUseCases]);

  const checkLocationPermission = useCallback(async () => {
    try {
      console.log('Checking location permission...');
      const hasPermission = await locationService.hasLocationPermission();
      console.log('Current permission status:', hasPermission);
      setLocationPermissionGranted(hasPermission);
      
      if (hasPermission) {
        console.log('Permission already granted, getting user location...');
        await centerOnUserLocation();
      } else {
        console.log('No permission, requesting it...');
        // Automatically request permission if not granted
        const granted = await locationService.requestLocationPermission();
        console.log('Permission request result:', granted);
        setLocationPermissionGranted(granted);
        
        if (granted) {
          console.log('Permission granted, getting user location...');
          await centerOnUserLocation();
        } else {
          console.log('Permission denied by user');
          setError('Location permission denied. Please enable location access in settings.');
        }
      }
    } catch (err) {
      console.error('Failed to check/request location permission:', err);
      setError('Failed to access location. Please check your device settings.');
    }
  }, [locationService, centerOnUserLocation]);

  const loadInitialViewport = useCallback(async () => {
    try {
      console.log('Loading initial viewport...');
      
      // If we have location permission, always try to get user location first
      if (locationPermissionGranted) {
        try {
          console.log('Getting user location for initial viewport...');
          const location = await locationService.getCurrentLocation();
          console.log('User location obtained:', location);
          
          const userViewport: MapViewport = {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.latitudeDelta,
            longitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.longitudeDelta,
          };
          
          console.log('Setting viewport to user location:', userViewport);
          setViewportState(userViewport);
          await mapUseCases.saveViewport(userViewport);
          console.log('User location viewport saved successfully');
          return;
        } catch (err) {
          console.error('Failed to get user location for initial viewport:', err);
          setError('Failed to get your location. Please check location settings.');
        }
      }

      // If no permission or failed to get location, use saved viewport or default
      try {
        console.log('Falling back to saved viewport or default...');
        const savedViewport = await mapUseCases.getCurrentViewport();
        console.log('Using saved viewport:', savedViewport);
        setViewportState(savedViewport);
      } catch (err) {
        console.warn('No saved viewport, using default Brazil coordinates');
   
      }
    } catch (err) {
      console.error('Failed to load initial viewport:', err);
      setError('Failed to load map viewport');
    }
  }, [mapUseCases, locationService, locationPermissionGranted]);

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
  }, [mapUseCases, filters]);

  // Load initial data and check location permission
  useEffect(() => {
    loadInitialData();
    checkLocationPermission();
  }, [loadInitialData, checkLocationPermission]);

  // Load initial viewport after checking location permission
  useEffect(() => {
    if (locationPermissionGranted !== undefined) {
      console.log('Loading initial viewport, permission granted:', locationPermissionGranted);
      loadInitialViewport();
    }
  }, [locationPermissionGranted, loadInitialViewport]);

  // Watch for location updates
  useEffect(() => {
    if (locationPermissionGranted) {
      const cleanup = locationService.watchLocation((location) => {
        setUserLocation(location);
      });

      return cleanup;
    }
  }, [locationPermissionGranted, locationService]);

  const requestLocationPermission = useCallback(async () => {
    try {
      setError(null);
      const granted = await locationService.requestLocationPermission();
      setLocationPermissionGranted(granted);
      
      if (granted) {
        await centerOnUserLocation();
      } else {
        setError('Location permission denied');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request location permission';
      setError(errorMessage);
    }
  }, [locationService, centerOnUserLocation]);

  const setViewport = useCallback(async (newViewport: MapViewport) => {
    setViewportState(newViewport);
    try {
      await mapUseCases.saveViewport(newViewport);
    } catch (err) {
      console.warn('Failed to save viewport');
    }
  }, [mapUseCases]);

  const setFilters = useCallback(async (newFilters: MapFilters) => {
    setFiltersState(newFilters);
    try {
      setLoading(true);
      setError(null);
      const data = await mapUseCases.loadMapData(newFilters);
      setLocations(data.locations);
      setTerritories(data.territories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply filters';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [mapUseCases]);

  const addLocation = useCallback(async (location: Omit<MapLocation, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newLocation = await mapUseCases.saveLocation(location);
      setLocations(prev => [...prev, newLocation]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add location';
      setError(errorMessage);
      throw err;
    }
  }, [mapUseCases]);

  const updateLocation = useCallback(async (id: string, updates: Partial<MapLocation>) => {
    try {
      setError(null);
      const updatedLocation = await mapUseCases.updateLocation(id, updates);
      setLocations(prev => 
        prev.map(loc => loc.id === id ? updatedLocation : loc)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update location';
      setError(errorMessage);
      throw err;
    }
  }, [mapUseCases]);

  const deleteLocation = useCallback(async (id: string) => {
    try {
      setError(null);
      await mapUseCases.deleteLocation(id);
      setLocations(prev => prev.filter(loc => loc.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete location';
      setError(errorMessage);
      throw err;
    }
  }, [mapUseCases]);

  const refreshData = useCallback(async () => {
    await loadInitialData();
  }, [loadInitialData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const forceRefreshFromUserLocation = useCallback(async () => {
    try {
      setError(null);
      const location = await locationService.getCurrentLocation();
      setUserLocation(location);
      const newViewport: MapViewport = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.latitudeDelta,
        longitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.longitudeDelta,
      };
      setViewportState(newViewport);
      await mapUseCases.saveViewport(newViewport);
      console.log('Viewport force-refreshed from user location:', newViewport);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to force refresh viewport from user location';
      console.error('Error force-refreshing viewport:', err);
      setError(errorMessage);
    }
  }, [locationService, mapUseCases]);

  const clearSavedViewport = useCallback(async () => {
    try {
      await mapUseCases.clearViewport();
      console.log('Saved viewport cleared successfully');
    } catch (err) {
      console.warn('Failed to clear saved viewport:', err);
    }
  }, [mapUseCases]);

  const debugViewportState = useCallback(() => {
    console.log('=== VIEWPORT DEBUG INFO ===');
    console.log('Current viewport state:', viewport);
    console.log('User location:', userLocation);
    console.log('Location permission granted:', locationPermissionGranted);
    console.log('==========================');
  }, [viewport, userLocation, locationPermissionGranted]);

  return {
    locations,
    territories,
    viewport,
    filters,
    loading,
    error,
    userLocation,
    locationPermissionGranted,
    setViewport,
    setFilters,
    addLocation,
    updateLocation,
    deleteLocation,
    refreshData,
    clearError,
    centerOnUserLocation,
    requestLocationPermission,
    forceRefreshFromUserLocation,
    clearSavedViewport,
    debugViewportState,
  };
}
