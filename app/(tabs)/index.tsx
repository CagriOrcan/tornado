import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TornadoIcon } from '@/components/ui/TornadoIcon';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { NotificationService } from '@/components/NotificationService';
import { TornadoColors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { expoPushToken } = useNotifications();
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  // Animations
  const buttonScale = useSharedValue(1);
  const fadeIn = useSharedValue(0);
  
  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 1000 });
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data && !error) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleStartTornado = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in to start a tornado');
      return;
    }

    setIsSearching(true);
    buttonScale.value = withSpring(0.95);

    try {
      // Call the find-match edge function
      const { data, error } = await supabase.functions.invoke('find-match', {
        body: { user_id: user.id }
      });

      if (error) {
        throw error;
      }

      if (data?.match_id) {
        // Navigate to chat screen
        router.push(`/(chat)/${data.match_id}`);
      } else {
        Alert.alert(
          'No matches found',
          'No one is available right now. Try again in a few minutes!'
        );
      }
    } catch (error) {
      console.error('Error finding match:', error);
      Alert.alert('Error', 'Failed to find a match. Please try again.');
    } finally {
      setIsSearching(false);
      buttonScale.value = withSpring(1);
    }
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeIn.value,
      transform: [
        {
          translateY: interpolate(fadeIn.value, [0, 1], [50, 0]),
        },
      ],
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  if (isSearching) {
    return (
      <LinearGradient
        colors={[TornadoColors.gradientStart, TornadoColors.gradientEnd]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <LoadingSpinner size="lg" message="Finding your perfect match..." />
          <Button
            title="Cancel Search"
            onPress={() => setIsSearching(false)}
            variant="outline"
            style={{ 
              marginTop: 32,
              backgroundColor: TornadoColors.white,
              borderColor: TornadoColors.white,
            }}
          />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[TornadoColors.gradientStart, TornadoColors.gradientEnd]}
      style={{ flex: 1 }}
    >
      <NotificationService />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1, 
            padding: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[animatedContainerStyle, { flex: 1 }]}>
            {/* Header Section */}
            <View style={{ alignItems: 'center', marginBottom: 40, marginTop: 40 }}>
              <TornadoIcon size={80} animated />
              <Text style={{
                fontSize: 36,
                fontWeight: 'bold',
                color: TornadoColors.white,
                marginTop: 16,
                marginBottom: 8,
                fontFamily: 'Inter',
              }}>
                Tornado
              </Text>
              <Text style={{
                fontSize: 18,
                color: TornadoColors.white,
                opacity: 0.9,
                textAlign: 'center',
                fontFamily: 'Inter',
              }}>
                Conversation first, profile second
              </Text>
            </View>

            {/* Welcome Card */}
            <Card variant="elevated" padding="lg" style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: TornadoColors.gray[900],
                marginBottom: 8,
                fontFamily: 'Inter',
              }}>
                Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
              </Text>
              <Text style={{
                fontSize: 16,
                color: TornadoColors.gray[600],
                lineHeight: 24,
                marginBottom: 16,
                fontFamily: 'Inter',
              }}>
                Ready to spark some amazing conversations? Tap the tornado button below to start your 2-minute anonymous chat adventure!
              </Text>
              
              {/* Stats */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-around',
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: TornadoColors.gray[200],
              }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: TornadoColors.primary,
                    fontFamily: 'Inter',
                  }}>
                    0
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: TornadoColors.gray[500],
                    fontFamily: 'Inter',
                  }}>
                    Tornados
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: TornadoColors.primary,
                    fontFamily: 'Inter',
                  }}>
                    0
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: TornadoColors.gray[500],
                    fontFamily: 'Inter',
                  }}>
                    Matches
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: TornadoColors.primary,
                    fontFamily: 'Inter',
                  }}>
                    ⚡
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: TornadoColors.gray[500],
                    fontFamily: 'Inter',
                  }}>
                    Energy
                  </Text>
                </View>
              </View>
            </Card>

            {/* How It Works */}
            <Card variant="outlined" padding="lg" style={{ marginBottom: 32 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: TornadoColors.gray[900],
                marginBottom: 16,
                fontFamily: 'Inter',
              }}>
                How Tornado Works
              </Text>
              
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: TornadoColors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Text style={{ color: TornadoColors.white, fontSize: 12, fontWeight: 'bold' }}>1</Text>
                  </View>
                  <Text style={{ flex: 1, color: TornadoColors.gray[700], fontFamily: 'Inter' }}>
                    Start an anonymous 2-minute chat
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: TornadoColors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Text style={{ color: TornadoColors.white, fontSize: 12, fontWeight: 'bold' }}>2</Text>
                  </View>
                  <Text style={{ flex: 1, color: TornadoColors.gray[700], fontFamily: 'Inter' }}>
                    Connect through conversation, not looks
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: TornadoColors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Text style={{ color: TornadoColors.white, fontSize: 12, fontWeight: 'bold' }}>3</Text>
                  </View>
                  <Text style={{ flex: 1, color: TornadoColors.gray[700], fontFamily: 'Inter' }}>
                    Reveal profiles if you both agree
                  </Text>
                </View>
              </View>
            </Card>

            {/* Main Action Button */}
            <Animated.View style={animatedButtonStyle}>
              <TouchableOpacity
                onPress={handleStartTornado}
                activeOpacity={0.9}
                style={{
                  shadowColor: TornadoColors.black,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 12,
                }}
              >
                <LinearGradient
                  colors={[TornadoColors.white, TornadoColors.gray[50]]}
                  style={{
                    width: width - 48,
                    height: 120,
                    borderRadius: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 3,
                    borderColor: TornadoColors.white,
                  }}
                >
                  <TornadoIcon size={48} animated color={TornadoColors.primary} />
                  <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: TornadoColors.primary,
                    marginTop: 8,
                    fontFamily: 'Inter',
                  }}>
                    Start Tornado
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: TornadoColors.gray[600],
                    fontFamily: 'Inter',
                  }}>
                    Tap to find someone new
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
