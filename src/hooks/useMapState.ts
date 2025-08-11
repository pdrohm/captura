import { useState, useCallback, useEffect } from 'react';
import { MapLocation, Territory, MapViewport, MapFilters } from '@/src/types/domain';
import { MapUseCases } from '@/src/services/useCases/mapUseCases';

interface UseMapStateReturn {
  // State
  locations: MapLocation[];
  territories: Territory[];
  viewport: MapViewport;
  filters: MapFilters;
  loading: boolean;
  error: string | null;
  
  // Actions
  setViewport: (viewport: MapViewport) => void;
  setFilters: (filters: MapFilters) => void;
  addLocation: (location: Omit<MapLocation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLocation: (id: string, updates: Partial<MapLocation>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export function useMapState(mapUseCases: MapUseCases): UseMapStateReturn {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [viewport, setViewportState] = useState<MapViewport>({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [filters, setFiltersState] = useState<MapFilters>({
    showTerritories: true,
    showPointsOfInterest: true,
    showBoundaries: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
    loadInitialViewport();
  }, []);

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

  const loadInitialViewport = useCallback(async () => {
    try {
      const savedViewport = await mapUseCases.getCurrentViewport();
      setViewportState(savedViewport);
    } catch (err) {
      console.warn('Failed to load saved viewport, using default');
    }
  }, [mapUseCases]);

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

  return {
    locations,
    territories,
    viewport,
    filters,
    loading,
    error,
    setViewport,
    setFilters,
    addLocation,
    updateLocation,
    deleteLocation,
    refreshData,
    clearError,
  };
}
