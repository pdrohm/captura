// Map configuration constants
export const MAP_CONSTANTS = {
  // Default viewport for Tubarão, SC, Brazil region
  DEFAULT_VIEWPORT: {
    latitude: -28.4698,
    longitude: -49.0069,
    latitudeDelta: 0.01,  // City-level zoom
    longitudeDelta: 0.01,
  },
  
  // Zoom levels for different use cases
  ZOOM_LEVELS: {
    CITY: {
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    },
    NEIGHBORHOOD: {
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    },
    STREET: {
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    },
    BUILDING: {
      latitudeDelta: 0.0001,
      longitudeDelta: 0.0001,
    },
  },
  
  // Fallback coordinates for when user location is unavailable
  FALLBACK_COORDINATES: {
    latitude: -28.4698,
    longitude: -49.0069,
  },
  
  // Clear viewport coordinates (origin)
  CLEARED_VIEWPORT: {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
} as const;

// Type for the constants
export type MapConstants = typeof MAP_CONSTANTS;
