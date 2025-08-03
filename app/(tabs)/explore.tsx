import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MapPin, Calendar, Users, Sparkles } from 'lucide-react-native';

const exploreData = [
  {
    id: 1,
    title: 'Speed Dating Night',
    location: 'Downtown Café',
    date: 'Tonight, 7 PM',
    attendees: 24,
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    title: 'Singles Hiking Group',
    location: 'Mountain Trail',
    date: 'Saturday, 9 AM',
    attendees: 18,
    imageUrl: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    title: 'Wine Tasting Event',
    location: 'City Vineyard',
    date: 'Sunday, 6 PM',
    attendees: 32,
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function ExploreScreen() {
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
            Explore
          </ThemedText>
          <View style={styles.headerSubtitle}>
            <Sparkles size={16} color={colors.primary} />
            <ThemedText type="caption" style={{ color: colors.textSecondary }}>
              Discover events near you
            </ThemedText>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Featured Events */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
              Featured Events
            </ThemedText>
            
            {exploreData.map((event) => (
              <TouchableOpacity key={event.id}>
                <ThemedView style={[styles.eventCard, { backgroundColor: colors.card }]}>
                  <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
                  <View style={styles.eventContent}>
                    <ThemedText type="subtitle" style={[styles.eventTitle, { color: colors.text }]}>
                      {event.title}
                    </ThemedText>
                    
                    <View style={styles.eventDetails}>
                      <View style={styles.eventDetail}>
                        <MapPin size={16} color={colors.primary} />
                        <ThemedText type="caption" style={{ color: colors.textSecondary }}>
                          {event.location}
                        </ThemedText>
                      </View>
                      
                      <View style={styles.eventDetail}>
                        <Calendar size={16} color={colors.primary} />
                        <ThemedText type="caption" style={{ color: colors.textSecondary }}>
                          {event.date}
                        </ThemedText>
                      </View>
                      
                      <View style={styles.eventDetail}>
                        <Users size={16} color={colors.primary} />
                        <ThemedText type="caption" style={{ color: colors.textSecondary }}>
                          {event.attendees} attending
                        </ThemedText>
                      </View>
                    </View>
                    
                    <LinearGradient
                      colors={[colors.gradient.start, colors.gradient.end]}
                      style={styles.joinButton}
                    >
                      <ThemedText type="button" style={styles.joinButtonText}>
                        Join Event
                      </ThemedText>
                    </LinearGradient>
                  </View>
                </ThemedView>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Stats */}
          <ThemedView style={[styles.statsCard, { backgroundColor: colors.card }]}>
            <LinearGradient
              colors={[colors.gradient.start, colors.gradient.end]}
              style={styles.statsGradient}
            >
              <ThemedText type="title" style={styles.statsNumber}>
                156
              </ThemedText>
              <ThemedText type="caption" style={styles.statsLabel}>
                Events This Month
              </ThemedText>
            </LinearGradient>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  eventCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  eventContent: {
    padding: 20,
  },
  eventTitle: {
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  eventDetails: {
    gap: 8,
    marginBottom: 16,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  joinButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  statsGradient: {
    padding: 32,
    alignItems: 'center',
  },
  statsNumber: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  statsLabel: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    opacity: 0.9,
  },
});