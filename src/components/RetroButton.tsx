import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/src/config/Colors';
import { RetroComponents, RetroText, RetroSpacing, RetroRadius, RetroShadows } from '@/src/config/retroStyles';

export interface RetroButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

export function RetroButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  children,
}: RetroButtonProps) {
  // ALWAYS use light paper theme
  const colors = Colors.light;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = RetroComponents.button;
    
    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.buttonSecondary, // Mint green
          borderColor: colors.border, // Strong black border
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 3,
          borderColor: colors.primary, // Purple outline
          ...RetroShadows.subtle,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 0,
          ...RetroShadows.none,
        };
      default:
        return baseStyle; // Purple button with black border
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle = RetroText.button;
    
    let textColor = colors.buttonText; // White text on colored buttons
    
    if (variant === 'outline') {
      textColor = colors.text; // Black text on transparent background
    } else if (variant === 'ghost') {
      textColor = colors.text; // Black text on transparent
    } else if (variant === 'secondary') {
      textColor = colors.buttonSecondaryText; // Dark text on mint green
    }
    
    if (disabled) {
      textColor = colors.textMuted; // Muted brown when disabled
    }
    
    return {
      ...baseTextStyle,
      color: textColor,
    };
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: RetroSpacing.sm,
          paddingHorizontal: RetroSpacing.lg,
          minHeight: 40,
          borderRadius: RetroRadius.md,
        };
      case 'large':
        return {
          paddingVertical: RetroSpacing.lg,
          paddingHorizontal: RetroSpacing.xxl,
          minHeight: 56,
          borderRadius: RetroRadius.xl,
        };
      default:
        return {
          borderRadius: RetroRadius.lg,
        };
    }
  };

  const buttonStyle = [
    getButtonStyle(),
    getSizeStyle(),
    disabled && styles.disabled,
    style,
  ];

  const textStyleFinal = [
    getTextStyle(),
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {children || (
        <Text style={textStyleFinal}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});
