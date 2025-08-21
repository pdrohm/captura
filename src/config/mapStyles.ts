// Pokémon GO inspired map styling - vibrant and game-like
// Note: Custom styling works best on iOS, Android has limited support
export const POKEMON_GO_MAP_STYLE = [
  // Water bodies - vivid blue like Pokémon GO
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      { color: '#4A90E2' }, // Pokémon GO blue
      { saturation: 100 },
      { lightness: 5 }
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#FFFFFF' },
      { weight: 'bold' }
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#FF0000' },
      { weight: 2 }
    ],
  },
  
  // Landscape - vibrant green like game maps
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      { color: '#98D982' }, // Bright game green
      { saturation: 80 },
      { lightness: 15 }
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      { color: '#7BC142' }, // Vivid nature green
      { saturation: 90 }
    ],
  },
  
  // Parks - even more vibrant for game feel
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      { color: '#6AB04C' }, // Rich park green
      { saturation: 100 }
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#FFFFFF' },
      { weight: 'bold' }
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#2D5016' },
      { weight: 3 }
    ],
  },
  
  // Roads - bright and game-like
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      { color: '#F39801' }, // Bright orange
      { saturation: 100 },
      { lightness: 20 }
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      { color: '#E55039' }, // Bright red-orange
      { saturation: 100 },
      { weight: 4 }
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      { color: '#FA6900' }, // Vibrant orange
      { saturation: 90 },
      { weight: 3 }
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [
      { color: '#FFA502' }, // Light orange
      { saturation: 80 },
      { weight: 2 }
    ],
  },
  
  // Road labels - high contrast for readability
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#FFFFFF' },
      { weight: 'bold' }
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#2C2C54' },
      { weight: 4 }
    ],
  },
  
  // Buildings - colorful like game structures
  {
    featureType: 'poi.business',
    elementType: 'geometry',
    stylers: [
      { color: '#D63031' }, // Bright red
      { saturation: 80 }
    ],
  },
  {
    featureType: 'poi.school',
    elementType: 'geometry',
    stylers: [
      { color: '#A29BFE' }, // Purple
      { saturation: 70 }
    ],
  },
  {
    featureType: 'poi.medical',
    elementType: 'geometry',
    stylers: [
      { color: '#00B894' }, // Teal
      { saturation: 90 }
    ],
  },
  {
    featureType: 'poi.government',
    elementType: 'geometry',
    stylers: [
      { color: '#FDCB6E' }, // Yellow
      { saturation: 80 }
    ],
  },
  
  // Enhanced POI visibility for game feel
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#FFFFFF' },
      { weight: 'bold' }
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#2C2C54' },
      { weight: 3 }
    ],
  },
  
  // Transit - vibrant colors
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      { color: '#6C5CE7' }, // Purple
      { saturation: 100 }
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      { color: '#00CEC9' }, // Cyan
      { weight: 3 }
    ],
  },
  
  // Administrative boundaries - more visible
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#2D3436' },
      { weight: 2 },
      { visibility: 'on' }
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#2D3436' },
      { weight: 'bold' }
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#FFFFFF' },
      { weight: 3 }
    ],
  },
  
  // Man-made structures - game-like colors
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [
      { color: '#DDA0DD' }, // Plum
      { saturation: 60 }
    ],
  },
];

// Simple styling that might work better
export const SIMPLE_GAME_MAP_STYLE = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      { color: '#4A90E2' }
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      { color: '#F39801' }
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      { color: '#98D982' }
    ],
  },
];

// Keep the original as an alternative
export const CARTOON_MAP_STYLE = SIMPLE_GAME_MAP_STYLE;

// Pokémon GO inspired color palette
export const CARTOON_COLORS = {
  // Vibrant game-style colors for territories
  territory: {
    player: '#E55039',     // Bright red-orange
    opponent1: '#4A90E2',   // Pokémon GO blue
    opponent2: '#6AB04C',   // Vibrant green
    opponent3: '#F39801',   // Bright orange
    opponent4: '#6C5CE7',   // Electric purple
    opponent5: '#FD79A8',   // Hot pink
    opponent6: '#00CEC9',   // Cyan
    opponent7: '#FDCB6E',   // Golden yellow
    neutral: '#95A5A6',     // Neutral gray
  },
  
  // Game-inspired UI colors
  ui: {
    primary: '#E55039',     // Bright red-orange
    secondary: '#4A90E2',   // Pokémon blue
    success: '#6AB04C',     // Vibrant green
    warning: '#F39801',     // Bright orange
    error: '#D63031',       // Deep red
    info: '#74B9FF',        // Light blue
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#2C2C54',        // Dark blue-gray
    textLight: '#636E72',
    border: '#DDA0DD',      // Light purple
    shadow: 'rgba(44, 44, 84, 0.2)', // Darker shadow
  },
  
  // Map-specific game colors
  map: {
    userLocation: '#E55039',  // Player red
    conquestPath: '#F39801',  // Bright orange path
    startMarker: '#6AB04C',   // Green start
    endMarker: '#D63031',     // Red end
    trackingPoint: '#FDCB6E', // Yellow tracking
  }
} as const;

// Animation and visual effects
export const MAP_ANIMATIONS = {
  territory: {
    pulseScale: 1.1,
    pulseDuration: 1000,
    fadeInDuration: 300,
    fadeOutDuration: 200,
  },
  marker: {
    bounceHeight: 10,
    bounceDuration: 600,
    scaleOnPress: 0.95,
  },
  ui: {
    slideInDuration: 250,
    fadeInDuration: 200,
    springConfig: {
      tension: 100,
      friction: 8,
    },
  },
} as const;

export type CartoonColors = typeof CARTOON_COLORS;
export type MapAnimations = typeof MAP_ANIMATIONS;
