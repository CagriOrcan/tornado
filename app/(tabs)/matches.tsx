import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { TornadoColors } from '../../constants/Colors';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  status: string;
  created_at: string;
  last_message_at?: string;
  otherUser: {
    id: string;
    full_name: string;
    avatar_url: string;
    bio: string;
    interests: string[];
  };
  lastMessage?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unreadCount: number;
}

export default function MatchesScreen() {
  const { user } = useAuthStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 800 });
    fetchMatches();
  }, [user]);

  const fetchMatches = async () => {
    if (!user) return;

    try {
      const { data: matchesData, error } = await supabase
        .from('matches')
        .select(`
          id, 
          user1_id, 
          user2_id, 
          status, 
          created_at,
          last_message_at
        `)
        .eq('status', 'revealed')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error fetching matches:', error);
        Alert.alert('Error', 'Failed to load matches');
        return;
      }

      if (!matchesData || matchesData.length === 0) {
        setMatches([]);
        return;
      }

      // Fetch other user profiles and last messages
      const matchesWithProfiles = await Promise.all(
        matchesData.map(async (match) => {
          const otherUserId = user.id === match.user1_id ? match.user2_id : match.user1_id;
          
          // Fetch other user's profile
          const { data: otherUser } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, bio, interests')
            .eq('id', otherUserId)
            .single();

          // Fetch last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('match_id', match.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Count unread messages
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('match_id', match.id)
            .neq('sender_id', user.id)
            .is('read_at', null);

          return {
            ...match,
            otherUser,
            lastMessage,
            unreadCount: unreadCount || 0,
          };
        })
      );

      setMatches(matchesWithProfiles);
    } catch (error) {
      console.error('Error in fetchMatches:', error);
      Alert.alert('Error', 'Failed to load matches');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMatches();
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const navigateToChat = (matchId: string) => {
    router.push(`/(chat)/${matchId}`);
  };

  const MatchCard = ({ item, index }: { item: Match; index: number }) => {
    const cardScale = useSharedValue(1);
    const cardOpacity = useSharedValue(0);

    React.useEffect(() => {
      cardOpacity.value = withTiming(1, { duration: 500 + index * 100 });
    }, [index]);

    const animatedCardStyle = useAnimatedStyle(() => {
      return {
        opacity: cardOpacity.value,
        transform: [
          { scale: cardScale.value },
          {
            translateY: interpolate(cardOpacity.value, [0, 1], [50, 0]),
          },
        ],
      };
    });

    const handlePressIn = () => {
      cardScale.value = withSpring(0.98);
    };

    const handlePressOut = () => {
      cardScale.value = withSpring(1);
    };

    return (
      <Animated.View style={animatedCardStyle}>
        <TouchableOpacity
          onPress={() => navigateToChat(item.id)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <Card variant="elevated" padding="none" style={{ marginBottom: 16 }}>
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Avatar */}
                <View style={{ position: 'relative' }}>
                  <Avatar
                    uri={item.otherUser?.avatar_url}
                    size="lg"
                    initials={item.otherUser?.full_name?.charAt(0)}
                  />
                  {item.unreadCount > 0 && (
                    <View style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      backgroundColor: TornadoColors.primary,
                      borderRadius: 10,
                      minWidth: 20,
                      height: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: TornadoColors.white,
                    }}>
                      <Text style={{
                        color: TornadoColors.white,
                        fontSize: 10,
                        fontWeight: 'bold',
                      }}>
                        {item.unreadCount > 99 ? '99+' : item.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Content */}
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: TornadoColors.gray[900],
                      fontFamily: 'Inter',
                    }}>
                      {item.otherUser?.full_name || 'Unknown User'}
                    </Text>
                    {item.lastMessage && (
                      <Text style={{
                        fontSize: 12,
                        color: TornadoColors.gray[500],
                        fontFamily: 'Inter',
                      }}>
                        {formatTime(item.lastMessage.created_at)}
                      </Text>
                    )}
                  </View>

                  {/* Last Message */}
                  <Text style={{
                    fontSize: 14,
                    color: item.unreadCount > 0 ? TornadoColors.gray[900] : TornadoColors.gray[600],
                    fontWeight: item.unreadCount > 0 ? '600' : '400',
                    fontFamily: 'Inter',
                    marginBottom: 8,
                  }} numberOfLines={2}>
                    {item.lastMessage ? 
                      `${item.lastMessage.sender_id === user?.id ? 'You: ' : ''}${item.lastMessage.content}` : 
                      'Start your conversation!'
                    }
                  </Text>

                  {/* Interests */}
                  {item.otherUser?.interests && item.otherUser.interests.length > 0 && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                      {item.otherUser.interests.slice(0, 3).map((interest, i) => (
                        <View key={i} style={{
                          backgroundColor: TornadoColors.secondary,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 12,
                        }}>
                          <Text style={{
                            fontSize: 10,
                            color: TornadoColors.primary,
                            fontWeight: '500',
                            fontFamily: 'Inter',
                          }}>
                            {interest}
                          </Text>
                        </View>
                      ))}
                      {item.otherUser.interests.length > 3 && (
                        <View style={{
                          backgroundColor: TornadoColors.gray[200],
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 12,
                        }}>
                          <Text style={{
                            fontSize: 10,
                            color: TornadoColors.gray[600],
                            fontWeight: '500',
                            fontFamily: 'Inter',
                          }}>
                            +{item.otherUser.interests.length - 3}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>

                {/* Arrow Icon */}
                <View style={{ marginLeft: 8 }}>
                  <Text style={{ 
                    fontSize: 16, 
                    color: TornadoColors.gray[400],
                  }}>
                    →
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      paddingHorizontal: 32,
    }}>
      <Text style={{ fontSize: 64, marginBottom: 16 }}>💕</Text>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: TornadoColors.white,
        textAlign: 'center',
        marginBottom: 8,
        fontFamily: 'Inter',
      }}>
        No Matches Yet
      </Text>
      <Text style={{
        fontSize: 16,
        color: TornadoColors.white,
        opacity: 0.9,
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: 'Inter',
      }}>
        Start a Tornado to meet someone new! Tap the tornado button on the home screen to begin your first anonymous chat.
      </Text>
    </View>
  );

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeIn.value,
    };
  });

  if (loading) {
    return (
      <LinearGradient
        colors={[TornadoColors.gradientStart, TornadoColors.gradientEnd]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner size="lg" message="Loading your matches..." />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[TornadoColors.gradientStart, TornadoColors.gradientEnd]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View style={[animatedContainerStyle, { flex: 1 }]}>
          {/* Header */}
          <View style={{ padding: 24, paddingBottom: 0 }}>
            <Text style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: TornadoColors.white,
              marginBottom: 8,
              fontFamily: 'Inter',
            }}>
              Your Matches
            </Text>
            <Text style={{
              fontSize: 16,
              color: TornadoColors.white,
              opacity: 0.9,
              marginBottom: 16,
              fontFamily: 'Inter',
            }}>
              {matches.length > 0 ? 
                `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}` : 
                'Start connecting with people'
              }
            </Text>
          </View>

          {/* Matches List */}
          {matches.length > 0 ? (
            <FlatList
              data={matches}
              renderItem={({ item, index }) => <MatchCard item={item} index={index} />}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ 
                padding: 24,
                paddingTop: 8,
              }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={TornadoColors.white}
                  colors={[TornadoColors.white]}
                />
              }
            />
          ) : (
            <EmptyState />
          )}
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}
