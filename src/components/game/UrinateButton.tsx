import { Entypo } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring
} from 'react-native-reanimated';
import { CARTOON_COLORS } from '../../config/mapStyles';
import { useGameSettings } from '../../stores/settingsStore';

interface UrinateButtonProps {
  onPress: () => void;
  disabled: boolean;
  remainingUrinations: number;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const UrinateButton: React.FC<UrinateButtonProps> = ({
  onPress,
  disabled,
  remainingUrinations,
}) => {
  const { haptics } = useGameSettings();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
  }));

  const handlePress = () => {
    if (disabled) return;

    // Haptic feedback
    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    // Animation
    scale.value = withSequence(
      withSpring(0.9, { duration: 100 }),
      withSpring(1.1, { duration: 200 }),
      withSpring(1, { duration: 300 })
    );

    rotation.value = withSequence(
      withSpring(-5, { duration: 100 }),
      withSpring(5, { duration: 100 }),
      withSpring(0, { duration: 100 })
    );

    onPress();
  };

  return (
    <View style={styles.container}>
      <AnimatedTouchableOpacity
        style={[animatedStyle, disabled && styles.disabledContainer]}
        onPress={handlePress}
        disabled={disabled}
      >
        <LinearGradient
          colors={disabled ? 
            [CARTOON_COLORS.ui.textLight, CARTOON_COLORS.ui.border] : 
            [CARTOON_COLORS.ui.primary, CARTOON_COLORS.ui.warning]
          }
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Entypo 
            name="water" 
            size={24} 
            color={disabled ? '#CCCCCC' : '#FFFFFF'} 
            style={styles.icon}
          />
         
          <Text style={[styles.counter, disabled && styles.disabledText]}>
            {remainingUrinations} left
          </Text>
        </LinearGradient>
      </AnimatedTouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.select({
      ios: 105, // iOS tab bar height (85) + padding (20)
      android: 85, // Android tab bar height (65) + padding (20)
    }),
    right: 20,
    zIndex: 1000,
  },
  button: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: CARTOON_COLORS.ui.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderWidth: 4,
    borderColor: CARTOON_COLORS.ui.background,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  icon: {
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,

  },
  text: {
    color: CARTOON_COLORS.ui.background,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  counter: {
    color: CARTOON_COLORS.ui.background,
    fontSize: 8,
    fontWeight: '700',
    marginTop: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  disabledText: {
    color: '#CCCCCC',
  },
});