import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GradientButton } from '@/components/ui/GradientButton';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Settings, Edit3, Camera, Star, MapPin, Briefcase } from 'lucide-react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={{ color: colors.primary }}>
            Profile
          </ThemedText>
          <TouchableOpacity>
            <Settings size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <LinearGradient
                  colors={[colors.gradient.start, colors.gradient.end]}
                  style={styles.cameraGradient}
                >
                  <Camera size={16} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            <ThemedText type="title" style={[styles.profileName, { color: colors.text }]}>
              Alex, 28
            </ThemedText>
            
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Star size={16} color={colors.primary} />
                <ThemedText type="caption" style={{ color: colors.textSecondary }}>
                  4.8 Rating
                </ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <MapPin size={16} color={colors.primary} />
                <ThemedText type="caption" style={{ color: colors.textSecondary }}>
                  2 miles away
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Profile Info */}
          <ThemedView style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <View style={styles.infoHeader}>
              <ThemedText type="subtitle" style={{ color: colors.text }}>
                About Me
              </ThemedText>
              <TouchableOpacity>
                <Edit3 size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <ThemedText type="default" style={[styles.bio, { color: colors.textSecondary }]}>
              Photographer by day, chef by night. Love capturing beautiful moments and cooking amazing meals. Always up for new adventures and meeting interesting people!
            </ThemedText>
          </ThemedView>

          {/* Interests */}
          <ThemedView style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <View style={styles.infoHeader}>
              <ThemedText type="subtitle" style={{ color: colors.text }}>
                Interests
              </ThemedText>
              <TouchableOpacity>
                <Edit3 size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.interestsContainer}>
              {['Photography', 'Cooking', 'Travel', 'Hiking', 'Music', 'Art'].map((interest) => (
                <View key={interest} style={[styles.interestTag, { borderColor: colors.primary }]}>
                  <ThemedText type="caption" style={{ color: colors.primary }}>
                    {interest}
                  </ThemedText>
                </View>
              ))}
            </View>
          </ThemedView>

          {/* Work & Education */}
          <ThemedView style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <View style={styles.infoHeader}>
              <ThemedText type="subtitle" style={{ color: colors.text }}>
                Work & Education
              </ThemedText>
              <TouchableOpacity>
                <Edit3 size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.workInfo}>
              <View style={styles.workItem}>
                <Briefcase size={16} color={colors.primary} />
                <ThemedText type="default" style={{ color: colors.text }}>
                  Senior Photographer at Creative Studio
                </ThemedText>
              </View>
            </View>
          </ThemedView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <GradientButton
              title="Edit Profile"
              onPress={() => console.log('Edit profile')}
              style={styles.editButton}
            />
            <GradientButton
              title="Boost Profile"
              onPress={() => console.log('Boost profile')}
              variant="secondary"
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cameraGradient: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    marginBottom: 12,
    fontFamily: 'Inter-Bold',
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E5E5E5',
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bio: {
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  workInfo: {
    gap: 12,
  },
  workItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  editButton: {
    marginBottom: 8,
  },
  boostButton: {
    marginBottom: 8,
  },
});