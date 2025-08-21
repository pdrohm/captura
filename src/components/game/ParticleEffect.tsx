import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface ParticleEffectProps {
  visible: boolean;
  onComplete?: () => void;
  type?: 'success' | 'celebration' | 'coins';
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  visible,
  onComplete,
  type = 'success',
}) => {
  // Create shared values at the top level - one for each particle property
  const particle0Scale = useSharedValue(0);
  const particle0Opacity = useSharedValue(0);
  const particle0TranslateX = useSharedValue(0);
  const particle0TranslateY = useSharedValue(0);
  const particle0Rotation = useSharedValue(0);

  const particle1Scale = useSharedValue(0);
  const particle1Opacity = useSharedValue(0);
  const particle1TranslateX = useSharedValue(0);
  const particle1TranslateY = useSharedValue(0);
  const particle1Rotation = useSharedValue(0);

  const particle2Scale = useSharedValue(0);
  const particle2Opacity = useSharedValue(0);
  const particle2TranslateX = useSharedValue(0);
  const particle2TranslateY = useSharedValue(0);
  const particle2Rotation = useSharedValue(0);

  const particle3Scale = useSharedValue(0);
  const particle3Opacity = useSharedValue(0);
  const particle3TranslateX = useSharedValue(0);
  const particle3TranslateY = useSharedValue(0);
  const particle3Rotation = useSharedValue(0);

  const particle4Scale = useSharedValue(0);
  const particle4Opacity = useSharedValue(0);
  const particle4TranslateX = useSharedValue(0);
  const particle4TranslateY = useSharedValue(0);
  const particle4Rotation = useSharedValue(0);

  const particle5Scale = useSharedValue(0);
  const particle5Opacity = useSharedValue(0);
  const particle5TranslateX = useSharedValue(0);
  const particle5TranslateY = useSharedValue(0);
  const particle5Rotation = useSharedValue(0);

  const particle6Scale = useSharedValue(0);
  const particle6Opacity = useSharedValue(0);
  const particle6TranslateX = useSharedValue(0);
  const particle6TranslateY = useSharedValue(0);
  const particle6Rotation = useSharedValue(0);

  const particle7Scale = useSharedValue(0);
  const particle7Opacity = useSharedValue(0);
  const particle7TranslateX = useSharedValue(0);
  const particle7TranslateY = useSharedValue(0);
  const particle7Rotation = useSharedValue(0);

  // Create particles array with the shared values
  const particles = useMemo(() => [
    {
      id: 0,
      scale: particle0Scale,
      opacity: particle0Opacity,
      translateX: particle0TranslateX,
      translateY: particle0TranslateY,
      rotation: particle0Rotation,
    },
    {
      id: 1,
      scale: particle1Scale,
      opacity: particle1Opacity,
      translateX: particle1TranslateX,
      translateY: particle1TranslateY,
      rotation: particle1Rotation,
    },
    {
      id: 2,
      scale: particle2Scale,
      opacity: particle2Opacity,
      translateX: particle2TranslateX,
      translateY: particle2TranslateY,
      rotation: particle2Rotation,
    },
    {
      id: 3,
      scale: particle3Scale,
      opacity: particle3Opacity,
      translateX: particle3TranslateX,
      translateY: particle3TranslateY,
      rotation: particle3Rotation,
    },
    {
      id: 4,
      scale: particle4Scale,
      opacity: particle4Opacity,
      translateX: particle4TranslateX,
      translateY: particle4TranslateY,
      rotation: particle4Rotation,
    },
    {
      id: 5,
      scale: particle5Scale,
      opacity: particle5Opacity,
      translateX: particle5TranslateX,
      translateY: particle5TranslateY,
      rotation: particle5Rotation,
    },
    {
      id: 6,
      scale: particle6Scale,
      opacity: particle6Opacity,
      translateX: particle6TranslateX,
      translateY: particle6TranslateY,
      rotation: particle6Rotation,
    },
    {
      id: 7,
      scale: particle7Scale,
      opacity: particle7Opacity,
      translateX: particle7TranslateX,
      translateY: particle7TranslateY,
      rotation: particle7Rotation,
    },
  ], [
    particle0Scale, particle0Opacity, particle0TranslateX, particle0TranslateY, particle0Rotation,
    particle1Scale, particle1Opacity, particle1TranslateX, particle1TranslateY, particle1Rotation,
    particle2Scale, particle2Opacity, particle2TranslateX, particle2TranslateY, particle2Rotation,
    particle3Scale, particle3Opacity, particle3TranslateX, particle3TranslateY, particle3Rotation,
    particle4Scale, particle4Opacity, particle4TranslateX, particle4TranslateY, particle4Rotation,
    particle5Scale, particle5Opacity, particle5TranslateX, particle5TranslateY, particle5Rotation,
    particle6Scale, particle6Opacity, particle6TranslateX, particle6TranslateY, particle6Rotation,
    particle7Scale, particle7Opacity, particle7TranslateX, particle7TranslateY, particle7Rotation,
  ]);

  useEffect(() => {
    if (visible) {
      // Start particle animation
      particles.forEach((particle, index) => {
        const delay = index * 50;
        const angle = (index * 45) * Math.PI / 180; // 45 degrees apart
        const distance = 100 + Math.random() * 50;
        
        // Initial spawn
        particle.scale.value = withTiming(1, { 
          duration: 200,
          delay,
          easing: Easing.out(Easing.quad)
        });
        
        particle.opacity.value = withTiming(1, { 
          duration: 200,
          delay,
        });

        // Movement
        particle.translateX.value = withSequence(
          withTiming(0, { duration: 100 }),
          withSpring(Math.cos(angle) * distance, { 
            damping: 15, 
            stiffness: 200 
          })
        );
        
        particle.translateY.value = withSequence(
          withTiming(0, { duration: 100 }),
          withSpring(Math.sin(angle) * distance, { 
            damping: 15, 
            stiffness: 200 
          })
        );

        // Rotation
        particle.rotation.value = withTiming(360 + Math.random() * 360, {
          duration: 1000,
          delay,
        });

        // Fade out
        setTimeout(() => {
          particle.opacity.value = withTiming(0, { 
            duration: 500,
            easing: Easing.in(Easing.quad)
          });
          
          particle.scale.value = withTiming(0, { 
            duration: 500,
            easing: Easing.in(Easing.quad)
          }, () => {
            // Callback on last particle
            if (index === particles.length - 1 && onComplete) {
              runOnJS(onComplete)();
            }
          });
        }, 800 + delay);
      });
    } else {
      // Reset all particles
      particles.forEach(particle => {
        particle.scale.value = 0;
        particle.opacity.value = 0;
        particle.translateX.value = 0;
        particle.translateY.value = 0;
        particle.rotation.value = 0;
      });
    }
  }, [visible, particles, onComplete]);

  if (!visible) return null;

  const getParticleEmoji = () => {
    switch (type) {
      case 'celebration': return '🎉';
      case 'coins': return '🪙';
      default: return '💧';
    }
  };

  const ParticleItem: React.FC<{ particle: typeof particles[0] }> = ({ particle }) => {
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: particle.translateX.value },
        { translateY: particle.translateY.value },
        { scale: particle.scale.value },
        { rotate: `${particle.rotation.value}deg` },
      ],
      opacity: particle.opacity.value,
    }));

    return (
      <Animated.View
        style={[styles.particle, animatedStyle]}
      >
        <View style={styles.particleContent}>
          <Animated.Text style={styles.particleEmoji}>
            {getParticleEmoji()}
          </Animated.Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <ParticleItem key={particle.id} particle={particle} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  particle: {
    position: 'absolute',
  },
  particleContent: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particleEmoji: {
    fontSize: 20,
  },
});