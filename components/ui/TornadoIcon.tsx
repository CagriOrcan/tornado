import React from 'react';
import { View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { TornadoColors } from '@/constants/Colors';

interface TornadoIconProps {
  size?: number;
  animated?: boolean;
  color?: string;
}

export function TornadoIcon({ 
  size = 48, 
  animated = false,
  color = TornadoColors.primary 
}: TornadoIconProps) {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (animated) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000 }),
        -1,
        false
      );
    }
  }, [animated, rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View style={[animatedStyle, { width: size, height: size }]}>
      <View style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{
          fontSize: size * 0.8,
          color,
        }}>
          🌪️
        </Text>
      </View>
    </Animated.View>
  );
}