import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, RetroColors } from '@/src/config/Colors';

interface PaperBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: 'subtle' | 'normal' | 'strong';
}

/**
 * Paper Background Component
 * Creates a vintage paper-like background with subtle texture
 * Provides the base for the retro-cartoon aesthetic
 */
export function PaperBackground({ 
  children, 
  style,
  intensity = 'normal'
}: PaperBackgroundProps) {
  // ALWAYS use light paper theme
  const colors = Colors.light;

  // Create paper texture gradient colors - always light paper
  const getPaperGradient = () => {
    const baseColor = colors.background; // #FEF9EF
    
    switch (intensity) {
      case 'subtle':
        return [baseColor, baseColor, '#FEF8ED', baseColor];
      case 'strong':
        return [baseColor, '#FEF8ED', '#FDF6E9', '#FEF8ED', baseColor];
      default:
        return [baseColor, baseColor, '#FEF8ED', baseColor, baseColor];
    }
  };

  const paperGradient = getPaperGradient();

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }, style]}>
      {/* Base paper background */}
      <LinearGradient
        colors={paperGradient}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      
      {/* Very subtle grain texture overlay - always light paper */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: RetroColors.paperGrain,
          opacity: intensity === 'subtle' ? 0.3 : intensity === 'strong' ? 0.8 : 0.5,
        }}
      />
      
      {/* Content */}
      {children}
    </View>
  );
}

/**
 * Paper Card Component
 * A card that sits on the paper background with sticker-like styling
 */
interface PaperCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'floating' | 'pressed';
}

export function PaperCard({ 
  children, 
  style,
  variant = 'default'
}: PaperCardProps) {
  // ALWAYS use light paper theme
  const colors = Colors.light;

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.card,
      borderRadius: 32, // Very rounded like stickers
      padding: 24,
      margin: 12,
      borderWidth: 3,
      borderColor: colors.border,
    };

    switch (variant) {
      case 'floating':
        return {
          ...baseStyle,
          shadowColor: colors.border,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
          borderWidth: 4, // Thicker border for floating effect
        };
      case 'pressed':
        return {
          ...baseStyle,
          shadowColor: colors.border,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
          borderWidth: 2, // Thinner border for pressed effect
        };
      default:
        return {
          ...baseStyle,
          shadowColor: colors.border,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 3,
        };
    }
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
}
