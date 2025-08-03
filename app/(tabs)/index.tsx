import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Settings, ListFilter as Filter } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const mockProfiles = [
  {
    id: 1,
    name: 'Emma',
    age: 25,
    bio: 'Adventure seeker, coffee lover, and weekend hiker. Looking for someone to explore the city with! 🌟',
    imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    name: 'Alex',
    age: 28,
    bio: 'Photographer by day, chef by night. Love capturing beautiful moments and cooking amazing meals.',
    imageUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    name: 'Sofia',
    age: 26,
    bio: 'Yoga instructor and travel enthusiast. Seeking genuine connections and meaningful conversations.',
    imageUrl: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

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
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="hero" style={[styles.headerTitle, { color: colors.primary }]}>
            Tornado
          </ThemedText>
          <View style={styles.headerActions}>
            <Settings size={24} color={colors.icon} />
            <Filter size={24} color={colors.icon} />
          </View>
        </View>

        {/* Main Content */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <GradientButton
              title="Super Like"
              onPress={() => console.log('Super liked!')}
              style={styles.superLikeButton}
            />
          </View>

          {/* Stats Section */}
          <ThemedView style={[styles.statsContainer, { backgroundColor: colors.card }]}>
            <View style={styles.statItem}>
              <ThemedText type="title" style={{ color: colors.primary }}>
                12
              </ThemedText>
              <ThemedText type="caption" style={{ color: colors.textSecondary }}>
                Likes Today
              </ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText type="title" style={{ color: colors.primary }}>
                5
              </ThemedText>
              <ThemedText type="caption" style={{ color: colors.textSecondary }}>
                New Matches
              </ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText type="title" style={{ color: colors.primary }}>
                89%
              </ThemedText>
              <ThemedText type="caption" style={{ color: colors.textSecondary }}>
                Match Rate
              </ThemedText>
            </View>
          </ThemedView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  cardContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  superLikeButton: {
    marginHorizontal: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
  },
});