import React, { useState } from 'react';
import { View, Pressable, Text, Alert, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'expo-router';
import { TornadoIcon } from './ui/TornadoIcon';
import { TornadoColors } from '../constants/Colors';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isSearching, setIsSearching] = useState(false);
  
  const fabScale = useSharedValue(1);
  const fabRotation = useSharedValue(0);

  const handleFabPress = async () => {
    if (!user) return;

    setIsSearching(true);
    fabScale.value = withSpring(0.9);
    fabRotation.value = withTiming(360, { duration: 1000 });

    try {
      const { data, error } = await supabase.functions.invoke('find-match', {
        body: { user_id: user.id },
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else if (data?.status === 'not_found') {
        Alert.alert('No Match Found', 'Sorry, there is no one available to match with right now.');
      } else if (data?.match_id) {
        router.push(`/(chat)/${data.match_id}`);
      }
    } catch (error) {
      console.error('Error finding match:', error);
      Alert.alert('Error', 'Failed to find a match. Please try again.');
    } finally {
      setIsSearching(false);
      fabScale.value = withSpring(1);
      fabRotation.value = 0;
    }
  };

  const getTabIcon = (routeName: string, isFocused: boolean) => {
    const iconColor = isFocused ? TornadoColors.primary : TornadoColors.gray[400];
    
    switch (routeName) {
      case 'index':
        return (
          <Text style={{ fontSize: 24, color: iconColor }}>
            🏠
          </Text>
        );
      case 'matches':
        return (
          <Text style={{ fontSize: 24, color: iconColor }}>
            💕
          </Text>
        );
      case 'profile':
        return (
          <Text style={{ fontSize: 24, color: iconColor }}>
            👤
          </Text>
        );
      case 'notifications-demo':
        return (
          <Text style={{ fontSize: 24, color: iconColor }}>
            🔔
          </Text>
        );
      default:
        return (
          <Text style={{ fontSize: 24, color: iconColor }}>
            ⭐
          </Text>
        );
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'Home';
      case 'matches':
        return 'Matches';
      case 'profile':
        return 'Profile';
      case 'notifications-demo':
        return 'Notifications';
      default:
        return routeName;
    }
  };

  const animatedFabStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: fabScale.value },
        { rotate: `${fabRotation.value}deg` },
      ],
    };
  });

  return (
    <View style={{
      backgroundColor: 'transparent',
      paddingBottom: insets.bottom,
    }}>
      {/* Tab Bar Background */}
      <View style={{
        flexDirection: 'row',
        height: 80,
        backgroundColor: TornadoColors.white,
        shadowColor: TornadoColors.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 16,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        position: 'relative',
      }}>
        {/* FAB Notch */}
        <View style={{
          position: 'absolute',
          top: -16,
          left: '50%',
          transform: [{ translateX: -40 }],
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: TornadoColors.white,
          zIndex: 1,
        }} />

        {state.routes.map((route, index) => {
          // Skip the second tab (index 1) for FAB placement in 4-tab layout
          if (index === 1) {
            return <View key={route.key} style={{ flex: 1 }} />;
          }

          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 12,
              }}
            >
              <View style={{ alignItems: 'center' }}>
                {getTabIcon(route.name, isFocused)}
                <Text style={{
                  fontSize: 12,
                  color: isFocused ? TornadoColors.primary : TornadoColors.gray[500],
                  marginTop: 4,
                  fontWeight: isFocused ? '600' : '400',
                  fontFamily: 'Inter',
                }}>
                  {getTabLabel(route.name)}
                </Text>
              </View>
            </Pressable>
          );
        })}

        {/* Floating Action Button */}
        <Animated.View style={[
          animatedFabStyle,
          {
            position: 'absolute',
            top: -32,
            left: '50%',
            transform: [{ translateX: -32 }],
            zIndex: 2,
          }
        ]}>
          <Pressable
            onPress={handleFabPress}
            disabled={isSearching}
            style={{
              shadowColor: TornadoColors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 16,
            }}
          >
            <LinearGradient
              colors={[TornadoColors.gradientStart, TornadoColors.gradientEnd]}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 4,
                borderColor: TornadoColors.white,
              }}
            >
              <TornadoIcon 
                size={32} 
                animated={isSearching} 
                color={TornadoColors.white} 
              />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
