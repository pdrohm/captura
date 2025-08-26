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
  
  const colors = Colors.light;

  const getCardStyle = (): ViewStyle => {
    const baseStyle = RetroComponents.card; 
    
    switch (variant) {
      case 'floating':
        return RetroCartoonComponents.stickerCard; 
      case 'accent':
        return {
          ...baseStyle,
          backgroundColor: colors.primary, 
          borderColor: colors.border,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent', 
        };
      default:
        return baseStyle; 
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