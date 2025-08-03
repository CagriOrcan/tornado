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
} from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GradientButton } from '@/components/ui/GradientButton';
import { Colors, Spacing, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { 
  Settings, 
  Edit3, 
  Camera, 
  Star, 
  MapPin, 
  Briefcase, 
  Heart,
  MessageCircle,
  Zap,
  Award
} from 'lucide-react-native';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const profileStats = [
    { icon: Heart, label: 'Likes Given', value: '127' },
    { icon: MessageCircle, label: 'Conversations', value: '43' },
    { icon: Zap, label: 'Tornados', value: '89' },
    { icon: Award, label: 'Success Rate', value: '92%' },
  ];

  const interests = ['Photography', 'Cooking', 'Travel', 'Hiking', 'Music', 'Art', 'Coffee', 'Books'];

  const StatCard = ({ stat, index }: { stat: typeof profileStats[0], index: number }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
      scale.value = withSpring(0.95, { damping: 15 }, () => {
        scale.value = withSpring(1);
      });
    };

    return (
      <AnimatedTouchableOpacity
        style={[animatedStyle]}
        onPress={handlePress}
        activeOpacity={1}
      >
        <BlurView intensity={30} style={styles.statCardBlur}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']}
            style={styles.statCard}
          >
            <View style={styles.statIcon}>
              <stat.icon size={20} color={colors.primary} strokeWidth={2.5} />
            </View>
            <ThemedText type="title" style={[styles.statValue, { color: colors.textInverse }]}>
              {stat.value}
            </ThemedText>
            <ThemedText type="caption" style={[styles.statLabel, { color: colors.textInverse }]}>
              {stat.label}
            </ThemedText>
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
            <ThemedText type="hero" style={[styles.headerTitle, { color: colors.textInverse }]}>
              Profile
            </ThemedText>
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={24} color={colors.textInverse} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </BlurView>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <BlurView intensity={30} style={styles.profileImageBlur}>
              <View style={styles.profileImageContainer}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                  style={styles.profileImage}
                />
                <TouchableOpacity style={styles.cameraButton}>
                  <LinearGradient
                    colors={colors.gradient.primary}
                    style={styles.cameraGradient}
                  >
                    <Camera size={18} color={colors.textInverse} strokeWidth={2.5} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </BlurView>
            
            <ThemedText type="hero" style={[styles.profileName, { color: colors.textInverse }]}>
              Alex, 28
            </ThemedText>
            
            <View style={styles.profileMeta}>
              <View style={styles.profileMetaItem}>
                <Star size={16} color={colors.primary} strokeWidth={2.5} />
                <ThemedText type="caption" style={[styles.profileMetaText, { color: colors.textInverse }]}>
                  4.8 Rating
                </ThemedText>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.profileMetaItem}>
                <MapPin size={16} color={colors.primary} strokeWidth={2.5} />
                <ThemedText type="caption" style={[styles.profileMetaText, { color: colors.textInverse }]}>
                  San Francisco
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsSection}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.textInverse }]}>
              Your Stats
            </ThemedText>
            <View style={styles.statsGrid}>
              {profileStats.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </View>
          </View>

          {/* About Section */}
          <BlurView intensity={30} style={styles.sectionBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.infoCard}
            >
              <View style={styles.infoHeader}>
                <ThemedText type="subtitle" style={[styles.infoTitle, { color: colors.textInverse }]}>
                  About Me
                </ThemedText>
                <TouchableOpacity>
                  <Edit3 size={20} color={colors.primary} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
              <ThemedText type="body" style={[styles.bio, { color: colors.textInverse }]}>
                Photographer by day, chef by night. Love capturing beautiful moments and cooking amazing meals. Always up for new adventures and meeting interesting people who value genuine connections!
              </ThemedText>
            </LinearGradient>
          </BlurView>

          {/* Interests */}
          <BlurView intensity={30} style={styles.sectionBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.infoCard}
            >
              <View style={styles.infoHeader}>
                <ThemedText type="subtitle" style={[styles.infoTitle, { color: colors.textInverse }]}>
                  Interests
                </ThemedText>
                <TouchableOpacity>
                  <Edit3 size={20} color={colors.primary} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
              <View style={styles.interestsContainer}>
                {interests.map((interest) => (
                  <BlurView key={interest} intensity={20} style={styles.interestTagBlur}>
                    <View style={[styles.interestTag, { borderColor: colors.primary }]}>
                      <ThemedText type="caption" style={[styles.interestText, { color: colors.textInverse }]}>
                        {interest}
                      </ThemedText>
                    </View>
                  </BlurView>
                ))}
              </View>
            </LinearGradient>
          </BlurView>

          {/* Work & Education */}
          <BlurView intensity={30} style={styles.sectionBlur}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.infoCard}
            >
              <View style={styles.infoHeader}>
                <ThemedText type="subtitle" style={[styles.infoTitle, { color: colors.textInverse }]}>
                  Work & Education
                </ThemedText>
                <TouchableOpacity>
                  <Edit3 size={20} color={colors.primary} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
              <View style={styles.workItem}>
                <Briefcase size={18} color={colors.primary} strokeWidth={2.5} />
                <ThemedText type="default" style={[styles.workText, { color: colors.textInverse }]}>
                  Senior Photographer at Creative Studio
                </ThemedText>
              </View>
            </LinearGradient>
          </BlurView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <GradientButton
              title="Edit Profile"
              onPress={() => console.log('Edit profile')}
              size="lg"
              icon={<Edit3 size={20} color={colors.textInverse} />}
              style={styles.editButton}
            />
            <GradientButton
              title="Boost Profile"
              onPress={() => console.log('Boost profile')}
              variant="secondary"
              size="lg"
              icon={<Zap size={20} color={colors.primary} />}
              style={styles.boostButton}
            />
          </View>
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
  headerTitle: {
    fontWeight: '900',
  },
  settingsButton: {
    padding: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
  },
  profileImageBlur: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  profileImageContainer: {
    position: 'relative',
    padding: Spacing.sm,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
  },
  cameraButton: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  cameraGradient: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    marginBottom: Spacing.md,
    fontWeight: '900',
    textAlign: 'center',
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  profileMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  profileMetaText: {
    opacity: 0.9,
    fontWeight: '500',
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  statsSection: {
    marginBottom: Spacing.xxxl,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    fontWeight: '700',
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  statCardBlur: {
    width: '48%',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  statCard: {
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '800',
  },
  statLabel: {
    opacity: 0.8,
    textAlign: 'center',
    fontSize: 11,
  },
  sectionBlur: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  infoCard: {
    padding: Spacing.xl,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  infoTitle: {
    fontWeight: '700',
  },
  bio: {
    lineHeight: 24,
    opacity: 0.9,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  interestTagBlur: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  interestTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  interestText: {
    fontWeight: '500',
    opacity: 0.9,
  },
  workItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  workText: {
    flex: 1,
    opacity: 0.9,
    fontWeight: '500',
  },
  actionButtons: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  editButton: {
    // Additional styling if needed
  },
  boostButton: {
    // Additional styling if needed
  },
});