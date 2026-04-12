// src/components/StatusBadge.tsx
// Reusable status indicator pill

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../theme';

type Status = 'safe' | 'warning' | 'danger' | 'unknown' | 'info';

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

const STATUS_CONFIG: Record<Status, { color: string; bg: string; icon: string; defaultLabel: string }> = {
  safe:    { color: COLORS.cyberGreen,  bg: '#00FF8818', icon: '✓', defaultLabel: 'SAFE' },
  warning: { color: COLORS.cyberYellow, bg: '#FFD70018', icon: '⚠', defaultLabel: 'WARNING' },
  danger:  { color: COLORS.cyberRed,    bg: '#FF003C18', icon: '✕', defaultLabel: 'DANGER' },
  unknown: { color: COLORS.textSecondary, bg: '#88888818', icon: '?', defaultLabel: 'UNKNOWN' },
  info:    { color: COLORS.cyberCyan,   bg: '#00E5FF18', icon: 'i', defaultLabel: 'INFO' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.color }]}>
      <Text style={[styles.icon, { color: cfg.color }]}>{cfg.icon}</Text>
      <Text style={[styles.label, { color: cfg.color }]}>{label ?? cfg.defaultLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 1,
  },
});
