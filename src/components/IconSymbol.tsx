import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'map': 'map',
  'map.fill': 'map',
  'list.bullet.rectangle': 'list',
  'list.bullet.rectangle.fill': 'list',
  
  'gamecontroller': 'sports-esports',
  'gamecontroller.fill': 'sports-esports',
  'person.crop.circle': 'account-circle',
  'person.crop.circle.fill': 'account-circle',
  'gearshape': 'settings',
  'gearshape.fill': 'settings',
  
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
  'puzzlepiece': 'extension',
  'puzzlepiece.fill': 'extension',
} as const;

type IconSymbolName = keyof typeof MAPPING;

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