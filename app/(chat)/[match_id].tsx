import { View, Text, TextInput, Button, FlatList, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { Dialog, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface Message {
  id: number;
  content: string;
  sender_id: string;
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
}

export default function ChatScreen() {
  const { match_id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const [timeLeft, setTimeLeft] = useState(120);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [matchStatus, setMatchStatus] = useState('active');
  const [showRevealDialog, setShowRevealDialog] = useState(false);
  const [otherUser, setOtherUser] = useState<Profile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          clearInterval(timer);
          setShowRevealDialog(true);
        }
        return prevTime - 1;
      });
    }, 1000);

    const messagesChannel = supabase.channel(`chat:${match_id}`);
    messagesChannel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${match_id}` },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
        }
      )
      .subscribe();

    const matchesChannel = supabase.channel(`matches:${match_id}`);
    matchesChannel
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'matches', filter: `id=eq.${match_id}` },
        async (payload) => {
          setMatchStatus(payload.new.status);
          if (payload.new.status === 'revealed') {
            const { data: match } = await supabase.from('matches').select('user1_id, user2_id').eq('id', match_id).single();
            const otherUserId = user.id === match.user1_id ? match.user2_id : match.user1_id;
            const { data: otherUserProfile } = await supabase.from('profiles').select('*').eq('id', otherUserId).single();
            setOtherUser(otherUserProfile);
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(timer);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(matchesChannel);
    };
  }, [match_id]);

  const handleSendMessage = async () => {
    if (!user || !newMessage) return;

    await supabase.from('messages').insert({
      match_id: match_id as string,
      sender_id: user.id,
      content: newMessage,
    });

    setNewMessage('');
  };

  const handleRevealConsent = async (consent: boolean) => {
    setShowRevealDialog(false);
    if (consent) {
      await supabase.functions.invoke('submit-consent', {
        body: { matchId: match_id, userId: user.id },
      });
    } else {
      await supabase.from('matches').update({ status: 'ended_by_user' }).eq('id', match_id);
    }
  };

  if (matchStatus === 'ended_by_user' || matchStatus === 'ended_by_timer') {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Match Ended</Text>
        <Button title="Go Home" onPress={() => router.replace('/(tabs)/')} />
      </Animated.View>
    );
  }

  if (matchStatus === 'revealed') {
    return (
      <Animated.View entering={FadeIn} style={{ flex: 1, padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Image source={{ uri: user.user_metadata.avatar_url }} style={{ width: 50, height: 50, borderRadius: 25 }} />
          <Text>{user.user_metadata.full_name}</Text>
          <Image source={{ uri: otherUser?.avatar_url }} style={{ width: 50, height: 50, borderRadius: 25 }} />
          <Text>{otherUser?.full_name}</Text>
        </View>
        <FlatList
          data={messages}
          renderItem={({ item }) => <Text>{item.content}</Text>}
          keyExtractor={(item) => item.id.toString()}
          style={{ flex: 1, borderWidth: 1, marginVertical: 16 }}
        />
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            style={{ flex: 1, borderWidth: 1, marginRight: 8 }}
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <Button title="Send" onPress={handleSendMessage} />
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Dialog visible={showRevealDialog} onClose={() => setShowRevealDialog(false)}>
        <DialogTitle>Reveal Identity?</DialogTitle>
        <DialogDescription>
          The 2-minute chat is over. Would you like to reveal your identity to your match?
        </DialogDescription>
        <DialogFooter>
          <Button title="No" onPress={() => handleRevealConsent(false)} />
          <Button title="Yes, Reveal" onPress={() => handleRevealConsent(true)} />
        </DialogFooter>
      </Dialog>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>User A</Text>
        <Text>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Text>
        <Text>User B</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text>{item.content}</Text>}
        keyExtractor={(item) => item.id.toString()}
        style={{ flex: 1, borderWidth: 1, marginVertical: 16 }}
      />
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, marginRight: 8 }}
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
}
