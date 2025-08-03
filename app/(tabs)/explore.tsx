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
import { GradientButton } from '@/components/ui/GradientButton';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MapPin, Calendar, Users, Sparkles, TrendingUp, ListFilter as Filter } from 'lucide-react-native';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const exploreData = [
  {
    id: 1,
    title: 'Speed Dating Night',
    location: 'Downtown Café',
    date: 'Tonight, 7 PM',
    attendees: 24,
    category: 'Social',
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    title: 'Singles Hiking Adventure',
    location: 'Mountain Trail',
    date: 'Saturday, 9 AM',
    attendees: 18,
    category: 'Outdoor',
    imageUrl: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    title: 'Wine & Paint Evening',
    location: 'Art Studio',
    date: 'Sunday, 6 PM',
    attendees: 32,
    category: 'Creative',
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function ExploreScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const EventCard = ({ event, index }: { event: typeof exploreData[0], index: number }) => {
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
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
        <BlurView intensity={30} style={styles.eventCardBlur}>
          <View style={styles.eventCard}>
            <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
            
            {/* Category badge */}
            <View style={styles.categoryBadge}>
              <LinearGradient
                colors={colors.gradient.primary}
                style={styles.categoryGradient}
              >
                <ThemedText type="caption" style={styles.categoryText}>
                  {event.category}
                </ThemedText>
              </LinearGradient>
            </View>
            
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
              locations={[0, 0.5, 1]}
              style={styles.eventGradient}
            />
            
            <View style={styles.eventContent}>
              <ThemedText type="title" style={[styles.eventTitle, { color: colors.textInverse }]}>
                {event.title}
              </ThemedText>
              
              <View style={styles.eventDetails}>
                <View style={styles.eventDetail}>
                  <MapPin size={16} color={colors.primary} strokeWidth={2.5} />
                  <ThemedText type="caption" style={[styles.eventDetailText, { color: colors.textInverse }]}>
                    {event.location}
                  </ThemedText>
                </View>
                
                <View style={styles.eventDetail}>
                  <Calendar size={16} color={colors.primary} strokeWidth={2.5} />
                  <ThemedText type="caption" style={[styles.eventDetailText, { color: colors.textInverse }]}>
                    {event.date}
                  </ThemedText>
                </View>
                
                <View style={styles.eventDetail}>
                  <Users size={16} color={colors.primary} strokeWidth={2.5} />
                  <ThemedText type="caption" style={[styles.eventDetailText, { color: colors.textInverse }]}>
                    {event.attendees} attending
                  </ThemedText>
                </View>
              </View>
              
              <GradientButton
                title="Join Event"
                onPress={() => console.log('Join event:', event.title)}
                size="sm"
                style={styles.joinButton}
              />
            </View>
          </View>
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
                Explore
              </ThemedText>
              <View style={styles.headerSubtitle}>
                <Sparkles size={16} color={colors.primary} strokeWidth={2.5} />
                <ThemedText type="caption" style={[styles.headerSubtitleText, { color: colors.textInverse }]}>
                  Discover events & activities
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={24} color={colors.textInverse} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </BlurView>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Featured Events */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.textInverse }]}>
              Featured Events
            </ThemedText>
            
            <View style={styles.eventsList}>
              {exploreData.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </View>
          </View>

          {/* Stats Card */}
          <BlurView intensity={30} style={styles.statsCardBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
              style={styles.statsCard}
            >
              <View style={styles.statsHeader}>
                <TrendingUp size={32} color={colors.primary} strokeWidth={2.5} />
                <View style={styles.statsHeaderText}>
                  <ThemedText type="title" style={[styles.statsNumber, { color: colors.textInverse }]}>
                    156
                  </ThemedText>
                  <ThemedText type="caption" style={[styles.statsLabel, { color: colors.textInverse }]}>
                    Events This Month
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <ThemedText type="subtitle" style={[styles.statValue, { color: colors.textInverse }]}>
                    89%
                  </ThemedText>
                  <ThemedText type="caption" style={[styles.statLabel, { color: colors.textInverse }]}>
                    Satisfaction
                  </ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText type="subtitle" style={[styles.statValue, { color: colors.textInverse }]}>
                    2.4k
                  </ThemedText>
                  <ThemedText type="caption" style={[styles.statLabel, { color: colors.textInverse }]}>
                    Participants
                  </ThemedText>
                </View>
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
    gap: Spacing.xs,
  },
  headerTitle: {
    fontWeight: '900',
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerSubtitleText: {
    opacity: 0.8,
  },
  filterButton: {
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
  eventsList: {
    gap: Spacing.lg,
  },
  eventCardBlur: {
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  eventCard: {
    height: 280,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  categoryGradient: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  categoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  eventGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  eventContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  eventTitle: {
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  eventDetails: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  eventDetailText: {
    opacity: 0.9,
    fontWeight: '500',
  },
  joinButton: {
    alignSelf: 'flex-start',
  },
  statsCardBlur: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xxxl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  statsCard: {
    padding: Spacing.xl,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statsHeaderText: {
    flex: 1,
  },
  statsNumber: {
    fontWeight: '800',
  },
  statsLabel: {
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontWeight: '700',
  },
});