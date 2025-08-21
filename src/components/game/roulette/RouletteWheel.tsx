import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { rouletteService } from '../../../services/rouletteService';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width * 0.8, 300);
const CENTER = WHEEL_SIZE / 2;
const RADIUS = (WHEEL_SIZE - 40) / 2;

interface RouletteWheelProps {
  isSpinning: boolean;
  finalAngle?: number;
  spinDuration?: number;
  onSpinComplete?: () => void;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  isSpinning,
  finalAngle = 0,
  spinDuration = 3000,
  onSpinComplete,
}) => {
  const rotation = useSharedValue(0);
  const config = rouletteService.getConfig();
  const segments = config.segments;

  useEffect(() => {
    if (isSpinning && finalAngle !== undefined) {
      // Calculate total rotation (multiple full spins + final angle)
      const fullSpins = 5 + Math.random() * 3; // 5-8 full spins
      const totalRotation = fullSpins * 360 + finalAngle;
      
      rotation.value = withTiming(
        totalRotation,
        {
          duration: spinDuration,
        },
        (finished) => {
          if (finished && onSpinComplete) {
            runOnJS(onSpinComplete)();
          }
        }
      );
    } else if (!isSpinning) {
      rotation.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });
    }
  }, [isSpinning, finalAngle, spinDuration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  const pointerStyle = useAnimatedStyle(() => {
    const pointerRotation = interpolate(
      rotation.value,
      [0, 360],
      [0, -360],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          rotate: `${pointerRotation}deg`,
        },
      ],
    };
  });

  const segmentAngle = 360 / segments.length;

  return (
    <View style={styles.container}>
      <View style={styles.wheelContainer}>
        {/* Roulette Wheel */}
        <Animated.View style={[styles.wheel, animatedStyle]}>
          {segments.map((segment, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            
            return (
              <View
                key={segment.id}
                style={[
                  styles.segment,
                  {
                    backgroundColor: segment.color,
                    transform: [
                      { rotate: `${startAngle}deg` },
                    ],
                  },
                ]}
              >
                <View style={styles.segmentContent}>
                  <Text style={styles.segmentIcon}>{segment.icon}</Text>
                  <Text style={styles.segmentLabel} numberOfLines={1}>
                    {segment.label}
                  </Text>
                </View>
              </View>
            );
          })}
        </Animated.View>

        {/* Center Circle */}
        <View style={styles.centerCircle}>
          <View style={styles.centerDot} />
        </View>

        {/* Pointer */}
        <Animated.View style={[styles.pointer, pointerStyle]}>
          <View style={styles.pointerTriangle} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  wheelContainer: {
    position: 'relative',
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    borderWidth: 8,
    borderColor: '#2C3E50',
    backgroundColor: '#34495E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  segment: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    transformOrigin: '100% 100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  segmentContent: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    right: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  segmentIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  segmentLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  centerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2C3E50',
    borderWidth: 4,
    borderColor: '#ECF0F1',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  centerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ECF0F1',
  },
  pointer: {
    position: 'absolute',
    top: -15,
    left: '50%',
    transform: [{ translateX: -15 }],
    zIndex: 10,
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#E74C3C',
  },
});
