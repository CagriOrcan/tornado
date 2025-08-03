import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Heart, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

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

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        <View style={styles.infoContainer}>
          <ThemedText type="title" style={styles.name}>
            {name}, {age}
          </ThemedText>
          <ThemedText type="caption" style={styles.bio}>
            {bio}
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={onPass}
          activeOpacity={0.8}
        >
          <X size={24} color="#666666" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={onLike}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradient.start, colors.gradient.end]}
            style={styles.likeGradient}
          >
            <Heart size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 500,
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
    height: 150,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  name: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bio: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 40,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  passButton: {
    backgroundColor: '#F5F5F5',
  },
  likeButton: {
    overflow: 'hidden',
  },
  likeGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});