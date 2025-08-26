import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const RetroSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const RetroRadius = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  pill: 999,
} as const;

export const RetroBorders = {
  subtle: {
    borderWidth: 2,
    borderStyle: 'solid' as const,
  },
  
  sticker: {
    borderWidth: 3,
    borderStyle: 'solid' as const,
  },
  
  bold: {
    borderWidth: 4,
    borderStyle: 'solid' as const,
  },
  
  thick: {
    borderWidth: 5,
    borderStyle: 'solid' as const,
  },
  
  extraThick: {
    borderWidth: 6,
    borderStyle: 'solid' as const,
  },
  
  none: {
    borderWidth: 0,
  },
} as const;

export const RetroShadows = {
  none: {},
  
  paper: {
    shadowColor: '#5C3D2E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  
  subtle: {
    shadowColor: '#2D2D2D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  
  soft: {
    shadowColor: '#2D2D2D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  
  medium: {
    shadowColor: '#2D2D2D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  floating: {
    shadowColor: '#2D2D2D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  
  hero: {
    shadowColor: '#2D2D2D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const RetroComponents = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.card,
    ...RetroBorders.sticker,
    borderColor: Colors.light.border,
    borderRadius: RetroRadius.xxl,
    padding: RetroSpacing.xl,
    margin: RetroSpacing.md,
    ...RetroShadows.soft,
  },
  
  button: {
    backgroundColor: Colors.light.button,
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
  
  input: {
    backgroundColor: Colors.light.surface,
    ...RetroBorders.sticker,
    borderColor: Colors.light.borderMuted,
    borderRadius: RetroRadius.xl,
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
  
  container: {
    backgroundColor: Colors.light.background,
    flex: 1,
    padding: RetroSpacing.lg,
  },
  
  containerDark: {
    backgroundColor: Colors.dark.background,
    flex: 1,
    padding: RetroSpacing.lg,
  },
  
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

export const RetroText = StyleSheet.create({
  gameTitle: {
    fontSize: 36,
    fontWeight: '900' as const,
    lineHeight: 40,
    textAlign: 'center' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  
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
    letterSpacing: 0.8,
  },
  
  heading: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 26,
    letterSpacing: 0.6,
  },
  
  body: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.3,
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
  
  label: {
    fontSize: 12,
    fontWeight: '800' as const,
    lineHeight: 16,
    letterSpacing: 1.0,
    textTransform: 'uppercase' as const,
  },
  
  score: {
    fontSize: 24,
    fontWeight: '900' as const,
    textAlign: 'center' as const,
    letterSpacing: 1.0,
  },
});

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

export const RetroCartoonComponents = StyleSheet.create({
  stickerCard: {
    backgroundColor: Colors.light.card,
    borderRadius: RetroRadius.xxl,
    padding: RetroSpacing.xxl,
    margin: RetroSpacing.lg,
    ...RetroBorders.thick,
    borderColor: Colors.light.border,
    ...RetroShadows.floating,
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
  
  paperTexture: {
    backgroundColor: Colors.light.background,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
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