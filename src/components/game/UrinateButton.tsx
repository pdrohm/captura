import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring
} from 'react-native-reanimated';
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
          colors={disabled ? ['#CCCCCC', '#999999'] : ['#FF6B6B', '#FF8E53']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.emoji, disabled && styles.disabledEmoji]}>
            💧
          </Text>
          <Text style={[styles.text, disabled && styles.disabledText]}>
            {disabled ? 'OUT OF AMMO' : 'MARK TERRITORY'}
          </Text>
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
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  button: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  disabledEmoji: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
  counter: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  disabledText: {
    color: '#CCCCCC',
  },
});