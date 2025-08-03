import { View, Text, FlatList, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { useRouter } from 'expo-router';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  otherUser: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

export default function MatchesScreen() {
  const { user } = useAuthStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('matches')
        .select('id, user1_id, user2_id')
        .eq('status', 'revealed')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) {
        console.error(error);
        return;
      }

      const matchesWithProfiles = await Promise.all(
        data.map(async (match) => {
          const otherUserId = user.id === match.user1_id ? match.user2_id : match.user1_id;
          const { data: otherUser } = await supabase.from('profiles').select('id, full_name, avatar_url').eq('id', otherUserId).single();
          return { ...match, otherUser };
        })
      );

      setMatches(matchesWithProfiles);
    };

    fetchMatches();
  }, [user]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={matches}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/(chat)/${item.id}`)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Image source={{ uri: item.otherUser.avatar_url }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }} />
            <Text>{item.otherUser.full_name}</Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
