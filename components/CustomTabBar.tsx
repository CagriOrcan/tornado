import { View, Pressable, Text, Alert } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'expo-router';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { user } = useAuthStore();
  const router = useRouter();

  const handleFabPress = async () => {
    if (!user) return;

    const { data, error } = await supabase.functions.invoke('find-match', {
      body: { userId: user.id },
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else if (data.status === 'not_found') {
      Alert.alert('No Match Found', 'Sorry, there is no one available to match with right now.');
    } else {
      router.push(`/(chat)/${data.match_id}`);
    }
  };

  return (
    <View style={{ flexDirection: 'row', height: 80, backgroundColor: 'white' }}>
      {state.routes.map((route, index) => {
        if (index === 1) {
          return (
            <View key={route.key} style={{ flex: 1, alignItems: 'center' }}>
              <Pressable
                onPress={handleFabPress}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#FF8C42',
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: -20,
                }}
              >
                <Text style={{ color: 'white', fontSize: 30 }}>T</Text>
              </Pressable>
            </View>
          );
        }

        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: isFocused ? '#FF8C42' : '#222' }}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
