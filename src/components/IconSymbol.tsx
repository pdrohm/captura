// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'map': 'map',
  'map.fill': 'map',
  'list.bullet.rectangle': 'list',
  'list.bullet.rectangle.fill': 'list',
  
  // Game icons
  'gamecontroller': 'sports-esports',
  'gamecontroller.fill': 'sports-esports',
  'person.crop.circle': 'account-circle',
  'person.crop.circle.fill': 'account-circle',
  'gearshape': 'settings',
  'gearshape.fill': 'settings',
  
  // Game specific icons
  'drop': 'water-drop',
  'drop.fill': 'water-drop',
  'coin': 'monetization-on',
  'coins': 'monetization-on',
  'star': 'star',
  'star.fill': 'star',
  'trophy': 'emoji-events',
  'trophy.fill': 'emoji-events',
  'target': 'my-location',
  'wheel': 'casino',
  'roulette': 'casino',
  'back': 'arrow-back',
  'forward': 'arrow-forward',
  'level': 'trending-up',
  'crown': 'emoji-events',
  'diamond': 'diamond',
} as const;

// Define types based on the actual mapping
type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
