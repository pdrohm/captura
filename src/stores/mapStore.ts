import { MAP_CONSTANTS } from '@/src/config/mapConstants';
import { ConquestPoint, MapFilters, MapLocation, MapViewport, Territory } from '@/src/types/domain';
import { create } from 'zustand';

interface MapState {
  // Viewport state
  viewport: MapViewport;
  currentRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null;
  hasUserInteracted: boolean;
  
  // Map data
  locations: MapLocation[];
  territories: Territory[];
  filters: MapFilters;
  
  // User location
  userLocation: { latitude: number; longitude: number } | null;
  locationPermissionGranted: boolean;
  
  // Conquest mode
  conquestStatus: 'idle' | 'tracking' | 'paused' | 'completed';
  trackedPoints: ConquestPoint[];
  totalDistance: number;
  totalArea: number;
  
  // UI state
  loading: boolean;
  error: string | null;
  selectedLocation: MapLocation | null;
  selectedTerritory: Territory | null;
  
  // Actions
  setViewport: (viewport: MapViewport) => void;
  setCurrentRegion: (region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }) => void;
  setUserInteracted: (interacted: boolean) => void;
  
  setLocations: (locations: MapLocation[]) => void;
  setTerritories: (territories: Territory[]) => void;
  addTerritory: (territory: Territory) => void;
  addLocation: (location: MapLocation) => void;
  updateLocation: (id: string, updates: Partial<MapLocation>) => void;
  deleteLocation: (id: string) => void;
  
  setFilters: (filters: MapFilters) => void;
  
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
  setLocationPermission: (granted: boolean) => void;
  
  setConquestStatus: (status: 'idle' | 'tracking' | 'paused' | 'completed') => void;
  addTrackedPoint: (point: ConquestPoint) => void;
  clearTrackedPoints: () => void;
  setTotalDistance: (distance: number) => void;
  setTotalArea: (area: number) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedLocation: (location: MapLocation | null) => void;
  setSelectedTerritory: (territory: Territory | null) => void;
  
  // Complex actions
  centerOnUserLocation: () => void;
  resetViewport: () => void;
  clearError: () => void;
  
  // Reset state
  reset: () => void;
}

const initialState = {
  viewport: MAP_CONSTANTS.DEFAULT_VIEWPORT,
  currentRegion: null,
  hasUserInteracted: false,
  locations: [],
  territories: [],
  filters: {
    showTerritories: true,
    showPointsOfInterest: true,
    showBoundaries: true,
  },
  userLocation: null,
  locationPermissionGranted: false,
  conquestStatus: 'idle' as const,
  trackedPoints: [] as ConquestPoint[],
  totalDistance: 0,
  totalArea: 0,
  loading: false,
  error: null,
  selectedLocation: null,
  selectedTerritory: null,
};

export const useMapStore = create<MapState>((set, get) => ({
  ...initialState,

  setViewport: (viewport) => {
    set({ viewport });
  },

  setCurrentRegion: (region) => {
    set({ currentRegion: region });
  },

  setUserInteracted: (interacted) => {
    set({ hasUserInteracted: interacted });
  },

  setLocations: (locations) => {
    set({ locations });
  },

  setTerritories: (territories) => {
    set({ territories });
  },

  addTerritory: (territory) => {
    set((state) => ({
      territories: [...state.territories, territory],
    }));
  },

  addLocation: (location) => {
    set((state) => ({
      locations: [...state.locations, location],
    }));
  },

  updateLocation: (id, updates) => {
    set((state) => ({
      locations: state.locations.map((loc) =>
        loc.id === id ? { ...loc, ...updates } : loc
      ),
    }));
  },

  deleteLocation: (id) => {
    set((state) => ({
      locations: state.locations.filter((loc) => loc.id !== id),
    }));
  },

  setFilters: (filters) => {
    set({ filters });
  },

  setUserLocation: (location) => {
    set({ userLocation: location });
  },

  setLocationPermission: (granted) => {
    set({ locationPermissionGranted: granted });
  },

  setConquestStatus: (status) => {
    set({ conquestStatus: status });
  },

  addTrackedPoint: (point) => {
    set((state) => ({
      trackedPoints: [...state.trackedPoints, point],
    }));
  },

  clearTrackedPoints: () => {
    set({ trackedPoints: [], totalDistance: 0, totalArea: 0 });
  },

  setTotalDistance: (distance) => {
    set({ totalDistance: distance });
  },

  setTotalArea: (area) => {
    set({ totalArea: area });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  setError: (error) => {
    set({ error });
  },

  setSelectedLocation: (location) => {
    set({ selectedLocation: location, selectedTerritory: null });
  },

  setSelectedTerritory: (territory) => {
    set({ selectedTerritory: territory, selectedLocation: null });
  },

  centerOnUserLocation: () => {
    const { userLocation } = get();
    if (!userLocation) return;

    const newViewport: MapViewport = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.latitudeDelta,
      longitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.longitudeDelta,
    };

    set({
      viewport: newViewport,
      currentRegion: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.latitudeDelta,
        longitudeDelta: MAP_CONSTANTS.ZOOM_LEVELS.CITY.longitudeDelta,
      },
      hasUserInteracted: false,
    });
  },

  resetViewport: () => {
    set({
      viewport: MAP_CONSTANTS.DEFAULT_VIEWPORT,
      currentRegion: null,
      hasUserInteracted: false,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));
