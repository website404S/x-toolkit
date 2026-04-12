// src/components/CyberButton.tsx

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../theme';

interface CyberButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  fullWidth = false,
}) => {
  const bg = {
    primary: COLORS.cyberGreen,
    secondary: COLORS.cyberCyan,
    danger: COLORS.cyberRed,
    outline: 'transparent',
  }[variant];

  const textColor = {
    primary: '#000000',
    secondary: '#000000',
    danger: '#FFFFFF',
    outline: COLORS.cyberGreen,
  }[variant];

  const borderColor = {
    primary: COLORS.cyberGreen,
    secondary: COLORS.cyberCyan,
    danger: COLORS.cyberRed,
    outline: COLORS.cyberGreen,
  }[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: bg, borderColor, width: fullWidth ? '100%' : undefined },
        (disabled || loading) && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 1,
  },
  disabled: {
    opacity: 0.4,
  },
});
