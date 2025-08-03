import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MessageCircle, Heart } from 'lucide-react-native';

const mockMatches = [
  {
    id: 1,
    name: 'Emma',
    lastMessage: 'Hey! How was your weekend?',
    time: '2m ago',
    imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: true,
  },
  {
    id: 2,
    name: 'Alex',
    lastMessage: 'That restaurant looks amazing!',
    time: '1h ago',
    imageUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: false,
  },
  {
    id: 3,
    name: 'Sofia',
    lastMessage: 'Would love to go hiking together',
    time: '3h ago',
    imageUrl: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: true,
  },
];

export default function MatchesScreen() {
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
            Matches
          </ThemedText>
          <View style={styles.headerStats}>
            <Heart size={20} color={colors.primary} />
            <ThemedText type="caption" style={{ color: colors.textSecondary }}>
              {mockMatches.length} matches
            </ThemedText>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Recent Matches */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Matches
            </ThemedText>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentMatches}
            >
              {mockMatches.slice(0, 3).map((match) => (
                <TouchableOpacity key={match.id} style={styles.recentMatchCard}>
                  <View style={styles.recentMatchImageContainer}>
                    <Image source={{ uri: match.imageUrl }} style={styles.recentMatchImage} />
                    {match.isOnline && <View style={styles.onlineIndicator} />}
                  </View>
                  <ThemedText type="caption" style={[styles.recentMatchName, { color: colors.text }]}>
                    {match.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Messages */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
              Messages
            </ThemedText>
            {mockMatches.map((match) => (
              <TouchableOpacity key={match.id}>
                <ThemedView style={[styles.messageCard, { backgroundColor: colors.card }]}>
                  <View style={styles.messageImageContainer}>
                    <Image source={{ uri: match.imageUrl }} style={styles.messageImage} />
                    {match.isOnline && <View style={styles.onlineIndicatorSmall} />}
                  </View>
                  <View style={styles.messageContent}>
                    <View style={styles.messageHeader}>
                      <ThemedText type="default" style={[styles.messageName, { color: colors.text }]}>
                        {match.name}
                      </ThemedText>
                      <ThemedText type="caption" style={{ color: colors.textSecondary }}>
                        {match.time}
                      </ThemedText>
                    </View>
                    <ThemedText type="caption" style={[styles.lastMessage, { color: colors.textSecondary }]}>
                      {match.lastMessage}
                    </ThemedText>
                  </View>
                  <MessageCircle size={20} color={colors.primary} />
                </ThemedView>
              </TouchableOpacity>
            ))}
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
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  recentMatches: {
    paddingHorizontal: 20,
    gap: 16,
  },
  recentMatchCard: {
    alignItems: 'center',
    width: 80,
  },
  recentMatchImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  recentMatchImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  recentMatchName: {
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 12,
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
  messageImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  messageImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicatorSmall: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageName: {
    fontFamily: 'Inter-SemiBold',
  },
  lastMessage: {
    fontFamily: 'Inter-Regular',
  },
});