import { Colors } from '@/src/config/Colors';
import { RetroComponents, RetroSpacing, RetroText } from '@/src/config/retroStyles';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

export interface RetroInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'filled';
  style?: ViewStyle;
}

export function RetroInput({
  label,
  error,
  helper,
  size = 'medium',
  variant = 'default',
  style,
  ...rest
}: RetroInputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? 'light'];

  const getInputStyle = (): ViewStyle => {
    const baseStyle = isDark ? RetroComponents.inputDark : RetroComponents.input;
    
    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
        };
      case 'filled':
        return {
          ...baseStyle,
          borderWidth: 1,
        };
      default:
        return baseStyle;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: RetroSpacing.sm,
          paddingHorizontal: RetroSpacing.md,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingVertical: RetroSpacing.lg,
          paddingHorizontal: RetroSpacing.xl,
          minHeight: 56,
        };
      default:
        return {};
    }
  };

  const inputStyle = [
    getInputStyle(),
    getSizeStyle(),
    { 
      borderColor: error ? colors.error : colors.border,
      color: colors.text,
    },
    style,
  ];

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      
      <TextInput
        style={inputStyle}
        placeholderTextColor={colors.textMuted}
        {...rest}
      />
      
      {(error || helper) && (
        <Text style={[
          styles.helper,
          { color: error ? colors.error : colors.textSecondary }
        ]}>
          {error || helper}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: RetroSpacing.lg,
  },
  label: {
    ...RetroText.label,
    marginBottom: RetroSpacing.sm,
  },
  helper: {
    ...RetroText.caption,
    marginTop: RetroSpacing.sm,
  },
});