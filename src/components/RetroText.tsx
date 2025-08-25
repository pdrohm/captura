import { Colors } from '@/src/config/Colors';
import { RetroText as RetroTextStyles } from '@/src/config/retroStyles';
import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

export interface RetroTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'heading' | 'body' | 'bodyLarge' | 'caption' | 'button' | 'buttonLarge' | 'input' | 'label';
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error';
  style?: TextStyle;
  children: React.ReactNode;
}

export function RetroText({
  variant = 'body',
  color = 'primary',
  style,
  children,
  ...rest
}: RetroTextProps) {
  // ALWAYS use light paper theme
  const colors = Colors.light;

  const getTextColor = (): string => {
    switch (color) {
      case 'secondary':
        return colors.textSecondary;
      case 'muted':
        return colors.textMuted;
      case 'accent':
        return colors.accent;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.text;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'title':
        return RetroTextStyles.title;
      case 'subtitle':
        return RetroTextStyles.subtitle;
      case 'heading':
        return RetroTextStyles.heading;
      case 'bodyLarge':
        return RetroTextStyles.bodyLarge;
      case 'caption':
        return RetroTextStyles.caption;
      case 'button':
        return RetroTextStyles.button;
      case 'buttonLarge':
        return RetroTextStyles.buttonLarge;
      case 'input':
        return RetroTextStyles.input;
      case 'label':
        return RetroTextStyles.label;
      default:
        return RetroTextStyles.body;
    }
  };

  const textStyle = [
    getTextStyle(),
    { color: getTextColor() },
    style,
  ];

  return (
    <Text style={textStyle} {...rest}>
      {children}
    </Text>
  );
}
