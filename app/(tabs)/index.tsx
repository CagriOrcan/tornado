import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Settings, Zap, Users, TrendingUp, Sparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const mockProfiles = [
  {
    id: 1,
    name: 'Emma',
    age: 25,
    bio: 'Adventure seeker, coffee lover, and weekend hiker. Looking for someone to explore the city with and share meaningful conversations! ✨',
    imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    name: 'Alex',
    age: 28,
    bio: 'Photographer by day, chef by night. Love capturing beautiful moments and cooking amazing meals for the people I care about.',
    imageUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    name: 'Sofia',
    age: 26,
    bio: 'Yoga instructor and travel enthusiast. Seeking genuine connections and meaningful conversations that go beyond the surface.',
    imageUrl: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // Animations
  const tornadoRotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    // Continuous tornado rotation
    tornadoRotation.value = withRepeat(
      withTiming(360, { duration: 8000 }),
      -1,
      false
    );
    
    // Pulsing glow effect
    glowOpacity.value = withRepeat(
      withTiming(0.8, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const tornadoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${tornadoRotation.value}deg` }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleStartTornado = () => {
    setIsSearching(true);
    pulseScale.value = withSpring(1.1, { damping: 15 }, () => {
      pulseScale.value = withSpring(1);
    });
    
    // Simulate matching process
    setTimeout(() => {
      setIsSearching(false);
      // In real app, this would navigate to chat screen
    }, 3000);
  };

  const handleLike = () => {
    console.log('Liked profile:', mockProfiles[currentProfileIndex].name);
    nextProfile();
  };

  const handlePass = () => {
    console.log('Passed profile:', mockProfiles[currentProfileIndex].name);
    nextProfile();
  };

  const nextProfile = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % mockProfiles.length);
  };

  const currentProfile = mockProfiles[currentProfileIndex];

  return (
    <LinearGradient
      colors={colors.gradient.warm}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <BlurView intensity={20} style={styles.headerBlur}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Animated.View style={tornadoAnimatedStyle}>
                <Zap size={32} color={colors.textInverse} strokeWidth={2.5} />
              </Animated.View>
              <View>
                <ThemedText type="hero" style={[styles.headerTitle, { color: colors.textInverse }]}>
                  Tornado
                </ThemedText>
                <ThemedText type="caption" style={[styles.headerSubtitle, { color: colors.textInverse }]}>
                  Connect beyond looks
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={24} color={colors.textInverse} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </BlurView>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Tornado Button */}
          <View style={styles.tornadoSection}>
            <Animated.View style={[styles.tornadoGlow, glowAnimatedStyle]}>
              <LinearGradient
                colors={['rgba(255, 140, 66, 0.4)', 'transparent']}
                style={styles.tornadoGlowGradient}
              />
            </Animated.View>
            
            <Animated.View style={pulseAnimatedStyle}>
              <GradientButton
                title={isSearching ? "Finding your match..." : "Start Tornado"}
                onPress={handleStartTornado}
                size="xl"
                style={styles.tornadoButton}
                disabled={isSearching}
                loading={isSearching}
                icon={<Zap size={24} color={colors.textInverse} />}
              />
            </Animated.View>
            
            <ThemedText type="body" style={[styles.tornadoDescription, { color: colors.textInverse }]}>
              Start a 2-minute anonymous conversation and discover someone's personality before seeing their photos
            </ThemedText>
          </View>

          {/* Featured Profile */}
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.textInverse }]}>
                Featured Profile
              </ThemedText>
              <Sparkles size={20} color={colors.textInverse} />
            </View>
            
            <View style={styles.cardContainer}>
              <ProfileCard
                name={currentProfile.name}
                age={currentProfile.age}
                bio={currentProfile.bio}
                imageUrl={currentProfile.imageUrl}
                onLike={handleLike}
                onPass={handlePass}
              />
            </View>
          </View>

          {/* Stats Section */}
          <BlurView intensity={30} style={styles.statsBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.statsContainer}
            >
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <TrendingUp size={24} color={colors.primary} strokeWidth={2.5} />
                </View>
                <ThemedText type="title" style={[styles.statNumber, { color: colors.textInverse }]}>
                  89%
                </ThemedText>
                <ThemedText type="caption" style={[styles.statLabel, { color: colors.textInverse }]}>
                  Success Rate
                </ThemedText>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <Users size={24} color={colors.primary} strokeWidth={2.5} />
                </View>
                <ThemedText type="title" style={[styles.statNumber, { color: colors.textInverse }]}>
                  2.4k
                </ThemedText>
                <ThemedText type="caption" style={[styles.statLabel, { color: colors.textInverse }]}>
                  Active Users
                </ThemedText>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <Sparkles size={24} color={colors.primary} strokeWidth={2.5} />
                </View>
                <ThemedText type="title" style={[styles.statNumber, { color: colors.textInverse }]}>
                  156
                </ThemedText>
                <ThemedText type="caption" style={[styles.statLabel, { color: colors.textInverse }]}>
                  Matches Today
                </ThemedText>
              </View>
            </LinearGradient>
          </BlurView>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerBlur: {
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerTitle: {
    fontWeight: '900',
  },
  headerSubtitle: {
    opacity: 0.8,
    marginTop: -Spacing.xs,
  },
  settingsButton: {
    padding: Spacing.sm,
  },
  scrollContent: {
    paddingBottom: 120, // Account for tab bar
  },
  tornadoSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
    position: 'relative',
  },
  tornadoGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tornadoGlowGradient: {
    flex: 1,
    borderRadius: BorderRadius.full,
  },
  tornadoButton: {
    minWidth: width * 0.8,
    marginBottom: Spacing.lg,
  },
  tornadoDescription: {
    textAlign: 'center',
    opacity: 0.9,
    paddingHorizontal: Spacing.lg,
    lineHeight: 24,
  },
  featuredSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  cardContainer: {
    alignItems: 'center',
  },
  statsBlur: {
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  statNumber: {
    fontWeight: '800',
  },
  statLabel: {
    opacity: 0.8,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: Spacing.lg,
  },
});