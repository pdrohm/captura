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
          <Entypo 
            name="water" 
            size={32} 
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
    width: 80,
    height: 80,
    borderRadius: 40,
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
  icon: {
    marginBottom: 2,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 2,
  },
  counter: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '600',
    marginTop: 1,
  },
  disabledText: {
    color: '#CCCCCC',
  },
});