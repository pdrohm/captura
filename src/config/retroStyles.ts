import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

/**
 * Retro-Cartoon Design System Styles
 * Paper-like vintage aesthetic with sticker-like elements
 * Inspired by retro handheld games and vintage illustrations
 */

// Retro-cartoon spacing system - generous and playful
export const RetroSpacing = {
  xs: 4,    // Tiny gaps
  sm: 8,    // Small spacing
  md: 12,   // Standard spacing
  lg: 16,   // Large spacing
  xl: 24,   // Extra large
  xxl: 32,  // Double extra large
  xxxl: 48, // Triple extra large for major sections
} as const;

// Retro-cartoon border radius - smooth and rounded like stickers
export const RetroRadius = {
  none: 0,
  xs: 6,    // Subtle rounding
  sm: 10,   // Small rounded corners
  md: 16,   // Standard rounded corners
  lg: 20,   // Large rounded corners
  xl: 24,   // Extra large rounding
  xxl: 32,  // Double extra large - very rounded like stickers
  pill: 999, // Fully rounded pills
} as const;

// Sticker-like borders for retro-cartoon aesthetic
export const RetroBorders = {
  // Subtle sticker outline
  subtle: {
    borderWidth: 2,
    borderStyle: 'solid' as const,
  },
  
  // Standard sticker borders - most common
  sticker: {
    borderWidth: 3,
    borderStyle: 'solid' as const,
  },
  
  // Bold borders for emphasis (like thick sticker outlines)
  bold: {
    borderWidth: 4,
    borderStyle: 'solid' as const,
  },
  
  // Extra thick borders for hero elements
  thick: {
    borderWidth: 5,
    borderStyle: 'solid' as const,
  },
  
  // Super thick for special elements
  extraThick: {
    borderWidth: 6,
    borderStyle: 'solid' as const,
  },
  
  // No border for flat elements
  none: {
    borderWidth: 0,
  },
} as const;

