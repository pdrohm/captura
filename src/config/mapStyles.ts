// Enhanced cartoon-style map configuration
export const CARTOON_MAP_STYLE = [
  // Water bodies - bright, clean blue
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      { color: '#5DADE2' }, // Bright blue
      { saturation: 60 },
      { lightness: 10 }
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#2E86AB' },
      { weight: 'bold' }
    ],
  },
  
  // Landscape/Parks - vibrant green
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      { color: '#A8E6CF' }, // Soft mint green
      { saturation: 40 },
      { lightness: 20 }
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      { color: '#7FB069' }, // Natural green
      { saturation: 50 }
    ],
  },
  
  // Parks and recreational areas
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      { color: '#88D498' }, // Park green
      { saturation: 55 }
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#2D5016' },
      { weight: 'bold' }
    ],
  },
  
  // Roads - warm, friendly colors
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      { color: '#FFE5B4' }, // Soft peach
      { saturation: 30 },
      { lightness: 40 }
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      { color: '#FFD93D' }, // Golden yellow
      { saturation: 70 },
      { weight: 3 }
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      { color: '#FFEB9C' }, // Light yellow
      { weight: 2 }
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [
      { color: '#FFF2CC' }, // Very light yellow
      { weight: 1 }
    ],
  },
  
  // Road labels - clean and readable
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#8B4513' }, // Brown text
      { weight: 'bold' }
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#FFFFFF' },
      { weight: 3 }
    ],
  },
  
  // Buildings - soft, clean colors
  {
    featureType: 'poi.business',
    elementType: 'geometry',
    stylers: [
      { color: '#E8E8E8' }, // Light gray
      { saturation: -20 }
    ],
  },
  
  // Hide clutter
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'simplified' }],
  },
  {
    featureType: 'poi.business',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.medical',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.government',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  
  // Administrative boundaries - subtle
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#C0C0C0' },
      { weight: 1 },
      { visibility: 'simplified' }
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#666666' },
      { weight: 'bold' }
    ],
  },
  
  // Clean up other elements
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [
      { color: '#F0F0F0' }, // Very light gray
      { saturation: -10 }
    ],
  },
];

// Color palette for territories and game elements
export const CARTOON_COLORS = {
  // Bright, cartoon-style colors for territories
  territory: {
    player: '#FF6B6B',     // Coral red
    opponent1: '#4ECDC4',   // Teal
    opponent2: '#45B7D1',   // Sky blue
    opponent3: '#F9CA24',   // Golden yellow
    opponent4: '#6C5CE7',   // Purple
    opponent5: '#FD79A8',   // Pink
    opponent6: '#00B894',   // Emerald
    opponent7: '#FDCB6E',   // Orange
    neutral: '#B2BEC3',     // Light gray
  },
  
  // UI element colors
  ui: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4', 
    success: '#00B894',
    warning: '#FDCB6E',
    error: '#E17055',
    info: '#74B9FF',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#2D3436',
    textLight: '#636E72',
    border: '#DDD',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  
  // Map-specific colors
  map: {
    userLocation: '#FF6B6B',
    conquestPath: '#FF6B35',
    startMarker: '#00B894',
    endMarker: '#E17055',
    trackingPoint: '#FDCB6E',
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
