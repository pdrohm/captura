// Retro-cartoon map styling - soft pastels and paper-like feel
// Inspired by vintage handheld games and sticker aesthetics
export const RETRO_CARTOON_MAP_STYLE = [
  // Water bodies - soft mint green like our secondary color
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      { color: '#A8DADC' }, // Mint green from our palette
      { saturation: 60 },
      { lightness: 10 }
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#2D2D2D' }, // Soft black text
      { weight: 'bold' }
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#FFFFFF' }, // White stroke for readability
      { weight: 3 }
    ],
  },
  
  // Landscape - warm beige like paper background
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      { color: '#F6E7CB' }, // Warm beige from our palette
      { saturation: 40 },
      { lightness: 20 }
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      { color: '#A8DADC' }, // Mint green for natural areas
      { saturation: 50 }
    ],
  },
  
  // Parks - soft mint green for friendly feel
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      { color: '#A8DADC' }, // Mint green from our palette
      { saturation: 60 }
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
  
  // Roads - warm orange accent color
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      { color: '#F4A261' }, // Orange accent from our palette
      { saturation: 70 },
      { lightness: 15 }
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      { color: '#F4A261' }, // Orange accent
      { saturation: 80 },
      { weight: 4 }
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      { color: '#F6BD60' }, // Yellow accent for variety
      { saturation: 70 },
      { weight: 3 }
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [
      { color: '#F6BD60' }, // Yellow accent
      { saturation: 60 },
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

// Retro-cartoon inspired color palette
export const CARTOON_COLORS = {
  // Soft pastel colors for territories - retro-cartoon style
  territory: {
    player: '#BFA2DB',     // Soft purple (primary)
    opponent1: '#A8DADC',   // Mint green (secondary)
    opponent2: '#F4A261',   // Orange accent
    opponent3: '#F6BD60',   // Yellow accent
    opponent4: '#E76F51',   // Soft coral
    opponent5: '#8B7355',   // Muted brown
    opponent6: '#5C3D2E',   // Warm brown
    opponent7: '#F6E7CB',   // Warm beige
    neutral: '#A68B5B',     // Light brown neutral
  },
  
  // Retro-cartoon UI colors
  ui: {
    primary: '#BFA2DB',     // Soft purple
    secondary: '#A8DADC',   // Mint green
    success: '#A8DADC',     // Mint green for success
    warning: '#F6BD60',     // Yellow for warnings
    error: '#E76F51',       // Soft coral for errors
    info: '#BFA2DB',        // Purple for info
    background: '#FEF9EF',  // Paper background
    surface: '#F6E7CB',     // Warm beige surface
    text: '#2D2D2D',        // Soft black text
    textLight: '#5C3D2E',   // Warm brown text
    border: '#2D2D2D',      // Strong borders for sticker effect
    shadow: 'rgba(45, 45, 45, 0.15)', // Soft shadow
  },
  
  // Map-specific retro colors
  map: {
    userLocation: '#BFA2DB',  // Purple player marker
    conquestPath: '#F4A261',  // Orange path
    startMarker: '#A8DADC',   // Mint green start
    endMarker: '#E76F51',     // Coral end
    trackingPoint: '#F6BD60', // Yellow tracking
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
