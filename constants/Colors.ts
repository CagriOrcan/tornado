/**
 * Tornado Dating App - Enhanced Color System
 * Modern gradient-focused palette with sophisticated color ramps
 */

// Core brand colors
const tornadoOrange = '#FF8C42';
const tornadoDeep = '#E85D04';
const tornadoLight = '#FFD3B5';
const tornadoSoft = '#FFF4E6';

// Extended color system
export const Colors = {
  light: {
    // Text hierarchy
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    
    // Background system
    background: '#FFFFFF',
    backgroundSecondary: '#FAFAFA',
    backgroundTertiary: '#F5F5F5',
    
    // Primary brand gradients
    primary: tornadoOrange,
    primaryLight: tornadoLight,
    primarySoft: tornadoSoft,
    
    // Gradient combinations
    gradient: {
      primary: [tornadoOrange, tornadoDeep],
      warm: ['#FF8C42', '#FF6B35', '#E85D04'],
      soft: ['#FFD3B5', '#FFF4E6'],
      sunset: ['#FF8C42', '#FF6B35', '#E85D04', '#D63031'],
      glow: ['rgba(255, 140, 66, 0.1)', 'rgba(255, 140, 66, 0.05)'],
    },
    
    // Semantic colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // UI elements
    tint: tornadoOrange,
    icon: '#6B7280',
    iconActive: tornadoOrange,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tornadoOrange,
    
    // Surfaces
    card: '#FFFFFF',
    cardSecondary: '#FAFAFA',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    
    // Interactive states
    hover: '#F97316',
    pressed: '#EA580C',
    disabled: '#D1D5DB',
    
    // Shadows
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowStrong: 'rgba(0, 0, 0, 0.15)',
    shadowGlow: 'rgba(255, 140, 66, 0.25)',
  },
  dark: {
    // Text hierarchy
    text: '#FFFFFF',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    textInverse: '#1A1A1A',
    
    // Background system
    background: '#0F0F0F',
    backgroundSecondary: '#1A1A1A',
    backgroundTertiary: '#262626',
    
    // Primary brand gradients
    primary: tornadoOrange,
    primaryLight: tornadoLight,
    primarySoft: '#2D1810',
    
    // Gradient combinations
    gradient: {
      primary: [tornadoOrange, tornadoDeep],
      warm: ['#FF8C42', '#FF6B35', '#E85D04'],
      soft: ['#2D1810', '#1A1A1A'],
      sunset: ['#FF8C42', '#FF6B35', '#E85D04', '#D63031'],
      glow: ['rgba(255, 140, 66, 0.15)', 'rgba(255, 140, 66, 0.08)'],
    },
    
    // Semantic colors
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',
    
    // UI elements
    tint: tornadoOrange,
    icon: '#D1D5DB',
    iconActive: tornadoOrange,
    tabIconDefault: '#6B7280',
    tabIconSelected: tornadoOrange,
    
    // Surfaces
    card: '#1A1A1A',
    cardSecondary: '#262626',
    border: '#374151',
    borderLight: '#4B5563',
    
    // Interactive states
    hover: '#F97316',
    pressed: '#EA580C',
    disabled: '#4B5563',
    
    // Shadows
    shadow: 'rgba(0, 0, 0, 0.25)',
    shadowStrong: 'rgba(0, 0, 0, 0.4)',
    shadowGlow: 'rgba(255, 140, 66, 0.3)',
  },
};

// Design tokens
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};