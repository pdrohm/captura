export const RETRO_CARTOON_MAP_STYLE = [
  
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      { color: '#A8DADC' }, 
      { saturation: 60 },
      { lightness: 10 }
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#2D2D2D' }, 
      { weight: 'bold' }
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#FFFFFF' }, 
      { weight: 3 }
    ],
  },

  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      { color: '#F6E7CB' }, 
      { saturation: 40 },
      { lightness: 20 }
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      { color: '#A8DADC' }, 
      { saturation: 50 }
    ],
  },

  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      { color: '#A8DADC' }, 
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

  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      { color: '#F4A261' }, 
      { saturation: 70 },
      { lightness: 15 }
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      { color: '#F4A261' }, 
      { saturation: 80 },
      { weight: 4 }
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      { color: '#F6BD60' }, 
      { saturation: 70 },
      { weight: 3 }
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [
      { color: '#F6BD60' }, 
      { saturation: 60 },
      { weight: 2 }
    ],
  },

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

  {
    featureType: 'poi.business',
    elementType: 'geometry',
    stylers: [
      { color: '#D63031' }, 
      { saturation: 80 }
    ],
  },
  {
    featureType: 'poi.school',
    elementType: 'geometry',
    stylers: [
      { color: '#A29BFE' }, 
      { saturation: 70 }
    ],
  },
  {
    featureType: 'poi.medical',
    elementType: 'geometry',
    stylers: [
      { color: '#00B894' }, 
      { saturation: 90 }
    ],
  },
  {
    featureType: 'poi.government',
    elementType: 'geometry',
    stylers: [
      { color: '#FDCB6E' }, 
      { saturation: 80 }
    ],
  },

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

  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      { color: '#6C5CE7' }, 
      { saturation: 100 }
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      { color: '#00CEC9' }, 
      { weight: 3 }
    ],
  },

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

  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [
      { color: '#DDA0DD' }, 
      { saturation: 60 }
    ],
  },
];

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

export const CARTOON_MAP_STYLE = SIMPLE_GAME_MAP_STYLE;

export const CARTOON_COLORS = {
  
  territory: {
    player: '#BFA2DB',     
    opponent1: '#A8DADC',   
    opponent2: '#F4A261',   
    opponent3: '#F6BD60',   
    opponent4: '#E76F51',   
    opponent5: '#8B7355',   
    opponent6: '#5C3D2E',   
    opponent7: '#F6E7CB',   
    neutral: '#A68B5B',     
  },

  ui: {
    primary: '#BFA2DB',     
    secondary: '#A8DADC',   
    success: '#A8DADC',     
    warning: '#F6BD60',     
    error: '#E76F51',       
    info: '#BFA2DB',        
    background: '#FEF9EF',  
    surface: '#F6E7CB',     
    text: '#2D2D2D',        
    textLight: '#5C3D2E',   
    border: '#2D2D2D',      
    shadow: 'rgba(45, 45, 45, 0.15)', 
  },

  map: {
    userLocation: '#BFA2DB',  
    conquestPath: '#F4A261',  
    startMarker: '#A8DADC',   
    endMarker: '#E76F51',     
    trackingPoint: '#F6BD60', 
  }
} as const;

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