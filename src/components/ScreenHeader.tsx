// src/components/ScreenHeader.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  accent?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  icon,
  accent = COLORS.cyberGreen,
}) => (
  <View style={styles.container}>
    {icon && <Text style={styles.icon}>{icon}</Text>}
    <View>
      <Text style={[styles.title, { color: accent }]}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
    <View style={[styles.divider, { backgroundColor: accent }]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: 4,
  },
  icon: {
    fontSize: 28,
    marginBottom: 4,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    width: 40,
    marginTop: 8,
    opacity: 0.6,
  },
});
