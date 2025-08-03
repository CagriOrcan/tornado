/**
 * Tornado Dating App Color System
 * Modern warm palette with energetic orange tones
 */

// Primary Tornado Brand Colors
export const TornadoColors = {
  primary: '#FF8C42',
  primaryDark: '#E85D04',
  secondary: '#FFD3B5',
  accent: '#FF6B2B',
  
  // Gradients
  gradientStart: '#FF8C42',
  gradientEnd: '#E85D04',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Chat Colors
  chatBubble: {
    sent: '#FF8C42',
    received: '#F3F4F6',
    anonymous: '#E5E7EB',
  },
};

const tintColorLight = TornadoColors.primary;
const tintColorDark = TornadoColors.white;

export const Colors = {
  light: {
    text: TornadoColors.gray[900],
    background: TornadoColors.white,
    tint: tintColorLight,
    icon: TornadoColors.gray[600],
    tabIconDefault: TornadoColors.gray[400],
    tabIconSelected: tintColorLight,
    primary: TornadoColors.primary,
    secondary: TornadoColors.secondary,
    accent: TornadoColors.accent,
  },
  dark: {
    text: TornadoColors.gray[50],
    background: TornadoColors.gray[900],
    tint: tintColorDark,
    icon: TornadoColors.gray[400],
    tabIconDefault: TornadoColors.gray[500],
    tabIconSelected: TornadoColors.primary,
    primary: TornadoColors.primary,
    secondary: TornadoColors.secondary,
    accent: TornadoColors.accent,
  },
};
