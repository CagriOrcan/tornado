import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MessageCircle, Heart, Clock, Sparkles, Search } from 'lucide-react-native';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const mockMatches = [
  {
    id: 1,
    name: 'Emma',
    lastMessage: 'That was such an amazing conversation! 😊',
    time: '2m ago',
    imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: true,
    unreadCount: 2,
    matchedAt: '2 days ago',
  },
  {
    id: 2,
    name: 'Alex',
    lastMessage: 'I love that restaurant recommendation!',
    time: '1h ago',
    imageUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: false,
    unreadCount: 0,
    matchedAt: '1 week ago',
  },
  {
    id: 3,
    name: 'Sofia',
    lastMessage: 'Would love to go hiking together sometime',
    time: '3h ago',
    imageUrl: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: true,
    unreadCount: 1,
    matchedAt: '3 days ago',
  },
];

export default function MatchesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const MatchCard = ({ match, index }: { match: typeof mockMatches[0], index: number }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    const handlePress = () => {
      scale.value = withSpring(0.98, { damping: 15 }, () => {
        scale.value = withSpring(1);
      });
    };

    return (
      <AnimatedTouchableOpacity
        style={[animatedStyle]}
        onPress={handlePress}
        activeOpacity={1}
      >
        <BlurView intensity={20} style={styles.matchCardBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.matchCard}
          >
            <View style={styles.matchImageContainer}>
              <Image source={{ uri: match.imageUrl }} style={styles.matchImage} />
              {match.isOnline && <View style={styles.onlineIndicator} />}
              {match.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <ThemedText type="caption" style={styles.unreadText}>
                    {match.unreadCount}
                  </ThemedText>
                </View>
              )}
            </View>
            
            <View style={styles.matchContent}>
              <View style={styles.matchHeader}>
                <ThemedText type="subtitle" style={[styles.matchName, { color: colors.textInverse }]}>
                  {match.name}
                </ThemedText>
                <View style={styles.timeContainer}>
                  <Clock size={12} color={colors.textInverse} />
                  <ThemedText type="caption" style={[styles.matchTime, { color: colors.textInverse }]}>
                    {match.time}
                  </ThemedText>
                </View>
              </View>
              
              <ThemedText 
                type="body" 
                style={[styles.lastMessage, { color: colors.textInverse }]}
                numberOfLines={2}
              >
                {match.lastMessage}
              </ThemedText>
              
              <View style={styles.matchMeta}>
                <View style={styles.matchedContainer}>
                  <Sparkles size={12} color={colors.primary} />
                  <ThemedText type="caption" style={[styles.matchedText, { color: colors.textInverse }]}>
                    Matched {match.matchedAt}
                  </ThemedText>
                </View>
              </View>
            </View>
            
            <MessageCircle size={20} color={colors.primary} strokeWidth={2.5} />
          </LinearGradient>
        </BlurView>
      </AnimatedTouchableOpacity>
    );
  };

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
              <ThemedText type="hero" style={[styles.headerTitle, { color: colors.textInverse }]}>
                Matches
              </ThemedText>
              <View style={styles.headerStats}>
                <Heart size={18} color={colors.primary} strokeWidth={2.5} />
                <ThemedText type="caption" style={[styles.headerStatsText, { color: colors.textInverse }]}>
                  {mockMatches.length} connections
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.searchButton}>
              <Search size={24} color={colors.textInverse} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </BlurView>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Recent Matches Carousel */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.textInverse }]}>
              Recent Connections
            </ThemedText>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentMatches}
            >
              {mockMatches.map((match, index) => (
                <TouchableOpacity key={match.id} style={styles.recentMatchCard}>
                  <BlurView intensity={30} style={styles.recentMatchBlur}>
                    <View style={styles.recentMatchImageContainer}>
                      <Image source={{ uri: match.imageUrl }} style={styles.recentMatchImage} />
                      {match.isOnline && <View style={styles.onlineIndicatorSmall} />}
                    </View>
                    <ThemedText type="caption" style={[styles.recentMatchName, { color: colors.textInverse }]}>
                      {match.name}
                    </ThemedText>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Messages List */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.textInverse }]}>
              Conversations
            </ThemedText>
            
            <View style={styles.messagesList}>
              {mockMatches.map((match, index) => (
                <MatchCard key={match.id} match={match} index={index} />
              ))}
            </View>
          </View>

          {/* Empty State for Demo */}
          <BlurView intensity={20} style={styles.emptyStateBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.emptyState}
            >
              <Sparkles size={48} color={colors.primary} strokeWidth={1.5} />
              <ThemedText type="title" style={[styles.emptyTitle, { color: colors.textInverse }]}>
                Start Your First Tornado
              </ThemedText>
              <ThemedText type="body" style={[styles.emptyDescription, { color: colors.textInverse }]}>
                Connect with someone new through our anonymous chat experience
              </ThemedText>
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
    gap: Spacing.xs,
  },
  headerTitle: {
    fontWeight: '900',
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerStatsText: {
    opacity: 0.8,
  },
  searchButton: {
    padding: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.xxxl,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    fontWeight: '700',
    opacity: 0.9,
  },
  recentMatches: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  recentMatchCard: {
    alignItems: 'center',
    width: 80,
  },
  recentMatchBlur: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    padding: Spacing.sm,
  },
  recentMatchImageContainer: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  recentMatchImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
  },
  recentMatchName: {
    textAlign: 'center',
    fontWeight: '600',
    opacity: 0.9,
  },
  onlineIndicatorSmall: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: BorderRadius.full,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messagesList: {
    gap: Spacing.md,
  },
  matchCardBlur: {
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  matchImageContainer: {
    position: 'relative',
    marginRight: Spacing.lg,
  },
  matchImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: BorderRadius.full,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  matchContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchName: {
    fontWeight: '700',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  matchTime: {
    opacity: 0.7,
  },
  lastMessage: {
    opacity: 0.8,
    lineHeight: 20,
  },
  matchMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  matchedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  matchedText: {
    opacity: 0.6,
    fontSize: 11,
  },
  emptyStateBlur: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  emptyState: {
    padding: Spacing.xxxl,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  emptyTitle: {
    textAlign: 'center',
    fontWeight: '700',
  },
  emptyDescription: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
});