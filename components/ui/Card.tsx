import React from 'react';
import { View, ViewStyle } from 'react-native';
import { TornadoColors } from '@/constants/Colors';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  style,
}: CardProps) {
  const getCardStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: 16,
      backgroundColor: TornadoColors.white,
    };

    const paddingStyles: ViewStyle = {
      padding:
        padding === 'none' ? 0 : padding === 'sm' ? 12 : padding === 'md' ? 16 : 24,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          ...paddingStyles,
          shadowColor: TornadoColors.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        };
      case 'outlined':
        return {
          ...baseStyles,
          ...paddingStyles,
          borderWidth: 1,
          borderColor: TornadoColors.gray[200],
        };
      default:
        return {
          ...baseStyles,
          ...paddingStyles,
        };
    }
  };

  return <View style={[getCardStyles(), style]}>{children}</View>;
}