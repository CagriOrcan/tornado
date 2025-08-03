import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/ui/Avatar';
import { TornadoIcon } from '@/components/ui/TornadoIcon';
import { TornadoColors } from '@/constants/Colors';

interface ChatHeaderProps {
  isAnonymous: boolean;
  timeLeft?: number;
  user1Name?: string;
  user2Name?: string;
  user1Avatar?: string;
  user2Avatar?: string;
  onBack?: () => void;
  onMenuPress?: () => void;
}

export function ChatHeader({
  isAnonymous,
  timeLeft,
  user1Name,
  user2Name,
  user1Avatar,
  user2Avatar,
  onBack,
  onMenuPress,
}: ChatHeaderProps) {
  const router = useRouter();
  const timerScale = useSharedValue(1);
  const warningAnimation = useSharedValue(0);

  React.useEffect(() => {
    if (timeLeft && timeLeft <= 30) {
      // Warning animation for last 30 seconds
      warningAnimation.value = withTiming(1, { duration: 300 });
      timerScale.value = withSpring(1.1, { damping: 10 });
    } else {
      warningAnimation.value = withTiming(0, { duration: 300 });
      timerScale.value = withSpring(1, { damping: 10 });
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const animatedTimerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      warningAnimation.value,
      [0, 1],
      [TornadoColors.white, TornadoColors.error]
    );

    const textColor = interpolateColor(
      warningAnimation.value,
      [0, 1],
      [TornadoColors.primary, TornadoColors.white]
    );

    return {
      backgroundColor,
      transform: [{ scale: timerScale.value }],
    };
  });

  const animatedTimerTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      warningAnimation.value,
      [0, 1],
      [TornadoColors.primary, TornadoColors.white]
    );

    return { color };
  });

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  if (isAnonymous) {
    return (
      <LinearGradient
        colors={[TornadoColors.gradientStart, TornadoColors.gradientEnd]}
        style={{ paddingBottom: 16 }}
      >
        <SafeAreaView>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 8,
          }}>
            {/* Back Button */}
            <TouchableOpacity
              onPress={handleBack}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18, color: TornadoColors.white }}>←</Text>
            </TouchableOpacity>

            {/* Anonymous User Indicators */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'space-between',
              paddingHorizontal: 32,
            }}>
              <View style={{ alignItems: 'center' }}>
                <Avatar
                  size="md"
                  anonymous
                  style={{
                    borderWidth: 2,
                    borderColor: TornadoColors.white,
                  }}
                />
                <Text style={{
                  fontSize: 14,
                  color: TornadoColors.white,
                  fontWeight: '600',
                  marginTop: 4,
                  fontFamily: 'System',
                }}>
                  You
                </Text>
              </View>

              {/* Timer */}
              {timeLeft !== undefined && (
                <Animated.View style={[
                  animatedTimerStyle,
                  {
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: TornadoColors.white,
                  },
                ]}>
                  <Animated.Text style={[
                    animatedTimerTextStyle,
                    {
                      fontSize: 18,
                      fontWeight: 'bold',
                      fontFamily: 'System',
                    },
                  ]}>
                    {formatTime(timeLeft)}
                  </Animated.Text>
                  <Text style={{
                    fontSize: 10,
                    color: TornadoColors.white,
                    opacity: 0.9,
                    fontFamily: 'System',
                  }}>
                    left
                  </Text>
                </Animated.View>
              )}

              <View style={{ alignItems: 'center' }}>
                <Avatar
                  size="md"
                  anonymous
                  style={{
                    borderWidth: 2,
                    borderColor: TornadoColors.white,
                  }}
                />
                <Text style={{
                  fontSize: 14,
                  color: TornadoColors.white,
                  fontWeight: '600',
                  marginTop: 4,
                  fontFamily: 'System',
                }}>
                  Match
                </Text>
              </View>
            </View>

            {/* Menu Button */}
            <TouchableOpacity
              onPress={onMenuPress}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 16, color: TornadoColors.white }}>⋯</Text>
            </TouchableOpacity>
          </View>

          {/* Anonymous Chat Info */}
          <View style={{
            alignItems: 'center',
            marginTop: 12,
            paddingHorizontal: 16,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}>
              <TornadoIcon size={16} color={TornadoColors.white} />
              <Text style={{
                fontSize: 12,
                color: TornadoColors.white,
                marginLeft: 6,
                fontWeight: '500',
                fontFamily: 'System',
              }}>
                Anonymous Chat • Get to know each other first
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Revealed chat header
  return (
    <View style={{
      backgroundColor: TornadoColors.white,
      borderBottomWidth: 1,
      borderBottomColor: TornadoColors.gray[200],
      paddingBottom: 16,
    }}>
      <SafeAreaView>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 8,
        }}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={handleBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: TornadoColors.gray[100],
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            <Text style={{ fontSize: 18, color: TornadoColors.gray[700] }}>←</Text>
          </TouchableOpacity>

          {/* User Info */}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Avatar
              uri={user2Avatar}
              size="md"
              initials={user2Name?.charAt(0)}
              style={{ marginRight: 12 }}
            />
            <View>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: TornadoColors.gray[900],
                fontFamily: 'System',
              }}>
                {user2Name || 'Unknown User'}
              </Text>
              <Text style={{
                fontSize: 12,
                color: TornadoColors.success,
                fontFamily: 'System',
              }}>
                🟢 Online
              </Text>
            </View>
          </View>

          {/* Menu Button */}
          <TouchableOpacity
            onPress={onMenuPress}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: TornadoColors.gray[100],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16, color: TornadoColors.gray[700] }}>⋯</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}