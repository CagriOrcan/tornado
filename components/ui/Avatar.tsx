import React from 'react';
import { View, Image, Text, ViewStyle, ImageStyle } from 'react-native';
import { TornadoColors } from '@/constants/Colors';

interface AvatarProps {
  uri?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  initials?: string;
  anonymous?: boolean;
  style?: ViewStyle;
}

export function Avatar({
  uri,
  size = 'md',
  initials,
  anonymous = false,
  style,
}: AvatarProps) {
  const getSizeValue = () => {
    switch (size) {
      case 'sm':
        return 32;
      case 'md':
        return 48;
      case 'lg':
        return 64;
      case 'xl':
        return 96;
      default:
        return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return 12;
      case 'md':
        return 16;
      case 'lg':
        return 20;
      case 'xl':
        return 32;
      default:
        return 16;
    }
  };

  const avatarSize = getSizeValue();
  
  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: anonymous ? TornadoColors.gray[300] : TornadoColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const imageStyle: ImageStyle = {
    width: '100%',
    height: '100%',
    borderRadius: avatarSize / 2,
  };

  if (anonymous) {
    return (
      <View style={[containerStyle, style]}>
        <Text style={{ fontSize: getFontSize(), color: TornadoColors.gray[600] }}>
          ?
        </Text>
      </View>
    );
  }

  if (uri) {
    return (
      <View style={[containerStyle, style]}>
        <Image source={{ uri }} style={imageStyle} />
      </View>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      <Text
        style={{
          fontSize: getFontSize(),
          color: TornadoColors.primary,
          fontWeight: '600',
          fontFamily: 'Inter',
        }}
      >
        {initials || '?'}
      </Text>
    </View>
  );
}