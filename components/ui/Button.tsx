import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TornadoColors } from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  gradient?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  gradient = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: size === 'sm' ? 8 : size === 'md' ? 12 : size === 'lg' ? 16 : 20,
      paddingVertical: size === 'sm' ? 8 : size === 'md' ? 12 : size === 'lg' ? 16 : 20,
      paddingHorizontal: size === 'sm' ? 16 : size === 'md' ? 24 : size === 'lg' ? 32 : 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled || loading ? 0.6 : 1,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: gradient ? 'transparent' : TornadoColors.primary,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: TornadoColors.secondary,
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: TornadoColors.primary,
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyles;
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      fontSize: size === 'sm' ? 14 : size === 'md' ? 16 : size === 'lg' ? 18 : 20,
      fontWeight: '600',
      fontFamily: 'Inter',
      marginLeft: icon ? 8 : 0,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          color: TornadoColors.white,
        };
      case 'secondary':
        return {
          ...baseStyles,
          color: TornadoColors.primary,
        };
      case 'outline':
        return {
          ...baseStyles,
          color: TornadoColors.primary,
        };
      case 'ghost':
        return {
          ...baseStyles,
          color: TornadoColors.primary,
        };
      default:
        return baseStyles;
    }
  };

  const ButtonContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? TornadoColors.white : TornadoColors.primary}
        />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyles(), textStyle]}>{title}</Text>
        </>
      )}
    </>
  );

  if (gradient && variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyles(), style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[TornadoColors.gradientStart, TornadoColors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            getButtonStyles(),
            {
              margin: 0,
              paddingVertical: size === 'sm' ? 8 : size === 'md' ? 12 : size === 'lg' ? 16 : 20,
              paddingHorizontal: size === 'sm' ? 16 : size === 'md' ? 24 : size === 'lg' ? 32 : 40,
            },
          ]}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyles(), style]}
      activeOpacity={0.8}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
}