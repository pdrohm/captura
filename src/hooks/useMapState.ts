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
    try {
      setErrorState(null);
      console.log('🗺️ [MapState] Centering on user location...');
      
      const locationServicesEnabled = await locationService.checkLocationServicesEnabled();
      if (!locationServicesEnabled) {
        throw new Error('Location services are disabled on your device. Please enable GPS in device settings.');
      }
      
      const location = await locationService.getCurrentLocation();
      console.log('📍 [MapState] Current user location obtained:', location);
      setUserLocation(location);
      
      setErrorState(null);
      
      const newViewport: MapViewport = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.latitudeDelta,
        longitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.longitudeDelta,
      };
      
      console.log('🗺️ [MapState] Setting new viewport to user location:', newViewport);
      setViewportState(newViewport);
      
      await mapUseCases.saveViewport(newViewport);
      console.log('💾 [MapState] Viewport saved successfully');
      
      console.log('=== AFTER CENTERING ON USER LOCATION ===');
      console.log('Viewport state:', newViewport);
      console.log('User location:', location);
      console.log('=====================================');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user location';
      console.error('❌ [MapState] Error centering on user location:', err);
      setErrorState(errorMessage);
      
      console.log('⚠️ [MapState] Not falling back to default coordinates - user needs to fix location');
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
        const granted = await locationService.requestLocationPermission();
        console.log('Permission request result:', granted);
        setLocationPermissionGranted(granted);
        
        if (granted) {
          console.log('Permission granted, getting user location...');
          await centerOnUserLocation();
        } else {
          console.log('Permission denied by user');
          setErrorState('Location permission denied. Please enable location access in settings.');
        }
      }
    } catch (err) {
      console.error('Failed to check/request location permission:', err);
      setErrorState('Failed to access location. Please check your device settings.');
    }
  }, [locationService, centerOnUserLocation]);

  const loadInitialViewport = useCallback(async () => {
    try {
      console.log('🗺️ [MapState] Loading initial viewport...');
      
      if (locationPermissionGranted) {
        try {
          console.log('📍 [MapState] Getting user location for initial viewport...');
          const location = await locationService.getCurrentLocation();
          console.log('📍 [MapState] User location obtained:', location);
          
          const userViewport: MapViewport = {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.latitudeDelta,
            longitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.longitudeDelta,
          };
          
          console.log('🗺️ [MapState] Setting viewport to user location:', userViewport);
          setViewportState(userViewport);
          await mapUseCases.saveViewport(userViewport);
          console.log('💾 [MapState] User location viewport saved successfully');
          
          setErrorState(null);
          return;
        } catch (err) {
          console.error('❌ [MapState] Failed to get user location for initial viewport:', err);
          setErrorState('Failed to get your location. Please check location settings and try again.');
          
          console.log('⚠️ [MapState] Not falling back to default coordinates - user needs to fix location');
          return;
        }
      }

      try {
        console.log('💾 [MapState] No location permission, trying saved viewport...');
        const savedViewport = await mapUseCases.getCurrentViewport();
        
        if (savedViewport.latitude !== MAP_CONSTANTS.DEFAULT_VIEWPORT.latitude || 
            savedViewport.longitude !== MAP_CONSTANTS.DEFAULT_VIEWPORT.longitude) {
          console.log('💾 [MapState] Using saved viewport:', savedViewport);
          setViewportState(savedViewport);
          setErrorState(null);
        } else {
          console.log('⚠️ [MapState] Saved viewport is default coordinates, not using it');
          if (!locationPermissionGranted) {
            setErrorState('Please grant location permission to center the map on your position.');
          }
        }
      } catch (err) {
        console.warn('⚠️ [MapState] No saved viewport available');
        if (!locationPermissionGranted) {
          setErrorState('Please grant location permission to center the map on your position.');
        }
      }
    } catch (err) {
      console.error('❌ [MapState] Failed to load initial viewport:', err);
      setErrorState('Failed to load map viewport. Please check location settings.');
    }
  }, [mapUseCases, locationService, locationPermissionGranted]);

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
    console.log('🔄 [MapState] Initial effect triggered');
    loadInitialData();
    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (locationPermissionGranted !== undefined) {
      console.log('Loading initial viewport, permission granted:', locationPermissionGranted);
      const timer = setTimeout(() => {
        loadInitialViewport();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [locationPermissionGranted, loadInitialViewport]);

  useEffect(() => {
    if (userLocation) {
      console.log('📍 [MapState] User location set, clearing any location errors');
      setErrorState(null);
    }
  }, [userLocation]);

  useEffect(() => {
    if (locationPermissionGranted) {
      console.log('👀 [MapState] Setting up location watching');
      const cleanup = locationService.watchLocation((location) => {
        setUserLocation(location);
        setErrorState(null);
      });

      return cleanup;
    }
  }, [locationPermissionGranted, locationService]);

  const requestLocationPermission = useCallback(async () => {
    try {
      setErrorState(null);
      const granted = await locationService.requestLocationPermission();
      setLocationPermissionGranted(granted);
      
      if (granted) {
        await centerOnUserLocation();
      } else {
        setErrorState('Location permission denied');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request location permission';
      setErrorState(errorMessage);
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
    console.log('🟢 [MapState] Clearing error');
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
      console.log('Viewport force-refreshed from user location:', newViewport);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to force refresh viewport from user location';
      console.error('Error force-refreshing viewport:', err);
      setErrorState(errorMessage);
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
    setError: setErrorState,
    centerOnUserLocation,
    requestLocationPermission,
    forceRefreshFromUserLocation,
    clearSavedViewport,
    debugViewportState,
  };
}
