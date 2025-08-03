import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { 
  FadeIn, 
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { useNotifications } from '../../contexts/NotificationContext';
import { MessageBubble, TypingIndicator } from '../../components/chat/MessageBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { Dialog, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { TornadoColors } from '../../constants/Colors';

interface Message {
  id: number;
  content: string;
  sender_id: string;
  created_at: string;
}

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  status: string;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  interests: string[];
}

export default function ChatScreen() {
  const { match_id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const { scheduleLocalNotification } = useNotifications();
  const router = useRouter();
  
  // State
  const [timeLeft, setTimeLeft] = useState(120);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [matchStatus, setMatchStatus] = useState('active');
  const [showRevealDialog, setShowRevealDialog] = useState(false);
  const [match, setMatch] = useState<Match | null>(null);
  const [otherUser, setOtherUser] = useState<Profile | null>(null);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [timerWarningScheduled, setTimerWarningScheduled] = useState(false);
  
  // Refs
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Animations
  const revealAnimation = useSharedValue(0);

  useEffect(() => {
    initializeChat();
    return cleanup;
  }, [match_id]);

  const initializeChat = async () => {
    if (!user || !match_id) return;

    try {
      // Fetch match data
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', match_id)
        .single();

      if (matchError || !matchData) {
        Alert.alert('Error', 'Match not found');
        router.back();
        return;
      }

      setMatch(matchData);
      setMatchStatus(matchData.status);

      // Determine other user ID
      const otherUserId = user.id === matchData.user1_id ? matchData.user2_id : matchData.user1_id;

      // Fetch user profiles
      const [currentUserResult, otherUserResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('profiles').select('*').eq('id', otherUserId).single(),
      ]);

      if (currentUserResult.data) setCurrentUser(currentUserResult.data);
      if (otherUserResult.data) setOtherUser(otherUserResult.data);

      // Fetch existing messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', match_id)
        .order('created_at', { ascending: true });

      if (messagesData) {
        setMessages(messagesData);
      }

      // Calculate time left if still in anonymous phase
      if (matchData.status === 'active') {
        const matchCreatedAt = new Date(matchData.created_at);
        const now = new Date();
        const elapsedSeconds = Math.floor((now.getTime() - matchCreatedAt.getTime()) / 1000);
        const remainingSeconds = Math.max(0, 120 - elapsedSeconds);
        
        setTimeLeft(remainingSeconds);
        
        if (remainingSeconds > 0) {
          startTimer(remainingSeconds);
        } else {
          setShowRevealDialog(true);
        }
      }

      setupRealtimeSubscriptions();
    } catch (error) {
      console.error('Error initializing chat:', error);
      Alert.alert('Error', 'Failed to load chat');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const startTimer = (initialTime: number) => {
    let currentTime = initialTime;
    
    timerRef.current = setInterval(() => {
      currentTime -= 1;
      setTimeLeft(currentTime);
      
      // Schedule warning notification at 30 seconds
      if (currentTime === 30 && !timerWarningScheduled) {
        scheduleLocalNotification(
          '⏰ 30 Seconds Left!',
          'Time is running out! Decide if you want to reveal profiles.',
          { seconds: 1 }
        );
        setTimerWarningScheduled(true);
      }
      
      if (currentTime <= 0) {
        clearInterval(timerRef.current!);
        setShowRevealDialog(true);
      }
    }, 1000);
  };

  const setupRealtimeSubscriptions = () => {
    // Messages subscription
    const messagesChannel = supabase.channel(`chat:${match_id}`);
    messagesChannel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${match_id}` },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          // Auto-scroll to bottom
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      )
      .subscribe();

    // Match status subscription
    const matchesChannel = supabase.channel(`matches:${match_id}`);
    matchesChannel
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'matches', filter: `id=eq.${match_id}` },
        (payload) => {
          const updatedMatch = payload.new as Match;
          setMatchStatus(updatedMatch.status);
          
          if (updatedMatch.status === 'revealed') {
            revealAnimation.value = withSpring(1, { damping: 15 });
            setShowRevealDialog(false);
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
          }
        }
      )
      .subscribe();
  };

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    supabase.removeAllChannels();
  };

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    const messageToSend = newMessage.trim();
    setNewMessage('');

    try {
      const { error } = await supabase.from('messages').insert({
        match_id: match_id as string,
        sender_id: user.id,
        content: messageToSend,
      });

      if (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', 'Failed to send message');
        setNewMessage(messageToSend); // Restore message on error
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
      setNewMessage(messageToSend);
    }
  };

  const handleRevealConsent = async (consent: boolean) => {
    setShowRevealDialog(false);
    
    try {
      if (consent) {
        const { error } = await supabase.functions.invoke('submit-consent', {
          body: { matchId: match_id, userId: user.id },
        });
        
        if (error) {
          console.error('Error submitting consent:', error);
          Alert.alert('Error', 'Failed to reveal profiles');
        }
      } else {
        const { error } = await supabase
          .from('matches')
          .update({ status: 'ended_by_user' })
          .eq('id', match_id);
          
        if (error) {
          console.error('Error ending match:', error);
        }
      }
    } catch (error) {
      console.error('Error handling reveal consent:', error);
    }
  };

  const handleMenuPress = () => {
    // TODO: Show options menu (report, block, etc.)
    Alert.alert('Menu', 'Options coming soon!');
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwnMessage = item.sender_id === user?.id;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
    
    const isFirst = !previousMessage || previousMessage.sender_id !== item.sender_id;
    const isLast = !nextMessage || nextMessage.sender_id !== item.sender_id;

    return (
      <MessageBubble
        message={item.content}
        isOwnMessage={isOwnMessage}
        timestamp={item.created_at}
        isAnonymous={matchStatus !== 'revealed'}
        senderName={isOwnMessage ? currentUser?.full_name : otherUser?.full_name}
        isFirst={isFirst}
        isLast={isLast}
      />
    );
  };

  const animatedRevealStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(revealAnimation.value, { duration: 1000 }),
      transform: [
        { scale: withSpring(revealAnimation.value, { damping: 15 }) },
      ],
    };
  });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: TornadoColors.white }}>
        <LoadingSpinner size="lg" message="Loading chat..." />
      </View>
    );
  }

  // Match ended states
  if (matchStatus === 'ended_by_user' || matchStatus === 'ended_by_timer') {
    return (
      <LinearGradient
        colors={[TornadoColors.gradientStart, TornadoColors.gradientEnd]}
        style={{ flex: 1 }}
      >
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut} 
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}
        >
          <Text style={{ fontSize: 64, marginBottom: 24 }}>💔</Text>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: TornadoColors.white,
            textAlign: 'center',
            marginBottom: 16,
            fontFamily: 'System',
          }}>
            Chat Ended
          </Text>
          <Text style={{
            fontSize: 16,
            color: TornadoColors.white,
            opacity: 0.9,
            textAlign: 'center',
            marginBottom: 32,
            lineHeight: 24,
            fontFamily: 'System',
          }}>
            {matchStatus === 'ended_by_user' 
              ? 'One of you chose not to reveal profiles. That\'s okay - try another Tornado!'
              : 'Time ran out without a mutual reveal. Keep trying - the right connection is out there!'
            }
          </Text>
          <Button
            title="Start New Tornado"
            onPress={() => router.replace('/(tabs)/')}
            gradient
            size="lg"
          />
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: TornadoColors.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <ChatHeader
        isAnonymous={matchStatus !== 'revealed'}
        timeLeft={matchStatus === 'active' ? timeLeft : undefined}
        user1Name={currentUser?.full_name}
        user2Name={otherUser?.full_name}
        user1Avatar={currentUser?.avatar_url}
        user2Avatar={otherUser?.avatar_url}
        onMenuPress={handleMenuPress}
      />

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={() => (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingVertical: 64,
          }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>💬</Text>
            <Text style={{
              fontSize: 18,
              color: TornadoColors.gray[600],
              textAlign: 'center',
              fontFamily: 'System',
            }}>
              {matchStatus === 'revealed' 
                ? 'Start your revealed conversation!'
                : 'Break the ice! Send the first message.'
              }
            </Text>
          </View>
        )}
      />

      {/* Typing Indicator */}
      {isTyping && <TypingIndicator />}

      {/* Chat Input */}
      <ChatInput
        value={newMessage}
        onChangeText={setNewMessage}
        onSend={handleSendMessage}
        placeholder={matchStatus === 'revealed' 
          ? `Message ${otherUser?.full_name || 'your match'}...`
          : 'Say something interesting...'
        }
        isAnonymous={matchStatus !== 'revealed'}
      />

      {/* Reveal Dialog */}
      <Dialog visible={showRevealDialog} onClose={() => {}}>
        <DialogTitle>🌪️ Time's Up!</DialogTitle>
        <DialogDescription>
          Your 2-minute anonymous chat is complete! Would you like to reveal your profiles and continue the conversation?
        </DialogDescription>
        <DialogFooter>
          <Button 
            title="No Thanks" 
            onPress={() => handleRevealConsent(false)}
            variant="outline"
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button 
            title="Yes, Reveal!" 
            onPress={() => handleRevealConsent(true)}
            gradient
            style={{ flex: 1, marginLeft: 8 }}
          />
        </DialogFooter>
      </Dialog>

      {/* Reveal Animation Overlay */}
      {matchStatus === 'revealed' && (
        <Animated.View 
          style={[
            animatedRevealStyle,
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 140, 66, 0.9)',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none',
            }
          ]}
        >
          <Text style={{ fontSize: 64, marginBottom: 16 }}>✨</Text>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: TornadoColors.white,
            textAlign: 'center',
            fontFamily: 'System',
          }}>
            Profiles Revealed!
          </Text>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}
