// src/components/CyberCard.tsx
// Reusable dark card with optional accent border

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../theme';

interface CyberCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  accent?: 'green' | 'cyan' | 'purple' | 'red' | 'none';
  padding?: number;
}

export const CyberCard: React.FC<CyberCardProps> = ({
  children,
  style,
  accent = 'none',
  padding = SPACING.md,
}) => {
  const accentColor = {
    green: COLORS.cyberGreen,
    cyan: COLORS.cyberCyan,
    purple: COLORS.cyberPurple,
    red: COLORS.cyberRed,
    none: 'transparent',
  }[accent];

  return (
    <View
      style={[
        styles.card,
        {
          padding,
          borderLeftColor: accentColor,
          borderLeftWidth: accent !== 'none' ? 2 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
});
