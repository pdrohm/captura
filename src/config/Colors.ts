/**
 * Retro-Cartoon Design System
 * Paper-like vintage aesthetic with soft pastel colors and sticker-like elements
 * Inspired by retro handheld games and vintage illustrations on paper
 */

// Light theme colors (retro paper-cartoon inspired)
const lightColors = {
  // Primary backgrounds - paper-like with texture
  background: '#FEF9EF',    // Very light paper background
  surface: '#F6E7CB',       // Warm beige surface
  card: '#FEF9EF',          // Paper-like card background (same as main bg for cohesion)
  
  // Text colors - warm and readable
  text: '#2D2D2D',          // Soft black for primary text
  textSecondary: '#5C3D2E', // Warm brown for secondary text
  textMuted: '#8B7355',     // Muted brown for less important text
  
  // Borders - bold sticker-like outlines
  border: '#2D2D2D',        // Strong outline for sticker effect
  borderSecondary: '#5C3D2E', // Warm brown borders
  borderMuted: '#A68B5B',   // Subtle borders for light elements
  
  // Retro pastel accents - playful and soft
  primary: '#BFA2DB',       // Soft purple - main brand color
  secondary: '#A8DADC',     // Mint green - secondary actions
  accent: '#F4A261',        // Orange accent - highlights and CTAs
  
  // Interactive elements - sticker-like buttons
  button: '#BFA2DB',        // Soft purple primary button
  buttonText: '#FFFFFF',    // White text on colored buttons
  buttonSecondary: '#A8DADC', // Mint green secondary button
  buttonSecondaryText: '#2D2D2D', // Dark text on light buttons
  
  // Status colors - soft but recognizable
  success: '#A8DADC',       // Mint green for success
  warning: '#F6BD60',       // Yellow accent for warnings
  error: '#E76F51',         // Soft coral for errors
  info: '#BFA2DB',          // Purple for info states
  
  // Navigation elements
  tabIconDefault: '#8B7355', // Muted brown for inactive tabs
  tabIconSelected: '#BFA2DB', // Purple for active tab
  
  // Icon colors
  icon: '#2D2D2D',          // Primary icon color
  iconMuted: '#8B7355',     // Muted icons
};

// Export both for compatibility, but both point to light theme
export const Colors = {
  light: lightColors,
  dark: lightColors, // Dark theme is same as light - always paper aesthetic
};

// Retro-cartoon specific colors and extended palette
export const RetroColors = {
  // Core retro-cartoon palette - paper-like aesthetic
  paperBackground: '#FEF9EF',  // Very light paper background
  warmBeige: '#F6E7CB',        // Warm beige surface
  softPurple: '#BFA2DB',       // Soft purple primary
  mintGreen: '#A8DADC',        // Mint green secondary
  orangeAccent: '#F4A261',     // Orange accent for CTAs
  yellowAccent: '#F6BD60',     // Yellow for highlights
  warmBrown: '#5C3D2E',        // Warm brown text
  softBlack: '#2D2D2D',        // Soft black primary text
  
  // Paper texture and sticker effects
  paperTexture: '#FEF9EF',     // Base paper color
  stickerShadow: 'rgba(45, 45, 45, 0.15)', // Subtle shadow for sticker effect
  paperGrain: 'rgba(92, 61, 46, 0.03)',   // Very subtle grain overlay
  
  // Sticker-like border colors
  stickerOutline: '#2D2D2D',   // Strong black outline
  stickerOutlineWarm: '#5C3D2E', // Warm brown outline
  stickerOutlineLight: '#A68B5B', // Light brown for subtle elements
  
  // Game-specific retro colors
  gameBackground: '#FEF9EF',   // Paper background
  gameSurface: '#FEF9EF',      // Cards same as background for cohesion
  gameBorder: '#2D2D2D',       // Strong sticker borders
  gameText: '#2D2D2D',         // Primary text
  gameTextSecondary: '#5C3D2E', // Secondary text
  gameAccent: '#F4A261',       // Orange actions
  
  // Extended dog-game themed colors (updated for new palette)
  dogBrown: '#8B4513',         // Rich brown for dog elements
  collarRed: '#E76F51',        // Soft coral for collars (matching error color)
  boneWhite: '#FEF9EF',        // Paper white for bones
  grassGreen: '#A8DADC',       // Mint green for parks (matching secondary)
  hydrantRed: '#F4A261',       // Orange for fire hydrants (matching accent)
  
  // Playful accent colors for variety
  pawPrint: '#5C3D2E',         // Warm brown paw prints
  treatBrown: '#8B7355',       // Muted brown treats
  toyPurple: '#BFA2DB',        // Purple toys (matching primary)
  leashMint: '#A8DADC',        // Mint leash (matching secondary)
  parkGreen: '#A8DADC',        // Park green (consistent)
  sunnyYellow: '#F6BD60',      // Sunny yellow (matching warning)
};
