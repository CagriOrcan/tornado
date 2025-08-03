import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { TornadoColors } from '@/constants/Colors';

interface MessageBubbleProps {
  message: string;
  isOwnMessage: boolean;
  timestamp: string;
  isAnonymous?: boolean;
  senderName?: string;
  avatar?: string | null;
  isFirst?: boolean;
  isLast?: boolean;
  onLongPress?: () => void;
}

export function MessageBubble({
  message,
  isOwnMessage,
  timestamp,
  isAnonymous = false,
  senderName,
  avatar,
  isFirst = false,
  isLast = false,
  onLongPress,
}: MessageBubbleProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        {
          translateX: interpolate(
            scale.value,
            [0, 1],
            [isOwnMessage ? 50 : -50, 0]
          ),
        },
      ],
      opacity: opacity.value,
    };
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getBubbleBackgroundColor = () => {
    if (isAnonymous) {
      return isOwnMessage ? TornadoColors.chatBubble.anonymous : TornadoColors.gray[200];
    }
    return isOwnMessage ? TornadoColors.primary : TornadoColors.gray[100];
  };

  const getTextColor = () => {
    if (isAnonymous) {
      return isOwnMessage ? TornadoColors.gray[700] : TornadoColors.gray[800];
    }
    return isOwnMessage ? TornadoColors.white : TornadoColors.gray[900];
  };

  const getBorderRadius = () => {
    const baseRadius = 20;
    const smallRadius = 4;
    
    if (isOwnMessage) {
      return {
        borderTopLeftRadius: baseRadius,
        borderTopRightRadius: isFirst ? baseRadius : smallRadius,
        borderBottomLeftRadius: baseRadius,
        borderBottomRightRadius: isLast ? baseRadius : smallRadius,
      };
    } else {
      return {
        borderTopLeftRadius: isFirst ? baseRadius : smallRadius,
        borderTopRightRadius: baseRadius,
        borderBottomLeftRadius: isLast ? baseRadius : smallRadius,
        borderBottomRightRadius: baseRadius,
      };
    }
  };

  return (
    <Animated.View style={animatedStyle}>
      <View style={{
        flexDirection: 'row',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        marginVertical: 2,
        paddingHorizontal: 16,
      }}>
        <TouchableOpacity
          onLongPress={onLongPress}
          activeOpacity={0.8}
          style={{
            maxWidth: '80%',
            minWidth: '20%',
          }}
        >
          {isOwnMessage && !isAnonymous ? (
            <LinearGradient
              colors={[TornadoColors.gradientStart, TornadoColors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                {
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  shadowColor: TornadoColors.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                },
                getBorderRadius(),
              ]}
            >
              <Text style={{
                fontSize: 16,
                color: TornadoColors.white,
                fontFamily: 'System',
                lineHeight: 20,
              }}>
                {message}
              </Text>
            </LinearGradient>
          ) : (
            <View style={[
              {
                backgroundColor: getBubbleBackgroundColor(),
                paddingHorizontal: 16,
                paddingVertical: 12,
                shadowColor: TornadoColors.black,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              },
              getBorderRadius(),
            ]}>
              <Text style={{
                fontSize: 16,
                color: getTextColor(),
                fontFamily: 'System',
                lineHeight: 20,
              }}>
                {message}
              </Text>
            </View>
          )}
          
          {/* Timestamp */}
          <View style={{
            flexDirection: 'row',
            justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
            marginTop: 4,
            paddingHorizontal: 4,
          }}>
            <Text style={{
              fontSize: 11,
              color: TornadoColors.gray[500],
              fontFamily: 'System',
            }}>
              {formatTime(timestamp)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export function TypingIndicator({ senderName }: { senderName?: string }) {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  React.useEffect(() => {
    const animate = () => {
      dot1.value = withTiming(1, { duration: 400 }, () => {
        dot1.value = withTiming(0, { duration: 400 });
      });
      
      setTimeout(() => {
        dot2.value = withTiming(1, { duration: 400 }, () => {
          dot2.value = withTiming(0, { duration: 400 });
        });
      }, 150);
      
      setTimeout(() => {
        dot3.value = withTiming(1, { duration: 400 }, () => {
          dot3.value = withTiming(0, { duration: 400 });
        });
      }, 300);
    };

    const interval = setInterval(animate, 1200);
    animate();

    return () => clearInterval(interval);
  }, []);

  const animatedDot1 = useAnimatedStyle(() => ({
    opacity: interpolate(dot1.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(dot1.value, [0, 1], [0.8, 1.2]) }],
  }));

  const animatedDot2 = useAnimatedStyle(() => ({
    opacity: interpolate(dot2.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(dot2.value, [0, 1], [0.8, 1.2]) }],
  }));

  const animatedDot3 = useAnimatedStyle(() => ({
    opacity: interpolate(dot3.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(dot3.value, [0, 1], [0.8, 1.2]) }],
  }));

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginVertical: 4,
      paddingHorizontal: 16,
    }}>
      <View style={{
        backgroundColor: TornadoColors.gray[200],
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderBottomLeftRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      }}>
        <Animated.View style={[
          animatedDot1,
          {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: TornadoColors.gray[500],
          }
        ]} />
        <Animated.View style={[
          animatedDot2,
          {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: TornadoColors.gray[500],
          }
        ]} />
        <Animated.View style={[
          animatedDot3,
          {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: TornadoColors.gray[500],
          }
        ]} />
      </View>
    </View>
  );
}