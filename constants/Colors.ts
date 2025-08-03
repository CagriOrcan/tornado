/**
 * Dating App Color Palette
 */

const primaryColor = '#FF8C42';
const secondaryColor = '#FFD3B5';
const gradientStart = '#FF8C42';
const gradientEnd = '#E85D04';

export const Colors = {
  light: {
    text: '#1A1A1A',
    textSecondary: '#666666',
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    primary: primaryColor,
    secondary: secondaryColor,
    gradient: {
      start: gradientStart,
      end: gradientEnd,
    },
    tint: primaryColor,
    icon: '#666666',
    tabIconDefault: '#999999',
    tabIconSelected: primaryColor,
    border: '#E5E5E5',
    card: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    primary: primaryColor,
    secondary: secondaryColor,
    gradient: {
      start: gradientStart,
      end: gradientEnd,
    },
    tint: primaryColor,
    icon: '#CCCCCC',
    tabIconDefault: '#666666',
    tabIconSelected: primaryColor,
    border: '#333333',
    card: '#1E1E1E',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};