// src/theme/index.ts
// X-Toolkit - Cyberpunk Dark Theme
// Palette: CyberGreen + CyberCyan on Deep Black

export const COLORS = {
  // Backgrounds
  bg: '#0A0A0F',
  bgCard: '#0F0F1A',
  bgElevated: '#141420',
  bgOverlay: '#1A1A2E',

  // Primary accents
  cyberGreen: '#00FF88',
  cyberCyan: '#00E5FF',
  cyberPurple: '#BF00FF',
  cyberRed: '#FF003C',
  cyberOrange: '#FF6B00',
  cyberYellow: '#FFD700',

  // Text
  textPrimary: '#E8E8F0',
  textSecondary: '#8888AA',
  textMuted: '#444466',
  textGreen: '#00FF88',
  textCyan: '#00E5FF',

  // Borders
  borderDefault: '#1E1E3A',
  borderAccent: '#00FF8833',
  borderCyan: '#00E5FF33',

  // Status colors
  success: '#00FF88',
  warning: '#FFD700',
  danger: '#FF003C',
  info: '#00E5FF',

  // Gradients (use as array for LinearGradient)
  gradientGreen: ['#00FF88', '#00CC6A'],
  gradientCyan: ['#00E5FF', '#0099CC'],
  gradientDark: ['#0A0A0F', '#141420'],
};

export const FONTS = {
  mono: 'monospace',       // JetBrains Mono fallback
  sans: 'sans-serif',
  bold: 'sans-serif-medium',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  display: 28,
};

// Common shadow style for cards
export const CARD_SHADOW = {
  shadowColor: '#00FF88',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 4,
};
