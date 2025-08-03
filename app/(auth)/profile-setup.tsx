import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';
import { useRouter } from 'expo-router';

export default function ProfileSetupScreen() {
  const { user } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const router = useRouter();

  const handleSaveProfile = async () => {
    if (!user) return;

    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: fullName,
      birth_date: birthDate,
      city,
      bio,
      interests: interests.split(',').map((item) => item.trim()),
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(tabs)/');
    }
  };

  return (
    <View>
      <Text>Profile Setup</Text>
      <TextInput placeholder="Full Name" value={fullName} onChangeText={setFullName} />
      <TextInput placeholder="Birth Date (YYYY-MM-DD)" value={birthDate} onChangeText={setBirthDate} />
      <TextInput placeholder="City" value={city} onChangeText={setCity} />
      <TextInput placeholder="Bio" value={bio} onChangeText={setBio} />
      <TextInput placeholder="Interests (comma separated)" value={interests} onChangeText={setInterests} />
      <Button title="Save Profile" onPress={handleSaveProfile} />
    </View>
  );
}
