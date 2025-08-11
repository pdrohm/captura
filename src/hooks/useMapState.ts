import { MAP_CONSTANTS } from '@/src/config/mapConstants';
import { MapUseCases } from '@/src/services/useCases/mapUseCases';
import { MapFilters, MapLocation, MapViewport, Territory } from '@/src/types/domain';
import { LocationService } from '@/src/types/repositories';
import { useCallback, useEffect, useState } from 'react';

interface UseMapStateReturn {
  locations: MapLocation[];
  territories: Territory[];
  viewport: MapViewport;
  filters: MapFilters;
  loading: boolean;
  error: string | null;
  userLocation: { latitude: number; longitude: number } | null;
  locationPermissionGranted: boolean;
  
  setViewport: (viewport: MapViewport) => void;
  setFilters: (filters: MapFilters) => void;
  addLocation: (location: Omit<MapLocation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLocation: (id: string, updates: Partial<MapLocation>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
  setError: (error: string | null) => void;
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
  const [error, setErrorState] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  const centerOnUserLocation = useCallback(async () => {
    if (!userLocation) {
      return;
    }

    const newViewport: MapViewport = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.latitudeDelta,
      longitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.longitudeDelta,
    };

    setViewportState(newViewport);
    await mapUseCases.saveViewport(newViewport);
  }, [userLocation, mapUseCases]);

  const centerOnUserLocationWithFallback = useCallback(async () => {
    if (!userLocation) {
      return;
    }

    const newViewport: MapViewport = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.latitudeDelta,
      longitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.longitudeDelta,
    };

    setViewportState(newViewport);
    await mapUseCases.saveViewport(newViewport);
  }, [userLocation, mapUseCases]);

  const requestLocationPermission = useCallback(async () => {
    const hasPermission = await locationService.hasLocationPermission();
    
    if (hasPermission) {
      setLocationPermissionGranted(true);
      return;
    }

    const granted = await locationService.requestLocationPermission();
    setLocationPermissionGranted(granted);
    
    if (granted) {
      await centerOnUserLocation();
    }
  }, [locationService, centerOnUserLocation]);

  const checkLocationPermission = useCallback(async () => {
    try {
      const hasPermission = await locationService.hasLocationPermission();
      setLocationPermissionGranted(hasPermission);
      
      if (hasPermission) {
        await centerOnUserLocation();
      }
    } catch (err) {
      console.error('Failed to check location permission:', err);
      setErrorState('Failed to access location. Please check your device settings.');
    }
  }, [locationService, centerOnUserLocation]);

  const loadInitialViewport = useCallback(async () => {
    const hasPermission = await locationService.hasLocationPermission();
    
    if (hasPermission) {
      const location = await locationService.getCurrentLocation();
      
      if (location) {
        const userViewport: MapViewport = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.latitudeDelta,
          longitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.longitudeDelta,
        };

        setViewportState(userViewport);
        await mapUseCases.saveViewport(userViewport);
        return;
      }
    }

    const savedViewport = await mapUseCases.getCurrentViewport();
    
    if (savedViewport.latitude !== MAP_CONSTANTS.DEFAULT_VIEWPORT.latitude || 
            savedViewport.longitude !== MAP_CONSTANTS.DEFAULT_VIEWPORT.longitude) {
      setViewportState(savedViewport);
    } else {
      setViewportState(MAP_CONSTANTS.DEFAULT_VIEWPORT);
    }
  }, [mapUseCases, locationService]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorState(null);
      const data = await mapUseCases.loadMapData(filters);
      setLocations(data.locations);
      setTerritories(data.territories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load map data';
      setErrorState(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [mapUseCases, filters]);

  useEffect(() => {
    loadInitialData();
    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (locationPermissionGranted !== undefined) {
      const timer = setTimeout(() => {
        loadInitialViewport();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [locationPermissionGranted, loadInitialViewport]);

  useEffect(() => {
    if (userLocation) {
      setErrorState(null);
    }
  }, [userLocation]);

  useEffect(() => {
    if (locationPermissionGranted) {
      const cleanup = locationService.watchLocation((location) => {
        setUserLocation(location);
        setErrorState(null);
      });

      return cleanup;
    }
  }, [locationPermissionGranted, locationService]);

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
      setErrorState(null);
      const data = await mapUseCases.loadMapData(newFilters);
      setLocations(data.locations);
      setTerritories(data.territories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply filters';
      setErrorState(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [mapUseCases]);

  const addLocation = useCallback(async (location: Omit<MapLocation, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setErrorState(null);
      const newLocation = await mapUseCases.saveLocation(location);
      setLocations(prev => [...prev, newLocation]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add location';
      setErrorState(errorMessage);
      throw err;
    }
  }, [mapUseCases]);

  const updateLocation = useCallback(async (id: string, updates: Partial<MapLocation>) => {
    try {
      setErrorState(null);
      const updatedLocation = await mapUseCases.updateLocation(id, updates);
      setLocations(prev => 
        prev.map(loc => loc.id === id ? updatedLocation : loc)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update location';
      setErrorState(errorMessage);
      throw err;
    }
  }, [mapUseCases]);

  const deleteLocation = useCallback(async (id: string) => {
    try {
      setErrorState(null);
      await mapUseCases.deleteLocation(id);
      setLocations(prev => prev.filter(loc => loc.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete location';
      setErrorState(errorMessage);
      throw err;
    }
  }, [mapUseCases]);

  const refreshData = useCallback(async () => {
    await loadInitialData();
  }, [loadInitialData]);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const forceRefreshFromUserLocation = useCallback(async () => {
    try {
      setErrorState(null);
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to force refresh viewport from user location';
      console.error('Error force-refreshing viewport:', err);
      setErrorState(errorMessage);
    }
  }, [locationService, mapUseCases]);

  const clearSavedViewport = useCallback(async () => {
    try {
      await mapUseCases.clearViewport();
    } catch (err) {
      console.warn('Failed to clear saved viewport:', err);
    }
  }, [mapUseCases]);

  const debugViewportState = useCallback(() => {
    // Debug function removed - no console.log statements
  }, []);

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
    setError: setErrorState,
    centerOnUserLocation,
    requestLocationPermission,
    forceRefreshFromUserLocation,
    clearSavedViewport,
    debugViewportState,
  };
}
