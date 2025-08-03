import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { TornadoColors } from '@/constants/Colors';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  disabled = false,
  leftIcon,
  rightIcon,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const containerStyle: ViewStyle = {
    marginBottom: 16,
  };

  const labelStyle: TextStyle = {
    fontSize: 14,
    fontWeight: '600',
    color: TornadoColors.gray[700],
    marginBottom: 8,
    fontFamily: 'Inter',
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    borderWidth: 2,
    borderColor: error
      ? TornadoColors.error
      : isFocused
      ? TornadoColors.primary
      : TornadoColors.gray[300],
    borderRadius: 12,
    backgroundColor: disabled ? TornadoColors.gray[100] : TornadoColors.white,
    paddingHorizontal: 16,
    paddingVertical: multiline ? 12 : 0,
    minHeight: multiline ? numberOfLines * 24 + 24 : 48,
  };

  const textInputStyle: TextStyle = {
    flex: 1,
    fontSize: 16,
    color: TornadoColors.gray[900],
    fontFamily: 'Inter',
    paddingVertical: multiline ? 0 : 12,
    textAlignVertical: multiline ? 'top' : 'center',
  };

  const errorStyle: TextStyle = {
    fontSize: 12,
    color: TornadoColors.error,
    marginTop: 4,
    fontFamily: 'Inter',
  };

  const showPasswordButton = secureTextEntry && (
    <TouchableOpacity
      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
      style={{ marginLeft: 8 }}
    >
      <Text style={{ color: TornadoColors.primary, fontSize: 14 }}>
        {isPasswordVisible ? 'Hide' : 'Show'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[containerStyle, style]}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <View style={inputContainerStyle}>
        {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
        <TextInput
          style={[textInputStyle, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={TornadoColors.gray[500]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
        />
        {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
        {showPasswordButton}
      </View>
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
}