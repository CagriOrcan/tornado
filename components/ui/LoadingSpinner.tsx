import React from 'react';
import { View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
} from 'react-native-reanimated';
import { TornadoColors } from '@/constants/Colors';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  color?: string;
}

export function LoadingSpinner({ 
  size = 'md',
  message,
  color = TornadoColors.primary 
}: LoadingSpinnerProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const sizeValue = size === 'sm' ? 24 : size === 'md' ? 48 : 72;

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1500 }),
      -1,
      false
    );
    
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1000 }),
      -1,
      true
    );
  }, [rotation, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[animatedStyle, { 
        width: sizeValue, 
        height: sizeValue,
        alignItems: 'center',
        justifyContent: 'center',
      }]}>
        <Text style={{
          fontSize: sizeValue * 0.8,
          color,
        }}>
          🌪️
        </Text>
      </Animated.View>
      
      {message && (
        <Text style={{
          marginTop: 16,
          fontSize: 16,
          color: TornadoColors.gray[600],
          textAlign: 'center',
          fontFamily: 'Inter',
        }}>
          {message}
        </Text>
      )}
    </View>
  );
}