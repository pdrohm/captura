import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { IconSymbol } from '../IconSymbol';
import { Colors, RetroColors } from '../../config/Colors';
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
  
  const colors = Colors.light;
  
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glow = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: 1 + glow.value * 0.2 }],
  }));

  const handlePress = () => {
    if (disabled) return;

    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    scale.value = withSequence(
      withSpring(0.85, { duration: 150 }),
      withSpring(1.15, { duration: 250 }),
      withSpring(1, { duration: 400 })
    );

    rotation.value = withSequence(
      withSpring(-8, { duration: 120 }),
      withSpring(8, { duration: 120 }),
      withSpring(-4, { duration: 100 }),
      withSpring(0, { duration: 200 })
    );

    glow.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 600 })
    );

    onPress();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glowBackground, glowStyle]} />
      
      <AnimatedTouchableOpacity
        style={[animatedStyle]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View style={[
          styles.stickerButton,
          {
            borderColor: colors.border,
            opacity: disabled ? 0.6 : 1,
          }
        ]}>
          <LinearGradient
            colors={disabled 
              ? [colors.textMuted, colors.textSecondary]
              : [RetroColors.yellowAccent, RetroColors.orangeAccent]
            }
            locations={[0, 1]}
            style={styles.gradientBackground}
          />
          
          <View style={styles.buttonContent}>
            <View style={styles.iconContainer}>
              <IconSymbol
                name="drop.fill"
                size={28}
                color={disabled ? colors.textMuted : colors.text}
                style={styles.waterDropIcon}
              />
            </View>
            
            <View style={[
              styles.counterBadge,
              {
                backgroundColor: disabled ? colors.textMuted : colors.card,
                borderColor: colors.border,
              }
            ]}>
              <Text style={[
                styles.counterText,
                { color: disabled ? colors.textSecondary : colors.text }
              ]}>
                {remainingUrinations}
              </Text>
            </View>
          </View>
          
          <Text style={[
            styles.actionText,
            { color: disabled ? colors.textMuted : colors.text }
          ]}>
            {disabled ? 'Empty' : 'Mark!'}
          </Text>
        </View>
      </AnimatedTouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.select({
      ios: 110, 
      android: 90, 
    }),
    right: 20,
    zIndex: 1000,
  },
  
  glowBackground: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: RetroColors.yellowAccent,
    opacity: 0,
  },
  
  stickerButton: {
    width: 100,
    height: 100,
    borderRadius: 32, 
    borderWidth: 4, 
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: Colors.light.border,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28, 
  },
  
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
  },
  
  iconContainer: {
    marginBottom: 4,
  },
  
  waterDropIcon: {
    
  },
  
  counterBadge: {
    minWidth: 24,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  
  counterText: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  
  actionText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 6,
    textShadowColor: 'rgba(45, 45, 45, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});