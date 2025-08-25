import { Colors } from '@/src/config/Colors';
import { RetroComponents, RetroSpacing, RetroCartoonComponents } from '@/src/config/retroStyles';
import React from 'react';
import { View, ViewStyle } from 'react-native';

export interface RetroCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'floating' | 'accent' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export function RetroCard({
  children,
  variant = 'default',
  size = 'medium',
  style,
}: RetroCardProps) {
  // ALWAYS use light paper theme
  const colors = Colors.light;

  const getCardStyle = (): ViewStyle => {
    const baseStyle = RetroComponents.card; // Always light paper card
    
    switch (variant) {
      case 'floating':
        return RetroCartoonComponents.stickerCard; // Floating sticker card
      case 'accent':
        return {
          ...baseStyle,
          backgroundColor: colors.primary, // Purple accent background
          borderColor: colors.border,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent', // Transparent with border only
        };
      default:
        return baseStyle; // Standard paper card
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          padding: RetroSpacing.md,
          margin: RetroSpacing.sm,
        };
      case 'large':
        return {
          padding: RetroSpacing.xl,
          margin: RetroSpacing.lg,
        };
      default:
        return {};
    }
  };

  const cardStyle = [
    getCardStyle(),
    getSizeStyle(),
    { borderColor: colors.border },
    style,
  ];

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}
