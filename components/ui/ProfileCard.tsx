import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Heart, X, Sparkles, MapPin } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - (Spacing.xl * 2);
const CARD_HEIGHT = height * 0.65;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ProfileCardProps {
  name: string;
  age: number;
  bio: string;
  imageUrl: string;
  onLike: () => void;
  onPass: () => void;
}

export function ProfileCard({ name, age, bio, imageUrl, onLike, onPass }: ProfileCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const cardScale = useSharedValue(1);
  const likeScale = useSharedValue(1);
  const passScale = useSharedValue(1);
  const sparkleOpacity = useSharedValue(0);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const passAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: passScale.value }],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
    transform: [
      { 
        rotate: `${interpolate(sparkleOpacity.value, [0, 1], [0, 360])}deg` 
      },
      { 
        scale: interpolate(sparkleOpacity.value, [0, 1], [0.5, 1.2]) 
      }
    ],
  }));

  const handleLike = () => {
    likeScale.value = withSpring(0.9, { damping: 15 }, () => {
      likeScale.value = withSpring(1);
    });
    sparkleOpacity.value = withTiming(1, { duration: 300 }, () => {
      sparkleOpacity.value = withTiming(0, { duration: 500 });
    });
    cardScale.value = withSpring(0.95, { damping: 15 }, () => {
      cardScale.value = withSpring(1);
      runOnJS(onLike)();
    });
  };

  const handlePass = () => {
    passScale.value = withSpring(0.9, { damping: 15 }, () => {
      passScale.value = withSpring(1);
    });
    cardScale.value = withSpring(0.95, { damping: 15 }, () => {
      cardScale.value = withSpring(1);
      runOnJS(onPass)();
    });
  };

  return (
    <Animated.View style={[cardAnimatedStyle]}>
      <ThemedView style={[styles.container, { backgroundColor: colors.card }]}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          
          {/* Gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            locations={[0, 0.6, 1]}
            style={styles.gradient}
          />
          
          {/* Sparkle animation overlay */}
          <Animated.View style={[styles.sparkleContainer, sparkleAnimatedStyle]}>
            <Sparkles size={32} color={colors.primary} />
          </Animated.View>
          
          {/* Profile info overlay */}
          <BlurView intensity={20} style={styles.infoBlur}>
            <LinearGradient
              colors={colors.gradient.glow}
              style={styles.infoGradient}
            >
              <View style={styles.infoContainer}>
                <View style={styles.nameContainer}>
                  <ThemedText type="hero" style={styles.name}>
                    {name}
                  </ThemedText>
                  <ThemedText type="title" style={styles.age}>
                    {age}
                  </ThemedText>
                </View>
                
                <View style={styles.locationContainer}>
                  <MapPin size={16} color={colors.textInverse} />
                  <ThemedText type="caption" style={styles.location}>
                    2 miles away
                  </ThemedText>
                </View>
                
                <ThemedText type="body" style={styles.bio} numberOfLines={3}>
                  {bio}
                </ThemedText>
              </View>
            </LinearGradient>
          </BlurView>
        </View>
        
        {/* Action buttons */}
        <View style={styles.actionsContainer}>
          <AnimatedTouchableOpacity
            style={[styles.actionButton, styles.passButton, passAnimatedStyle]}
            onPress={handlePass}
            activeOpacity={1}
          >
            <LinearGradient
              colors={['#F8F9FA', '#E9ECEF']}
              style={styles.actionGradient}
            >
              <X size={28} color="#6C757D" strokeWidth={2.5} />
            </LinearGradient>
          </AnimatedTouchableOpacity>
          
          <AnimatedTouchableOpacity
            style={[styles.actionButton, styles.likeButton, likeAnimatedStyle]}
            onPress={handleLike}
            activeOpacity={1}
          >
            <LinearGradient
              colors={colors.gradient.warm}
              style={styles.actionGradient}
            >
              <Heart size={28} color={colors.textInverse} strokeWidth={2.5} />
            </LinearGradient>
          </AnimatedTouchableOpacity>
        </View>
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BorderRadius.xxl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  sparkleContainer: {
    position: 'absolute',
    top: Spacing.xl,
    right: Spacing.xl,
  },
  infoBlur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  infoGradient: {
    padding: Spacing.xl,
  },
  infoContainer: {
    gap: Spacing.sm,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  name: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  age: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  location: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  bio: {
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: Spacing.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xxl,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  actionGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passButton: {
    // Additional styling for pass button if needed
  },
  likeButton: {
    // Additional styling for like button if needed
  },
});