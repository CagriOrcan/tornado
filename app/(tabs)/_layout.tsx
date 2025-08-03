import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Heart, MessageCircle, User, Compass, Zap } from 'lucide-react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const fabScale = useSharedValue(1);

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const handleFabPress = () => {
    fabScale.value = withSpring(0.9, { damping: 15 }, () => {
      fabScale.value = withSpring(1);
    });
    // Navigate to tornado matching
    console.log('Start Tornado pressed!');
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tint,
          tabBarInactiveTintColor: colors.tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              paddingTop: Spacing.md,
              height: 100,
              paddingBottom: 34, // Account for home indicator
            },
            default: {
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              paddingTop: Spacing.md,
              height: 90,
              elevation: 0,
            },
          }),
          tabBarLabelStyle: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 12,
            marginTop: Spacing.xs,
            letterSpacing: 0.5,
          },
          tabBarItemStyle: {
            paddingTop: Spacing.sm,
          },
        }}>
        
        <Tabs.Screen
          name="index"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color, size }) => (
              <Heart size={size || 22} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="matches"
          options={{
            title: 'Matches',
            tabBarIcon: ({ color, size }) => (
              <MessageCircle size={size || 22} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, size }) => (
              <Compass size={size || 22} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <User size={size || 22} color={color} strokeWidth={2.5} />
            ),
          }}
        />
      </Tabs>

      {/* Custom Floating Action Button */}
      <View style={styles.fabContainer}>
        <AnimatedBlurView 
          intensity={30} 
          style={[styles.fabBlur, fabAnimatedStyle]}
        >
          <Animated.View style={styles.fabWrapper}>
            <LinearGradient
              colors={colors.gradient.warm}
              style={styles.fab}
            >
              <Animated.View style={styles.fabContent}>
                <Zap size={28} color={colors.textInverse} strokeWidth={3} />
              </Animated.View>
            </LinearGradient>
          </Animated.View>
        </AnimatedBlurView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  fabBlur: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fabWrapper: {
    padding: Spacing.xs,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  fabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});