// Retro-cartoon shadow effects - soft and paper-like
export const RetroShadows = {
  none: {},
  
  // Very subtle shadow for paper texture
  paper: {
    shadowColor: '#5C3D2E', // Warm brown shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  
  // Subtle sticker shadow
  subtle: {
    shadowColor: '#2D2D2D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Soft sticker shadow - most common
  soft: {
    shadowColor: '#2D2D2D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  
  // Medium shadow for floating elements
  medium: {
    shadowColor: '#2D2D2D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Strong shadow for floating stickers
  floating: {
    shadowColor: '#2D2D2D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  
  // Hero shadow for main elements
  hero: {
    shadowColor: '#2D2D2D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// Common retro-cartoon component styles - sticker-like paper elements
export const RetroComponents = StyleSheet.create({
  // Paper-like card with sticker border - ALWAYS light theme
  card: {
    backgroundColor: Colors.light.card, // Always paper background
    ...RetroBorders.sticker,
    borderColor: Colors.light.border,
    borderRadius: RetroRadius.xxl, // Very rounded like stickers
    padding: RetroSpacing.xl,
    margin: RetroSpacing.md,
    ...RetroShadows.soft, // Soft shadow for sticker effect
  },
  
  // Sticker-like button styles - ALWAYS light theme
  button: {
    backgroundColor: Colors.light.button,
    ...RetroBorders.bold, // Bold border for sticker effect
    borderColor: Colors.light.border, // Strong outline
    borderRadius: RetroRadius.xxl, // Very rounded
    paddingVertical: RetroSpacing.lg,
    paddingHorizontal: RetroSpacing.xl,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 56,
    ...RetroShadows.medium, // More shadow for button press feel
  },
  
  buttonSecondary: {
    backgroundColor: Colors.light.buttonSecondary,
    ...RetroBorders.bold,
    borderColor: Colors.light.border,
    borderRadius: RetroRadius.xxl,
    paddingVertical: RetroSpacing.lg,
    paddingHorizontal: RetroSpacing.xl,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 56,
    ...RetroShadows.medium,
  },
  
  // Paper-like input with sticker border
  input: {
    backgroundColor: Colors.light.surface, // Warm beige background
    ...RetroBorders.sticker,
    borderColor: Colors.light.borderMuted,
    borderRadius: RetroRadius.xl, // Rounded like sticker
    padding: RetroSpacing.xl,
    fontSize: 16,
    minHeight: 56,
    color: Colors.light.text,
    ...RetroShadows.subtle,
  },
  
  inputDark: {
    backgroundColor: Colors.dark.surface,
    ...RetroBorders.sticker,
    borderColor: Colors.dark.borderMuted,
    borderRadius: RetroRadius.xl,
    padding: RetroSpacing.xl,
    fontSize: 16,
    minHeight: 56,
    color: Colors.dark.text,
    ...RetroShadows.subtle,
  },
  
  inputFocused: {
    backgroundColor: Colors.light.card,
    borderColor: Colors.light.primary,
    ...RetroShadows.soft,
  },
  
  inputFocusedDark: {
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.primary,
    ...RetroShadows.soft,
  },
  
  // Paper-like container styles
  container: {
    backgroundColor: Colors.light.background, // Paper background
    flex: 1,
    padding: RetroSpacing.lg,
  },
  
  containerDark: {
    backgroundColor: Colors.dark.background, // Dark paper
    flex: 1,
    padding: RetroSpacing.lg,
  },
  
  // Section styles
  section: {
    marginVertical: RetroSpacing.md,
    padding: RetroSpacing.lg,
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.borderMuted,
    borderRadius: RetroRadius.md,
    ...RetroShadows.subtle,
  },
  
  sectionDark: {
    marginVertical: RetroSpacing.md,
    padding: RetroSpacing.lg,
    backgroundColor: Colors.dark.surface,
    borderWidth: 2,
    borderColor: Colors.dark.borderMuted,
    borderRadius: RetroRadius.md,
    ...RetroShadows.subtle,
  },
  
  // Header styles
  header: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: RetroSpacing.lg,
    textAlign: 'center' as const,
    color: Colors.light.text,
    letterSpacing: 0.5,
  },
  
  headerDark: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: RetroSpacing.lg,
    textAlign: 'center' as const,
    color: Colors.dark.text,
    letterSpacing: 0.5,
  },
  
  // Divider styles
  divider: {
    height: 3,
    backgroundColor: Colors.light.borderMuted,
    marginVertical: RetroSpacing.lg,
    borderRadius: RetroRadius.pill,
  },
  
  dividerDark: {
    height: 3,
    backgroundColor: Colors.dark.borderMuted,
    marginVertical: RetroSpacing.lg,
    borderRadius: RetroRadius.pill,
  },
});

// Retro-cartoon typography - playful and readable
export const RetroText = StyleSheet.create({
  // Game title - bold and chunky like retro handheld games
  gameTitle: {
    fontSize: 36,
    fontWeight: '900' as const,
    lineHeight: 40,
    textAlign: 'center' as const,
    letterSpacing: 1.5, // More spacing for retro feel
    textTransform: 'uppercase' as const,
  },
  
  // Section titles - friendly and bold
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 34,
    textAlign: 'center' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  
  subtitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
    textAlign: 'center' as const,
    letterSpacing: 0.8, // Slightly more spacing
  },
  
  heading: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 26,
    letterSpacing: 0.6, // More spacing for playful feel
  },
  
  body: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.3, // Slightly more readable
  },
  
  bodyLarge: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 26,
    letterSpacing: 0.4,
  },
  
  caption: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  
  // Button text - bold and playful
  button: {
    fontSize: 18,
    fontWeight: '800' as const,
    textAlign: 'center' as const,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
  
  buttonLarge: {
    fontSize: 20,
    fontWeight: '800' as const,
    textAlign: 'center' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  
  input: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  
  // Label - small caps style
  label: {
    fontSize: 12,
    fontWeight: '800' as const,
    lineHeight: 16,
    letterSpacing: 1.0,
    textTransform: 'uppercase' as const,
  },
  
  // Score/stats display
  score: {
    fontSize: 24,
    fontWeight: '900' as const,
    textAlign: 'center' as const,
    letterSpacing: 1.0,
  },
});

// Retro layout utilities
export const RetroLayout = StyleSheet.create({
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  
  column: {
    flexDirection: 'column' as const,
  },
  
  center: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  spaceBetween: {
    justifyContent: 'space-between' as const,
  },
  
  spaceAround: {
    justifyContent: 'space-around' as const,
  },
  
  flex1: {
    flex: 1,
  },
  
  flex2: {
    flex: 2,
  },
  
  flex3: {
    flex: 3,
  },
});

// Retro spacing utilities
export const RetroSpacingStyles = StyleSheet.create({
  marginXs: { margin: RetroSpacing.xs },
  marginSm: { margin: RetroSpacing.sm },
  marginMd: { margin: RetroSpacing.md },
  marginLg: { margin: RetroSpacing.lg },
  marginXl: { margin: RetroSpacing.xl },
  
  marginVerticalXs: { marginVertical: RetroSpacing.xs },
  marginVerticalSm: { marginVertical: RetroSpacing.sm },
  marginVerticalMd: { marginVertical: RetroSpacing.md },
  marginVerticalLg: { marginVertical: RetroSpacing.lg },
  marginVerticalXl: { marginVertical: RetroSpacing.xl },
  
  marginHorizontalXs: { marginHorizontal: RetroSpacing.xs },
  marginHorizontalSm: { marginHorizontal: RetroSpacing.sm },
  marginHorizontalMd: { marginHorizontal: RetroSpacing.md },
  marginHorizontalLg: { marginHorizontal: RetroSpacing.lg },
  marginHorizontalXl: { marginHorizontal: RetroSpacing.xl },
  
  paddingXs: { padding: RetroSpacing.xs },
  paddingSm: { padding: RetroSpacing.sm },
  paddingMd: { padding: RetroSpacing.md },
  paddingLg: { padding: RetroSpacing.lg },
  paddingXl: { padding: RetroSpacing.xl },
  
  paddingVerticalXs: { paddingVertical: RetroSpacing.xs },
  paddingVerticalSm: { paddingVertical: RetroSpacing.sm },
  paddingVerticalMd: { paddingVertical: RetroSpacing.md },
  paddingVerticalLg: { paddingVertical: RetroSpacing.lg },
  paddingVerticalXl: { paddingVertical: RetroSpacing.xl },
  
  paddingHorizontalXs: { paddingHorizontal: RetroSpacing.xs },
  paddingHorizontalSm: { paddingHorizontal: RetroSpacing.sm },
  paddingHorizontalMd: { paddingHorizontal: RetroSpacing.md },
  paddingHorizontalLg: { paddingHorizontal: RetroSpacing.lg },
  paddingHorizontalXl: { paddingHorizontal: RetroSpacing.xl },
});

// Special retro-cartoon component styles - enhanced sticker aesthetic
export const RetroCartoonComponents = StyleSheet.create({
  // Hero sticker card with extra thick borders
  stickerCard: {
    backgroundColor: Colors.light.card, // Paper background
    borderRadius: RetroRadius.xxl,
    padding: RetroSpacing.xxl,
    margin: RetroSpacing.lg,
    ...RetroBorders.thick, // Thick border for sticker effect
    borderColor: Colors.light.border,
    ...RetroShadows.floating, // More shadow for floating effect
  },
  
  stickerCardDark: {
    backgroundColor: Colors.dark.card,
    borderRadius: RetroRadius.xxl,
    padding: RetroSpacing.xxl,
    margin: RetroSpacing.lg,
    ...RetroBorders.thick,
    borderColor: Colors.dark.border,
    ...RetroShadows.floating,
  },
  
  // Paper texture overlay for backgrounds
  paperTexture: {
    backgroundColor: Colors.light.background,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03, // Very subtle texture
  },
  
  paperTextureDark: {
    backgroundColor: Colors.dark.background,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  
  // Dog paw button with sticker styling
  pawButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: RetroRadius.pill,
    paddingVertical: RetroSpacing.lg,
    paddingHorizontal: RetroSpacing.xl,
    ...RetroBorders.bold,
    borderColor: Colors.light.borderSecondary,
    ...RetroShadows.soft,
  },
  
  pawButtonDark: {
    backgroundColor: Colors.dark.accent,
    borderRadius: RetroRadius.pill,
    paddingVertical: RetroSpacing.lg,
    paddingHorizontal: RetroSpacing.xl,
    ...RetroBorders.bold,
    borderColor: Colors.dark.borderSecondary,
    ...RetroShadows.soft,
  },
  
  // Badge sticker with thick outline
  stickerBadge: {
    backgroundColor: Colors.light.primary,
    borderRadius: RetroRadius.pill,
    paddingVertical: RetroSpacing.sm,
    paddingHorizontal: RetroSpacing.lg,
    ...RetroBorders.sticker,
    borderColor: Colors.light.borderSecondary,
    alignSelf: 'flex-start' as const,
    ...RetroShadows.subtle,
  },
  
  stickerBadgeDark: {
    backgroundColor: Colors.dark.primary,
    borderRadius: RetroRadius.pill,
    paddingVertical: RetroSpacing.sm,
    paddingHorizontal: RetroSpacing.lg,
    ...RetroBorders.sticker,
    borderColor: Colors.dark.borderSecondary,
    alignSelf: 'flex-start' as const,
    ...RetroShadows.subtle,
  },
  
  // Game section with sticker styling
  gameSection: {
    backgroundColor: Colors.light.surface,
    borderRadius: RetroRadius.xxl,
    padding: RetroSpacing.xxl,
    margin: RetroSpacing.lg,
    ...RetroBorders.sticker,
    borderColor: Colors.light.borderMuted,
    ...RetroShadows.soft,
  },
  
  gameSectionDark: {
    backgroundColor: Colors.dark.surface,
    borderRadius: RetroRadius.xxl,
    padding: RetroSpacing.xxl,
    margin: RetroSpacing.lg,
    ...RetroBorders.sticker,
    borderColor: Colors.dark.borderMuted,
    ...RetroShadows.soft,
  },
});
